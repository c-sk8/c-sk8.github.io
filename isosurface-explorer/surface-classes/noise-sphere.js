// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";
import { noise3D } from '../noise-3d.js';

export default class NoiseSphere extends Surface {
    constructor() {
        super();
        this.name = "Noise Sphere";
        this.colourMode = 14;
        this.animationBounds = [-1.3,1.3,-1.3,1.3,-1.3,1.3];
        this.bounds = [-1.3,1.3,-1.3,1.3,-1.3,1.3];
        this.animations = [0, 1, 0];
        this.frames = [200, 200];

        this.variants = [
			{ params: [0.9, 0.6, 0.05], noise: [2.0, 30] },
			{ params: [0.5, 2, 0.03], noise: [1.0, 40] },
			{ params: [0.85, 1, 0.1], noise: [1.0, 50] },
        ];

        this.animationVariants = [
			{ params: [0.9, 0.4, 0.05] },
			{ params: [0.3, 0.6, 0.05] }
        ];
    }

    field(x, y, z, params, shared_params) { 

		const radius = params[0];
		const noise_scale = params[1];
		const wave_scale = params[2];
	
		let noise_function_scale = 2;
		let frequency = 20;
		
		if(shared_params != null)
		{
			noise_function_scale = shared_params[0];
			frequency = shared_params[1];
		}
	
		const n = noise3D(	x * noise_function_scale,
							y * noise_function_scale,
							z * noise_function_scale);
		
		const t = 0.5 + 0.5 * Math.sin(n * frequency);
		
		const r = radius + n * noise_scale + (t - 0.5) * wave_scale;
		
		return x*x + y*y + z*z - r*r;
    }
}
