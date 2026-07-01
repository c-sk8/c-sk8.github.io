// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	Decocube, Tooth, SuperSphere, GumdropTorus, SinusoidalSphere,
			ChairSurface, GeodesicPointsSphereOptimized, TwistedWaveTorus,
			MoebiusStrip, AlgebraicSurface, SurfacePattern, BlobRing,
			PiriformDiabolo, SuperSphereCluster, Tetrahedral, ThreeTori,
			RadialWaveSphere, FlattenedWavePattern, SpheredSchwarzP,
			Rhombicuboctahedron, GyroidFloor, LidinoidSurface
 			} from './field-functions.js';

export function getNextFieldFunctionIndex(index) {
	return (index + 1) % fieldList.length;
}

export function getFieldIndexString(index) {
	return '(' + (index+1) + '/' + fieldList.length + ')';
}

export function getFieldName(index) {
	return	fieldList[index].name;
}

export function getVariantIndexString(index) {
	const v_index = fieldList[index].currentVariant;
	return '(' + (v_index+1) + '/' + fieldList[index].variants.length + ')';
}

export function getVariantsCount(index) {
	return fieldList[index].variants.length;
}

export function getBounds(index) {
	const bounds = fieldList[index]?.bounds ?? [-1, 1, -1, 1, -1, 1];
	const v_index = fieldList[index]?.currentVariant;
	return fieldList[index]?.variants?.[v_index]?.bounds ?? bounds;
}

export function getFieldFunction(index) {
	return fieldList[index].fn;
}

export function getFieldFunctionParams(index) {
	const v_index = fieldList[index].currentVariant;
	return fieldList[index].variants[v_index].params;
}

export function getColourMode(index) {
	return fieldList[index].colourMode;
}

export function getNextFieldIndex(index) {
	let next_index = index + 1;
	if (next_index > fieldList.length - 1) next_index = 0;	
	return next_index;	
}

export function getPreviousFieldIndex(index) {
	let previous_index = index - 1;
	if (previous_index < 0) previous_index = fieldList.length - 1;
	return previous_index;	
}

export function nextVariant(index) {
	let next_variant = fieldList[index].currentVariant + 1;
	if(next_variant > fieldList[index].variants.length - 1)
		next_variant = 0;
	fieldList[index].currentVariant = next_variant;
}

export function previousVariant(index) {
	let previous_variant = fieldList[index].currentVariant - 1;
	if(previous_variant < 0)
		previous_variant = fieldList[index].variants.length - 1;
	fieldList[index].currentVariant = previous_variant;
}

export function nextColourMode(index, col_modes_count) {
	let next_col_mode = fieldList[index].colourMode + 1;
	if(next_col_mode > col_modes_count - 1)
		next_col_mode = 0;
	fieldList[index].colourMode = next_col_mode;
}

export function previousColourMode(index, col_modes_count) {
	let prev_col_mode = fieldList[index].colourMode - 1;
	if(prev_col_mode < 0)
		prev_col_mode = col_modes_count - 1;
	fieldList[index].colourMode = prev_col_mode;
}

// =====================================================================================

export function getFieldFunctionName(index) {
	return fieldList[index].fn.name;
}
export function getVariantParams(index, variant_index) {
	return fieldList[index].variants[variant_index].params;
}
export function getCurrentVariant(index) {
	return fieldList[index].currentVariant;
}
export function getFieldsCount() {
	return fieldList.length;
}

// =====================================================================================

