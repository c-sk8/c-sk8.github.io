// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';

let bounds = null; // This should match the size of the marching cubes grid

export function setCubeSpaceBounds(new_bounds) {
	bounds = new_bounds;
}

export function getColourModeName(index) {
	return colourModeFunctions[index].name;
}

export function getColourModeIndexString(index) {
	return '(' + (index + 1) + '/' + colourModeFunctions.length + ')';
}

export function getColourFunction(index) {
	return colourModeFunctions[index].fn;
}

export function getColourModeCount() {
	return colourModeFunctions.length;
}

const tempColor = new THREE.Color();

export function PaletteColours(x, y, z, palette, l_stripe = 0.95) {
    let t = Math.max(0, Math.min(1, (y - bounds.y.min) / (bounds.y.max - bounds.y.min)));
	const border_step = 1 / palette.length;
	const index = Math.floor(t / border_step);
    const c = palette[index];
    let l = c[2];
    if(l < 0.25 && !(z % 2)) l *= 1.1;
    if(l >= 0.25 && z % 2) l *= 0.95;
	tempColor.setHSL(c[0] / 360, c[1], l);
	tempColor.convertSRGBToLinear();
    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};

}

export function SmoothPaletteGradient(x, y, z, palette, l_stripe = 0.95) {

    // 1. Normalize Z to a 0.0 - 1.0 range
    // We clamp it to ensure it stays within bounds of the array
    let t = Math.max(0, Math.min(1, (y - bounds.y.min) / (bounds.y.max - bounds.y.min)));

    // 2. Map 't' to the palette indices
    const scaledT = t * (palette.length - 1);
    const index = Math.floor(scaledT);
    const nextIndex = Math.min(index + 1, palette.length - 1);
    
    // 3. Calculate how far we are between the two colors (0.0 to 1.0)
    const factor = scaledT - index;

    // 4. Get RGB values for the two surrounding colors
    const c1 = palette[index];
    const c2 = palette[nextIndex];
    
    const h = c1[0] + (c2[0] - c1[0]) * factor
    const s = c1[1] + (c2[1] - c1[1]) * factor
    let l = c1[2] + (c2[2] - c1[2]) * factor

	if(y % 2) l *= l_stripe;
		
	tempColor.setHSL(h / 360, s, l);
	tempColor.convertSRGBToLinear();
	//const rgb_col = hslToRgb(h,s,l);

    return { r: tempColor.r, g: tempColor.g, b: tempColor.b};
}

const aqua = [[160, 1.00, 0.5],[180, 1.00, 0.5],[200, 1.00, 0.5]];
const warm_fire = [[40,0.90,0.5],[20,1.0,0.45],[0,1.0,0.4]];
const spring_greens = [[50, 1.00, 0.4],[60, 1.00, 0.30],[70, 1.00, 0.2]];
const pinks_and_purples = [[282,1,0.3],[307,1,0.5]];
const pale_blues = [[190,0.7,0.8],[210,0.6,0.5],[210,0.6,0.5],[190,0.7,0.8]];
const orange = [[5,1,0.5],[23,1,0.5],[23,1,0.5],[5,1,0.5]];
const yellow_roses = [[80,0.91,0.18],[80,1,0.22],[44,1,0.5],[47,1,0.53]];
const bluebells = [[216,0.79,0.65],[269,0.79,0.65]];
const vibrant_sky = [[205,0.91,0.63],[360,0.91,0.63]];
const full_spectrum = [[0,1,0.5],[360,1,0.5]];
const wood = [[20,1,0.4],[30,1,0.6],[20,1,0.4]];

const hot_and_cold = [	[20,1,0.50],[26,1,0.50],[31,1,0.50],[34,1,0.50],[37,1,0.50],
						[190,1,0.42],[195,1,0.39],[201,1,0.36],[214,0.97,0.27],
						[239,0.94,0.19]];

const rosy_blush = [	[0,0.79,0.72],[3,0.80,0.74],[5,0.82,0.76],[7,0.83,0.77],
						[7,0.84,0.78],[11,0.87,0.79],[15,0.90,0.81],[19,0.91,0.83],
						[23,0.95,0.85],[28,1,0.86] ];
						
const creamy_colours = [	[200,1,0.09],[175,0.63,0.24],[181,0.36,0.47],
							[106,0.24,0.69],[45,1,0.80],[25,0.92,0.71],
							[24,0.85,0.52],[6,0.68,0.40],[20,0.85,0.24]];

const coastal_blues = [	[206,0.97,0.15],[205,0.98,0.20],[205,0.98,0.25],[205,0.99,0.26],
						[202,0.56,0.38],[198,0.57,0.40],[198,0.43,0.48],[198,0.44,0.57],
						[197,0.51,0.69],[195,0.54,0.78]];



export const colourModeFunctions = [
  	{
    	name: "Aqua",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, aqua)
    },
   	{
    	name: "Warm Fire",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, warm_fire)
    },
   	{
    	name: "Spring Greens",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, spring_greens)
    },
  	{
    	name: "Pinks And Purples",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, pinks_and_purples)
    },
   	{
    	name: "Orange",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, orange)
    },
    {
    	name: "Pale Blues",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, pale_blues)
    },
    {
    	name: "Bluebells",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, bluebells)
    },
    {
    	name: "Yellow Roses",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, yellow_roses)
    },
  	{
    	name: "Vibrant Sky",
		fn: (x, y, z) => SmoothPaletteGradient(x, y, z, vibrant_sky, 0.96)
    },
    {
    	name: "Full Spectrum",
    	fn: (x, y, z) => SmoothPaletteGradient(x, y, z, full_spectrum)
    },
    {
    	name: "Hot And Cold",
    	fn: (x, y, z) => PaletteColours(x, y, z, hot_and_cold)
    },
    {
    	name: "Rosy Blush",
    	fn: (x, y, z) => PaletteColours(x, y, z, rosy_blush)
    },
    {
    	name: "Creamy Colours",
    	fn: (x, y, z) => PaletteColours(x, y, z, creamy_colours)
    },
    {
    	name: "Coastal Blues",
    	fn: (x, y, z) => PaletteColours(x, y, z, coastal_blues)
    },
    {
    	name: "Polished Wood",
    	fn: (x, y, z) => SmoothPaletteGradient(x, y, z, wood, 0.9)
    }
];







