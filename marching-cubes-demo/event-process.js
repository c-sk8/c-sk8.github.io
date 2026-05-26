// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	toggleFlatShading, rebuildSurface,
			initialiseGeometry, destroyGeometry } from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	getNextFieldIndex, getPreviousFieldIndex } from './field-functions-manager.js';
import { 	updateHUD } from './hud.js';
import {	nextVariant, previousVariant,
			nextColourMode, previousColourMode } from './field-functions-manager.js';
import {	set_X_RotationVelocity, set_Y_RotationVelocity,
			set_X_TargetRotationVelocity, get_X_TargetRotationVelocity,
			set_Y_TargetRotationVelocity, get_Y_TargetRotationVelocity,
			isUpsideDown, resetRotation } from './animate.js';
import {	getColourModeCount } from './colour-modes.js';

export let fieldIndex = 0;
export let animateGen = true; // animate surface generation

let xEnabled = false;
let yEnabled = false;

const hud = document.getElementById('hud');
const controls = document.getElementById('controls');
const hiddencontrols = document.getElementById('hiddencontrols');
const flatShadingButton = document.getElementById("flatShading");
const xRotationButton = document.getElementById("xRotation");
const yRotationButton = document.getElementById("yRotation");
const animateGenButton = document.getElementById("animateGen");
const sizeButtons = document.querySelectorAll('.size-btn');

export function toggleHideControls() {
	hud.classList.toggle('hidden');
	controls.classList.toggle('hidden');
	hiddencontrols.classList.toggle('hidden');
}

export function processFlatShadingToggle() {
	const active = toggleFlatShading();
	
	if(active)
		flatShadingButton.classList.add('is-active');
	else
		flatShadingButton.classList.remove('is-active');
		
	rebuildSurface(fieldIndex, animateGen);
}

export function nextSurface() {
    fieldIndex = getNextFieldIndex(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

export function previousSurface() {
    fieldIndex = getPreviousFieldIndex(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

function updateRotationSpeeds() {

	const activeCount =
		(xEnabled ? 1 : 0) +
		(yEnabled ? 1 : 0);

	if (activeCount === 0) {
		set_X_TargetRotationVelocity(0);
		set_Y_TargetRotationVelocity(0);
		return;
	}

	// Keep overall rotation speed constant
	const speed = 2 / Math.sqrt(activeCount);

	set_X_TargetRotationVelocity(xEnabled ? speed : 0);
	set_Y_TargetRotationVelocity(yEnabled ? speed : 0);
}

export function doXRotation() {

	xEnabled = !xEnabled;

	xRotationButton.classList.toggle('is-active');

	updateRotationSpeeds();
};

export function doYRotation() {

	yEnabled = !yEnabled;

	yRotationButton.classList.toggle('is-active');

	updateRotationSpeeds();
};

export function doResetRotation() {
	set_X_RotationVelocity(0);
	set_X_TargetRotationVelocity(0);
	xRotationButton.classList.remove('is-active');
	xEnabled = false;
	
	set_Y_RotationVelocity(0);
	set_Y_TargetRotationVelocity(0);
	yRotationButton.classList.remove('is-active');
	yEnabled = false;
	
	resetRotation();
}

export function doAnimateGen() {

	animateGen = !animateGen;
	
	if(animateGen)
		animateGenButton.classList.add('is-active');
	else
		animateGenButton.classList.remove('is-active');
		
	if(animateGen)
		rebuildSurface(fieldIndex, animateGen);
}

export function doNextVariant() {
    nextVariant(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

export function doPrevVariant() {
    previousVariant(fieldIndex);
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

export function doPrevColour() {
	previousColourMode(fieldIndex, getColourModeCount());
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

export function doNextColour() {
	nextColourMode(fieldIndex, getColourModeCount());
    updateHUD();
	rebuildSurface(fieldIndex, animateGen);
}

export function doCubeLevel(level) {

	// 2. Remove 'is-active' from ALL buttons in the group
	sizeButtons.forEach(btn => btn.classList.remove('is-active'));
	
	// 3. Add 'is-active' only to the one we clicked
	sizeButtons[level-1].classList.add('is-active');

	// 4. Get the size value from the data attribute (convert string to number)
	const size = parseInt(sizeButtons[level-1].dataset.size);

	// 5. Run your shared geometry logic once
	destroyGeometry();
	setGridSize(size);
	initialiseGeometry();
	rebuildSurface(fieldIndex, animateGen);
}



