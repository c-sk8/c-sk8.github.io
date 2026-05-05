// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

// Pre-calculate constants for efficiency
const SQRT3 = Math.sqrt(3);
const TWO_PI = 2 * Math.PI;

// =====================================================================================

function slowSmoothUnion(a, b, k) {
    return -Math.log(Math.exp(-k*a) + Math.exp(-k*b)) / k;
}

function fastSmoothUnion(a, b, k) {
    // Calculate how much the two surfaces "overlap" based on smoothing factor k
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    
    // Result is the linear minimum minus a quadratic smoothing term
    return Math.min(a, b) - h * h * k * (1.0 / 4.0);
}

function smoothMin(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * h * k * (1.0/6.0);
}

function smoothMax(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.max(a, b) + h*h*h * k * (1/6);
}

// Pre-calculate the points as a Float32Array for better cache performance
const bumpsCount = 23;
const bumpsX = new Float32Array(bumpsCount);
const bumpsY = new Float32Array(bumpsCount);
const bumpsZ = new Float32Array(bumpsCount);

// Initialize once
(function initBumps() {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < bumpsCount; i++) {
        const y = 1 - (i / (bumpsCount - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        bumpsX[i] = Math.cos(theta) * r;
        bumpsY[i] = y;
        bumpsZ[i] = Math.sin(theta) * r;
    }
})();

// =====================================================================================

export function Decocube (x, y, z, params) {

	const scale = params[0];
	const shape = params[1];
	const thickness = params[2];
	
    x *= scale;
    y *= scale;
    z *= scale;

	return	( (x*x+y*y-shape)**2 + (z*z-1)**2 ) *
			( (y*y+z*z-shape)**2 + (x*x-1)**2 ) *
			( (z*z+x*x-shape)**2 + (y*y-1)**2 ) - thickness;
};

export function Tooth (x, y, z, params) {

	const scale = params[0];
	const thickness = params[1];

    x *= scale;
    y *= scale;
    z *= scale;

	return ((2 * (x**4 + y**4 + z**4)) - (2 * (x**2 + y**2 + z**2))) + thickness;
};

export function SuperSphere(x, y, z, params) {

	const scale = params[0];
	const power = params[1];
	
	x *= scale;
	y *= scale;
	z *= scale;
	
	return (x**2)**power + (y**2)**power + (z**2)**power - 0.3;
}

export function GumdropTorus(x, y, z, params) {

	const scale = params[0];
	const modifier = params[1];

	x *= scale;
	y *= scale;
	z *= scale;
	
	const x2 = x*x;
	const y2 = y*y;
	const z2 = z*z; 

    return (
        4 * x2 * x2 +
        4 * y2 * y2 +
        8 * y2 * z2 +
        4 * z2 * z2 +
        17 * x2 * y2 +
        17 * x2 * z2 -
        20 * x2 -
        20 * y2 -
        20 * z2 +
        modifier
    );
}

export function SinusoidalSphere(x, y, z, params) {

	const scale = params[0];
	const amplitude = params[1];
	const xfrequency = params[2];
	const yfrequency = params[3];
	const zfrequency = params[4];

    let r2 = x*x + y*y + z*z;
    return	r2 - scale + amplitude *
    		Math.sin(xfrequency * x) *
    		Math.sin(yfrequency * y) *
    		Math.sin(zfrequency * z);
}

export function ChairSurface(x, y, z, params) {

	const k = params[0]; // scale
	const a = params[1]; // thickness
	const b = params[2]; // form
	
	const x2 = x * x;
	const y2 = y * y;

    // First part: (x^2 + y^2 + z^2 - a * k^2)^2
    const sphereTerm = Math.pow(x2 + y2 + z * z - a * k * k, 2);

    // Second part: b * [(z - k)^2 - 2x^2] * [(z + k)^2 - 2y^2]
    const chairTerm = b * ((z - k)**2 - 2 * x2) * ((z + k)**2 - 2 * y2);

    return sphereTerm - chairTerm;
}

export function GeodesicPointsSphereOptimized(x, y, z, params) {
    const R = params[0];
    const bump_depth = params[1];
    
    const rSq = x * x + y * y + z * z;
    const r = Math.sqrt(rSq) + 1e-6;

    // Normalized direction
    const invR = 1.0 / r;
    const dx = x * invR;
    const dy = y * invR;
    const dz = z * invR;

    let field = 0;

    for (let i = 1; i < bumpsCount - 1; i++) {
        // Dot product: range [-1, 1]
        const dot = dx * bumpsX[i] + dy * bumpsY[i] + dz * bumpsZ[i];

        // 1. Thresholding: If the dot product is low, the bump has no effect.
        // This is the biggest speedup. 
        if (dot > 0.5) { 
            // 2. Algebraic Falloff: (dot)^power is much faster than exp()
            // We use (dot - 0.5) * 2 to remap [0.5, 1.0] to [0.0, 1.0]
            let h = (dot - 0.5) * 2.0;
            
            // h^4 or h^8 provides a very similar "sharp" peak to exp
            const h2 = h * h;
            const h4 = h2 * h2;
            field -= h4 * h4 * h4 * h4; // This is h^8
        }
    }

    return r - (R - bump_depth * field);
}

export function TwistedWaveTorus(x, y, z, params) {
	
	const scale = params[0];
	const m = params[1];	// twist factor
    const A = params[2];	// wave amplitude
	
    x *= scale;
    y *= scale;
    z *= scale;

    const R = 1.5;		// major radius
    const r = 0.6;		// base tube radius
    const n = 6.0;		// waves around tube

    // Distance from Y axis
    let radial = Math.sqrt(x*x + z*z);

    // Angle around torus ring
    let theta = Math.atan2(z, x);

    // Local tube coordinates
    let dx = radial - R;
    let phi = Math.atan2(y, dx);

    // Twisted wave modulation
	let wave = A * Math.sin(n * phi + m * theta) + 0.1 * Math.cos(2.0 * theta);

    // Final implicit field
    return dx*dx + y*y - (r + wave)*(r + wave);
}

export function MoebiusStrip(x, y, z, params) {

    const scale = params[0];
    const k = params[1]; // Twist count
    const a = params[2]; // Height/Thickness
    const b = params[3]; // Width
        
    x *= scale;
    y *= scale;
    z *= scale;

    const r = Math.sqrt(x * x + y * y);
    const phi = Math.atan2(y, x);
    
    // Rotation of the square cross-section
    const psi = (k / 2) * phi;
    const cosPsi = Math.cos(psi);
    const sinPsi = Math.sin(psi);
    
    const tMinus1 = r - 3.0;
    
    // Local rotated coordinates
    const rotatedX = cosPsi * tMinus1 + sinPsi * z;
    const rotatedZ = -sinPsi * tMinus1 + cosPsi * z;

    // SQUARE LOGIC:
    // We use a "Superellipse" (L-p norm) formula. 
    // An exponent of 4-6 creates rounded corners. 
    // An exponent of 10+ creates a very sharp square.
    const p = 3.5; 
    
    const componentX = Math.pow(Math.abs(rotatedX / b), p);
    const componentZ = Math.pow(Math.abs(rotatedZ / a), p);
    
    // Resulting field: 0 is the surface
    return componentX + componentZ - 1.0;
	//return Math.tanh(componentX + componentZ - 1.0);
}

export function AlgebraicSurface(x, y, z, params) {

	const scale = params[0];
	const form_mq = params[1];
	const form_tp = params[2];
	const form_q = params[3];
	const thickness = params[4];

    x *= scale;
    y *= scale;
    z *= scale;

    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;

    const term1 = (x2 - 4) * (x2 - 4);
    const term2 = (y2 - 4) * (y2 - 4);
    const term3 = (z2 - 4) * (z2 - 4);

    const mixedQuartic =
        form_mq * (x2 * y2 + x2 * z2 + y2 * z2);

    const tripleProduct =
        form_tp * x * y * z;

    const quadratic =
        -form_q * (x2 + y2 + z2);

    return (
        term1 +
        term2 +
        term3 +
        mixedQuartic +
        tripleProduct +
        quadratic +
        thickness
    );
}

export function SurfacePattern(x, y, z, params) {
	
	const horizontal_scale = params[0];
	const vertical_scale = params[1];
	
    let sx = x * horizontal_scale;
    let sy = -y * vertical_scale;
    let sz = z * horizontal_scale;
	
	const surface_top =	Math.cos(sx) * Math.cos(sz) +
			Math.cos((SQRT3*sx-sz)/2) * Math.cos((sx + SQRT3 * sz)/2) +
			Math.cos((SQRT3*sx+sz)/2) * Math.cos((sx - SQRT3 * sz)/2) + sy + 6;

    return surface_top;
}

export function BlobRing(x, y, z, params) {
    const scale = params[0];
    const ringRadius = params[1];
    const sharpness = 7;
    const blobCount = 8;
    const angleStep = TWO_PI / blobCount;

    x *= scale; y *= scale; z *= scale;

    const angle = Math.atan2(z, x);
    const radius = Math.sqrt(x * x + z * z);
    
    // Find the relative angle within the local wedge
    const localAngle = ((angle % angleStep) + angleStep) % angleStep - (angleStep / 2);
    
    let field = 0;

    // Sum 3 neighbors: The current wedge, one clockwise, one counter-clockwise
    // This provides the "gooey" overlap without looping through all 8 blobs.
    for (let i = -1; i <= 1; i++) {
        const neighborAngle = localAngle + (i * angleStep);
        
        const px = Math.cos(neighborAngle) * radius;
        const pz = Math.sin(neighborAngle) * radius;

        const dx = px - ringRadius;
        const dz = pz;
        
        const distSq = dx * dx + y * y + dz * dz;
        //field += Math.exp(-sharpness * distSq);
		if (distSq < 0.5) {
		    const f = 1.0 - distSq * 2.0; 
		    field += f * f * f; 
		}
    }

    return field - 0.6;
}

export function PiriformDiabolo(x, y, z, params) {
	
	const scale = params[0];
	const dist_apart = params[1];
	const twist = params[2];
	
    x *= scale;
    y *= scale;
    z *= scale;

	const r2 = Math.sqrt(y*y + z*z) * (1 + twist * Math.sin(4 * Math.atan2(z, y) + 3 * x));
	const yz = r2 * r2;
	
    let x1 = x + dist_apart;
    let surface1 = (16 * yz) - (2 * x1 * x1 * x1 * (4 - x1));

    let x2 = -(x - dist_apart);
    let surface2 = (16 * yz) - (2 * x2 * x2 * x2 * (4 - x2));

    return fastSmoothUnion(surface1, surface2, 20);
}

export function SuperSphereCluster(x, y, z, params) {

    const scale = params[0];
    const p = params[1];
    const ext = params[2]; 

    x *= scale;
    y *= scale;
    z *= scale;

    // Helper for a single supersphere shape
    const shape = (tx, ty, tz, s) => {
        const nx = tx * s;
        const ny = ty * s;
        const nz = tz * s;
        return (nx**2)**p + (ny**2)**p + (nz**2)**p - 0.3;
    };

    // 1. Central Cube
    let field = shape(x, y, z, 1.5);

    // 2. Side Cubes (Emerging from 4 sides)
    // We offset them based on the 'ext' parameter
    const offset = 0.3 * (ext + 1);
    const sideScale = 2.5; // Making them slightly smaller

    // Four sides: +X, -X, +Z, -Z
    const s1 = shape(x - offset, y, z, sideScale);
    const s2 = shape(x + offset, y, z, sideScale);
    const s3 = shape(x, y, z - offset, sideScale);
    const s4 = shape(x, y, z + offset, sideScale);
    const s5 = shape(x, y - offset, z, sideScale);
    const s6 = shape(x, y + offset, z, sideScale);

    field = smoothMin(field, s1, 0.4);
    field = smoothMin(field, s2, 0.4);
    field = smoothMin(field, s3, 0.4);
    field = smoothMin(field, s4, 0.4);
    field = smoothMin(field, s5, 0.4);
    field = smoothMin(field, s6, 0.4);

    return field;
}

export function Tetrahedral(x, y, z, params) {
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
        10.2 * x**2 -
        10.2 * y**2 -
        10.2 * z**2 +
        thickness
    );
}

