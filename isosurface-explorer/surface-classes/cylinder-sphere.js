// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Surface from "./surface.js";

// Optimized smooth minimum helper function
function smin(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
}

// Optimized smooth maximum helper function
function smax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h * h * k * 0.25;
}

export default class CylinderSphere extends Surface {
    constructor() {
        super();
        this.colourMode = 6;
        this.name = "Cylinder Sphere";
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.bounds = [-1, 1, -1, 1, -1, 1];
        this.animations = [0, 1, 2, 3, 4, 0];
        this.frames = [50, 50, 50, 50, 30];
        this.animationsColour = 11;

        // Parameters: [scale, cylinderRadius, outerSphereRadius, innerSphereRadius, blendSmoothness]
        this.variants = [
            { params: [1.1, 0.3, 1, 0, 0.1] },
            { params: [1.1, 0.3, 1, 0.85, 0.1] },
            { params: [1.1, 0.1, 1, 0, 0.05] },
            { params: [1.1, 0.45, 1, 0, 0.05] },
        ];

        this.animationVariants = [
            { params: [1.1, 0.3, 0.95, 0, 0.1] },
            { params: [1.1, 0.1, 0.95, 0, 0.6] },
            { params: [1.1, 0.1, 0.95, 0, 0.03] },
            { params: [1.1, 0.1, 0.1, 0, 0.03] },
            { params: [1.1, 0.3, 0.95, 0.9, 0.03] },
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const rCyl = params[1];
        const rOuter = params[2];
        const rInner = params[3];
        const blend = params[4] !== undefined ? params[4] : 0.15;

        x *= scale;
        y *= scale;
        z *= scale;

        const x2 = x * x;
        const y2 = y * y;
        const z2 = z * z;
        const r2 = x2 + y2 + z2;
        const r = Math.sqrt(r2);

        // 1. Optimized orthogonal cylinders using precomputed r2 components
        const cX = Math.sqrt(r2 - x2) - rCyl;
        const cY = Math.sqrt(r2 - y2) - rCyl;
        const cZ = Math.sqrt(r2 - z2) - rCyl;

        // Precompute shared differences and sums for diagonal cylinders to eliminate redundancy
        const xy = x - y;
        const yz = y - z;
        const zx = z - x;
        const xy_plus = x + y;
        const yz_plus = y + z;
        const zx_plus = z + x;

        const xy2 = xy * xy;
        const yz2 = yz * yz;
        const zx2 = zx * zx;
        const xy_plus2 = xy_plus * xy_plus;
        const yz_plus2 = yz_plus * yz_plus;
        const zx_plus2 = zx_plus * zx_plus;

        const rCyl2 = rCyl * rCyl;

        const d1 = (yz2 + zx2 + xy2) / 3 - rCyl2;
        const d2 = (yz2 + zx_plus2 + xy_plus2) / 3 - rCyl2;
        const d3 = (yz_plus2 + zx_plus2 + xy2) / 3 - rCyl2;
        const d4 = (yz_plus2 + zx2 + xy_plus2) / 3 - rCyl2;
        
        // Smoothly union all 7 cylinders together[cite: 3]
        let cylinders = smin(cX, cY, blend);
        cylinders = smin(cylinders, cZ, blend);
        cylinders = smin(cylinders, d1, blend);
        cylinders = smin(cylinders, d2, blend);
        cylinders = smin(cylinders, d3, blend);
        cylinders = smin(cylinders, d4, blend);

        // 2. Distance fields for truncation spheres[cite: 3]
        const outerSphere = r - rOuter;
        const innerSphere = rInner - r;

        // 3. Smooth CSG operations[cite: 3]
        let result = smax(cylinders, outerSphere, blend);
        result = smax(result, innerSphere, blend);

        return result;
    }
}