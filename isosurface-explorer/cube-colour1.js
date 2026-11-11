// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	Sampling } from './sampling.js';
import {	noise3D } from './noise-3d.js';

import * as THREE from './three.module.js';
const tempColor = new THREE.Color();

const CUBECOLS = {
    mint_green:    	{ r: 0.00, g: 1.00, b: 0.50 },
    cyan:     		{ r: 0.00, g: 0.40, b: 1.00 },
    warm_yellow:   	{ r: 1.00, g: 0.30, b: 0.00 },
    deepRed:      	{ r: 0.65, g:-0.10, b:-0.10 },
    warmGreen:    	{ r: 0.60, g: 0.60, b: 0.00 },
    darkGreen:    	{ r: 0.07, g: 0.10, b: 0.00 },
    pale_blue:   	{ r: 0.00, g: 0.40, b: 1.00 },
    dark_blue:     	{ r: 0.02, g: 0.04, b: 0.45 },
    purple:   		{ r: 0.10, g: 0.00, b: 0.10 },
    pink:		 	{ r: 0.90, g: 0.00, b: 0.90 },
    yellow: 		{ r: 1.00, g: 0.43, b: 0.00 },
    orange:  		{ r: 1.00, g: 0.20, b: 0.00 },
    latteLight:   	{ r: 0.82, g: 0.41, b: 0.12 },
    latteDark:    	{ r: 0.80, g: 0.52, b: 0.25 },
    cloudWhite:     { r: 1.00, g: 0.95, b: 0.95 },
    skyBlue:      	{ r: 0.00, g: 0.30, b: 0.50 },
    warmPink:		{ r: 1.00, g: 0.00, b: 0.10 },
    greyMauve:		{ r: 0.90, g: 0.45, b: 0.95 },
    black: 		   	{ r: 0.00, g: 0.00, b: 0.00 },
    raspberryPink:	{ r: 0.80, g: 0.10, b: 0.30 },
    greyBlue:		{ r: 0.10, g: 0.30, b: 0.80 },
    paleMove:		{ r: 0.70, g: 0.43, b: 0.93 },
    greyOrange:		{ r: 0.93, g: 0.07, b: 0.07 }
};

const creamy_bands = [
  { r: 0.0000, g: 0.0134, b: 0.0272 },
  { r: 0.0084, g: 0.1268, b: 0.1103 },
  { r: 0.0736, g: 0.3591, b: 0.3662 },
  { r: 0.3805, g: 0.5452, b: 0.3371 },
  { r: 1.0000, g: 0.7874, b: 0.3185 },
  { r: 0.9480, g: 0.4005, b: 0.1652 },
  { r: 0.8440, g: 0.1614, b: 0.0120 },
  { r: 0.4091, g: 0.0279, b: 0.0149 },
  { r: 0.1658, g: 0.0250, b: 0.0028 }
];

const meadow_green_bands = [
  { r: 0.5471, g: 0.9480, b: 0.2858 },
  { r: 0.3541, g: 0.8931, b: 0.2589 },
  { r: 0.2319, g: 0.8440, b: 0.2319 },
  { r: 0.1256, g: 0.6953, b: 0.2798 },
  { r: 0.0631, g: 0.5452, b: 0.3371 },
  { r: 0.0217, g: 0.3805, b: 0.4091 },
  { r: 0.0039, g: 0.2505, b: 0.4440 },
  { r: 0.0053, g: 0.1742, b: 0.3662 },
  { r: 0.0075, g: 0.1068, b: 0.2929 },
  { r: 0.0053, g: 0.0681, b: 0.1982 }
];

const magma_inferno_bands = [
  { r: 0.0062, g: 0.0012, b: 0.0286 },
  { r: 0.0492, g: 0.0055, b: 0.1154 },
  { r: 0.2409, g: 0.0120, b: 0.2409 },
  { r: 0.4995, g: 0.0108, b: 0.1473 },
  { r: 0.8378, g: 0.0066, b: 0.0385 },
  { r: 0.9007, g: 0.0990, b: 0.0185 },
  { r: 0.9573, g: 0.4203, b: 0.0546 },
  { r: 0.9718, g: 0.8040, b: 0.2258 },
  { r: 1.0000, g: 1.0000, b: 0.5382 }
];

const autumn_foliage_bands = [
  { r: 0.0633, g: 0.0228, b: 0.0073 }, // Deep bark brown
  { r: 0.1371, g: 0.0846, b: 0.0205 }, // Muted olive-brown
  { r: 0.1005, g: 0.2049, b: 0.0363 }, // Fading green leaf
  { r: 0.2890, g: 0.3814, b: 0.0298 }, // Yellow-green transition
  { r: 0.7954, g: 0.5639, b: 0.0165 }, // Golden yellow
  { r: 0.8378, g: 0.2856, b: 0.0066 }, // Warm amber/orange
  { r: 0.6604, g: 0.0849, b: 0.0057 }, // Rust orange
  { r: 0.4770, g: 0.0291, b: 0.0072 }, // Deep terracotta
  { r: 0.2738, g: 0.0072, b: 0.0134 }  // Crimson autumn red
];