export function TorusXY(x, y, z, R = 0.7, r = 0.2) {
    // R = major radius (center to tube center)
    // r = minor radius (tube radius / thickness)
    const q = Math.sqrt(x**2 + y**2) - R;
    return Math.sqrt(q**2 + z**2) - r;
}

export function TorusXZ(x, y, z, R = 0.7, r = 0.2) {
    // R = major radius (center to tube center)
    // r = minor radius (tube radius / thickness)
    const q = Math.sqrt(x**2 + z**2) - R;
    return Math.sqrt(q**2 + y**2) - r;
}

export function TorusYZ(x, y, z, R = 0.7, r = 0.2) {
    // R = major radius (center to tube center)
    // r = minor radius (tube radius / thickness)
    const q = Math.sqrt(y**2 + z**2) - R;
    return Math.sqrt(q**2 + x**2) - r;
}

export function ThreeTori(x, y, z, params ) { 

	const scale = params[0];
	const major_radius = params[1];
	const tube_radius = params[2];
	const blend_factor = params[3];
	
    x *= scale;
    y *= scale;
    z *= scale;

    // Six tori (positive & negative directions implicitly covered)
    const f1 = TorusXY(x, y, z, major_radius, tube_radius);
    const f2 = TorusXZ(x, y, z, major_radius, tube_radius);
    const f3 = TorusYZ(x, y, z, major_radius, tube_radius);

    let field = smoothMin(f1, f2, blend_factor);
    field = smoothMin(field, f3, blend_factor);

    return field;
}

