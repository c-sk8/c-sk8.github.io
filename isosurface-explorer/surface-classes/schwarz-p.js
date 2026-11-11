import Surface from "./surface.js";

const TWO_PI = 2 * Math.PI;

function smoothMax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h*h*h * k * (1/6);
}

export default class SpheredSchwarzP extends Surface {
    constructor() {
        super();
        this.name = "Sphered Schwarz P";
        this.colourMode = 10;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 7;
        this.animations = [0, 2, 0, 2, 0];
        this.frames = [120, 120, 120, 120];

        this.variants = [
            { params: [1.6, 1, 1.5] },
            { params: [1.0, 1, 1.5] },
            { params: [0.56, 1, 1.5] }
        ];

        this.animationVariants = [
            { params: [1.6, 1, 1.5] },
            { params: [1.0, 1, 1.5] },
            { params: [0.56, 1, 1.5] }
        ];
    }

    field(x, y, z, params) {
        const density = params[0];
        const radius = params[1];
        const smoothness = params[2];

        const frequency = density * TWO_PI;
        const raw_lattice_field = Math.cos(x * frequency) +
                                  Math.cos(y * frequency) +
                                  Math.cos(z * frequency);

        const sphere = (x * x) + (y * y) + (z * z) - radius;

        return smoothMax(raw_lattice_field, sphere, smoothness);
    }
}