const mediterranean_surf_bands = [
  { r: 0.0035, g: 0.0196, b: 0.0529 }, // Deep offshore trench
  { r: 0.0052, g: 0.0796, b: 0.1607 }, // Deep Mediterranean blue
  { r: 0.0060, g: 0.2311, b: 0.3547 }, // Classic azure water
  { r: 0.0121, g: 0.4938, b: 0.5829 }, // Bright turquoise shallows
  { r: 0.0539, g: 0.6784, b: 0.6435 }, // Light coastal cyan
  { r: 0.1916, g: 0.6471, b: 0.5678 }, // Pale seafoam green-blue
  { r: 0.4682, g: 0.6453, b: 0.6848 }, // Frothy wave crest tint
  { r: 0.7143, g: 0.7600, b: 0.7835 }, // Soft wind-blown spray
  { r: 0.9114, g: 0.9114, b: 0.9114 }  // Crisp white surf foam
];

const spectral_thermal_bands = [
  { r: 0.0116, g: 0.0023, b: 0.0593 },
  { r: 0.0042, g: 0.0512, b: 0.3768 },
  { r: 0.0062, g: 0.5256, b: 0.7639 },
  { r: 0.0283, g: 0.7031, b: 0.2330 },
  { r: 0.2957, g: 0.7776, b: 0.0571 },
  { r: 0.9157, g: 0.6884, b: 0.0628 },
  { r: 0.9007, g: 0.2633, b: 0.0185 },
  { r: 0.7639, g: 0.0357, b: 0.0062 },
  { r: 0.3998, g: 0.0027, b: 0.0027 }
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
const greens_blues_noise = [	{ r: 0.0, g: 0.0, b: 0.2 },
								{ r: 0.0, g: 0.2, b: 0.3 },
        						{ r: 0.1, g: 0.5, b: 0.0 },
								{ r: 0.0, g: 0.2, b: 0.0 } ];

export class CubeColours {
    constructor() {
        this.cubeCols = [
            {   
                name: "Mint Green And Cyan",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.mint_green, CUBECOLS.cyan)
            },
            {   
                name: "Yellow And Red",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.warm_yellow, CUBECOLS.deepRed)
            },
            {   
                name: "Two Greens",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.warmGreen, CUBECOLS.darkGreen)
            },
            {   
                name: "Two Blues",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.pale_blue, CUBECOLS.dark_blue)
            },
            {   
                name: "Yellow And Orange",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.yellow, CUBECOLS.orange)
            },
            {   
                name: "Pink And Purple",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, CUBECOLS.pink, CUBECOLS.purple)
            },
            {   
                name: "Red, Blue, White",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient_3cols(y, vc[1], sampling, CUBECOLS.deepRed, CUBECOLS.dark_blue, CUBECOLS.cloudWhite)
            },
            {   
                name: "Mellow Sky",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient_3cols(y, vc[1], sampling, CUBECOLS.warm_yellow, CUBECOLS.greyMauve, CUBECOLS.skyBlue)
            },
            {   
                name: "Creamy Bands",
                fn: (x, y, z, vc, sampling, params) =>
                	this.colourBands(x, y, z, sampling, creamy_bands)
            },
            {   
                name: "Meadow Green Bands",
                fn: (x, y, z, vc, sampling, params) =>
                	this.colourBands(x, y, z, sampling, meadow_green_bands)
            },
            {   
                name: "Magma Inferno Bands",
                fn: (x, y, z, vc, sampling, params) =>
                	this.colourBands(x, y, z, sampling, magma_inferno_bands)
            },
            {   
                name: "autumn_foliage_bands",
                fn: (x, y, z, vc, sampling, params) =>
                	this.colourBands(x, y, z, sampling, autumn_foliage_bands)
            },
            {   
                name: "stripe",
                fn: (x, y, z, vc, sampling, params) =>
                	this.stripe(y,  CUBECOLS.cloudWhite , CUBECOLS.greyBlue)
            },
  			{
  				name: "Blue White Noise",
				fn: (x, y, z, vc, sampling, noise) =>
				this.cyclicNoise(vc[0], vc[1], vc[2], y, sampling, noise, blue_white_noise)
    		},
  			{
  				name: "Magenta Cyan Noise",
				fn: (x, y, z, vc, sampling, noise) =>
				this.cyclicNoise(vc[0], vc[1], vc[2], y, sampling, noise, mag_cyan_noise)
    		},
  			{
  				name: "Yellow Green Noise",
				fn: (x, y, z, vc, sampling, noise) =>
				this.cyclicNoise(vc[0], vc[1], vc[2], y, sampling, noise, yellow_green_noise)
    		},
   			{	name: "Full Colour Noise",
				fn: (x, y, z, vc, sampling, noise) =>
				this.valueNoise(vc[0], vc[1], vc[2], x, y, z, sampling, noise)
    		}
       ];
    }

	safeIndex(index) {
		return Math.abs(index) % this.cubeCols.length;
	}
	
	getNextColour(index) {
		return index > this.cubeCols.length - 1 ? 0 : index;
	}

	getPreviousColour(index) {
		return index < 0 ? this.cubeCols.length - 1  : index;
	}
	
    getColourFunction(index = 0) {
        const safeIndex = this.safeIndex(index);
        return this.cubeCols[safeIndex]?.fn;
    }

    getColourName(index = 0) {
        const safeIndex = this.safeIndex(index);
        return this.cubeCols[safeIndex]?.name;
    }

    gradient(y, vy, sampling, color1, color2) {
		const t = (vy - sampling.bounds.min_y) / sampling.boundsHeight();
        
        const isOdd = y & 1;
        const r = color1.r + (color2.r - color1.r) * t;
        const g = color1.g + (color2.g - color1.g) * t;
        const b = color1.b + (color2.b - color1.b) * t;
        const multiplier = isOdd ? 0.85 : 1.0;

        return { 
            r: r * multiplier, 
            g: g * multiplier, 
            b: b * multiplier 
        };
    }

	gradient_3cols(y, vy, sampling, color1, color2, color3) {
		const t = (vy - sampling.bounds.min_y) / sampling.boundsHeight();
		
		const isOdd = y & 1;
		
		// Pick start color, delta vector, and local scale factor
		const isFirstHalf = t < 0.5;
		const cStart = isFirstHalf ? color1 : color2;
		const cEnd   = isFirstHalf ? color2 : color3;
		const factor = isFirstHalf ? t * 2.0 : (t - 0.5) * 2.0;
	
		const multiplier = (isOdd ? 0.85 : 1.0);
	
		return { 
			r: (cStart.r + (cEnd.r - cStart.r) * factor) * multiplier, 
			g: (cStart.g + (cEnd.g - cStart.g) * factor) * multiplier, 
			b: (cStart.b + (cEnd.b - cStart.b) * factor) * multiplier 
		};
	}

	singleColour(y, colour) {
        const isOdd = y & 1;
        const multiplier = isOdd ? 0.85 : 1;

        return { 
            r: colour.r * multiplier, 
            g: colour.g * multiplier, 
            b: colour.b * multiplier 
        };
    }

	colourBands(x, y, z, sampling, palette) {
		const t = y / sampling.dimensions.height;
	
		const border_step = 1 / palette.length;
		const index = Math.floor(t / border_step);
		
		let m = 1;
		if (x % 2) m *= 0.95;
		
		return { r: palette[index].r * m, g: palette[index].g * m, b: palette[index].b * m};
	}

	stripe(y, colour1, colour2) {
        return y & 1 ? colour1 : colour2;
    }

	cyclicNoise(vx, vy, vz, y, sampling, noise, colours) {

		let noise_scale = 2;
		let frequency = 80;
	
		if(noise != null) {
			noise_scale = noise[0];
			frequency = noise[1];
		}
	
		let n = noise3D(vx * noise_scale, vy * noise_scale, vz * noise_scale);
	
		let t = 0.5 + 0.5 * Math.sin(n * frequency);
	
		const scaled = t * (colours.length - 1);
		
		const i = Math.floor(scaled);
		let f = scaled - i;
		
		const c1 = colours[i];
		const c2 = colours[i + 1];
		
		if(!(y % 2)) f *= 0.9;

		return { 	r: c1.r + (c2.r - c1.r) * f,
					g: c1.g + (c2.g - c1.g) * f,
					b: c1.b + (c2.b - c1.b) * f	};
	}
	
	valueNoise(vx, vy, vz, x, y, z, sampling, noise) {

		let noise_scale = 2;
 		if(noise != null) noise_scale = noise[0];

		let n = noise3D(vx * noise_scale, vy * noise_scale, vz * noise_scale);

		let l = 0.5;
		if(!(y % 2)) l *= 0.97;
	//	if(!(x % 2)) l *= 0.97;
	//	if(!(z % 2)) l *= 0.97;

		tempColor.setHSL( n * 3, 0.6, l);
		tempColor.convertSRGBToLinear();

    	return { r: tempColor.r, g: tempColor.g, b: tempColor.b};
    }

}

export let cube_colours = new CubeColours();
