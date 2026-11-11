import Surface from "./surface.js";

const SQRT3 = Math.sqrt(3);
const RAND1 = Math.random() * 10;
const RAND2 = Math.random() * 10;

export default class CosinePattern extends Surface {
    constructor() {
        super();
        this.name = "Cosine Pattern";
        this.colourMode = 6;
        this.currentVariant = 0;

        this.animationsColour = 10;
        this.animations = [0, 1, 2, 3, 1, 0];
        this.frames = [120, 30, 30, 30, 120];
        this.animationBounds = [-1, 1, -0.6, 0.3, -1, 1];

        this.variants = [
            { params: [20, 20, 20, 0, 0], bounds: [-1.5, 1.5, -0.15, 0.09, -1.5, 1.5] },
            { params: [10, 40, 10, 0, 0], bounds: [-1.5, 1.5, -0.08, 0.05, -1.5, 1.5] },
            { params: [10, 40, 10, RAND1, RAND2], bounds: [-1.5, 1.5, -0.08, 0.05, -1.5, 1.5] },
        ];

        this.animationVariants = [
            { params: [20, 20, 20, 0, 0] },
            { params: [5, 5, 5, 0, 0] },
            { params: [3, 5, 5, 0, 0] },
            { params: [5, 5, 3, 0, 0] }
        ];
    }

    field(x, y, z, params) {
        const x_scale = params[0];
        const y_scale = params[1];
        const z_scale = params[2];
        
        const x_shift = params[3];
        const z_shift = params[4];

        let sx = (x + x_shift) * x_scale;
        let sy = y * y_scale;
        let sz = (z + z_shift) * z_scale;
        
        const surface_top = Math.cos(sx) * Math.cos(sz) +
                            Math.cos((SQRT3 * sx - sz) / 2) * Math.cos((sx + SQRT3 * sz) / 2) +
                            Math.cos((SQRT3 * sx + sz) / 2) * Math.cos((sx - SQRT3 * sz) / 2) + sy;

        return surface_top;
    }
}