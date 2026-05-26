// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	fieldIndex } from './event-process.js';
import {	getColourModeName,  getColourModeIndexString} from './colour-modes.js';
import {	getFieldIndexString, getFieldName, getVariantIndexString, getColourMode }
		 from './field-functions-manager.js';

export function updateHUD() {
    document.getElementById("surfaceName").textContent = getFieldName(fieldIndex);
    document.getElementById("colourMode").textContent = getColourModeName(getColourMode(fieldIndex));

    //document.getElementById("surfaceIndex").textContent = getFieldIndexString(fieldIndex);
    //document.getElementById("variantIndex").textContent = getVariantIndexString(fieldIndex);
    //document.getElementById("colourModeIndex").textContent = getColourModeIndexString(getColourMode(fieldIndex));
}

function formatVertices(count) {
    return Math.round(count / 1000) + 'K';
}
export function updateVertexCount(vertexCount) {
	document.getElementById("vertexCount").textContent = formatVertices(vertexCount);
}

export function updateSurfaceGenerationTime(duration) {
	document.getElementById("surfGenTime").textContent = `${duration.toFixed(0)} ms`;
}

export function clearSurfaceGenerationTime() {
	document.getElementById("surfGenTime").textContent = "";
}