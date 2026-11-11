// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import { SCOLS } from "./colour-defs.js";

export class AnimationColours {
    constructor() {
        this.animationCols = [
            {   
                name: "Animation Aqua",
                fn: (y, height) => this.customGradient(y, height, SCOLS.mint_green, SCOLS.cyan)
            },
            {   
                name: "Animation Red",
                fn: (y, height) => this.customGradient(y, height, SCOLS.warm_yellow, SCOLS.deep_red)
            },
            {   
                name: "Animation Warm Greens",
                fn: (y, height) => this.customGradient(y, height, SCOLS.warm_green, SCOLS.dark_green)
            },
            {   
                name: "Animation Blues",
                fn: (y, height) => this.customGradient(y, height, SCOLS.pale_blue, SCOLS.dark_blue)
            },
            {   
                name: "Animation Yellow And Orange",
                fn: (y, height) => this.customGradient(y, height, SCOLS.yellow, SCOLS.orange)
            },
            {   
                name: "Animation Pink And Purple",
                fn: (y, height) => this.customGradient(y, height, SCOLS.pink, SCOLS.purple)
            },
            {   
                name: "Pale Mauve And Blue",
                fn: (y, height)  => this.customGradient(y, height, SCOLS.pale_mauve, SCOLS.sky_blue)
            },
            {   
                name: "Animation Latte",
                fn: (y, height) => this.customGradient(y, height, SCOLS.latte_light, SCOLS.latte_dark)
            },
            {   
                name: "Animation Sky",
                fn: (y, height) => this.customGradient(y, height, SCOLS.cloud_white, SCOLS.sky_blue)
            },
            {   
                name: "Animation Warm Pink And Mauve",
                fn: (y, height) => this.customGradient(y, height, SCOLS.grey_mauve, SCOLS.warm_pink)
            },
            {   
                name: "Animation Yellow Mauve Blue",
                fn: (y, height) => this.gradient_3cols_mod(y, height, SCOLS.warm_yellow, SCOLS.grey_mauve, SCOLS.sky_blue)
            },
            {   
                name: "Animation Dark Green Yellow",
                fn: (y, height) => this.gradient_3cols_mod(y, height, SCOLS.dark_green, SCOLS.warm_green, SCOLS.yellow)
            },
            {   
                name: "Animation Blue Stripes",
                fn: (y, height) => this.stripe(y,  SCOLS.cloud_white , SCOLS.grey_blue)
            },
            {   
                name: "Animation Pale Pink Stripes",
                fn: (y, height) => this.stripe(y,  SCOLS.cloud_white, SCOLS.pale_pink)
            },
        ];
    }

	safeIndex(index) {
		return Math.abs(index) % this.animationCols.length;
	}
	
    getAnimationColourFunction(index = 0) {
        const safeIndex = this.safeIndex(index);
        return this.animationCols[safeIndex]?.fn;
    }

    getAnimationColourName(index = 0) {
        const safeIndex = this.safeIndex(index);
        return this.animationCols[safeIndex]?.name;
    }

	getNextColour(index) {
		return index > this.animationCols.length - 1 ? 0 : index;
	}

	getPreviousColour(index) {
		return index < 0 ? this.animationCols.length - 1  : index;
	}

    customGradient(y, height, color1, color2) {
        const t = height > 0 ? y / height : 0;
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

	gradient_3cols_mod(y, height, color1, color2, color3) {
		const t = height > 0 ? y / height : 0;
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

	doubleGradient(y, height, color1, color2, color3) {
		const t = height > 0 ? y / height : 0;
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
        
	stripe(y, colour1, colour2) {
		return y & 1 ? colour1 : colour2;
	}

}

export let animation_colours = new AnimationColours();