import Surface from "./surface.js";

function smoothMax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h*h*h * k * (1/6);
}

export default class GyroidFloor extends Surface {
    constructor() {
        super();
        this.name = "Gyroid Floor";
        this.colourMode = 7;
        this.currentVariant = 0;
        this.bounds = [-1, 1, -1, 1, -1, 1];
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 4;
        this.animations = [1, 0, 2, 0, 1];
        this.frames = [200, 400, 400, 200];

        this.variants = [
            { params: [8.5, 1, 3] },
            { params: [5, 1, 1.5] },
            { params: [12, 1, 1.5] },
        ];

        this.animationVariants = [
			{ params: [1, 0.9, 3] },
			{ params: [8.5, 1, 3] },
            { params: [12, 1.1, 3] },
        ];
    }

    field(x, y, z, params) {
        const gyroid_scale = params[0];
        const sphere_radius = params[1];
        const softness = params[2];
        
        let sx = x * gyroid_scale;
		let sy = y * gyroid_scale;
        let sz = z * gyroid_scale;
        
        const super_sphere = (x * x) + (y * y) + (z * z) - sphere_radius;

        const gyroid = Math.sin(sx) * Math.cos(sy) + 
                       Math.sin(sy) * Math.cos(sz) + 
                       Math.sin(sz) * Math.cos(sx);

        return smoothMax(gyroid, super_sphere, softness);
    }
}