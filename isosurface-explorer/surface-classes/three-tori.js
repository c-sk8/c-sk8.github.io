import Surface from "./surface.js";

// Helper functions for individual tori calculations
function torisXY(x, y, z, R, r) {
    const q = Math.sqrt(x**2 + y**2) - R;
    return Math.sqrt(q**2 + z**2) - r;
}

function torisXZ(x, y, z, R, r) {
    const q = Math.sqrt(x**2 + z**2) - R;
    return Math.sqrt(q**2 + y**2) - r;
}

function torisYZ(x, y, z, R, r) {
    const q = Math.sqrt(y**2 + z**2) - R;
    return Math.sqrt(q**2 + x**2) - r;
}

function smoothMin(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * h * k * (1.0 / 6.0);
}

export default class ThreeTori extends Surface {
    constructor() {
        super();
        this.name = "Three Tori";
        this.colourMode = 8;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 11;
        this.animations = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
        this.frames = [120, 120, 120, 120, 120, 120, 120, 120, 120, 120];

        this.variants = [
            { params: [4, 1, 0.4, 3, 3, 3] },
            { params: [4, 1, 0.1, 3, 3, 3] },
            { params: [4, 1, 0.4, 3, 2.4, 1.8] },
        ];

        this.animationVariants = [
            { params: [4, 1, 0.4, 3, 3, 3] },
            { params: [4, 3, 0.5, 0, 0, 0] },
            { params: [4, 3, 0.5, 0, 0, 3] },
            { params: [4, 3, 0.5, 0, 3, 3] },
            { params: [5, 3, 0.6, 3, 3, 3] },
            { params: [4, 3, 0.1, 3, 3, 3] },
            { params: [4, 1, 0.4, 3, 3, 3] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const blend_factor = params[1];
        const tube_radius = params[2];
        const xy_radius = params[3];
        const xz_radius = params[4];
        const yz_radius = params[5];
        
        x *= scale;
        y *= scale;
        z *= scale;

        const f1 = torisXY(x, y, z, xy_radius, tube_radius);
        const f2 = torisXZ(x, y, z, xz_radius, tube_radius);
        const f3 = torisYZ(x, y, z, yz_radius, tube_radius);

        let field = smoothMin(f1, f2, blend_factor);
        field = smoothMin(field, f3, blend_factor);

        return field;
    }
}