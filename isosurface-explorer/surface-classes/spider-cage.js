// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";

export default class SpiderCage extends Surface {
    constructor() {
        super();
        this.name = "Spider Cage";
        this.bounds = [-1, 1, -1, 1, -1, 1];
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animations = [0, 1, 2, 1, 0];
        this.frames = [30, 200, 200, 30];
        this.currentVariant = 0;

        this.variants = [
            { params: [1.7, 1, 1.7, 0.9, 0.02] },
            { params: [1.7, 1.6, 1.7, 0.785, 0.1] },
            { params: [1.7, 1.6, 1.7, 0, 0.05] }
        ];

        this.animationVariants = [
        	{ params: [1.7, 1.6, 1.7, 0.785, 0.1] },
			{ params: [1.8, 1, 1.8, 0, 0.1] },
			{ params: [2, 1.5, 2, 1.57, 0.5] }
        ];
    }

	field(x, y, z, params) {
	
        const x_scale = params[0];
        const y_scale = params[1];
        const z_scale = params[2];
        const a = params[3];
        const thickness = params[4];

        x *= x_scale;
        y *= y_scale;
        z *= z_scale;

        const x2 = x * x;
        const z2 = z * z;
        const x2_z2 = x2 + z2 + 0.1;

        const term1 = Math.sqrt(Math.pow(x2 - z2, 2) / x2_z2 + 3 * Math.pow(y * Math.sin(a), 2)) - 1.0;
        const term2 = Math.sqrt(Math.pow(x * z, 2) / x2_z2 + Math.pow(y * Math.cos(a), 2)) - 0.5;

        return Math.pow(term1, 2) + 6 * Math.pow(term2, 2) - thickness;
    }
}