const fieldList = [
{
	name: "Decocube",
	fn: Decocube,
	colourMode: 0,
	currentVariant: 4,
	variants: [
		{ params: [1.16, 0.05, 0.35] },
		{ params: [1.16, 0.30, 0.15] },
		{ params: [1.16, 0.55, 0.07] },
		{ params: [1.16, 0.75, 0.05] },
		{ params: [1.16, 1.00, 0.03] }
	]
},
{
	name: "Tooth",
	fn: Tooth,
	colourMode: 1,
	currentVariant: 4,
	variants: [
		{ params: [1.1, 1.22] },
		{ params: [1.1, 1.12] },
		{ params: [1.1, 1.02] },
		{ params: [1.1, 0.92] },
		{ params: [1.1, 0.82] },
		{ params: [1.1, 0.72] },
		{ params: [1.1, 0.62] },
		{ params: [1.1, 0.52] }
	]
},
{
	name: "Gumdrop Torus",
	fn: GumdropTorus,
	colourMode: 2,
	currentVariant: 0,
	variants: [
		{ params: [2, 18.3, 20, 20, 20] },
		{ params: [2.2, 18, 22, 15, 22] },
		{ params: [2.1, 15, 20, 16, 20] },
		{ params: [2.1, 18, 18, 18, 18] }
	]
},
{
	name: "Sinusoidal Sphere",
	fn: SinusoidalSphere,
	colourMode: 3,
	currentVariant: 3,
	variants: [
		{ params: [0.4, 0.2, 10, 1, 2] },
		{ params: [0.4, 0.3, 9, 1.5, 2] },
		{ params: [0.4, 0.4, 8, 2, 2] },
		{ params: [0.4, 0.5, 7, 2.5, 2] },
		{ params: [0.4, 0.6, 6, 3, 2] },
		{ params: [0.4, 0.7, 5, 3.5, 2] },
		{ params: [0.4, 0.8, 4, 4, 2] },
		{ params: [0.4, 0.9, 3, 4.5, 2] },
		{ params: [0.4, 0.9, 2, 5, 2] },
		{ params: [0.4, 0.9, 1, 5.5, 2] },
	]
},
{
	name: "Chair Surface",
	fn: ChairSurface,
	colourMode: 4,
	currentVariant: 2,
	variants: [
		{ params: [1, 0.74, 0.1] },
		{ params: [1, 0.74, 0.15] },
		{ params: [1, 0.74, 0.2] },
		{ params: [1, 0.74, 0.25] },
		{ params: [1, 0.74, 0.3] },
		{ params: [1, 0.74, 0.35] },
		{ params: [1, 0.74, 0.4] },
		{ params: [1, 0.74, 0.45] },
		{ params: [1, 0.74, 0.5] },
		{ params: [1, 0.74, 0.55] },
		{ params: [1, 0.74, 0.6] },
		{ params: [1, 0.74, 0.65] },
	]
},
{
	name: "Geodesic Sphere Points",
	fn: GeodesicPointsSphereOptimized,
	colourMode: 17,
	currentVariant: 10,
	variants: [
		{ params: [0.8, 0.2] },
		{ params: [0.775, 0.22] },
		{ params: [0.75, 0.24] },
		{ params: [0.725, 0.26] },
		{ params: [0.7, 0.28] },
		{ params: [0.675, 0.3] },
		{ params: [0.65, 0.32] },
		{ params: [0.625, 0.34] },
		{ params: [0.6, 0.36] },
		{ params: [0.575, 0.38] },
		{ params: [0.55, 0.4] },
		{ params: [0.525, 0.42] },
		{ params: [0.5, 0.44] },
		{ params: [0.475, 0.46] }
	]
},
{
	name: "Twisted Torus",
	fn: TwistedWaveTorus,
	colourMode: 1,
	currentVariant: 13,
	bounds: [-1,1,-0.34,0.34,-1,1],
	variants: [
		{ params: [2.3, 3, 0] },
		{ params: [2.3, 3, 0.005] },
		{ params: [2.3, 3, 0.01] },
		{ params: [2.3, 3, 0.015] },
		{ params: [2.3, 3, 0.02] },
		{ params: [2.3, 3, 0.025] },
		{ params: [2.3, 3, 0.03] },
		{ params: [2.3, 3, 0.035] },
		{ params: [2.3, 3, 0.04] },
		{ params: [2.3, 3, 0.045] },
		{ params: [2.3, 3, 0.05] },
		{ params: [2.3, 3, 0.055] },
		{ params: [2.3, 3, 0.06] },
		{ params: [2.3, 3, 0.065] },
		{ params: [2.3, 3, 0.07] },
		{ params: [2.3, 3, 0.075] },
		{ params: [2.3, 3, 0.08] }
	]
},
{
	name: "Moebius Strip",
	fn: MoebiusStrip,
	colourMode: 6,
	currentVariant: 2,
	bounds: [-1,1,-1,1,-0.25,0.25],
	variants: [
		{ params: [4.2, 1, 0.5, 1] },
		{ params: [4.2, 2, 0.5, 1] },
		{ params: [4.2, 3, 0.5, 1] },
		{ params: [4.2, 4, 0.5, 1] },
		{ params: [4.2, 5, 0.5, 1] }
	]
},
{
	name: "Algebraic Surface",
	fn: AlgebraicSurface,
	colourMode: 7,
	currentVariant: 7,
	variants: [
		{ params: [3.9, 3, 2, 10, 14] },
		{ params: [3.9, 3, 3, 10, 16] },
		{ params: [3.9, 3, 4, 10, 18] },
		{ params: [3.9, 3, 5, 10, 20] },
		{ params: [3.9, 3, 6, 10, 22] },
		{ params: [3.9, 3, 7, 10, 24] },
		{ params: [3.9, 3, 8, 10, 26] },
		{ params: [3.9, 3, 9, 10, 28] },
		{ params: [3.9, 3, 10, 10, 30] },
		{ params: [3.9, 3, 11, 10, 32] },
		{ params: [3.9, 3, 12, 10, 34] },
		{ params: [3.9, 3, 13, 10, 36] },
		{ params: [3.9, 3, 14, 10, 38] },
		{ params: [3.9, 3, 15, 10, 40] }
	]
},
{
	name: "Cosine Pattern",
	fn: SurfacePattern,
	colourMode: 11,
	currentVariant: 1,
	variants: [
		{ params: [20, 20, 1], bounds: [-1.5,1.5,-0.15,0.09,-1.5,1.5] },
		{ params: [14, 14, 1], bounds: [-1.8,1.8,-0.22,0.15,-1.8,1.8] },
		{ params: [8, 8, 1], bounds: [-1.8,1.8,-0.38,0.2,-1.8,1.8] }
	]
},
{
	name: "Blob Ring",
	fn: BlobRing,
	colourMode: 9,
	currentVariant: 0,
	variants: [
		{ params: [0.8, 0.8], bounds: [-1.2,1.2,-0.36,0.36,-1.2,1.2] }
	]
},
{
	name: "Piriform Diabolo",
	fn: PiriformDiabolo,
	colourMode: 8,
	currentVariant: 0,
	bounds: [-1.1,1.1,-0.7,0.7,-0.8,0.7],
	variants: [
		{ params: [3.5, 0.5, 0.24] },
		{ params: [3.5, 0.5, 0.16] },
		{ params: [3.5, 0.5, 0.08] },
		{ params: [3.5, 0.5, 0] }
	]
},
{
	name: "Super Sphere Cluster",
	fn: SuperSphereCluster,
	colourMode: 13,
	currentVariant: 0,
	variants: [
		{ params: [0.95, 4, 1] },
		{ params: [0.95, 3.5, 1] },
		{ params: [0.95, 3, 1] },
		{ params: [0.95, 2.5, 1] },
		{ params: [0.95, 2, 1] },
		{ params: [0.95, 1.5, 1] }
	]
},
{
	name: "Tetrahedral",
	fn: Tetrahedral,
	colourMode: 2,
	currentVariant: 7,
	variants: [
		{ params: [3.2, 10] },
		{ params: [3.2, 12] },
		{ params: [3.2, 14] },
		{ params: [3.2, 16] },
		{ params: [3.2, 18] },
		{ params: [3.2, 20] },
		{ params: [3.2, 22] },
		{ params: [3.2, 24] },
		{ params: [3.2, 26] },
		{ params: [3.2, 28] },
		{ params: [3.2, 30] },
		{ params: [3.2, 32] },
		{ params: [3.2, 34] },
		{ params: [3.2, 36] },
		{ params: [3.2, 38] },
		{ params: [3.2, 40] }
	]
},
{
	name: "Three Tori",
	fn: ThreeTori,
	colourMode: 11,
	currentVariant: 0,
	variants: [
		{ params: [3.95, 3, 0.55, 2] },
		{ params: [3.95, 3, 0.35, 0.5] },
		{ params: [3.55, 3, 0.15, 2] }
	]
},
{
	name: "Radial Wave Sphere",
	fn: RadialWaveSphere,
	colourMode: 6,
	currentVariant: 4,
	variants: [
		{ params: [0.3] },
		{ params: [0.35] },
		{ params: [0.4] },
		{ params: [0.45] },
		{ params: [0.5] },
		{ params: [0.55] },
		{ params: [0.6] },
		{ params: [0.65] },
		{ params: [0.7] }
	]
},
{
	name: "Flattened Wave Pattern",
	fn: FlattenedWavePattern,
	colourMode: 12,
	currentVariant: 0,
	variants: [
		{ params: [10, 14, 2], bounds: [-2,2,-0.04,0.04,-2,2] },
		{ params: [10, 7, 2], bounds: [-2,2,-0.09,0.09,-2,2] }
	]
},
{
	name: "Rhombicuboctahedron",
	fn: Rhombicuboctahedron,
	colourMode: 0,
	currentVariant: 6,
	variants: [
		{ params: [3.1, 1, 2.2, 3.6] },
		{ params: [3.1, 1, 2.2, 3.1] },
		{ params: [3.1, 1, 2.2, 2.6] },
		{ params: [3.1, 1, 2.2, 2.1] },
		{ params: [3.1, 1, 2.2, 1.6] },
		{ params: [3.1, 1, 2.2, 1.1] },
		{ params: [3.1, 1, 2.2, 0.6] },
		{ params: [3.1, 1, 2.2, 0.1] }
	]
},
{
	name: "Sphered Schwarz P",
	fn: SpheredSchwarzP,
	colourMode: 2,
	currentVariant: 0,
	variants: [
		{ params: [1.2, 1, 0.9] },
		{ params: [1.45, 1, 1.5] },
		{ params: [0.7, 1, 2.5] }
	]
},
{
	name: "Gyroid Floor",
	fn: GyroidFloor,
	colourMode: 3,
	currentVariant: 2,
	bounds: [-1,1,-1,0.75,-1,1],
	variants: [
		{ params: [3, 2.5, 1.5] },
		{ params: [4, 2.5, 1.5] },
		{ params: [5, 2.5, 1.5] },
		{ params: [6, 2.5, 1.5] },
		{ params: [6, 3, 1.5] },
		{ params: [6, 3.5, 1.5] },
		{ params: [6, 4, 1.5] },
	]
},
{
	name: "Lidinoid Surface",
	fn: LidinoidSurface,
	colourMode: 4,
	currentVariant: 0,
	variants: [
		{ params: [2.2,1,2] },
		{ params: [3,0.8,1.5] }
	]
}
];
