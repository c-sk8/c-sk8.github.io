// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { 	scene } from './scene.js';
import {	resetVertexCount, getVertexCount, XYCubeMarcher, CubeMarcher, 
			vertexCount, computeSlice, setMaxVertices } from './cube-marcher.js';
import { 	updateVertexCount, clearSurfaceGenerationTime  } from './hud.js';
import { 	getFieldFunction, getFieldFunctionParams, getColourMode }
			from './field-functions-manager.js';
import {	positions, colors, normals } from './cube-marcher.js';
import {	getColourFunction} from './cube-colour.js';
import {	sampling } from './sampling.js';

export let mesh = null;

let zIndex = null;
let material = null;
let geometry = null;
let generationToken = 0;
let flatShading = true;
let slice0 = null;
let slice1 = null;
//let generationStartTime = 0;

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

function generateAllGeometry(fieldIndex) {
		
	//generationStartTime = performance.now();
    //clearSurfaceGenerationTime();
	//const start = performance.now();
	
	CubeMarcher(flatShading, sampling,
				getFieldFunction(fieldIndex),
				getFieldFunctionParams(fieldIndex),
				getColourFunction(getColourMode(fieldIndex)));
		
	//const elapsed = performance.now() - generationStartTime;
    //console.log(`${elapsed.toFixed(0)} ms`);

	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);    
}

function generateGeometry(token, fieldIndex) {

	if (token !== generationToken) {
		geometry.setDrawRange(0, 0);
		return;
	}
	
	const field_fn = getFieldFunction(fieldIndex);
	const field_fn_params = getFieldFunctionParams(fieldIndex);

	if(zIndex == null) {
		zIndex = 0;
		slice0 = computeSlice(	0, sampling, field_fn, field_fn_params);
		slice1 = computeSlice(	1, sampling, field_fn, field_fn_params);
	}

	XYCubeMarcher(	zIndex, slice0, slice1, sampling, flatShading,
					getFieldFunction(fieldIndex),
					getFieldFunctionParams(fieldIndex),
					getColourFunction(getColourMode(fieldIndex)) );
	zIndex++;
		
	if (token !== generationToken) {
		geometry.setDrawRange(0, 0);
		return;
	}

	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);
    
	if (zIndex < sampling.dimensions.depth) {
		slice0 = slice1;
		slice1 = computeSlice(	zIndex + 1, sampling, field_fn, field_fn_params);
		requestAnimationFrame(() => generateGeometry(token, fieldIndex));
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

export function rebuildSurface(fieldIndex = 0, animateSurfaceGeneration = false) {
 
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

	zIndex = null;
	resetVertexCount();
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = rotation_x;
    mesh.rotation.y = rotation_y;

    scene.add(mesh);

	if(animateSurfaceGeneration)
	{
		generationToken++;
		const myToken = generationToken;
		
    	generateGeometry(myToken, fieldIndex);
    }
    else
    {
	    generateAllGeometry(fieldIndex);
	}
}
