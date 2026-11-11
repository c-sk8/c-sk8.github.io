import Surface from "./surface.js";

const count50 = 50;
const bumps50X = new Float32Array(count50);
const bumps50Y = new Float32Array(count50);
const bumps50Z = new Float32Array(count50);

(function init50() {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const jitterAmount = 0.03;
    
    for (let i = 0; i < count50; i++) {
        const y = 1 - (i / (count50 - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        
        let nx = Math.cos(theta) * r;
        let ny = y;
        let nz = Math.sin(theta) * r;
        
        nx += ((Math.sin(i * 12.9898) * 43758.5453) % 1 - 0.5) * jitterAmount;
        ny += ((Math.sin(i * 78.2330) * 43758.5453) % 1 - 0.5) * jitterAmount;
        nz += ((Math.sin(i * 45.1640) * 43758.5453) % 1 - 0.5) * jitterAmount;
        
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        bumps50X[i] = nx / len;
        bumps50Y[i] = ny / len;
        bumps50Z[i] = nz / len;
    }
})();

const count300 = 300;
const bumps300X = new Float32Array(count300);
const bumps300Y = new Float32Array(count300);
const bumps300Z = new Float32Array(count300);

(function init300() {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const jitterAmount = 0.03;
    
    for (let i = 0; i < count300; i++) {
        const y = 1 - (i / (count300 - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        
        let nx = Math.cos(theta) * r;
        let ny = y;
        let nz = Math.sin(theta) * r;
        
        nx += ((Math.sin(i * 12.9898) * 43758.5453) % 1 - 0.5) * jitterAmount;
        ny += ((Math.sin(i * 78.2330) * 43758.5453) % 1 - 0.5) * jitterAmount;
        nz += ((Math.sin(i * 45.1640) * 43758.5453) % 1 - 0.5) * jitterAmount;
        
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        bumps300X[i] = nx / len;
        bumps300Y[i] = ny / len;
        bumps300Z[i] = nz / len;
    }
})();

export default class Geodesic extends Surface {
    constructor() {
        super();
        
        this.name = "Geodesic Stochastic Spheres";
        this.colourMode = 7;
        this.currentVariant = 0;
        
        this.animationBounds = [-1, 1, -1, 1, -1, 1];
        this.animationsColour = 4;
        this.animations = [0, 1, 2, 3, 0];
        this.frames = [200, 200, 200, 200];

        this.variants = [
            { params: [0.84, 0.19, 2.4, 0] },
            { params: [0.9, 0.08, 2.4, 1] },
            { params: [0.9, 0.08, 1.8, 1] }
        ];

        this.animationVariants = [
            { params: [0.84, 0.19, 1.8, 0] },
            { params: [0.8, 0.19, 3, 0] },
            { params: [0.84, 0.1, 2.7, 0] },
            { params: [0.1, 0.23, 2.7, 0] },
        ];
    }

    field(x, y, z, params) {
        const R = params[0];
        const blobSize = (params[1] !== undefined) ? params[1] : 0.18;
        const coreRadius = R * blobSize;
        const coreMaxDistSq = coreRadius * coreRadius;
        
        const connectionReach = (params[2] !== undefined) ? params[2] : 1.8;
        const influenceRadius = coreRadius * connectionReach;
        const maxDistSq = influenceRadius * influenceRadius;
        
        const useDense = (params[3] !== undefined && params[3] >= 1);
        const bxArr = useDense ? bumps300X : bumps50X;
        const byArr = useDense ? bumps300Y : bumps50Y;
        const bzArr = useDense ? bumps300Z : bumps50Z;
        const activeCount = useDense ? count300 : count50;
        
        const rSq = x * x + y * y + z * z;
        const r = Math.sqrt(rSq);
        
        const outerLimit = R + influenceRadius;
        const innerLimit = R - influenceRadius;
        if (r > outerLimit || (r < innerLimit && r > influenceRadius)) {
            return 1.0;
        }
        
        let field = 0;
        
        for (let i = 1; i < activeCount - 1; i++) {
            const bx = R * bxArr[i];
            const by = R * byArr[i];
            const bz = R * bzArr[i];
        
            const distX = x - bx;
            const distY = y - by;
            const distZ = z - bz;
            const dSq = distX * distX + distY * distY + distZ * distZ;
        
            if (dSq < maxDistSq) {
                const d = Math.sqrt(dSq);
                
                if (dSq < coreMaxDistSq) {
                    const hCore = 1.0 - (d / coreRadius);
                    field += hCore * hCore * (3.0 - 2.0 * hCore);
                }
                
                if (connectionReach > 1.0 && d < influenceRadius) {
                    const hBridge = 1.0 - (d / influenceRadius);
                    const bridgeProfile = hBridge * hBridge; 
                    const tensionFactor = 0.55 * (connectionReach - 0.8);
                    field += bridgeProfile * tensionFactor;
                }
            }
        }
        
        const threshold = 0.35;
        return threshold - field;
    }
}