import Surface from "./surface.js";

export default class Rhombicuboctahedron extends Surface {
    constructor() {
        super();
        this.name = "Rhombicuboctahedron";
        this.colourMode = 0;
        this.currentVariant = 5;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 0;
        this.animations = [5, 0, 1, 2, 3, 4, 0, 5];
        this.frames = [120,120,120,120,120,120,120];

        this.variants = [
            { params: [3.1, 1, 0.2, 0.05] },
            { params: [3.1, 1, 2.2, 5] },
            { params: [1.8, 1, 0.2, 0.05] },
            { params: [3.1, 1, 2.2, 0.4] },
            { params: [3.3, 1, 2.2, 15.0] },
            { params: [3, 1, 2.2, 1] }
        ];
        
        this.animationVariants = [
            { params: [3.1, 1, 0.2, 0.05] },
            { params: [3.1, 1, 2.2, 5] },
            { params: [1.8, 1, 0.2, 0.05] },
            { params: [3.1, 1, 2.2, 0.4] },
            { params: [3.3, 1, 2.2, 15.0] },
            { params: [3, 1, 2.2, 1] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const b = params[1];
        const c = params[2];
        const t = params[3];

        x *= scale;
        y *= scale;
        z *= scale;

        const x2 = x * x * 0.3;
        const y2 = y * y * 0.3;
        const z2 = z * z * 0.3;

        const xm1 = x - 1, xp1 = x + 1;
        const ym1 = y - 1, yp1 = y + 1;
        const zm1 = z - 1, zp1 = z + 1;

        const xpm = xm1 * xm1 * xp1 * xp1;
        const ypm = ym1 * ym1 * yp1 * yp1;
        const zpm = zm1 * zm1 * zp1 * zp1;

        const xy = x2 + y2 - c;
        const yz = y2 + z2 - c;
        const zx = z2 + x2 - c;

        const term1 = xy * xy + zpm;
        const term2 = yz * yz + xpm;
        const term3 = zx * zx + ypm;

        const core = term1 * term2 * term3;
        const subtract = t * (1 + b * (x2 + y2 + z2));

        return core - subtract;
    }
}