export function RadialWaveSphere(x, y, z, params ) {

	const cylinderRadius = params[0];

    const scale = 1.1;
    const baseRadius = 1;
    const radialFreq = 6;
    const angularFreq = 5;
    const amplitude = 0.25;
    const smoothness = 1;
    const twistAmount = 0;

    x *= scale;
    y *= scale;
    z *= scale;

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

export function FlattenedWavePattern(x, y, z, params) { //scale = 12, flatness = 2.0) {

	const scale = params[0];
	const flatness = params[1];
	
    x *= scale;
    y *= scale;
    z *= scale;
	
    // 1. Calculate the raw interference pattern
    let wave = Math.cos(x) * Math.cos(z) +
               Math.cos((SQRT3 * x - z) / 2) * Math.cos((x + SQRT3 * z) / 2) +
               Math.cos((SQRT3 * x + z) / 2) * Math.cos((x - SQRT3 * z) / 2);

    // 2. Apply the "squash" (Hyperbolic Tangent)
    // We divide by the flatness after tanh to keep the scale consistent
    let squashedWave = Math.tanh(wave * flatness) / flatness;

    // 3. Combine with your vertical offset
    return (squashedWave + y);
}

export function SpheredSchwarzP(x, y, z, params) {

	const lattice_density = params[0]; // Higher values mean more, smaller holes
	const spherical_radius = params[1]; // Size of the final sphere
    const boundary_smoothness = params[2];
	const lattice_thickness = 0; // How 'thick' the walls of the tubes are

    // 1. Calculate distance from the origin (assuming 0,0,0 is center)
    // The marching cubes bounds must center the pattern.
    const distSq = (x * x) + (y * y) + (z * z);
    const distance = Math.sqrt(distSq);

    // 2. Generate the high-frequency networked lattice
    // We use high-frequency sine waves to create the texture.
    const frequency = lattice_density * TWO_PI;
    
    // A simplified field that approximates the periodic structure
    // (similar to P-surface but with density and scale)
    const raw_lattice_field = Math.cos(x * frequency) +
                              Math.cos(y * frequency) +
                              Math.cos(z * frequency);

    // 3. Create a clean boundary 'mask' for the sphere.
    // The mask is positive inside the sphere and negative outside.
    // We can use a smooth falloff function.
    
    // This function creates a value of 1.0 inside the radius, 
    // decaying smoothly to 0.0 outside, over a narrow region.
    const mask = 1.0 - Math.tanh((distance - spherical_radius) / boundary_smoothness);
    
    // 4. Final Field Combine: Apply Thickness and Mask
    // We can add thickness by biasing the field towards a specific isovalue,
    // and then apply the spherical boundary to 'cut' the pattern.
    
    // Adding thickness
    let surface_field = raw_lattice_field - (1.0 - lattice_thickness);

    // Apply the mask and shift for a final surface top, 
    // ensuring positive values are inside the final structure.
    const final_surface = (surface_field * mask) + 1.0; 
    
    return final_surface;
}

export function Rhombicuboctahedron(x, y, z, params) {

    const scale = params[0];
    const b = params[1];
    const c = params[2];
    const t = params[3];

    // Scale once
    x *= scale;
    y *= scale;
    z *= scale;

    // Precompute squares
    const x2 = x * x * 0.3;
    const y2 = y * y * 0.3;
    const z2 = z * z * 0.3;

    // Precompute (v - 1)^2 and (v + 1)^2 efficiently
    const xm1 = x - 1, xp1 = x + 1;
    const ym1 = y - 1, yp1 = y + 1;
    const zm1 = z - 1, zp1 = z + 1;

    const xpm = xm1 * xm1 * xp1 * xp1; // (x-1)^2 * (x+1)^2
    const ypm = ym1 * ym1 * yp1 * yp1;
    const zpm = zm1 * zm1 * zp1 * zp1;

    // Precompute shared sums
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

export function GyroidFloor(x, y, z, params) {
	
	const horizontal_scale = params[0];
	const vertical_scale = params[1];
	
    let sx = x * horizontal_scale;
    let sy = -y * vertical_scale;
    let sz = z * horizontal_scale;
	
	const gyroid = Math.sin(sx) * Math.cos(sy) + 
               Math.sin(sy) * Math.cos(sz) + 
               Math.sin(sz) * Math.cos(sx);
	const surface_top = gyroid + (sy * 0.5) + 2; 

    return surface_top;
}