import * as THREE from './three.module.js';
import { 	scene } from './scene.js';
import {	resetVertexCount, getVertexCount, indexToXYZ, total_cubes, marchCube, vertexCount, setGridSize } from './cube-marcher.js';
import { 	updateHUD, updateVertexCount, updateSurfaceGenerationTime, clearSurfaceGenerationTime  } from './hud.js';
import { 	getCurrentField } from './field-functions.js';
import {	positions, colors, normals } from './cube-marcher.js';

const FRAME_BUDGET = 30; // ms

let cubeIndex = 0;
export let isGenerating = true;
export let mesh = null;
let material = null;
let geometry = null;
let generationToken = 0;
let generationStartTime = 0;
let flatShading = false;

setGridSize();
initialiseGeometry();

export function initialiseGeometry()
{
	geometry = new THREE.BufferGeometry();
	
	geometry.setAttribute( 'position',
		new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
	geometry.setAttribute( 'normal',
		new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
	geometry.setAttribute( 'color',
		new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));	

	geometry.setDrawRange(0, 0); // nothing visible yet
}

export function destroyGeometry()
{
	scene.remove(mesh);
	mesh.geometry.dispose();
	mesh.material.dispose();
}

export function toggleFlatShading() {
	flatShading = !flatShading
}

function generateGeometry(token) {

	const fieldfn = getCurrentField();

	const start = performance.now();

	while (performance.now() - start < FRAME_BUDGET &&
         cubeIndex < total_cubes) {

		const { x, y, z } = indexToXYZ(cubeIndex);
		marchCube(fieldfn, x, y, z, flatShading);
		cubeIndex++;
		
		// Stop if a new generation has started
		if (token !== generationToken) break;
	}

	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);
    
	if (cubeIndex < total_cubes)
		requestAnimationFrame(() => generateGeometry(token));
	else
	{
		const elapsed = performance.now() - generationStartTime;
    	updateSurfaceGenerationTime(elapsed);
    	isGenerating = false;
	}
}

export function destroyMesh()
{
	if(mesh !== null) {
		scene.remove(mesh);
		mesh.geometry.dispose();
		mesh.material.dispose();
	}
}

export function rebuildSurface() {
 
	generationToken++;
	const myToken = generationToken;

 	let rotation_x = 0;
 	let rotation_y = 0;
 	
	if(mesh !== null) {
		rotation_x = mesh.rotation.x;
		rotation_y = mesh.rotation.y;
		
		scene.remove(mesh);
		mesh.geometry.dispose();
		mesh.material.dispose();
	}

	material = new THREE.MeshPhongMaterial({
		vertexColors: true,
		side: THREE.DoubleSide,
		shininess: 150,
		specular: new THREE.Color(0x333333),
		flatShading: false
	});

	cubeIndex = 0;
	resetVertexCount();
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = rotation_x;
    mesh.rotation.y = rotation_y;

    scene.add(mesh);
	isGenerating = true;

	generationStartTime = performance.now();
    clearSurfaceGenerationTime();

	updateHUD();
	
    generateGeometry(myToken);
}
