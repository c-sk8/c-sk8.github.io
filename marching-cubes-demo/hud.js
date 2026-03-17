import { getColourModeName } from './colour-modes.js';
import { getFieldFunctionName } from './field-functions.js';

export function updateHUD() {
    document.getElementById("surfaceName").textContent = getFieldFunctionName();
    document.getElementById("colourMode").textContent = getColourModeName();
    //document.getElementById("vertexCount").textContent = verticesArray.length / 3;
}

export function updateVertexCount(vertexCount) {
	document.getElementById("vertexCount").textContent = vertexCount;
}

export function updateSurfaceGenerationTime(duration) {
	document.getElementById("surfGenTime").textContent = `${duration.toFixed(0)} ms`;
}

export function clearSurfaceGenerationTime() {
	document.getElementById("surfGenTime").textContent = "";
}