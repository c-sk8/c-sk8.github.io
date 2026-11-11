import Surface from "./surface.js";

export default class Gumdrop extends Surface {
    constructor() {
        super();
        this.name = "Gumdrop Torus";
        this.colourMode = 2;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 2;
        this.animations = [0, 3, 1, 3, 2, 0];
        this.frames = [100, 100, 100, 100, 100];

        this.variants = [
            { params: [2.1, 18, 18, 20, 20] },
            { params: [2.3, 18, 18, 24, 24] },
            { params: [2.2, 18, 22, 15, 22] },
            { params: [2.1, 15, 20, 16, 20] },
            { params: [2.1, 18, 18, 17.3, 17.3] }
        ];

        this.animationVariants = [
            { params: [2.1, 18, 18, 20, 20] },
            { params: [2.2, 18, 22, 15, 22] },
            { params: [2.1, 15, 20, 16, 20] },
            { params: [2.1, 18, 18, 17.3, 17.3] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const modifier = params[1];
        const xmod = params[2];
        const ymod = params[3];
        const zmod = params[4];
        
        x *= scale;
        y *= scale;
        z *= scale;
        
        const x2 = x*x;
        const y2 = y*y;
        const z2 = z*z; 
        
        return (
            4 * x2 * x2 +
            4 * y2 * y2 +
            8 * y2 * z2 +
            4 * z2 * z2 +
            17 * x2 * y2 +
            17 * x2 * z2 -
            zmod * x2 -
            ymod * y2 -
            zmod * z2 +
            modifier
        );
    }
}