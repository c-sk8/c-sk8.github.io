// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";

export default class Decocube extends Surface {
    constructor() {
        super();
        
        this.name = "Decocube";
        this.colourMode = 0;
        this.currentVariant = 0;

        this.animationsColour = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animations = [0, 1, 2, 3, 1, 0];
        this.frames = [200, 200, 200, 30, 200];

        this.variants = [
            { params: [1.2, 1.00, 0.03] },
            { params: [1.4, 1.00, 0.3] },
            { params: [2, 3.00, 3] },
            { params: [1.16, 0, 0.2] }
        ];

        this.animationVariants = [
            { params: [1.2, 1.00, 0.03] },
            { params: [1.16, 0, 0.01] },
            { params: [1.4, 1.00, 0.3] },
            { params: [1.16, 0, 0.42] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const shape = params[1];
        const thickness = params[2];
        
        x *= scale;
        y *= scale;
        z *= scale;
    
        return  ( (x*x + y*y - shape)**2 + (z*z - 1)**2 ) *
                ( (y*y + z*z - shape)**2 + (x*x - 1)**2 ) *
                ( (z*z + x*x - shape)**2 + (y*y - 1)**2 ) - thickness;
    }
}