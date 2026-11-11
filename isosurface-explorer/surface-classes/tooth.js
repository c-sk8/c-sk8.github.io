// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";

export default class Tooth extends Surface {
    constructor() {
        super();
        
        this.name = "Tooth";
        this.colourMode = 1;
        this.currentVariant = 0;
        
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 1;
        this.animations = [1, 0, 2, 0, 1];
        this.frames = [100, 150, 150, 100];

        this.variants = [
            { params: [1.1, 0.82] },
            { params: [1.1, 1.02] },
        ];

        this.animationVariants = [
            { params: [1.1, 1.45] },
            { params: [1.1, 0.82] },
            { params: [1.1, 0.62] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const thickness = params[1];
        
        x *= scale;
        y *= scale;
        z *= scale;
        
        return ((2 * (x**4 + y**4 + z**4)) - (2 * (x**2 + y**2 + z**2))) + thickness;
    }
}