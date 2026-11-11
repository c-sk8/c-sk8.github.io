import Surface from "./surface.js";

const SQRT3 = Math.sqrt(3);
const RAND1 = Math.random() * 10;
const RAND2 = Math.random() * 10;

export default class FlattenedWave extends Surface {
    constructor() {
        super();
        this.name = "Flattened Wave";
        this.colourMode = 9;
        this.currentVariant = 0;
        this.animationBounds = [-1.5, 1.5, -0.25, 0.22, -1.5, 1.5];
        this.animationsColour = 12;
        this.animations = [0, 1, 2, 1, 0, 3, 4, 3, 0];
        this.frames = [400, 400, 400, 400, 300, 300, 300, 300];

        this.variants = [
            { params: [RAND1, RAND2, 5, 20, 5, 1], bounds: [-3, 3, -0.06, 0.06, -3, 3] },
            { params: [RAND2, RAND1, 5, 5, 5, 2], bounds: [-2, 2, -0.1, 0.1, -2, 2] },
            { params: [0, 0, 20, 50, 20, 1], bounds: [-2, 2, -0.02, 0.02, -2, 2] },
            { params: [0, 0, 20, 10, 20, 1], bounds: [-1.5, 1.5, -0.1, 0.1, -1.5, 1.5] },
        ];

        this.animationVariants = [
            { params: [0, 0, 16, 18, 16, 1.5] },
            { params: [0, 0, 6, 8, 6, 1.5] },
            { params: [0, 0, 3, 3, 3, 1.5] },
            { params: [0, 0, 13, 8, 15, 1.5] },
            { params: [0, 0, 10, 3, 14, 1.5] },
        ];
    }

    field(x, y, z, params) {
        const x_offset = params[0];
        const z_offset = params[1];
    
        const x_scale = params[2];
        const y_scale = params[3];
        const z_scale = params[4];
    
        const flatness = params[5];
    
        x += x_offset;
        z += z_offset;
        
        x *= x_scale;
        y *= y_scale;
        z *= z_scale;
    
        let wave = Math.cos(x) * Math.cos(z) +
                   Math.cos((SQRT3 * x - z) / 2) * Math.cos((x + SQRT3 * z) / 2) +
                   Math.cos((SQRT3 * x + z) / 2) * Math.cos((x - SQRT3 * z) / 2);
    
        let squashedWave = Math.tanh(wave * flatness) / flatness;
    
        return (squashedWave + y);
    }
}