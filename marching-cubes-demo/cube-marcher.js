// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import {colourModeFunction, setColourGridSize} from './colour-modes.js';
import {ff, ff_params} from './field-functions.js';

// ============================================================
//	EDGE TABLE + TRI TABLE (STANDARD)
// ============================================================

import { edgeTable, triTable as triTableFlat } from './tables.js';

const triTable = [];

for (let i = 0; i < 256; i++) {
	triTable.push(triTableFlat.slice(i * 16, i * 16 + 16));
}

//console.log(triTable.length, triTable[64].length);

// ============================================================
//	MARCHING CUBES CONSTANTS
// ============================================================

// cube corner offsets
const CUBE_VERTS = [
	[0,0,0],[1,0,0],[1,1,0],[0,1,0],
	[0,0,1],[1,0,1],[1,1,1],[0,1,1]
];

// edges between corners
const EDGE_INDEX = [
	[0,1],[1,2],[2,3],[3,0],
	[4,5],[5,6],[6,7],[7,4],
	[0,4],[1,5],[2,6],[3,7]
];

export let marching_grid_size;
export let vertex_scale;
export let total_cubes;

export let max_vertices;

export let positions;
export let normals;
export let colors;

// ============================================================
//	MARCHING CUBES FUNCTIONS
// ============================================================

export function setGridSize(size = 90) {

    marching_grid_size = size;
    vertex_scale = 2 / marching_grid_size;
    total_cubes = marching_grid_size ** 3;

    max_vertices = 44 * marching_grid_size * marching_grid_size;

    positions = new Float32Array(max_vertices * 3);
    normals   = new Float32Array(max_vertices * 3);
    colors    = new Float32Array(max_vertices * 3);
    
	setColourGridSize(marching_grid_size);
}

export function getMarchingGridSize() {
	return marching_grid_size;
}

function interpolate(p1, p2, v1, v2) {
	const t = v1 / (v1 - v2);
	return [p1[0] + t * (p2[0] - p1[0]),
			p1[1] + t * (p2[1] - p1[1]),
			p1[2] + t * (p2[2] - p1[2])];
}

function faceNormal(a, b, c) {
	const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
	const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
	const nx = uy*vz - uz*vy;
	const ny = uz*vx - ux*vz;
	const nz = ux*vy - uy*vx;
	const len = Math.hypot(nx, ny, nz) || 1;
	return [nx/len, ny/len, nz/len];
}

function computeNormal(x, y, z) {
    const eps = 0.01;

    const dx = ff(x - eps, y, z, ff_params) - ff(x + eps, y, z, ff_params);
    const dy = ff(x, y - eps, z, ff_params) - ff(x, y + eps, z, ff_params);
    const dz = ff(x, y, z - eps, ff_params) - ff(x, y, z + eps, ff_params);

    let nx = dx;
    let ny = dy;
    let nz = dz;

    const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
    if (len > 0.0) {
        nx /= len;
        ny /= len;
        nz /= len;
    }

    return { x: nx, y: ny, z: nz };
}

export let vertexCount = 0;

export function getVertexCount() { return vertexCount; }
export function resetVertexCount() { vertexCount = 0; }

function pushVertex(x, y, z, nx, ny, nz, r, g, b) {
  const i = vertexCount * 3;

  positions[i + 0] = x;
  positions[i + 1] = y;
  positions[i + 2] = z;

  normals[i + 0] = nx;
  normals[i + 1] = ny;
  normals[i + 2] = nz;

  colors[i + 0] = r;
  colors[i + 1] = g;
  colors[i + 2] = b;

  vertexCount++;
}

export function precomputeSlice(z) {
	const size = marching_grid_size + 1;
	const slice = new Float32Array(size * size);

	let i = 0;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const vx = x * vertex_scale - 1;
			const vy = y * vertex_scale - 1;
			const vz = z * vertex_scale - 1;

			slice[i++] = ff(vx, vy, vz, ff_params);
		}
	}

	return slice;
}

function getVal(slice, x, y) {
	return slice[x * (marching_grid_size + 1) + y];
}

