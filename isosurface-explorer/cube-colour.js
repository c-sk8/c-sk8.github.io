// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import { Sampling } from './sampling.js';
import { noise3D } from './noise-3d.js';
import { SCOLS, creamy_bands, meadow_green_bands, magma_inferno_bands,
		autumn_foliage_bands, blue_white_noise, mag_cyan_noise,
		yellow_green_noise } from "./colour-defs.js";

// --- Pure JS HSL to RGB helper with sRGB-to-linear conversion ---
function hslToRgb(h, s, l) {
    let r, g, b;

    h = ((h % 1) + 1) % 1;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    // Apply sRGB-to-linear conversion (matches Three.js convertSRGBToLinear())
    return {
        r: Math.pow(r, 2.2),
        g: Math.pow(g, 2.2),
        b: Math.pow(b, 2.2)
    };
}

export class CubeColours {
    constructor() {
        this.cubeCols = [
            {   
                name: "Mint Green And Cyan",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.mint_green, SCOLS.cyan)
            },
            {   
                name: "Yellow And Red",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.warm_yellow, SCOLS.deep_red)
            },
            {   
                name: "Two Greens",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.warm_green, SCOLS.dark_green)
            },
            {   
                name: "Two Blues",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.pale_blue, SCOLS.dark_blue)
            },
            {   
                name: "Yellow And Orange",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.yellow, SCOLS.orange)
            },
            {   
                name: "Pink And Purple",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.pink, SCOLS.purple)
            },
            {   
                name: "Pale Mauve And Blue",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient(y, vc[1], sampling, SCOLS.pale_mauve, SCOLS.sky_blue)
            },
            {   
                name: "Blue, Purple, Orange",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient_3cols_mod(y, vc[1], sampling, SCOLS.grey_blue, SCOLS.purple, SCOLS.orange)
            },
            {   
                name: "Mellow Sky",
                fn: (x, y, z, vc, sampling, params) =>
                	this.gradient_3cols_mod(y, vc[1], sampling, SCOLS.warm_yellow, SCOLS.grey_mauve, SCOLS.sky_blue)
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
                name: "Autumn Foliage Bands",
                fn: (x, y, z, vc, sampling, params) =>
                	this.colourBands(x, y, z, sampling, autumn_foliage_bands)
            },
            {   
                name: "Stripes",
                fn: (x, y, z, vc, sampling, params) =>
                	this.stripe(y,  SCOLS.cloud_white , SCOLS.grey_blue)
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

	gradient_3cols_mod(y, vy, sampling, color1, color2, color3) {
		const t = (vy - sampling.bounds.min_y) / sampling.boundsHeight();
		const isOdd = y & 1;
		const multiplier = (isOdd ? 0.85 : 1.0);
	
		let cStart, cEnd, factor;
	
		if (t < 0.1) {
			// First 10%: solid color1
			cStart = color1;
			cEnd = color1;
			factor = 0.0;
		} else if (t < 0.45) {
			// First transition: color1 to color2 (over 35% of the range)
			cStart = color1;
			cEnd = color2;
			factor = (t - 0.1) / 0.35;
		} else if (t < 0.55) {
			// Middle 10%: solid color2
			cStart = color2;
			cEnd = color2;
			factor = 0.0;
		} else if (t < 0.9) {
			// Second transition: color2 to color3 (over 35% of the range)
			cStart = color2;
			cEnd = color3;
			factor = (t - 0.55) / 0.35;
		} else {
			// Last 10%: solid color3
			cStart = color3;
			cEnd = color3;
			factor = 0.0;
		}
	
		return { 
			r: (cStart.r + (cEnd.r - cStart.r) * factor) * multiplier, 
			g: (cStart.g + (cEnd.g - cStart.g) * factor) * multiplier, 
			b: (cStart.b + (cEnd.b - cStart.b) * factor) * multiplier 
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
		const index = Math.min(Math.floor(t / border_step), palette.length - 1);
				
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
		
		const i = Math.min(Math.floor(scaled), colours.length - 2);
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
        if (noise != null) noise_scale = noise[0];

        let n = noise3D(vx * noise_scale, vy * noise_scale, vz * noise_scale);

        let l = 0.5;
        if (!(y % 2)) l *= 0.97;

        // Replaced Three.js HSL conversion with pure JS function
        // Note: n * 3 maps hue, 0.6 is saturation, l is lightness
        return hslToRgb((n * 3) % 1, 0.6, l);
    }
}

export let cube_colours = new CubeColours();