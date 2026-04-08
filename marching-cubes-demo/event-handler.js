// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	rebuildSurface, toggleFlatShading, initialiseGeometry, destroyGeometry} from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	incrementFieldFunction, decrementFieldFunction,
			incrementFFVariant, decrementFFVariant} from './field-functions.js';
import {	incrementColourMode, decrementColourMode } from './colour-modes.js';
import {	zoomIn, zoomOut, resetRotationVelocity } from './animate.js';

let animateSurfaceGeneration = false;

function toggleAnimateSurfaceGeneration() {
	animateSurfaceGeneration = !animateSurfaceGeneration;
}

// ============================================================
//	Handle button presses
// ============================================================

document.getElementById("nextSurface").onclick = () => {
    incrementFieldFunction();
    resetRotationVelocity();
	rebuildSurface(animateSurfaceGeneration);
}

document.getElementById("prevSurface").onclick = () => {
    decrementFieldFunction();
    resetRotationVelocity();
	rebuildSurface(animateSurfaceGeneration);
}

document.getElementById("nextVariant").onclick = () => {
    incrementFFVariant();
	rebuildSurface();
}

document.getElementById("prevVariant").onclick = () => {
    decrementFFVariant();
	rebuildSurface();
}

document.getElementById("prevColour").onclick  = () => {
	decrementColourMode();
	rebuildSurface();
}

document.getElementById("nextColour").onclick  = () => {
	incrementColourMode();
	rebuildSurface();
}

document.getElementById("zoomIn").onclick  = () => {
	zoomIn();
}

document.getElementById("zoomOut").onclick  = () => {
	zoomOut();
}

const flatShadingButton = document.getElementById("flatShading");

flatShadingButton.onclick  = () => {
	const active = toggleFlatShading();
	if(active) flatShadingButton.classList.add('is-active');
	else flatShadingButton.classList.remove('is-active');
	rebuildSurface();
}

const animateSurfaceGenerationButton = document.getElementById("animateSurfaceGeneration");

animateSurfaceGenerationButton.onclick  = () => {
	toggleAnimateSurfaceGeneration();
	if(animateSurfaceGeneration) animateSurfaceGenerationButton.classList.add('is-active');
	else animateSurfaceGenerationButton.classList.remove('is-active');
	if(animateSurfaceGeneration) rebuildSurface(animateSurfaceGeneration);
}

// 1. Grab all buttons with the common class
const sizeButtons = document.querySelectorAll('.size-btn');

sizeButtons.forEach(button => {
    button.onclick = () => {
        // 2. Remove 'is-active' from ALL buttons in the group
        sizeButtons.forEach(btn => btn.classList.remove('is-active'));
        
        // 3. Add 'is-active' only to the one we clicked
        button.classList.add('is-active');

        // 4. Get the size value from the data attribute (convert string to number)
        const size = parseInt(button.dataset.size);

        // 5. Run your shared geometry logic once
        destroyGeometry();
        setGridSize(size);
        initialiseGeometry();
        rebuildSurface();
    };
});

// ============================================================
//	Handle key presses
// ============================================================

window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') {
        incrementFieldFunction();
        resetRotationVelocity();
        rebuildSurface(animateSurfaceGeneration);
    }

    if (e.key === 'ArrowLeft') {
    	decrementFieldFunction();
        resetRotationVelocity();
        rebuildSurface(animateSurfaceGeneration);
    }

	if (e.key === "ArrowUp") {
		incrementFFVariant();
    	rebuildSurface();
	}

	if (e.key === "ArrowDown") {
  		decrementFFVariant();
	    rebuildSurface();
	}

	if (e.key === "]") {
		incrementColourMode();
    	rebuildSurface();
	}

	if (e.key === "[") {
  		decrementColourMode();
	    rebuildSurface();
	}

	if (e.key === "/") {
		const active = toggleFlatShading();
		if(active) flatShadingButton.classList.add('is-active');
		else flatShadingButton.classList.remove('is-active');
		rebuildSurface();
	}

	if (e.key === "\\") {
		toggleAnimateSurfaceGeneration();
		if(animateSurfaceGeneration) animateSurfaceGenerationButton.classList.add('is-active');
		else animateSurfaceGenerationButton.classList.remove('is-active');
		if(animateSurfaceGeneration) rebuildSurface(animateSurfaceGeneration);
	}

    if (e.key === "+" || e.key === "w") zoomIn();
    if (e.key === "-" || e.key === "s") zoomOut();

});
