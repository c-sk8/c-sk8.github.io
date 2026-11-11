import Surface from "./surface.js";

function fastSmoothUnion(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * (1.0 / 4.0);
}

export default class PiriformDiabolo extends Surface {
    constructor() {
        super();
        this.name = "Piriform Diabolo";
        this.colourMode = 8;
        this.currentVariant = 0;
        this.bounds = [-1.1, 1.1, -0.7, 0.7, -0.8, 0.7];
        this.animationBounds = [-1.1, 1.1, -0.7, 0.7, -0.8, 0.7];
        this.animationsColour = 8;
        this.animations = [0, 4, 3, 4, 0];
        this.frames = [120, 120, 120, 120];

        this.variants = [
            { params: [3.5, 0.5, 0.24] },
            { params: [3.5, 0.5, 0.16] },
            { params: [3.5, 0.5, 0.08] },
            { params: [3.5, 0.5, 0] },
            { params: [3.5, 1.5, 0] }
        ];

        this.animationVariants = [
            { params: [3.5, 0.5, 0.24] },
            { params: [3.5, 0.5, 0.16] },
            { params: [3.5, 0.5, 0.08] },
            { params: [3.5, 0.5, 0] },
            { params: [3.5, 1.5, 0] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const dist_apart = params[1];
        const twist = params[2];
        
        x *= scale;
        y *= scale;
        z *= scale;

        const r2 = Math.sqrt(y*y + z*z) * (1 + twist * Math.sin(4 * Math.atan2(z, y) + 3 * x));
        const yz = r2 * r2;
        
        let x1 = x + dist_apart;
        let surface1 = (16 * yz) - (2 * x1 * x1 * x1 * (4 - x1));

        let x2 = -(x - dist_apart);
        let surface2 = (16 * yz) - (2 * x2 * x2 * x2 * (4 - x2));

        return fastSmoothUnion(surface1, surface2, 20);
    }
}