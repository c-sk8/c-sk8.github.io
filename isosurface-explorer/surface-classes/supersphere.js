import Surface from "./surface.js";

export default class SuperSphere extends Surface {
    constructor() {
        super();
        this.name = "Super Sphere";
        this.colourMode = 0;
        this.currentVariant = 1;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 0;
        this.animations = [1, 2, 0, 2, 3, 2, 3, 4, 3, 4, 1];
        this.frames = [50, 50, 50, 50, 50, 50, 50, 50, 50, 100];

        this.variants = [
            { params: [0.7, 4] },
            { params: [0.8, 3] },
            { params: [0.9, 1] },
            { params: [1, 0.5] },
            { params: [1, 0.2] },
        ];

        this.animationVariants = [
            { params: [0.7, 4] },
            { params: [0.8, 3] },
            { params: [0.9, 1] },
            { params: [1, 0.5] },
            { params: [1, 0.2] },
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const p = params[1];

        return (x**2)**p + (y**2)**p + (z**2)**p - scale;
    }
}