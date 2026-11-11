import Surface from "./surface.js";

export default class SinedSphere extends Surface {
    constructor() {
        super();
        this.name = "Sined Sphere";
        this.colourMode = 3;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 3;
        this.animations = [0, 1, 2, 0, 3, 0];
        this.frames = [120, 120, 120, 120, 120];

        this.variants = [
            { params: [1, 0.8, 0.2, 10, 10, 10] },
            { params: [0.8, 0.1, 0.9, 4, 4, 4] },
            { params: [1, 0.2, 0.9, 6, 6, 6] },
            { params: [1, 0.2, 0.9, 9, 9, 9] }
        ];

        this.animationVariants = [
            { params: [1, 0.8, 0.25, 10, 10, 10] },
            { params: [0.8, 0.1, 0.9, 4, 4, 4] },
            { params: [1, 0.2, 0.9, 6, 6, 6] },
            { params: [1, 0.2, 0.9, 9, 9, 9] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const rscale = params[1];
        const amplitude = params[2];
        const xfrequency = params[3];
        const yfrequency = params[4];
        const zfrequency = params[5];
        
        x *= scale;
        y *= scale;
        z *= scale;

        let r2 = x*x + y*y + z*z;
        return r2 - rscale + amplitude *
               Math.sin(xfrequency * x) *
               Math.sin(yfrequency * y) *
               Math.sin(zfrequency * z);
    }
}