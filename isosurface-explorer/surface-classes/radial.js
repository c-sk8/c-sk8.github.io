import Surface from "./surface.js";

function smoothMax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h*h*h * k * (1/6);
}

export default class RadialWaveSphere extends Surface {
    constructor() {
        super();
        this.name = "Radial Wave Sphere";
        this.colourMode = 1;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 1;
        this.animations = [0, 1, 0, 2, 0, 3, 4, 5, 6, 5, 4, 0];
        this.frames = [50, 50, 100, 100, 200, 100, 20, 100, 100, 20, 40];

        this.variants = [
            { params: [1.3, 1.3, 1.3, 0.4, -1.2, 0, 5] },
           // { params: [1.3, 0.4, 1.2, 0, 5] },
            //{ params: [1.3, 0.4, 6, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.4, 12, 0, 5] },
            { params: [1.3, 1.3, 0.7, 0.9, 1.2, 4, 3] },
            { params: [1.25, 1.25, 1, 0.6, 1.2, 1, 9] },
        ];

        this.animationVariants = [
            { params: [1.3, 1.3, 1.3, 0.4, -1.2, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.4, 1.2, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.4, 6, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.4, 12, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.4, 0, 0, 5] },
            { params: [1.3, 1.3, 1.3, 0.6, 0, 0, 3] },
            { params: [1.3, 1.3, 1.3, 0.6, 1.2, 2, 3] },
        ];
    }

    field(x, y, z, params) {
        const x_scale = params[0];
        const y_scale = params[1];
        const z_scale = params[2];
        const cylinderRadius = params[3];
        const radialFreq = params[4];
        const twistAmount = params[5];
        const angularFreq = params[6];

        const baseRadius = 1;
        const amplitude = 0.25;
        const smoothness = 1;

        x *= x_scale;
        y *= y_scale;
        z *= z_scale;

        const r = Math.sqrt(x*x + y*y + z*z);
        const theta = Math.atan2(y, x);

        const twistedTheta = theta + twistAmount * z;

        const radialWave = Math.sin(radialFreq * r);
        const angularWave = Math.sin(angularFreq * twistedTheta);

        const displacement = amplitude * radialWave * angularWave;

        // Main surface
        const surface = r*r - (baseRadius + displacement) ** 2;

        // Cylinder along Z axis
        const cylinder = x*x + y*y - cylinderRadius * cylinderRadius;

        // Smooth subtraction (remove cylinder)
        return smoothMax(surface, -cylinder, smoothness);
    }
}