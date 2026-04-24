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
			RadialWaveSphere, FlattenedWavePattern, SpheredSchwarzP
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

export function getVariantBounds(index) {
	const v_index = fieldList[index].currentVariant;
	return fieldList[index].variants[v_index].bounds;
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
	currentVariant: 1,
	variants: [
		{ params: [1.4, 1, 0.01], bounds: [0.1,0.9,0.1,0.9,0.1,0.9] },
		{ params: [1.38, 0.9, 0.04], bounds: [0.087,0.913,0.087,0.913,0.087,0.913] },
		{ params: [1.36, 0.8, 0.08], bounds: [0.078,0.922,0.078,0.922,0.078,0.922] },
		{ params: [1.34, 0.7, 0.12], bounds: [0.073,0.927,0.073,0.927,0.073,0.927] },
		{ params: [1.32, 0.6, 0.16], bounds: [0.067,0.933,0.067,0.933,0.067,0.933] },
		{ params: [1.3, 0.5, 0.2], bounds: [0.062,0.938,0.062,0.938,0.062,0.938] },
		{ params: [1.28, 0.4, 0.24], bounds: [0.057,0.943,0.057,0.943,0.057,0.943] },
		{ params: [1.26, 0.3, 0.28], bounds: [0.052,0.948,0.052,0.948,0.052,0.948] },
		{ params: [1.24, 0.2, 0.32], bounds: [0.046,0.954,0.046,0.954,0.046,0.954] },
		{ params: [1.22, 0.1, 0.36], bounds: [0.04,0.96,0.04,0.96,0.04,0.96] },
		{ params: [1.2, 0, 0.4], bounds: [0.034,0.966,0.034,0.966,0.034,0.966] },
		{ params: [1.2, -0.1, 0.44], bounds: [0.039,0.961,0.039,0.961,0.039,0.961] },
		{ params: [1.2, -0.2, 0.48], bounds: [0.054,0.946,0.054,0.946,0.054,0.946] }
	]
},
{
	name: "Tooth",
	fn: Tooth,
	colourMode: 4,
	currentVariant: 3,
	variants: [
		{ params: [1.3, 1.22], bounds: [0.14,0.86,0.14,0.86,0.14,0.86] },
		{ params: [1.3, 1.12], bounds: [0.127,0.873,0.127,0.873,0.127,0.873] },
		{ params: [1.3, 1.02], bounds: [0.117,0.883,0.117,0.883,0.117,0.883] },
		{ params: [1.3, 0.92], bounds: [0.108,0.892,0.108,0.892,0.108,0.892] },
		{ params: [1.3, 0.82], bounds: [0.099,0.901,0.099,0.901,0.099,0.901] },
		{ params: [1.3, 0.72], bounds: [0.092,0.908,0.092,0.908,0.092,0.908] },
		{ params: [1.3, 0.62], bounds: [0.085,0.915,0.085,0.915,0.085,0.915] },
		{ params: [1.3, 0.52], bounds: [0.078,0.922,0.078,0.922,0.078,0.922] },
		{ params: [1.3, 0.42], bounds: [0.072,0.928,0.072,0.928,0.072,0.928] },
		{ params: [1.3, 0.32], bounds: [0.066,0.934,0.066,0.934,0.066,0.934] }
	]
},
{
	name: "Super Sphere",
	fn: SuperSphere,
	colourMode: 2,
	currentVariant: 2,
	variants: [
		{ params: [1, 1], bounds: [0.226,0.774,0.226,0.774,0.226,0.774] },
		{ params: [1, 1.5], bounds: [0.165,0.835,0.165,0.835,0.165,0.835] },
		{ params: [1, 2], bounds: [0.129,0.871,0.129,0.871,0.129,0.871] },
		{ params: [1, 2.5], bounds: [0.107,0.893,0.107,0.893,0.107,0.893] },
		{ params: [1, 3], bounds: [0.09,0.91,0.09,0.91,0.09,0.91] },
		{ params: [1, 3.5], bounds: [0.079,0.921,0.079,0.921,0.079,0.921] },
		{ params: [1, 4], bounds: [0.069,0.931,0.069,0.931,0.069,0.931] },
		{ params: [1, 4.5], bounds: [0.062,0.938,0.062,0.938,0.062,0.938] }
	]
},
{
	name: "GumdropTorus",
	fn: GumdropTorus,
	colourMode: 3,
	currentVariant: 5,
	variants: [
		{ params: [2.3, 12.5], bounds: [0.05,0.95,0.05,0.95,0.05,0.95] },
		{ params: [2.3, 13.5], bounds: [0.054,0.946,0.054,0.946,0.054,0.946] },
		{ params: [2.3, 14.5], bounds: [0.058,0.942,0.058,0.942,0.058,0.942] },
		{ params: [2.3, 15.5], bounds: [0.063,0.937,0.063,0.937,0.063,0.937] },
		{ params: [2.3, 16.5], bounds: [0.067,0.933,0.067,0.933,0.067,0.933] },
		{ params: [2.3, 17.5], bounds: [0.072,0.928,0.072,0.928,0.072,0.928] },
		{ params: [2.3, 18.5], bounds: [0.077,0.923,0.077,0.923,0.077,0.923] },
		{ params: [2.3, 19.5], bounds: [0.083,0.917,0.083,0.917,0.083,0.917] },
		{ params: [2.3, 20.5], bounds: [0.089,0.911,0.089,0.911,0.089,0.911] },
		{ params: [2.3, 21.5], bounds: [0.097,0.903,0.097,0.903,0.097,0.903] }
	]
},
{
	name: "Sinusoidal Sphere",
	fn: SinusoidalSphere,
	colourMode: 4,
	currentVariant: 3,
	variants: [
		{ params: [0.4, 0.2, 10, 1, 2], bounds: [0.183,0.817,0.183,0.817,0.183,0.817] },
		{ params: [0.4, 0.3, 9, 1.5, 2], bounds: [0.183,0.817,0.17,0.83,0.175,0.825] },
		{ params: [0.4, 0.4, 8, 2, 2], bounds: [0.183,0.817,0.146,0.854,0.146,0.854] },
		{ params: [0.4, 0.5, 7, 2.5, 2], bounds: [0.179,0.821,0.131,0.869,0.107,0.893] },
		{ params: [0.4, 0.6, 6, 3, 2], bounds: [0.182,0.818,0.134,0.866,0.071,0.929] },
		{ params: [0.4, 0.7, 5, 3.5, 2], bounds: [0.183,0.817,0.15,0.85,0.044,0.956] },
		{ params: [0.4, 0.8, 4, 4, 2], bounds: [0.17,0.83,0.17,0.83,0.027,0.973] },
		{ params: [0.4, 0.9, 3, 4.5, 2], bounds: [0.11,0.89,0.183,0.817,0.02,0.98] },
		{ params: [0.4, 0.9, 2, 5, 2], bounds: [0.052,0.948,0.183,0.817,0.052,0.948] },
		{ params: [0.4, 0.9, 1, 5.5, 2], bounds: [0.103,0.897,0.183,0.817,0.139,0.861] }
	]
},
{
	name: "Chair Surface",
	fn: ChairSurface,
	colourMode: 5,
	currentVariant: 2,
	variants: [
		{ params: [1, 0.74, 0.1], bounds: [0.067,0.933,0.067,0.933,0.052,0.948] },
		{ params: [1, 0.74, 0.15], bounds: [0.063,0.937,0.063,0.937,0.049,0.951] },
		{ params: [1, 0.74, 0.2], bounds: [0.06,0.94,0.06,0.94,0.047,0.953] },
		{ params: [1, 0.74, 0.25], bounds: [0.057,0.943,0.057,0.943,0.045,0.955] },
		{ params: [1, 0.74, 0.3], bounds: [0.055,0.945,0.055,0.945,0.043,0.957] },
		{ params: [1, 0.74, 0.35], bounds: [0.052,0.948,0.052,0.948,0.042,0.958] },
		{ params: [1, 0.74, 0.4], bounds: [0.05,0.95,0.05,0.95,0.041,0.959] },
		{ params: [1, 0.74, 0.45], bounds: [0.048,0.952,0.048,0.952,0.04,0.96] },
		{ params: [1, 0.74, 0.5], bounds: [0.047,0.953,0.047,0.953,0.039,0.961] },
		{ params: [1, 0.74, 0.55], bounds: [0.045,0.955,0.045,0.955,0.038,0.962] },
		{ params: [1, 0.74, 0.6], bounds: [0.043,0.957,0.043,0.957,0.038,0.962] },
		{ params: [1, 0.74, 0.65], bounds: [0.042,0.958,0.042,0.958,0.037,0.963] }
	]
},
{
	name: "Geodesic Sphere Points",
	fn: GeodesicPointsSphereOptimized,
	colourMode: 6,
	currentVariant: 10,
	variants: [
		{ params: [0.8, 0.2], bounds: [0.039,0.983,0.039,0.961,0.032,0.981] },
		{ params: [0.775, 0.22], bounds: [0.041,0.981,0.041,0.959,0.035,0.978] },
		{ params: [0.75, 0.24], bounds: [0.044,0.978,0.044,0.956,0.038,0.975] },
		{ params: [0.725, 0.26], bounds: [0.047,0.976,0.047,0.953,0.04,0.973] },
		{ params: [0.7, 0.28], bounds: [0.05,0.973,0.049,0.951,0.043,0.97] },
		{ params: [0.675, 0.3], bounds: [0.052,0.97,0.052,0.948,0.046,0.968] },
		{ params: [0.65, 0.32], bounds: [0.055,0.968,0.055,0.945,0.048,0.965] },
		{ params: [0.625, 0.34], bounds: [0.057,0.965,0.057,0.943,0.051,0.963] },
		{ params: [0.6, 0.36], bounds: [0.06,0.963,0.06,0.94,0.053,0.96] },
		{ params: [0.575, 0.38], bounds: [0.062,0.96,0.062,0.938,0.056,0.958] },
		{ params: [0.55, 0.4], bounds: [0.065,0.958,0.065,0.935,0.058,0.955] },
		{ params: [0.525, 0.42], bounds: [0.067,0.955,0.067,0.933,0.061,0.953] },
		{ params: [0.5, 0.44], bounds: [0.07,0.953,0.069,0.931,0.063,0.95] },
		{ params: [0.475, 0.46], bounds: [0.072,0.951,0.072,0.928,0.066,0.948] }
	]
},
{
	name: "Twisted Wave Torus",
	fn: TwistedWaveTorus,
	colourMode: 1,
	currentVariant: 8,
	variants: [
		{ params: [2.3, 3, 0], bounds: [0.021,0.979,0.347,0.653,0.065,0.935] },
		{ params: [2.3, 3, 0.005], bounds: [0.021,0.979,0.347,0.653,0.064,0.934] },
		{ params: [2.3, 3, 0.01], bounds: [0.021,0.979,0.347,0.653,0.063,0.933] },
		{ params: [2.3, 3, 0.015], bounds: [0.02,0.98,0.346,0.654,0.061,0.932] },
		{ params: [2.3, 3, 0.02], bounds: [0.019,0.981,0.345,0.655,0.06,0.932] },
		{ params: [2.3, 3, 0.025], bounds: [0.019,0.981,0.344,0.656,0.059,0.932] },
		{ params: [2.3, 3, 0.03], bounds: [0.018,0.982,0.343,0.657,0.058,0.932] },
		{ params: [2.3, 3, 0.035], bounds: [0.017,0.983,0.342,0.658,0.057,0.933] },
		{ params: [2.3, 3, 0.04], bounds: [0.016,0.984,0.341,0.659,0.056,0.933] },
		{ params: [2.3, 3, 0.045], bounds: [0.015,0.985,0.34,0.66,0.055,0.934] },
		{ params: [2.3, 3, 0.05], bounds: [0.014,0.986,0.339,0.661,0.054,0.935] },
		{ params: [2.3, 3, 0.055], bounds: [0.013,0.987,0.338,0.662,0.053,0.935] },
		{ params: [2.3, 3, 0.06], bounds: [0.012,0.988,0.337,0.663,0.052,0.936] },
		{ params: [2.3, 3, 0.065], bounds: [0.011,0.989,0.336,0.664,0.051,0.937] },
		{ params: [2.3, 3, 0.07], bounds: [0.01,0.99,0.335,0.665,0.049,0.938] },
		{ params: [2.3, 3, 0.075], bounds: [0.009,0.991,0.334,0.666,0.048,0.939] },
		{ params: [2.3, 3, 0.08], bounds: [0.008,0.992,0.333,0.667,0.047,0.94] }
	]
},
{
	name: "Moebius Strip",
	fn: MoebiusStrip,
	colourMode: 8,
	currentVariant: 3,
	variants: [
		{ params: [4.2, 1, 0.5, 1], bounds: [0.083,0.977,0.036,0.964,0.379,0.621] },
		{ params: [4.2, 2, 0.5, 1], bounds: [0.023,0.977,0.081,0.919,0.379,0.621] },
		{ params: [4.2, 3, 0.5, 1], bounds: [0.074,0.977,0.033,0.967,0.379,0.621] },
		{ params: [4.2, 4, 0.5, 1], bounds: [0.023,0.977,0.023,0.977,0.379,0.621] },
		{ params: [4.2, 5, 0.5, 1], bounds: [0.059,0.977,0.029,0.971,0.379,0.621] }
	]
},
{
	name: "Algebraic Surface",
	fn: AlgebraicSurface,
	colourMode: 0,
	currentVariant: 7,
	variants: [
		{ params: [3.9, 3, 2, 10, 14], bounds: [0.031,0.969,0.031,0.969,0.031,0.969] },
		{ params: [3.9, 3, 3, 10, 16], bounds: [0.035,0.965,0.035,0.965,0.035,0.965] },
		{ params: [3.9, 3, 4, 10, 18], bounds: [0.04,0.96,0.04,0.96,0.04,0.96] },
		{ params: [3.9, 3, 5, 10, 20], bounds: [0.044,0.956,0.044,0.956,0.044,0.956] },
		{ params: [3.9, 3, 6, 10, 22], bounds: [0.05,0.95,0.05,0.95,0.05,0.95] },
		{ params: [3.9, 3, 7, 10, 24], bounds: [0.055,0.945,0.055,0.945,0.055,0.945] },
		{ params: [3.9, 3, 8, 10, 26], bounds: [0.062,0.938,0.062,0.938,0.062,0.938] },
		{ params: [3.9, 3, 9, 10, 28], bounds: [0.07,0.93,0.07,0.93,0.07,0.93] },
		{ params: [3.9, 3, 10, 10, 30], bounds: [0.076,0.924,0.076,0.924,0.076,0.924] },
		{ params: [3.9, 3, 11, 10, 32], bounds: [0.077,0.923,0.077,0.923,0.077,0.923] },
		{ params: [3.9, 3, 12, 10, 34], bounds: [0.075,0.925,0.075,0.925,0.075,0.925] },
		{ params: [3.9, 3, 13, 10, 36], bounds: [0.071,0.929,0.071,0.929,0.071,0.929] },
		{ params: [3.9, 3, 14, 10, 38], bounds: [0.066,0.934,0.066,0.934,0.066,0.934] },
		{ params: [3.9, 3, 15, 10, 40], bounds: [0.06,0.94,0.06,0.94,0.06,0.94] }
	]
},
{
	name: "Cosine Egg Box",
	fn: SurfacePattern,
	colourMode: 6,
	currentVariant: 9,
	variants: [
		{ params: [5, 16], bounds: [0,1,0.649,0.782,0,1] },
		{ params: [6, 16], bounds: [0,1,0.649,0.782,0,1] },
		{ params: [7, 16], bounds: [0,1,0.648,0.782,0,1] },
		{ params: [8, 16], bounds: [0,1,0.648,0.782,0,1] },
		{ params: [9, 16], bounds: [0,1,0.643,0.782,0,1] },
		{ params: [10, 16], bounds: [0,1,0.641,0.782,0,1] },
		{ params: [11, 16], bounds: [0,1,0.641,0.782,0,1] },
		{ params: [12, 16], bounds: [0,1,0.641,0.782,0,1] },
		{ params: [13, 16], bounds: [0,1,0.641,0.782,0,1] },
		{ params: [14, 16], bounds: [0,1,0.641,0.782,0,1] }
	]
},
{
	name: "Blob Ring",
	fn: BlobRing,
	colourMode: 14,
	currentVariant: 7,
	variants: [
		{ params: [1.4, 0.725], bounds: [0.154,0.846,0.393,0.607,0.154,0.846] },
		{ params: [1.4, 0.75], bounds: [0.149,0.851,0.397,0.603,0.149,0.851] },
		{ params: [1.4, 0.775], bounds: [0.143,0.857,0.399,0.601,0.143,0.857] },
		{ params: [1.4, 0.8], bounds: [0.135,0.865,0.399,0.601,0.135,0.865] },
		{ params: [1.4, 0.825], bounds: [0.127,0.873,0.4,0.6,0.127,0.873] },
		{ params: [1.4, 0.85], bounds: [0.119,0.881,0.4,0.6,0.119,0.881] },
		{ params: [1.4, 0.875], bounds: [0.111,0.889,0.4,0.6,0.111,0.889] },
		{ params: [1.4, 0.9], bounds: [0.103,0.897,0.4,0.6,0.103,0.897] },
		{ params: [1.4, 0.925], bounds: [0.094,0.906,0.4,0.6,0.094,0.906] },
		{ params: [1.4, 0.95], bounds: [0.086,0.914,0.4,0.6,0.086,0.914] },
		{ params: [1.4, 0.975], bounds: [0.078,0.922,0.4,0.6,0.078,0.922] },
		{ params: [1.4, 1], bounds: [0.07,0.93,0.4,0.6,0.07,0.93] },
		{ params: [1.4, 1.025], bounds: [0.061,0.939,0.4,0.6,0.061,0.939] },
		{ params: [1.4, 1.05], bounds: [0.053,0.947,0.4,0.6,0.053,0.947] }
	]
},
{
	name: "Piriform Diabolo",
	fn: PiriformDiabolo,
	colourMode: 13,
	currentVariant: 11,
	variants: [
		{ params: [3.5, 1.6, 0], bounds: [0.152,0.848,0.237,0.763,0.237,0.763] },
		{ params: [3.5, 1.5, 0], bounds: [0.141,0.859,0.237,0.763,0.237,0.763] },
		{ params: [3.5, 1.4, 0], bounds: [0.128,0.872,0.237,0.763,0.237,0.763] },
		{ params: [3.5, 1.3, 0], bounds: [0.114,0.886,0.237,0.763,0.237,0.763] },
		{ params: [3.5, 1.2, 0.02], bounds: [0.099,0.9,0.233,0.767,0.233,0.767] },
		{ params: [3.5, 1.1, 0.04], bounds: [0.085,0.915,0.229,0.771,0.229,0.771] },
		{ params: [3.5, 1, 0.06], bounds: [0.071,0.929,0.225,0.775,0.225,0.775] },
		{ params: [3.5, 0.9, 0.08], bounds: [0.057,0.943,0.223,0.777,0.223,0.777] },
		{ params: [3.5, 0.8, 0.1], bounds: [0.042,0.958,0.214,0.786,0.214,0.786] },
		{ params: [3.5, 0.7, 0.12], bounds: [0.028,0.972,0.205,0.795,0.205,0.795] },
		{ params: [3.5, 0.6, 0.14], bounds: [0.014,0.986,0.196,0.804,0.196,0.804] },
		{ params: [3.5, 0.5, 0.16], bounds: [0,1,0.188,0.812,0.188,0.812] }
	]
},
{
	name: "Super Sphere Cluster",
	fn: SuperSphereCluster,
	colourMode: 4,
	currentVariant: 4,
	variants: [
		{ params: [0.6, 1, 0], bounds: [0.067,0.933,0.067,0.933,0.067,0.933] },
		{ params: [0.64, 1.2, 0.1], bounds: [0.052,0.948,0.052,0.948,0.052,0.948] },
		{ params: [0.68, 1.4, 0.2], bounds: [0.043,0.957,0.043,0.957,0.043,0.957] },
		{ params: [0.72, 1.6, 0.3], bounds: [0.038,0.962,0.038,0.962,0.038,0.962] },
		{ params: [0.76, 1.8, 0.4], bounds: [0.035,0.965,0.035,0.965,0.035,0.965] },
		{ params: [0.8, 2, 0.5], bounds: [0.033,0.967,0.033,0.967,0.033,0.967] },
		{ params: [0.84, 2.2, 0.6], bounds: [0.033,0.967,0.033,0.967,0.033,0.967] },
		{ params: [0.88, 2.4, 0.7], bounds: [0.033,0.967,0.033,0.967,0.033,0.967] },
		{ params: [0.92, 2.6, 0.8], bounds: [0.034,0.966,0.034,0.966,0.034,0.966] },
		{ params: [0.96, 2.8, 0.9], bounds: [0.035,0.965,0.035,0.965,0.035,0.965] },
		{ params: [1, 3, 1], bounds: [0.036,0.964,0.036,0.964,0.036,0.964] }
	]
},
{
	name: "Tetrahedral",
	fn: Tetrahedral,
	colourMode: 5,
	currentVariant: 7,
	variants: [
		{ params: [3.1, 10], bounds: [0.003,0.997,0.003,0.997,0.003,0.997] },
		{ params: [3.1, 12], bounds: [0.008,0.992,0.008,0.992,0.008,0.992] },
		{ params: [3.1, 14], bounds: [0.013,0.987,0.013,0.987,0.013,0.987] },
		{ params: [3.1, 16], bounds: [0.018,0.982,0.018,0.982,0.018,0.982] },
		{ params: [3.1, 18], bounds: [0.023,0.977,0.023,0.977,0.023,0.977] },
		{ params: [3.1, 20], bounds: [0.028,0.972,0.028,0.972,0.028,0.972] },
		{ params: [3.1, 22], bounds: [0.034,0.966,0.034,0.966,0.034,0.966] },
		{ params: [3.1, 24], bounds: [0.04,0.96,0.04,0.96,0.04,0.96] },
		{ params: [3.1, 26], bounds: [0.046,0.954,0.046,0.954,0.046,0.954] },
		{ params: [3.1, 28], bounds: [0.052,0.948,0.052,0.948,0.052,0.948] },
		{ params: [3.1, 30], bounds: [0.059,0.941,0.059,0.941,0.059,0.941] },
		{ params: [3.1, 32], bounds: [0.066,0.934,0.066,0.934,0.066,0.934] },
		{ params: [3.1, 34], bounds: [0.073,0.927,0.073,0.927,0.073,0.927] },
		{ params: [3.1, 36], bounds: [0.081,0.919,0.081,0.919,0.081,0.919] },
		{ params: [3.1, 38], bounds: [0.089,0.911,0.089,0.911,0.089,0.911] },
		{ params: [3.1, 40], bounds: [0.099,0.901,0.099,0.901,0.099,0.901] }
	]
},
{
	name: "Drei Tori",
	fn: ThreeTori,
	colourMode: 10,
	currentVariant: 7,
	variants: [
		{ params: [3.65, 3, 0.46, 0.4], bounds: [0.016,0.984,0.016,0.984,0.016,0.984] },
		{ params: [3.65, 3, 0.42, 0.6], bounds: [0.017,0.983,0.017,0.983,0.017,0.983] },
		{ params: [3.65, 3, 0.38, 0.8], bounds: [0.018,0.982,0.018,0.982,0.018,0.982] },
		{ params: [3.65, 3, 0.34, 1], bounds: [0.019,0.981,0.019,0.981,0.019,0.981] },
		{ params: [3.65, 3, 0.3, 1.2], bounds: [0.02,0.98,0.02,0.98,0.02,0.98] },
		{ params: [3.65, 3, 0.26, 1.4], bounds: [0.021,0.979,0.021,0.979,0.021,0.979] },
		{ params: [3.65, 3, 0.22, 1.6], bounds: [0.022,0.978,0.022,0.978,0.022,0.978] },
		{ params: [3.65, 3, 0.18, 1.8], bounds: [0.023,0.977,0.023,0.977,0.023,0.977] },
		{ params: [3.65, 3, 0.15, 2], bounds: [0.022,0.978,0.022,0.978,0.022,0.978] }
	]
},
{
	name: "Radial Wave Sphere",
	fn: RadialWaveSphere,
	colourMode: 7,
	currentVariant: 4,
	variants: [
		{ params: [0.3], bounds: [0.038,0.962,0.032,0.933,0.101,0.899] },
		{ params: [0.35], bounds: [0.038,0.962,0.032,0.933,0.109,0.891] },
		{ params: [0.4], bounds: [0.038,0.962,0.032,0.933,0.119,0.881] },
		{ params: [0.45], bounds: [0.038,0.962,0.032,0.933,0.131,0.869] },
		{ params: [0.5], bounds: [0.039,0.961,0.032,0.932,0.144,0.856] },
		{ params: [0.55], bounds: [0.039,0.961,0.032,0.932,0.16,0.84] },
		{ params: [0.6], bounds: [0.039,0.961,0.033,0.931,0.178,0.822] },
		{ params: [0.65], bounds: [0.04,0.96,0.033,0.93,0.199,0.801] },
		{ params: [0.7], bounds: [0.041,0.959,0.034,0.928,0.223,0.777] }
	]
},
{
	name: "Flattened Wave Pattern",
	fn: FlattenedWavePattern,
	colourMode: 9,
	currentVariant: 6,
	variants: [
		{ params: [6, 2], bounds: [0,1,0.458,0.542,0,1] },
		{ params: [7, 2], bounds: [0,1,0.464,0.536,0,1] },
		{ params: [8, 2], bounds: [0,1,0.468,0.531,0,1] },
		{ params: [9, 2], bounds: [0,1,0.472,0.528,0,1] },
		{ params: [10, 2], bounds: [0,1,0.475,0.525,0,1] },
		{ params: [11, 2], bounds: [0,1,0.477,0.523,0,1] },
		{ params: [12, 2], bounds: [0,1,0.479,0.521,0,1] }
	]
},
{
	name: "Sphered Schwarz P",
	fn: SpheredSchwarzP,
	colourMode: 11,
	currentVariant: 4,
	variants: [
		{ params: [1.9, 0.8, 0.06], bounds: [0.093,0.907,0.093,0.907,0.093,0.907] },
		{ params: [1.9, 0.76, 0.1], bounds: [0.098,0.902,0.098,0.902,0.098,0.902] },
		{ params: [1.9, 0.72, 0.14], bounds: [0.101,0.899,0.101,0.899,0.101,0.899] },
		{ params: [1.9, 0.68, 0.18], bounds: [0.104,0.896,0.104,0.896,0.104,0.896] },
		{ params: [1.9, 0.64, 0.22], bounds: [0.106,0.894,0.106,0.894,0.106,0.894] },
		{ params: [1.9, 0.6, 0.26], bounds: [0.108,0.892,0.108,0.892,0.108,0.892] },
		{ params: [1.9, 0.56, 0.3], bounds: [0.109,0.891,0.109,0.891,0.109,0.891] },
		{ params: [1.9, 0.52, 0.34], bounds: [0.111,0.889,0.111,0.889,0.111,0.889] },
		{ params: [1.9, 0.48, 0.38], bounds: [0.112,0.888,0.112,0.888,0.112,0.888] },
		{ params: [1.9, 0.44, 0.42], bounds: [0.113,0.887,0.113,0.887,0.113,0.887] },
		{ params: [1.9, 0.4, 0.46], bounds: [0.115,0.885,0.115,0.885,0.115,0.885] },
		{ params: [1.9, 0.36, 0.5], bounds: [0.116,0.884,0.116,0.884,0.116,0.884] }
	]
}
];
