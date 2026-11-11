import Surface from "./surface.js";

export default class Tetrahedral extends Surface {
    constructor() {
        super();
        this.name = "Tetrahedral";
        this.colourMode = 2;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 2;
        this.animations = [1, 2, 0, 1];
        this.frames = [60, 120, 60];

        this.variants = [
            { params: [3.3, 24] },
            { params: [3.3, 28] }
        ];

        this.animationVariants = [
            { params: [3.3, 5] },
            { params: [3.3, 24] },
            { params: [3.3, 50] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const thickness = params[1];
        
        x *= scale;
        y *= scale;
        z *= scale;

        return (
            x**4 +
            2 * x**2 * y**2 +
            2 * x**2 * z**2 +
            y**4 +
            2 * y**2 * z**2 +
            z**4 +
            8 * x * y * z -
            10 * x**2 -
            10 * y**2 -
            10 * z**2 +
            thickness
        );
    }
}