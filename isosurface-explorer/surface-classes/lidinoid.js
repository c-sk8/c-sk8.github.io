import Surface from "./surface.js";

function smoothMax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h*h*h * k * (1/6);
}

export default class LidinoidSurface extends Surface {
    constructor() {
        super();
        this.name = "Lidinoid Surface";
        this.colourMode = 4;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 4;
        this.animations = [0, 3, 0, 3, 0];
        this.frames = [120, 120, 120, 120];

        this.variants = [
            { params: [1.2, 1, 2] },
            { params: [2.2, 1, 2] },
            { params: [3, 0.8, 1.5] },
            { params: [3.9, 0.8, 1.5] },
        ];

        this.animationVariants = [
            { params: [1.2, 1, 2] },
            { params: [2.2, 1, 2] },
            { params: [3, 0.8, 1.5] },
            { params: [3.9, 0.8, 1.5] },
        ];
    }

    field(x, y, z, params) {
        const ox = x;
        const oy = y;
        const oz = z;

        const scale = params[0];
        const radius = params[1];
        const softness = params[2];

        x *= scale;
        y *= scale;
        z *= scale;

        const sx = Math.sin(x);
        const sy = Math.sin(y);
        const sz = Math.sin(z);

        const cx = Math.cos(x);
        const cy = Math.cos(y);
        const cz = Math.cos(z);

        const s2x = Math.sin(2 * x);
        const s2y = Math.sin(2 * y);
        const s2z = Math.sin(2 * z);

        const c2x = Math.cos(2 * x);
        const c2y = Math.cos(2 * y);
        const c2z = Math.cos(2 * z);

        const lidinoid =
            s2x * sz * cy +
            s2y * sx * cz +
            s2z * sy * cx -
            c2x * c2y +
            c2y * c2z +
            c2z * c2x +
            0.3;

        const sphere =
            ox * ox * ox * ox +
            oy * oy * oy * oy +
            oz * oz * oz * oz -
            radius;

        return smoothMax(lidinoid, sphere, softness);
    }
}