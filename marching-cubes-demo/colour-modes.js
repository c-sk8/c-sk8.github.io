// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';

export let currentColourMode = 0;
let z_cubes = 100; // This should match the size of the marching cubes grid

export function setColourGridSize(marching_grid_size) {
	z_cubes = marching_grid_size;
}

export function incrementColourMode() {
	currentColourMode = (currentColourMode + 1) % colourModeFunctions.length;
}

export function decrementColourMode() {
	currentColourMode--;
    if (currentColourMode < 0)
    	currentColourMode = colourModeFunctions.length - 1;
}

export function getColourModeName() {
	return colourModeFunctions[currentColourMode].name;
}

export function getColourModeIndexString() {
	return '(' + (currentColourMode+1) + '/' + colourModeFunctions.length + ')';
}

export function colourModeFunction(x, y, z) {
	return colourModeFunctions[currentColourMode].fn(x,y,z);
}

// =====================================================================================

/*
export function CheckerPattern(x, y, z, r, g, b) {
    const xOdd = x & 1;
    const yOdd = y & 1;
    const zOdd = z & 1;
    
    const delta_r = r * 0.05;
    const delta_g = g * 0.05;
    const delta_b = b * 0.05;

    if (zOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    }

    if (yOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    } else {
        r -= delta_r;
        g -= delta_g;
        b -= delta_b;
    }

    if (xOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    } else {
        r -= delta_r;
        g -= delta_g;
        b -= delta_b;
    }

    return { r: r, g: g, b: b };
}
*/
/**
 * Converts HSL to RGB.
 * @param {number} h - Hue in degrees [0, 360]
 * @param {number} s - Saturation [0, 1]
 * @param {number} l - Lightness [0, 1]
 * @returns {object} {r, g, b} in range [0, 1]
 */
/*
function hslToRgb(h, s, l) {
    // 1. Normalize Hue to 0-360 and handle negative wraps
    h = h % 360;
    if (h < 0) h += 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60; // Sector 0 to 6
    const x = c * (1 - Math.abs((hp % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    // Use floor to get a discrete integer sector (0-5)
    const sector = Math.floor(hp);

    if (sector === 0)      { r = c; g = x; b = 0; }
    else if (sector === 1) { r = x; g = c; b = 0; }
    else if (sector === 2) { r = 0; g = c; b = x; }
    else if (sector === 3) { r = 0; g = x; b = c; }
    else if (sector === 4) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
        r: r + m,
        g: g + m,
        b: b + m
    };
}

export function HueContours(x, y, z, h, s, l) {

	let lightness = l;
	const delta = 0.04;

	const period = 10;

	let m = y % period;
	if (m < 0) m += period; // handle negative values

	let d = Math.min(m, period - m); // distance from nearest contour

	if (d <= 4) {
		lightness += delta * (5 - d);
	}

	const rgb_col = hslToRgb(h - (z/(z_cubes * 5)), s, lightness);

	return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function Contours(x, y, z, h, s, l) {

	let lightness = l;
	const delta = 0.04;

	const period = 10;

	let m = y % period;
	if (m < 0) m += period; // handle negative values

	let d = Math.min(m, period - m); // distance from nearest contour

	if (d <= 4) {
		lightness += delta * (5 - d);
	}

	const rgb_col = hslToRgb(h, s, lightness);

	return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function AquaStripes(x, y, z) {
	let lightness = 0.43;
	if(z % 2) lightness = 0.39;

	const rgb_col = hslToRgb(0.6 - (z/(z_cubes * 5)), 0.95, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function GreenHueStripes(x, y, z) {
	let lightness = 0.43;
	if(z % 2) lightness = 0.39;

	const rgb_col = hslToRgb(0.1 + (z/(z_cubes * 5)), 0.7, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function WarmStripes(x, y, z) {
	let lightness = 0.3;
	if(z % 2) lightness = 0.28;

	const rgb_col = hslToRgb(-0.02 + (z/(z_cubes * 10)), 0.95, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function MoveStripes(x, y, z) {
	let lightness = 0.4;
	if(z % 2) lightness = 0.37;

	const rgb_col = hslToRgb(0.6 + (z/(z_cubes * 4)), 0.6, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}
*/

const aqua = [[160, 1.00, 0.5],[180, 1.00, 0.5],[200, 1.00, 0.5]];
const warm_fire = [[40,0.90,0.5],[20,1.0,0.45],[0,1.0,0.4]];
const spring_greens = [[50, 1.00, 0.4],[60, 1.00, 0.30],[70, 1.00, 0.2]];
const pinks_and_purples = [[282,1,0.3],[307,1,0.5]];
const pale_blues = [[190,0.7,0.8],[210,0.6,0.5],[210,0.6,0.5],[190,0.7,0.8]];
const orange = [[5,1,0.5],[23,1,0.5],[23,1,0.5],[5,1,0.5]];

const tempColor = new THREE.Color();

export function SmoothPaletteGradient(x, y, z, palette, l_stripe = 0.95) {

    // 1. Normalize Z to a 0.0 - 1.0 range
    // We clamp it to ensure it stays within bounds of the array
    let t = Math.max(0, Math.min(1, y / z_cubes));

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
    }
]
/*
    {
    	name: "Aqua Stripes",
		fn: AquaStripes
    },
    {
    	name: "Spring Green Stripes",
		fn: GreenHueStripes
    },
    {
    	name: "Warm Stripes",
		fn: WarmStripes
    },
    {
    	name: "Move Stripes",
		fn: MoveStripes
    },
    {
    	name: "Orange Checker",
		fn: (x, y, z) => CheckerPattern(x, y, z, 0.85, 0.15, 0.0)
    },
    {
    	name: "Blue Checker",
    	fn: (x, y, z) => CheckerPattern(x, y, z, 0.1, 0.3, 0.9)
    },
    {
    	name: "Green Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.14, 0.8, 0.2)
    },
    {
    	name: "Blue Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.55, 1, 0.2)
    },
    {
    	name: "Orange Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.02, 1, 0.2)
    },
    {
    	name: "Cyan To Purple Contours",
		fn: (x, y, z) => HueContours(x, y, z, 0.7, 0.7, 0.2)
    },
    {
    	name: "Green To Yellow Contours",
		fn: (x, y, z) => HueContours(x, y, z, 0.3, 0.7, 0.2)
    }
*/
