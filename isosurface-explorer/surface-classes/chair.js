import Surface from "./surface.js";

export default class Chair extends Surface {
    constructor() {
        super();
        
        this.name = "Chair";
        this.colourMode = 3;
        this.currentVariant = 2;
        
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 3;
        this.animations = [5, 0, 1, 0, 2, 3, 4, 0, 5];
        this.frames = [30, 100, 200, 100, 50, 200, 100, 30];

        this.variants = [
            { params: [1.1, 0.5, 0.03] },
            { params: [1.0, 0.9, 0.2] },
            { params: [1.0, 0.9, 0.5] },
            { params: [1.0, 0.9, 0.8] },
            { params: [1.0, 0.9, 1.1] },
            { params: [1.0, 0.74, 0.1] },
            { params: [1.0, 0.74, 0.5] },
            { params: [0.4, 1.5, 0.8] },
            { params: [0.55, 1.2, 0.8] },
        ];

        this.animationVariants = [
            { params: [1.0, 0.9, 0.2] },
            { params: [0.8, 0.9, 1.1] },
            { params: [1.0, 0.74, 0.1] },
            { params: [1.0, 0.74, 0.5] },
            { params: [0.3, 1.5, 0.8] },
            { params: [1.0, 0.9, 0.5] },
        ];
    }

    field(x, y, z, params) {
        const k = params[0];
        const a = params[1];
        const b = params[2];
        
        const x2 = x * x;
        const y2 = y * y;
        
        const sphereTerm = Math.pow(x2 + y2 + z * z - a * k * k, 2);
        const chairTerm = b * ((z - k)**2 - 2 * x2) * ((z + k)**2 - 2 * y2);
        
        return sphereTerm - chairTerm;
    }
}