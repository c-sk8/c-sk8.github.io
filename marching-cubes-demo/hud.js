// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	getColourModeName,  getColourModeIndexString} from './colour-modes.js';
import { 	getFieldFunctionName, getSurfaceIndexString,
			getSurfaceVariantIndexString } from './field-functions.js';

export function updateHUD() {
    document.getElementById("surfaceIndex").textContent = getSurfaceIndexString();
    document.getElementById("surfaceName").textContent = getFieldFunctionName();
    document.getElementById("variantIndex").textContent = getSurfaceVariantIndexString();
    document.getElementById("colourModeIndex").textContent = getColourModeIndexString();
    document.getElementById("colourMode").textContent = getColourModeName();
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