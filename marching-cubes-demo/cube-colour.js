// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import {	Sampling } from './sampling.js';

export function getColourModeName(index) {
	return cubeCols[index].name;
}

export function getColourModeIndexString(index) {
	return '(' + (index + 1) + '/' + cubeCols.length + ')';
}

export function getColourFunction(index) {
	return cubeCols[index].fn;
}

export function getColourModeCount() {
	return cubeCols.length;
}

const tempColor = new THREE.Color();

export function FullSpectrum(y, vy, sampling) {

	const hue = (vy - sampling.bounds.min_y) / (sampling.bounds.max_y - sampling.bounds.min_y);

	let l = 0.5;
	if(y % 2) l *= 0.95;

	tempColor.setHSL(hue, 0.6, l);
	tempColor.convertSRGBToLinear();

    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};
}

export function SmoothGradient(y, vy, sampling, palette) {

	const t = (vy - sampling.bounds.min_y) / (sampling.bounds.max_y - sampling.bounds.min_y);

    const scaledT = t * (palette.length - 1);
    const index = Math.floor(scaledT);
    const nextIndex = Math.min(index + 1, palette.length - 1);
    
    const factor = scaledT - index;

    const c1 = palette[index];
    const c2 = palette[nextIndex];
    
    const h = c1[0] + (c2[0] - c1[0]) * factor
    const s = c1[1] + (c2[1] - c1[1]) * factor
    let l = c1[2] + (c2[2] - c1[2]) * factor

	if(y % 2) l *= 0.95;

	tempColor.setHSL(h / 360, s, l);
	tempColor.convertSRGBToLinear();

    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};
}

export function ColourBands(x, y, z, sampling, palette) {
 
 	const t = y / sampling.dimensions.height;

	const border_step = 1 / palette.length;
	const index = Math.floor(t / border_step);
    const c = palette[index];
    
    let l = c[2];
    if (x % 2) l *= 0.97;
    
	tempColor.setHSL(c[0] / 360, c[1], l);
	tempColor.convertSRGBToLinear();
    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function fade(t) {
    return t * t * (3.0 - 2.0 * t);
}

function hash(x, y, z) {
    let h = x * 374761393 + y * 668265263 + z * 2147483647;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function noise3D(x, y, z) {

    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);

    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const n000 = hash(xi,     yi,     zi);
    const n100 = hash(xi + 1, yi,     zi);
    const n010 = hash(xi,     yi + 1, zi);
    const n110 = hash(xi + 1, yi + 1, zi);

    const n001 = hash(xi,     yi,     zi + 1);
    const n101 = hash(xi + 1, yi,     zi + 1);
    const n011 = hash(xi,     yi + 1, zi + 1);
    const n111 = hash(xi + 1, yi + 1, zi + 1);

    const x00 = lerp(n000, n100, u);
    const x10 = lerp(n010, n110, u);
    const x01 = lerp(n001, n101, u);
    const x11 = lerp(n011, n111, u);

    const y0 = lerp(x00, x10, v);
    const y1 = lerp(x01, x11, v);

    return lerp(y0, y1, w);
}

export function ValueNoise(vx, vy, vz, x, y, z, sampling) {

    const scale = 5;

	const nx = (vx - sampling.bounds.min_x) / (sampling.bounds.max_x - sampling.bounds.min_x);
	const ny = (vy - sampling.bounds.min_y) / (sampling.bounds.max_y - sampling.bounds.min_y);
	const nz = (vz - sampling.bounds.min_z) / (sampling.bounds.max_z - sampling.bounds.min_z);

    let n = noise3D(nx * scale, ny * scale, nz * scale);

	let l = 0.5;
	if(!(y % 3)) l *= 0.95;
	if(!(x % 3)) l *= 0.95;
	if(!(z % 3)) l *= 0.95;

	tempColor.setHSL( n * 3, 0.6, l);
	tempColor.convertSRGBToLinear();

    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};

}

export function CyclicNoise(vx, vy, vz, sampling, colours, scale, frequency) {

     const nx = (vx - sampling.bounds.min_x) /
               (sampling.bounds.max_x - sampling.bounds.min_x);

    const ny = (vy - sampling.bounds.min_y) /
               (sampling.bounds.max_y - sampling.bounds.min_y);

    const nz = (vz - sampling.bounds.min_z) /
               (sampling.bounds.max_z - sampling.bounds.min_z);

    let n = noise3D(nx * scale, ny * scale, nz * scale);

    let t = 0.5 + 0.5 * Math.sin(n * frequency);

	const scaled = t * (colours.length - 1);
	
	const i = Math.floor(scaled);
	const f = scaled - i;
	
	const c1 = colours[i];
	const c2 = colours[i + 1];
	
	return {
		r: c1.r + (c2.r - c1.r) * f,
		g: c1.g + (c2.g - c1.g) * f,
		b: c1.b + (c2.b - c1.b) * f
	};
}

