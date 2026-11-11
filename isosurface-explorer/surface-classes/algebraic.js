import Surface from "./surface.js";

export default class Algebraic extends Surface {
    constructor() {
        super();
        
        this.name = "Algebraic Surface";
        this.colourMode = 5;
        this.currentVariant = 0;
        
        this.animationBounds = [-1.1, 1.1, -1.1, 1.1, -1.1, 1.1];
        this.animationsColour = 4;
        this.animations = [0, 1, 0, 3, 4, 2, 0];
        this.frames = [50, 50, 100, 200, 100, 100];

        this.variants = [
            { params: [3.7, 5, 30, 10, 24] },
            { params: [3.9, 5, 0, 10, 0] },
            { params: [4.6, 15, 0, 15, 0] },
            { params: [3.9, 3, 16, 10, 42] },
            { params: [3.5, 3, 4, 10, 24] }
        ];

        this.animationVariants = [
            { params: [3.7, 5, 30, 10, 24] },
            { params: [3.7, 5, 30, 10, 100] },
            { params: [3.9, 5, 0, 10, 0] },
            { params: [4.6, 15, 0, 15, 0] },
            { params: [3.9, 3, 16, 10, 42] },
            { params: [3.5, 3, 4, 10, 10] },
            { params: [6, 3, 40, 18, 40] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const form_mq = params[1];
        const form_tp = params[2];
        const form_q = params[3];
        const thickness = params[4];
        
        x *= scale;
        y *= scale;
        z *= scale;
        
        const x2 = x * x;
        const y2 = y * y;
        const z2 = z * z;
        
        const term1 = (x2 - 4) * (x2 - 4);
        const term2 = (y2 - 4) * (y2 - 4);
        const term3 = (z2 - 4) * (z2 - 4);
        
        const mixedQuartic = form_mq * (x2 * y2 + x2 * z2 + y2 * z2);
        const tripleProduct = form_tp * x * y * z;
        const quadratic = -form_q * (x2 + y2 + z2);
        
        return (term1 + term2 + term3 + mixedQuartic + tripleProduct + quadratic + thickness);
    }
}