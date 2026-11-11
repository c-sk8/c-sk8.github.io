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

export class InfoBox {
	
    constructor() {
	}
	
	formatVertices(count) {
    	return Math.round(count / 1000) + 'K';
	}

	setColourModeName(str) {
    	colour_mode.textContent = str;
	}

	setVertexCount(count) {
		vertex_count.textContent = this.formatVertices(count);
	}

	setTime(time) {
		performance_time.textContent = `${time.toFixed(0)} ms`;
	}

	clearTime() {
		performance_time.textContent = "";
	}
	
	setSamplingDimensions(str) {
    	sampling_dimensions.textContent = str;
	}
	
	setSurfaceName(str) {
		surface_name.textContent = str;
	}
}

export let info_box = new InfoBox();