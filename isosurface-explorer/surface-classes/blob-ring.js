import Surface from "./surface.js";

const TWO_PI = 2 * Math.PI;

export default class BlobRing extends Surface {
    constructor() {
        super();
        this.name = "Blob Ring";
        this.colourMode = 9;
        this.currentVariant = 0;
        this.bounds = [-1.2, 1.2, -0.37, 0.37, -1.2, 1.2];
        this.animationBounds = [-1.2, 1.2, -0.37, 0.37, -1.2, 1.2];
        this.animationsColour = 9;
        this.animations = [0, 1, 2, 0];
        this.frames = [150, 600, 400];

        this.variants = [
            { params: [0.8, 0.8] },
            { params: [0.8, 0.81] },
            { params: [0.8, 0.78] }
        ];

        this.animationVariants = [
            { params: [0.8, 0.81] },
            { params: [1.05, 1.05] },
            { params: [1.0, 0.6] }
        ];
    }

    field(x, y, z, params) {
        const scale = params[0];
        const ringRadius = params[1];
        const blobCount = 6;
        const angleStep = TWO_PI / blobCount;

        x *= scale; 
        y *= scale; 
        z *= scale;

        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z);
        
        const localAngle = ((angle % angleStep) + angleStep) % angleStep - (angleStep / 2);
        
        let field = 0;

        for (let i = -1; i <= 1; i++) {
            const neighborAngle = localAngle + (i * angleStep);
            
            const px = Math.cos(neighborAngle) * radius;
            const pz = Math.sin(neighborAngle) * radius;

            const dx = px - ringRadius;
            const dz = pz;
            
            const distSq = dx * dx + y * y + dz * dz;

            if (distSq < 0.5) {
                const f = 1.0 - distSq * 2.0; 
                field += f * f * f; 
            }
        }

        const distsq = x * x + y * y + z * z;
        const f2 = 1.0 - distsq * 2.0;
        field += f2 * f2 * f2; 

        return field - 0.6;
    }
}