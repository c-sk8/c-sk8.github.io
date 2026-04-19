// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	rebuildSurface, toggleFlatShading,
			initialiseGeometry, destroyGeometry} from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	zoomIn, zoomOut, resetRotationVelocity } from './animate.js';
import {	getNextFieldIndex, getPreviousFieldIndex,
			nextVariant, previousVariant,
			nextColourMode, previousColourMode } from './field-functions-manager.js';
import { 	updateHUD } from './hud.js';
import {	getColourModeCount } from './colour-modes.js';

let animateSurfaceGeneration = false;
export let fieldIndex = 0;

function toggleAnimateSurfaceGeneration() {
	animateSurfaceGeneration = !animateSurfaceGeneration;
}

// ============================================================
//	Handle button presses
// ============================================================

document.getElementById("nextSurface").onclick = () => {
    resetRotationVelocity();
    fieldIndex = getNextFieldIndex(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

document.getElementById("prevSurface").onclick = () => {
    resetRotationVelocity();
    fieldIndex = getPreviousFieldIndex(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

document.getElementById("nextVariant").onclick = () => {
    nextVariant(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

document.getElementById("prevVariant").onclick = () => {
    previousVariant(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

document.getElementById("prevColour").onclick  = () => {
	previousColourMode(fieldIndex, getColourModeCount());
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

document.getElementById("nextColour").onclick  = () => {
	nextColourMode(fieldIndex, getColourModeCount());
    updateHUD();
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
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
	rebuildSurface(fieldIndex, animateSurfaceGeneration);
}

const animateSurfaceGenerationButton = document.getElementById("animateSurfaceGeneration");

animateSurfaceGenerationButton.onclick  = () => {
	toggleAnimateSurfaceGeneration();
	if(animateSurfaceGeneration) animateSurfaceGenerationButton.classList.add('is-active');
	else animateSurfaceGenerationButton.classList.remove('is-active');
	if(animateSurfaceGeneration) rebuildSurface(fieldIndex, animateSurfaceGeneration);
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
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
    };
});

// ============================================================
//	Handle key presses
// ============================================================

window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') {
		resetRotationVelocity();
		fieldIndex = getNextFieldIndex(fieldIndex);
		updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
    }

    if (e.key === 'ArrowLeft') {
		resetRotationVelocity();
		fieldIndex = getPreviousFieldIndex(fieldIndex);
		updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
    }

	if (e.key === "ArrowUp") {
    	nextVariant(fieldIndex);
    	updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

	if (e.key === "ArrowDown") {
		previousVariant(fieldIndex);
		updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

	if (e.key === "]") {
		nextColourMode(fieldIndex, getColourModeCount());
		updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

	if (e.key === "[") {
		previousColourMode(fieldIndex, getColourModeCount());
		updateHUD();
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

	if (e.key === "/") {
		const active = toggleFlatShading();
		if(active) flatShadingButton.classList.add('is-active');
		else flatShadingButton.classList.remove('is-active');
		rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

	if (e.key === "\\") {
		toggleAnimateSurfaceGeneration();
		if(animateSurfaceGeneration) animateSurfaceGenerationButton.classList.add('is-active');
		else animateSurfaceGenerationButton.classList.remove('is-active');
		if(animateSurfaceGeneration) rebuildSurface(fieldIndex, animateSurfaceGeneration);
	}

    if (e.key === "+" || e.key === "w") zoomIn();
    if (e.key === "-" || e.key === "s") zoomOut();

});

function setupHUDToggle() {
    const hud = document.getElementById('hud');
    const controls = document.getElementById('controls');

    window.addEventListener('keydown', (event) => {
        // Check if the pressed key is "h" or "H"
        if (event.key.toLowerCase() === 'h') {
            hud.classList.toggle('hidden');
            controls.classList.toggle('hidden');
        }
    });
}

// Initialize the listener
setupHUDToggle();
