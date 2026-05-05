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
import { 	updateVertexCount, updateSurfaceGenerationTime, clearSurfaceGenerationTime  } from './hud.js';
import { 	getVariantBounds, getFieldFunction, getFieldFunctionParams, getColourMode }
			from './field-functions-manager.js';
import {	positions, colors, normals, marching_grid_size } from './cube-marcher.js';
import {	setCubeSpaceBounds, getColourFunction} from './colour-modes.js';
import {	BoundingBox } from './bounds.js';

export let mesh = null;

let zIndex = null;
let material = null;
let geometry = null;
let generationToken = 0;
let generationStartTime = 0;
let flatShading = true;
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

function generateAllGeometry(fieldIndex) {

	let bounds = new BoundingBox();
	bounds.setValues(getVariantBounds(fieldIndex)); // Get Normalised values
	bounds.scale(marching_grid_size);
	bounds.expand(1); 	// Make sure the surface is inside the bounding box
	bounds.roundout();	// And then round up or down the edges
	bounds.clamp(0,marching_grid_size);
	
	setCubeSpaceBounds(bounds); // Let the colouring code know who big the surface is

	const start = performance.now();
	
	CubeMarcher(flatShading, bounds,
				getFieldFunction(fieldIndex),
				getFieldFunctionParams(fieldIndex),
				getColourFunction(getColourMode(fieldIndex)));
		
	const elapsed = performance.now() - generationStartTime;

	geometry.setDrawRange(0, getVertexCount());
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.normal.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;

    updateVertexCount(vertexCount);
    
    updateSurfaceGenerationTime(elapsed);
}

function generateGeometry(token, fieldIndex) {

	if (token !== generationToken) {
		geometry.setDrawRange(0, 0);
		return;
	}

	let bounds = new BoundingBox();
	bounds.setValues(getVariantBounds(fieldIndex));
	bounds.scale(marching_grid_size);
	bounds.expand(1);
	bounds.roundout();
	bounds.clamp(0,marching_grid_size);

    document.getElementById("surfaceBounds").textContent = bounds.getDimensionsString();

	setCubeSpaceBounds(bounds);  // Let the colouring code know who big the surface is

	if(zIndex == null) {
		zIndex = bounds.z.min;
		slice0 = precomputeSlice(	bounds.z.min, bounds,
									getFieldFunction(fieldIndex),
									getFieldFunctionParams(fieldIndex));
		slice1 = precomputeSlice(	bounds.z.min + 1, bounds,
									getFieldFunction(fieldIndex),
									getFieldFunctionParams(fieldIndex));
	}

	const start = performance.now();

	const gridsize = getMarchingGridSize();

	XYCubeMarcher(	zIndex, slice0, slice1, bounds, flatShading,
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
    
	if (zIndex < bounds.z.max) {
		slice0 = slice1;
		slice1 = precomputeSlice(	zIndex + 1, bounds,
									getFieldFunction(fieldIndex),
									getFieldFunctionParams(fieldIndex));
		requestAnimationFrame(() => generateGeometry(token, fieldIndex));
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

	generationStartTime = performance.now();
    clearSurfaceGenerationTime();
	
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
