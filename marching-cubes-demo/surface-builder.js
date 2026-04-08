// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { 	scene } from './scene.js';
import {	resetVertexCount, getVertexCount, total_cubes, XYCubeMarcher, CubeMarcher, 
			vertexCount, setGridSize, getMarchingGridSize, precomputeSlice } from './cube-marcher.js';
import { 	updateHUD, updateVertexCount, updateSurfaceGenerationTime, clearSurfaceGenerationTime  } from './hud.js';
import { 	getCurrentField } from './field-functions.js';
import {	positions, colors, normals } from './cube-marcher.js';

//let cubeIndex = 0;
let zIndex = 0;
export let mesh = null;
let material = null;
let geometry = null;
let generationToken = 0;
let generationStartTime = 0;
let flatShading = false;
let slice0 = null;
let slice1 = null;

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
	return flatShading;
}

function generateAllGeometry() {

	const start = performance.now();

	CubeMarcher(flatShading)
		
	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);
    
	const elapsed = performance.now() - generationStartTime;
    updateSurfaceGenerationTime(elapsed);
}

function generateGeometry(token) {

	if(zIndex == 0) {
		slice0 = precomputeSlice(0);
		slice1 = precomputeSlice(1);
	}

	const start = performance.now();

	const gridsize = getMarchingGridSize();

	XYCubeMarcher(zIndex, slice0, slice1, flatShading)
	zIndex++;
		
	// Stop if a new generation has started
	if (token !== generationToken) return;

	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);
    
	if (zIndex < gridsize) {
		slice0 = slice1;
		slice1 = precomputeSlice(zIndex + 1);
		requestAnimationFrame(() => generateGeometry(token));
	}
	else
	{
		const elapsed = performance.now() - generationStartTime;
    	updateSurfaceGenerationTime(elapsed);
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

export function rebuildSurface(animateSurfaceGeneration = false) {
 
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

	//cubeIndex = 0;
	zIndex = 0;
	resetVertexCount();
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = rotation_x;
    mesh.rotation.y = rotation_y;

    scene.add(mesh);

	generationStartTime = performance.now();
    clearSurfaceGenerationTime();

	updateHUD();
	
	if(animateSurfaceGeneration)
    	generateGeometry(myToken);
    else
	    generateAllGeometry();
}
