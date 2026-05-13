// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	rebuildSurface, toggleFlatShading,
			initialiseGeometry, destroyGeometry} from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	zoomIn, zoomOut, resetRotationVelocity,
			set_X_RotationVelocity, set_Y_RotationVelocity,
			isUpsideDown,
			set_X_TargetRotationVelocity, get_X_TargetRotationVelocity,
			set_Y_TargetRotationVelocity, get_Y_TargetRotationVelocity,
			set_Z_TargetRotationVelocity, get_Z_TargetRotationVelocity,
			} from './animate.js';
import {	getNextFieldIndex, getPreviousFieldIndex,
			nextVariant, previousVariant,
			nextColourMode, previousColourMode } from './field-functions-manager.js';
import { 	updateHUD } from './hud.js';
import {	getColourModeCount } from './colour-modes.js';

let animateSurfaceGeneration = true;
export let fieldIndex = 0;

function toggleAnimateSurfaceGeneration() {
	animateSurfaceGeneration = !animateSurfaceGeneration;
}

// ============================================================
//	Handle button presses
// ============================================================

document.getElementById("hideControls").onclick = () => {
    const hud = document.getElementById('hud');
    const controls = document.getElementById('controls');
    const hiddencontrols = document.getElementById('hiddencontrols');
	hud.classList.toggle('hidden');
	controls.classList.toggle('hidden');
	hiddencontrols.classList.toggle('hidden');
}

document.getElementById("showControls").onclick = () => {
    const hud = document.getElementById('hud');
    const controls = document.getElementById('controls');
    const hiddencontrols = document.getElementById('hiddencontrols');
	hud.classList.toggle('hidden');
	controls.classList.toggle('hidden');
	hiddencontrols.classList.toggle('hidden');
}

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

const xRotationButton = document.getElementById("xRotation");
const yRotationButton = document.getElementById("yRotation");
const zRotationButton = document.getElementById("zRotation");

xRotationButton.onclick = () => {
	const x_trv = get_X_TargetRotationVelocity();
	if(x_trv == 0) {
		set_X_TargetRotationVelocity(1.5);
		xRotationButton.classList.add('is-active');
	}
	else {
		set_X_TargetRotationVelocity(0);
		xRotationButton.classList.remove('is-active');
	}	
}

yRotationButton.onclick = () => {
	const y_trv = get_Y_TargetRotationVelocity();
	if(y_trv == 0) {
		set_Y_TargetRotationVelocity(1.5);
		yRotationButton.classList.add('is-active');
	}
	else {
		set_Y_TargetRotationVelocity(0);
		yRotationButton.classList.remove('is-active');
	}	
}

zRotationButton.onclick = () => {
	const z_trv = get_Z_TargetRotationVelocity();
	if(z_trv == 0) {
		set_Z_TargetRotationVelocity(1.5);
		zRotationButton.classList.add('is-active');
	}
	else {
		set_Z_TargetRotationVelocity(0);
		zRotationButton.classList.remove('is-active');
	}	
}

// ============================================================
//	Handle key presses
// ============================================================

const buttons = [
    document.getElementById("num1"),
    document.getElementById("num2"),
    document.getElementById("num3"),
    document.getElementById("num4")
];

window.addEventListener('keydown', (e) => {

	const index = parseInt(e.key, 10) - 1;

    // Only handle keys 1–4
    if (index >= 0 && index < buttons.length) {
        const selectedButton = buttons[index];

        // Toggle active class
        buttons.forEach(btn => btn.classList.remove('is-active'));
        selectedButton.classList.add('is-active');

        // Rebuild geometry
        destroyGeometry();
        setGridSize(parseInt(selectedButton.dataset.size));
        initialiseGeometry();
        rebuildSurface(fieldIndex, animateSurfaceGeneration);
    }
    
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
    const hiddencontrols = document.getElementById('hiddencontrols');

    window.addEventListener('keydown', (event) => {
        // Check if the pressed key is "h" or "H"
        if (event.key.toLowerCase() === 'h') {
            hud.classList.toggle('hidden');
            controls.classList.toggle('hidden');
            hiddencontrols.classList.toggle('hidden');
        }
    });
}

// ============================================================
//	Handle touch
// ============================================================

let rotX = 0;
let rotY = 0;

let lastX = 0;
let lastY = 0;

window.addEventListener("touchstart", e => {
	const touch = e.touches[0];
	lastX = touch.clientX;
	lastY = touch.clientY;
});

window.addEventListener("touchmove", e => {

	e.preventDefault();

	const touch = e.touches[0];

	const dx = touch.clientX - lastX;
	const dy = touch.clientY - lastY;

	const rotY = isUpsideDown()
		? -dx
		:  dx;

	const rotX = dy;

	set_X_RotationVelocity(rotX);
	set_Y_RotationVelocity(rotY);

	lastX = touch.clientX;
	lastY = touch.clientY;

}, { passive: false });

// ============================================================
//	Handle mouse and trackpad
// ============================================================

let dragging = false;

window.addEventListener("mousedown", e => {

	dragging = true;

	lastX = e.clientX;
	lastY = e.clientY;

});

window.addEventListener("mousemove", e => {

	if (!dragging) return;

	const dx = e.clientX - lastX;
	const dy = e.clientY - lastY;

	let rotY = isUpsideDown() ? -dx :  dx;
	let rotX = dy;

	const MAX_SPEED = 50;
	
	rotX = Math.max(-MAX_SPEED,
		Math.min(MAX_SPEED, rotX));
	
	rotY = Math.max(-MAX_SPEED,
		Math.min(MAX_SPEED, rotY));
	
	set_X_RotationVelocity(rotX);
	set_Y_RotationVelocity(rotY);

	lastX = e.clientX;
	lastY = e.clientY;

});

window.addEventListener("mouseup", () => {

	dragging = false;

});


// Initialize the listener
setupHUDToggle();