export function CubeMarcher(flatShading) {

	let ymin = 0;
	let ymax = 0;
	
	let slice0 = null;
	let slice1 = null;

	slice0 = precomputeSlice(0);
	slice1 = precomputeSlice(1);

	for (let z = 0; z < marching_grid_size; z++) {
		for (let x = 0; x < marching_grid_size; x++) {
			for (let y = 0; y < marching_grid_size; y++) {
				
				const cubePos = [];
				
				const cubeVal = [
					getVal(slice0, x,     y),
					getVal(slice0, x + 1, y),
					getVal(slice0, x + 1, y + 1),
					getVal(slice0, x,     y + 1),
				
					getVal(slice1, x,     y),
					getVal(slice1, x + 1, y),
					getVal(slice1, x + 1, y + 1),
					getVal(slice1, x,     y + 1),
				];
				
				for (let i = 0; i < 8; i++) {
					const vx = (x + CUBE_VERTS[i][0]) * vertex_scale - 1;
					const vy = (y + CUBE_VERTS[i][1]) * vertex_scale - 1;
					const vz = (z + CUBE_VERTS[i][2]) * vertex_scale - 1;
					cubePos.push([vx, vy, vz]);
				}
			
				let caseIndex = 0;
				for (let i = 0; i < 8; i++) {
					if (cubeVal[i] < 0) caseIndex |= (1 << i);
				}
			
				if (edgeTable[caseIndex] === 0) continue;
				
				if(ymin == 0 && y > 0) ymin = y;
				if(y > ymax) ymax = y;
			
				const vertList = new Array(12);
				
				for (let e = 0; e < 12; e++) {
					if (edgeTable[caseIndex] & (1 << e)) {
						const [a, b] = EDGE_INDEX[e];
						vertList[e] = interpolate(cubePos[a], cubePos[b], cubeVal[a], cubeVal[b]);
					}
				}
			
				for (let i = 0; triTable[caseIndex][i] !== -1; i += 3) {
				
					const a = vertList[triTable[caseIndex][i]];
					const b = vertList[triTable[caseIndex][i+1]];
					const c = vertList[triTable[caseIndex][i+2]];
					
					const col = colourModeFunction(x,y,z);
			
					if(flatShading)
					{
						const norm = faceNormal(a,b,c);
						pushVertex(	a[0], a[1], a[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
						pushVertex(	b[0], b[1], b[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
						pushVertex(	c[0], c[1], c[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
					}
					else
					{
						const anorm = computeNormal(a[0], a[1], a[2]);
						const bnorm = computeNormal(b[0], b[1], b[2]);
						const cnorm = computeNormal(c[0], c[1], c[2]);
						pushVertex(	a[0], a[1], a[2], anorm.x, anorm.y, anorm.z, col.r, col.g, col.b);
						pushVertex(	b[0], b[1], b[2], bnorm.x, bnorm.y, bnorm.z, col.r, col.g, col.b);
						pushVertex(	c[0], c[1], c[2], cnorm.x, cnorm.y, cnorm.z, col.r, col.g, col.b);
					}
				}
			}
		}
		
		slice0 = slice1;
		slice1 = precomputeSlice(z + 1);
	}
	
	console.log(ymin, ymax);
}

export function XYCubeMarcher(z, slice0, slice1, flatShading) {

	for (let x = 0; x < marching_grid_size; x++) {
		for (let y = 0; y < marching_grid_size; y++) {
			
			const cubePos = [];
			
			const cubeVal = [
				getVal(slice0, x,     y),
				getVal(slice0, x + 1, y),
				getVal(slice0, x + 1, y + 1),
				getVal(slice0, x,     y + 1),
			
				getVal(slice1, x,     y),
				getVal(slice1, x + 1, y),
				getVal(slice1, x + 1, y + 1),
				getVal(slice1, x,     y + 1),
			];
			
			for (let i = 0; i < 8; i++) {
				const vx = (x + CUBE_VERTS[i][0]) * vertex_scale - 1;
				const vy = (y + CUBE_VERTS[i][1]) * vertex_scale - 1;
				const vz = (z + CUBE_VERTS[i][2]) * vertex_scale - 1;
				cubePos.push([vx, vy, vz]);
			}
		
			let caseIndex = 0;
			for (let i = 0; i < 8; i++) {
				if (cubeVal[i] < 0) caseIndex |= (1 << i);
			}
		
			if (edgeTable[caseIndex] === 0) continue;
		
			const vertList = new Array(12);
			
			for (let e = 0; e < 12; e++) {
				if (edgeTable[caseIndex] & (1 << e)) {
					const [a, b] = EDGE_INDEX[e];
					vertList[e] = interpolate(cubePos[a], cubePos[b], cubeVal[a], cubeVal[b]);
				}
			}
		
			for (let i = 0; triTable[caseIndex][i] !== -1; i += 3) {
			
				const a = vertList[triTable[caseIndex][i]];
				const b = vertList[triTable[caseIndex][i+1]];
				const c = vertList[triTable[caseIndex][i+2]];
				
				const col = colourModeFunction(x,y,z);
		
				if(flatShading)
				{
					const norm = faceNormal(a,b,c);
					pushVertex(	a[0], a[1], a[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
					pushVertex(	b[0], b[1], b[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
					pushVertex(	c[0], c[1], c[2], norm[0], norm[1], norm[2], col.r, col.g, col.b);
				}
				else
				{
					const anorm = computeNormal(a[0], a[1], a[2]);
					const bnorm = computeNormal(b[0], b[1], b[2]);
					const cnorm = computeNormal(c[0], c[1], c[2]);
					pushVertex(	a[0], a[1], a[2], anorm.x, anorm.y, anorm.z, col.r, col.g, col.b);
					pushVertex(	b[0], b[1], b[2], bnorm.x, bnorm.y, bnorm.z, col.r, col.g, col.b);
					pushVertex(	c[0], c[1], c[2], cnorm.x, cnorm.y, cnorm.z, col.r, col.g, col.b);
				}
			}
		}
	}
}

/*
export function indexToXYZ(index) {
	const x = index % marching_grid_size;
	const y = Math.floor(index / marching_grid_size) % marching_grid_size;
	const z = Math.floor(index / (marching_grid_size * marching_grid_size));
	return { x, y, z };
}
*/