const aqua =			[[160, 1, 0.5], [200, 1, 0.5]];
const yellow_red =		[[37, 1, 0.55], [0, 1, 0.4]];
const spring_greens =	[[55, 0.9, 0.4], [70, 0.9, 0.2]];
const blues = 			[[200, 0.6, 0.5], [230,0.6,0.5]];
const orange = 			[[5, 1, 0.5], [23, 1, 0.5], [23,1,0.5], [5,1,0.5]];
const pink_purple = 	[[265, 1, 0.5], [307, 0.7, 0.6]];
const yellow_green = 	[[80, 0.91, 0.18], [80, 1, 0.22], [44, 1, 0.5], [47, 1, 0.53]];
const vibrant_sky =		[[205, 0.91, 0.63], [360, 0.91, 0.63]];
const wood =			[[20, 1, 0.4], [30, 1, 0.6], [20, 1, 0.4]];

const orange_blue_bands =	[	[20,1,0.50],[26,1,0.50],[31,1,0.50],[34,1,0.50],
								[37,1,0.50],[190,1,0.42],[195,1,0.39],[201,1,0.36],
								[214,0.97,0.27],[239,0.94,0.19] ];
const orange_green_bands =	[	[105, 0.45, 0.36], [101, 0.37, 0.48],
								[98, 0.49, 0.61], [84, 0.61, 0.68], [64, 0.68, 0.72],
								[47, 1, 0.76], [38, 1, 0.67], [33, 1, 0.59] ];
const meadow_green_bands = 	[	[73,0.72,0.75],[92,0.62,0.72],[110,0.50,0.70],[141,0.43,0.62],
								[163,0.41,0.52],[182,0.52,0.42],[194,0.77,0.38],[199,0.72,0.36],
								[206,0.66,0.34],[206,0.66,0.28]];
const creamy_bands =		[	[200,1,0.09],[175,0.63,0.24],[181,0.36,0.47],
								[106,0.24,0.69],[45,1,0.80],[25,0.92,0.71],
								[24,0.85,0.52],[6,0.68,0.40],[20,0.85,0.24]];
								
const volcanic_fire = [
    [339,0.80,0.12], // Night Bordeaux
    [354,0.93,0.22], // Black Cherry
    [358,0.97,0.31], // Oxblood
    [0,1.00,0.41],   // Brick Ember
    [12,0.98,0.44],  // Red Ochre
    [23,0.97,0.46],  // Cayenne Red
    [34,0.95,0.49],  // Deep Saffron
    [39,0.96,0.50],  // Orange
    [43,1.00,0.52]   // Amber Flame
];

const vibrant_summer = [
    [358,1.00,0.67], // Vibrant Coral
    [13,1.00,0.65],
    [29,1.00,0.63],
    [44,1.00,0.61], // Golden Pollen
    [57,0.89,0.56],
    [70,0.79,0.52],
    [123,0.71,0.46],
    [185,0.74,0.44],
    [203,0.77,0.43], // Steel Blue
    [224,0.62,0.43],
    [244,0.47,0.44],
    [260,0.32,0.44] // Dusty Grape
];

const blue_white_noise = [		{ r: 0.0, g: 0.0, b: 0.2 },
								{ r: 0.1, g: 0.1, b: 0.4 },
								{ r: 0.8, g: 0.8, b: 0.8 } ];
const mag_cyan_noise = [		{ r: 0.6, g: 0.0, b: 0.6 },
								{ r: 0.0, g: 0.0, b: 1.0 },
								{ r: 0.0, g: 0.8, b: 0.8 } ];
const yellow_green_noise = [	{ r: 0.0, g: 0.4, b: 0.0 },
								{ r: 0.0, g: 0.1, b: 0.0 },
        						{ r: 0.9, g: 0.55, b: 0.0 } ];

export const cubeCols = [
  	{	name: "Aqua",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, aqua)
    },
  	{	name: "Yellow Red",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, yellow_red)
    },
  	{	name: "Spring Greens",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, spring_greens)
    },
  	{	name: "Blues",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, blues)
    },
  	{	name: "Orange",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, orange)
    },
  	{	name: "Pink Purple",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, pink_purple)
    },
  	{	name: "Yellow Green",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, yellow_green)
    },
  	{	name: "Vibrant Sky",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, vibrant_sky)
    },
  	{	name: "Wood",
		fn: (x, y, z, vc, sampling) => SmoothGradient(y, vc[1], sampling, wood)
    },
  	{	name: "Orange Blue Bands",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, orange_blue_bands)
    },
  	{	name: "Orange Green Bands",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, orange_green_bands)
    },
  	{	name: "Meadow Green Bands",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, meadow_green_bands)
    },
  	{	name: "Creamy Bands",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, creamy_bands)
    },
  	{	name: "Volcanic Fire",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, volcanic_fire)
    },
  	{	name: "Vibrant Summer",
		fn: (x, y, z, vc, sampling) => ColourBands(x, y, z, sampling, vibrant_summer)
    },
  	{	name: "Colour Wheel Noise",
		fn: (x, y, z, vc, sampling) => ValueNoise(vc[0], vc[1], vc[2], x, y, z, sampling)
    },
  	{	name: "Contour Noise",
		fn: (x, y, z, vc, sampling) => CyclicNoise(vc[0], vc[1], vc[2], sampling, blue_white_noise, 6, 100)
    },
  	{	name: "Cyclic Noise",
		fn: (x, y, z, vc, sampling) => CyclicNoise(vc[0], vc[1], vc[2], sampling, mag_cyan_noise, 2, 150)
    },
  	{	name: "Cyclic Noise",
		fn: (x, y, z, vc, sampling) => CyclicNoise(vc[0], vc[1], vc[2], sampling, yellow_green_noise, 5, 50)
    }
];
