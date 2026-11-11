// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

const surface_name = document.getElementById('surfaceName');
const colour_mode = document.getElementById('colourMode');
const sampling_dimensions = document.getElementById("cubes");
const vertex_count = document.getElementById("vertexCount");
const performance_time = document.getElementById("performanceTime");

export function updateHUD() {
    document.getElementById("surfaceName").textContent = getFieldName(fieldIndex);
    document.getElementById("colourMode").textContent = getColourModeName(getColourMode(fieldIndex));
	document.getElementById("cubes").textContent = sampling.getDimensionsString();
}

export function updateHUD_ColourName(colour_name) {
    colour_mode.textContent = colour_name;
}

function formatVertices(count) {
    return Math.round(count / 1000) + 'K';
}
export function updateVertexCount(vertexCount) {
	vertex_count.textContent = formatVertices(vertexCount);
}

export function updatePerformanceTime(duration) {
	performance_time.textContent = `${duration.toFixed(0)} ms`;
}

export function clearPerformanceTime() {
	performance_time.textContent = "";
}