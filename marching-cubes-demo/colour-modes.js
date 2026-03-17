export let currentColourMode = 0;
let z_cubes = 100; // This should match the size of the marching cubes grid

export function setColourGridSize(marching_grid_size) {
	z_cubes = marching_grid_size;
}

export function incrementColourMode() {
	currentColourMode = (currentColourMode + 1) % colourModeFunctions.length;
}

export function decrementColourMode() {
	currentColourMode--;
    if (currentColourMode < 0)
    	currentColourMode = colourModeFunctions.length - 1;
}

export function getColourModeName() {
	return colourModeFunctions[currentColourMode].name;
}

export function colourModeFunction(x, y, z) {
	return colourModeFunctions[currentColourMode].fn(x,y,z);
}

export function CheckerPattern(x, y, z, r, g, b) {
    const xOdd = x & 1;
    const yOdd = y & 1;
    const zOdd = z & 1;
    
    const delta_r = r * 0.05;
    const delta_g = g * 0.05;
    const delta_b = b * 0.05;

    if (zOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    }

    if (yOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    } else {
        r -= delta_r;
        g -= delta_g;
        b -= delta_b;
    }

    if (xOdd) {
        r += delta_r;
        g += delta_g;
        b += delta_b;
    } else {
        r -= delta_r;
        g -= delta_g;
        b -= delta_b;
    }

    return { r: r, g: g, b: b };
}

function hslToRgb01(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (h * 360) / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (hp < 1) { r = c; g = x; }
    else if (hp < 2) { r = x; g = c; }
    else if (hp < 3) { g = c; b = x; }
    else if (hp < 4) { g = x; b = c; }
    else if (hp < 5) { r = x; b = c; }
    else { r = c; b = x; }

    return {
        r: r + m,
        g: g + m,
        b: b + m
    };
}

export function HueContours(x, y, z, h, s, l) {

	let lightness = l;
	const delta = 0.04;

	const period = 10;

	let m = y % period;
	if (m < 0) m += period; // handle negative values

	let d = Math.min(m, period - m); // distance from nearest contour

	if (d <= 4) {
		lightness += delta * (5 - d);
	}

	const rgb_col = hslToRgb01(h - (z/(z_cubes * 5)), s, lightness);

	return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function Contours(x, y, z, h, s, l) {

	let lightness = l;
	const delta = 0.04;

	const period = 10;

	let m = y % period;
	if (m < 0) m += period; // handle negative values

	let d = Math.min(m, period - m); // distance from nearest contour

	if (d <= 4) {
		lightness += delta * (5 - d);
	}

	const rgb_col = hslToRgb01(h, s, lightness);

	return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function AquaStripes(x, y, z) {
	let lightness = 0.43;
	if(z % 2) lightness = 0.39;

	const rgb_col = hslToRgb01(0.6 - (z/(z_cubes * 5)), 0.95, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function GreenHueStripes(x, y, z) {
	let lightness = 0.43;
	if(z % 2) lightness = 0.39;

	const rgb_col = hslToRgb01(0.1 + (z/(z_cubes * 5)), 0.7, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function WarmStripes(x, y, z) {
	let lightness = 0.3;
	if(z % 2) lightness = 0.28;

	const rgb_col = hslToRgb01(-0.02 + (z/(z_cubes * 10)), 0.95, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export function MoveStripes(x, y, z) {
	let lightness = 0.4;
	if(z % 2) lightness = 0.37;

	const rgb_col = hslToRgb01(0.6 + (z/(z_cubes * 4)), 0.6, lightness);

    return { r: rgb_col.r, g: rgb_col.g, b: rgb_col.b };
}

export const colourModeFunctions = [
    {
    	name: "Aqua Stripes",
		fn: AquaStripes
    },
    {
    	name: "Spring Green Stripes",
		fn: GreenHueStripes
    },
    {
    	name: "Warm Stripes",
		fn: WarmStripes
    },
    {
    	name: "Move Stripes",
		fn: MoveStripes
    },
    {
    	name: "Orange Checker",
		fn: (x, y, z) => CheckerPattern(x, y, z, 0.85, 0.15, 0.0)
    },
    {
    	name: "Blue Checker",
    	fn: (x, y, z) => CheckerPattern(x, y, z, 0.1, 0.3, 0.9)
    },
    {
    	name: "Green Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.14, 0.8, 0.2)
    },
    {
    	name: "Blue Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.55, 1, 0.2)
    },
    {
    	name: "Orange Contours",
		fn: (x, y, z) => Contours(x, y, z, 0.02, 1, 0.2)
    },
    {
    	name: "Cyan To Purple Contours",
		fn: (x, y, z) => HueContours(x, y, z, 0.7, 0.7, 0.2)
    },
    {
    	name: "Green To Yellow Contours",
		fn: (x, y, z) => HueContours(x, y, z, 0.3, 0.7, 0.2)
    }
]
