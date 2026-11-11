// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";
import { noise3D } from '../noise-3d.js';

export default class SurfaceNoise extends Surface {
    constructor() {
        super();
        this.name = "Surface Noise";
        this.colourMode = 17;
        this.animationBounds = [-2, 2, 0, 0.6, -2, 2];
        this.animations = [0, 1, 0];
        this.frames = [600,600];
        this.animationsColour = 13;

        this.variants = [
			{ params: [0.6], noise: [2, 3], bounds: [-2,2,0,0.65,-2,2] },
			{ params: [0.2], noise: [2, 10], bounds: [-2,2,-0.2,0.22,-2,2] },
			{ params: [0.05], noise: [3, 20], bounds: [-2,2,-0.05,0.05,-2,2] }
        ];

        this.animationVariants = [
            { params: [0.6] },
            { params: [0.2] },
        ];
    }

    field(x, y, z, params, shared_params) {
		const vertical_scale = params[0];
	
		let noise_function_scale = 2;
		let frequency = 5;
		
		if(shared_params != null)
		{
			noise_function_scale = shared_params[0];
			frequency = shared_params[1];
		}

		const n = noise3D(	x * noise_function_scale, 0,
							z * noise_function_scale);
							
		const t = vertical_scale * Math.sin(n * frequency);
		return y - t;
	}
}
