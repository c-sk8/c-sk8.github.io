import Surface from "./surface.js";

export default class MoebiusStrip extends Surface {
    constructor() {
        super();
        this.name = "Moebius Strip";
        this.colourMode = 8;
        this.currentVariant = 0;
        this.animationBounds = [-1, 1, -0.25, 0.25, -1, 1];
        this.animationsColour = 7;
        this.animations = [0, 1, 2, 3, 4, 3, 2, 1, 0];
        this.frames = [120, 120, 120, 120, 120, 120, 120, 120];

        this.variants = [
            { params: [4.2, 5, 0.6, 1], bounds: [-1, 1, -0.25, 0.25, -1, 1] },
            { params: [4.2, 4, 2, 0.5], bounds: [-1.2,1.2,-0.5,0.5,-1.2,1.2] },
            { params: [4.2, 3, 0.5, 2], bounds: [-1.2,1.2,-0.5,0.5,-1.2,1.2] },
            { params: [4.2, 2, 1, 1], bounds: [-1,1,-0.3,0.3,-1,1] },
        ];

        this.animationVariants = [
            { params: [4.2, 1, 0.5, 1] },
            { params: [4.2, 2, 0.5, 1] },
            { params: [4.2, 3, 0.5, 1] },
            { params: [4.2, 4, 0.5, 1] },
            { params: [4.2, 5, 0.5, 1] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const k = params[1]; // Twist count
        const a = params[2]; // Height/Thickness
        const b = params[3]; // Width
            
        x *= scale;
        y *= scale;
        z *= scale;

        const r = Math.sqrt(x * x + z * z);
        const phi = Math.atan2(z, x);
        
        const psi = (k / 2) * phi;
        const cosPsi = Math.cos(psi);
        const sinPsi = Math.sin(psi);
        
        const tMinus1 = r - 3.0;
        
        const rotatedX = cosPsi * tMinus1 + sinPsi * y;
        const rotatedZ = -sinPsi * tMinus1 + cosPsi * y;

        const p = 3.5; 
        
        const componentX = Math.pow(Math.abs(rotatedX / b), p);
        const componentZ = Math.pow(Math.abs(rotatedZ / a), p);
        
        return componentX + componentZ - 1.0;
    }
}