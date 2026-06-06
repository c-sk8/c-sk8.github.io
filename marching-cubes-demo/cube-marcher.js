// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';

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

export function setMaxVertices(max_vertices = 2000000) {

    positions = new Float32Array(max_vertices * 3);
    normals   = new Float32Array(max_vertices * 3);
    colors    = new Float32Array(max_vertices * 3);
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

function computeNormal(x, y, z, fn, params) {
    const eps = 0.01;

    const dx =	fn(x - eps, y, z, params) - fn(x + eps, y, z, params);
    const dy =	fn(x, y - eps, z, params) - fn(x, y + eps, z, params);
    const dz =	fn(x, y, z - eps, params) - fn(x, y, z + eps, params);

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

export function computeSlice(zIndex, sampling, field_fn, field_fn_params) {

    const minX = sampling.bounds.min_x;
    const maxX = sampling.bounds.max_x;

    const minY = sampling.bounds.min_y;
    const maxY = sampling.bounds.max_y;

    const stepX = sampling.step.x;
    const stepY = sampling.step.y;
    const stepZ = sampling.step.z;

    const width  = sampling.dimensions.width;
    const height = sampling.dimensions.height;

    const data = new Float32Array(width * height);

    const vz = sampling.bounds.min_z + zIndex * stepZ;

    let i = 0;

    for (let x = 0; x < width; x++) {

        const vx = minX + x * stepX;

        for (let y = 0; y < height; y++) {

            const vy = minY + y * stepY;

            data[i++] = field_fn(vx, vy, vz, field_fn_params);
        }
    }

    return data;
}

function getVal(data, x, y, height) {
    return data[x * height + y];
}

export function CubeMarcher(flatShading, sampling, field_fn, field_fn_params, colour_fn) {

	let slice0 = null;
	let slice1 = null;

	slice0 = computeSlice(	0, sampling, field_fn, field_fn_params);
	slice1 = computeSlice(	1, sampling, field_fn, field_fn_params);

    const minX = sampling.bounds.min_x;
    const maxX = sampling.bounds.max_x;

    const minY = sampling.bounds.min_y;
    const maxY = sampling.bounds.max_y;

    const minZ = sampling.bounds.min_z;
    const maxZ = sampling.bounds.max_z;

    const stepX = sampling.step.x;
    const stepY = sampling.step.y;
    const stepZ = sampling.step.z;

    const width  = sampling.dimensions.width;
    const height = sampling.dimensions.height;
    const depth = sampling.dimensions.depth;

	for (let z = 0; z < depth; z++) {
		for (let x = 0; x < width - 1; x++) {
			for (let y = 0; y < height - 1; y++) {
				
				const cubePos = [];
				
				const cubeVal = [
					getVal(slice0, x, y, height),
					getVal(slice0, x + 1, y, height),
					getVal(slice0, x + 1, y + 1, height),
					getVal(slice0, x, y + 1, height),
				
					getVal(slice1, x, y, height),
					getVal(slice1, x + 1, y, height),
					getVal(slice1, x + 1, y + 1, height),
					getVal(slice1, x, y + 1, height),
				];
								
				for (let i = 0; i < 8; i++) {
					const vx = minX + (x + CUBE_VERTS[i][0]) * stepX;
					const vy = minY + (y + CUBE_VERTS[i][1]) * stepY;
					const vz = minZ + (z + CUBE_VERTS[i][2]) * stepZ;
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
					
					//const col = colour_fn(x,y,z,width,height,depth);
					const a_col = colour_fn(x, y, z, a, sampling);
					const b_col = colour_fn(x, y, z, b, sampling);
					const c_col = colour_fn(x, y, z, c, sampling);
					
					if(flatShading)
					{
						const norm = faceNormal(a,b,c);
						pushVertex(	a[0], a[1], a[2], norm[0], norm[1], norm[2], a_col.r, a_col.g, a_col.b);
						pushVertex(	b[0], b[1], b[2], norm[0], norm[1], norm[2], b_col.r, b_col.g, b_col.b);
						pushVertex(	c[0], c[1], c[2], norm[0], norm[1], norm[2], c_col.r, c_col.g, c_col.b);
					}
					else
					{
						const anorm = computeNormal(a[0], a[1], a[2], field_fn, field_fn_params);
						const bnorm = computeNormal(b[0], b[1], b[2], field_fn, field_fn_params);
						const cnorm = computeNormal(c[0], c[1], c[2], field_fn, field_fn_params);
						pushVertex(	a[0], a[1], a[2], anorm.x, anorm.y, anorm.z, a_col.r, a_col.g, a_col.b);
						pushVertex(	b[0], b[1], b[2], bnorm.x, bnorm.y, bnorm.z, b_col.r, b_col.g, b_col.b);
						pushVertex(	c[0], c[1], c[2], cnorm.x, cnorm.y, cnorm.z, c_col.r, c_col.g, c_col.b);
					}
				}
			}
		}
		
		slice0 = slice1;
		
		// Here was a difficult bug to fix, this line used z + 1, but it needs to be
		// z + 2, otherwise one line looks wrong!
		slice1 = computeSlice(z + 2, sampling, field_fn, field_fn_params);
	}
}

export function XYCubeMarcher(z, slice0, slice1, sampling, flatShading, field_fn, field_fn_params, colour_fn) {
								
    const minX = sampling.bounds.min_x;
    const maxX = sampling.bounds.max_x;

    const minY = sampling.bounds.min_y;
    const maxY = sampling.bounds.max_y;

    const minZ = sampling.bounds.min_z;
    const maxZ = sampling.bounds.max_z;

    const stepX = sampling.step.x;
    const stepY = sampling.step.y;
    const stepZ = sampling.step.z;

    const width  = sampling.dimensions.width;
    const height = sampling.dimensions.height;
    const depth = sampling.dimensions.depth;

	for (let x = 0; x < width - 1; x++) {
		for (let y = 0; y < height - 1; y++) {
			
			const cubePos = [];
			
			const cubeVal = [
				getVal(slice0, x, y, height),
				getVal(slice0, x + 1, y, height),
				getVal(slice0, x + 1, y + 1, height),
				getVal(slice0, x, y + 1, height),
			
				getVal(slice1, x, y, height),
				getVal(slice1, x + 1, y, height),
				getVal(slice1, x + 1, y + 1, height),
				getVal(slice1, x, y + 1, height),
			];
			
			for (let i = 0; i < 8; i++) {
				const vx = minX + (x + CUBE_VERTS[i][0]) * stepX;
				const vy = minY + (y + CUBE_VERTS[i][1]) * stepY;
				const vz = minZ + (z + CUBE_VERTS[i][2]) * stepZ;
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
				
				//const col = colour_fn(x,y,z,width,height,depth);
				const a_col = colour_fn(x, y, z, a, sampling);
				const b_col = colour_fn(x, y, z, b, sampling);
				const c_col = colour_fn(x, y, z, c, sampling);
		
				if(flatShading)
				{
					const norm = faceNormal(a,b,c);
					pushVertex(	a[0], a[1], a[2], norm[0], norm[1], norm[2], a_col.r, a_col.g, a_col.b);
					pushVertex(	b[0], b[1], b[2], norm[0], norm[1], norm[2], b_col.r, b_col.g, b_col.b);
					pushVertex(	c[0], c[1], c[2], norm[0], norm[1], norm[2], c_col.r, c_col.g, c_col.b);
				}
				else
				{
					const anorm = computeNormal(a[0], a[1], a[2], field_fn, field_fn_params);
					const bnorm = computeNormal(b[0], b[1], b[2], field_fn, field_fn_params);
					const cnorm = computeNormal(c[0], c[1], c[2], field_fn, field_fn_params);
					pushVertex(	a[0], a[1], a[2], anorm.x, anorm.y, anorm.z, a_col.r, a_col.g, a_col.b);
					pushVertex(	b[0], b[1], b[2], bnorm.x, bnorm.y, bnorm.z, b_col.r, b_col.g, b_col.b);
					pushVertex(	c[0], c[1], c[2], cnorm.x, cnorm.y, cnorm.z, c_col.r, c_col.g, c_col.b);
				}
			}
		}
	}
}