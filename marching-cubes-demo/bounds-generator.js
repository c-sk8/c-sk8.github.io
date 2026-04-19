// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import { 	getFieldFunction, getVariantsCount, getVariantParams, getFieldName,
			getColourMode, getCurrentVariant, getFieldFunctionName,
			getFieldsCount  }
			from './field-functions-manager.js';
import {	edgeTable, triTable as triTableFlat } from './tables.js';
import {	BoundingBox } from './bounds.js';

const triTable = [];

for (let i = 0; i < 256; i++) {
	triTable.push(triTableFlat.slice(i * 16, i * 16 + 16));
}

export function generateAllBounds() {

	const f_count = getFieldsCount();
	
	for(let index = 0; index < f_count; index++) {
		let bounds = [];
		for (let v = 0; v < getVariantsCount(index); v++) {
			bounds[v] = CalculateSurfaceBounds(
				getFieldFunction(index),
				getVariantParams(index, v),
				200);
				
			bounds[v].normalize(-1,1);
			bounds[v].round(4);
		}
		
		outputToLog(index, bounds);
	}
}

function outputToLog(index, bounds)
{
	const field_name = getFieldName(index);
	const variants_count = getVariantsCount(index);
	const field_function_name =  getFieldFunctionName(index);
	const colour_mode = getColourMode(index);
	const current_variant = getCurrentVariant(index);
	
	
    const lines = [];

    lines.push("{");
    lines.push(`\tname: "${field_name}",`);
	lines.push(`\tfn: ${field_function_name},`);
	lines.push(`\tcolourMode: ${colour_mode},`);
	lines.push(`\tcurrentVariant: ${current_variant},`);
    lines.push(`\tvariants: [`);

	for(let v=0; v < variants_count; v++)
	{
		const variant_params = getVariantParams(index, v);
		const params = `[${variant_params.join(", ")}]`;
		const boundsstr = bounds[v].getString();
		const comma = (v < variants_count - 1) ? "," : "";
		lines.push(`\t\t{ params: ${params}, bounds: ${boundsstr} }${comma}`);
	}

    lines.push("\t]");
    lines.push("}");
    
    console.log(lines.join("\n"));
}

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

function interpolate(p1, p2, v1, v2) {
	const t = v1 / (v1 - v2);
	return [p1[0] + t * (p2[0] - p1[0]),
			p1[1] + t * (p2[1] - p1[1]),
			p1[2] + t * (p2[2] - p1[2])];
}

function CalculateSurfaceBounds(field_function, params, cubespace_size) {

	console.log('CalculateSurfaceBounds: ',params);
		
	const box = new BoundingBox();

	for (let z = 0; z < cubespace_size; z++) {
		for (let x = 0; x < cubespace_size; x++) {
			for (let y = 0; y < cubespace_size; y++) {
			
				const cubePos = [];
				const cubeVal = [];
				
				for (let i = 0; i < 8; i++) {
					const vx = ((x + CUBE_VERTS[i][0]) * 2/cubespace_size) - 1;
					const vy = ((y + CUBE_VERTS[i][1]) * 2/cubespace_size) - 1;
					const vz = ((z + CUBE_VERTS[i][2]) * 2/cubespace_size) - 1;
					cubePos.push([vx, vy, vz]);
					cubeVal.push(field_function(vx, vy, vz, params));
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
					
					box.addPoint(a[0], a[1], a[2]);
					box.addPoint(b[0], b[1], b[2]);
					box.addPoint(c[0], c[1], c[2]);
				}
			}
		}
	}
	
	return box;
}
