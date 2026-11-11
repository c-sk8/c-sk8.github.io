import Surface from "./surface.js";

// Smooth minimum helper function for organic blending
function smin(a, b, k) {
    let h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
}

// Smooth maximum helper function for smooth CSG intersections & subtractions
function smax(a, b, k) {
    let h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h * h * k * 0.25;
}

export default class CylinderCross extends Surface {
    constructor() {
        super();
        this.name = "Cylinder Cross";
        this.colourMode = 0;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 2;
        this.animations = [2, 0, 1, 0, 2];
        this.frames = [120, 120, 120, 120, 120];

        // Parameters: [scale, outerRadius, innerRadius, sphereRadius, jointSmoothness]
        this.variants = [
            { params: [1, 0.6, 0.5, 1, 0.1] },
            { params: [1, 0.2, 0.13, 1, 0.05] }
        ];

        this.animationVariants = [
            { params: [1, 0.6, 0.13, 1, 0.4] },
            { params: [1, 0.2, 0.13, 1, 0.05] },
            { params: [1, 0.6, 0.4, 1, 0.1] },
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const outerR = params[1];
        const innerR = params[2];
        const sphereR = params[3];
        const smoothness = params[4] ?? 0.3;

        // Scale coordinates
        let sx = x * scale;
        let sy = y * scale;
        let sz = z * scale;

        // 1. Smooth union of the three outer cylinders along X, Y, Z axes
        const cx = sy * sy + sz * sz - outerR * outerR;
        const cy = sx * sx + sz * sz - outerR * outerR;
        const cz = sx * sx + sy * sy - outerR * outerR;
        
        const outerCyl = smin(cx, smin(cy, cz, smoothness), smoothness);

        // 2. Smooth union of inner hollowing cylinders
        const ix = sy * sy + sz * sz - innerR * innerR;
        const iy = sx * sx + sz * sz - innerR * innerR;
        const iz = sx * sx + sy * sy - innerR * innerR;
        
        const innerCyl = smin(ix, smin(iy, iz, smoothness), smoothness);

        // Smooth subtraction of inner cylinders from outer cylinders
        let pipeField = smax(outerCyl, -innerCyl, smoothness * 0.5);

        // 3. Smooth intersection with the bounding sphere to cap the ends cleanly
        const sphereField = (sx * sx + sy * sy + sz * sz) - sphereR * sphereR;
        
        // Final field uses smooth max to blend the truncated rim into the sphere boundary
        return smax(pipeField, sphereField, smoothness);
    }
}