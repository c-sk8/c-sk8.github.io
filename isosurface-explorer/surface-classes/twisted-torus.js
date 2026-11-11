// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";

export default class TwistedTorus extends Surface {
    constructor() {
        super();
        
        this.name = "Twisted Torus";
        this.colourMode = 1;
        this.currentVariant = 0;
        
        this.animationBounds = [-1.25, 1.25, -0.5, 0.5, -1.25, 1.25];
        this.animationsColour = 1;
        this.animations = [0, 1, 0, 2, 0];
        this.frames = [300, 300, 300, 300];

        this.variants = [
            { params: [2.3, 2.3, 2.3, 2, 0.1, 1.5, 0.6, 5], bounds: [-1, 1, -0.34, 0.36, -1, 1] },
            { params: [2.3, 1.5, 2.3, 5, 0.04, 1.5, 0.6, 8], bounds: [-1, 1, -0.5, 0.5, -1, 1] },
            { params: [2.5, 2, 2.5, 3, 0.2, 1.5, 0.6, 2], bounds: [-1, 1, -0.5, 0.5, -1, 1] },
            { params: [2.5, 2.5, 2.5, 10, 0.07, 2, 0.6, 2], bounds: [-1.25, 1.25, -0.45, 0.45, -1.25, 1.25] },
        ];

        this.animationVariants = [
            { params: [2.5, 2.5, 2.5, 2, 0.4, 2, 0.6, 2] },
            { params: [2.5, 2.5, 2.5, 10, 0.05, 2, 0.6, 2] },
            { params: [2.5, 2.5, 2.5, 2, 0.05, 2, 0.6, 8] },
        ];
    }

    field(x, y, z, params) {
        const x_scale = params[0];
        const y_scale = params[1];
        const z_scale = params[2];
    
        const twist_factor = params[3];
        const wave_amplitude = params[4];
        const major_radius = params[5];
        const tube_radius = params[6];
        const num_waves = params[7];
    
        x *= x_scale;
        y *= y_scale;
        z *= z_scale;
    
        let radial = Math.sqrt(x*x + z*z);
        let theta = Math.atan2(z, x);
        let dx = radial - major_radius;
        let phi = Math.atan2(y, dx);
        let wave = wave_amplitude * Math.sin(num_waves * phi + twist_factor * theta) + 0.1 * Math.cos(2.0 * theta);
    
        return dx*dx + y*y - (tube_radius + wave)*(tube_radius + wave);
    }
}