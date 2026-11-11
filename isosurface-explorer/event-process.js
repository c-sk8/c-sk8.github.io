// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	surface_builder,
			BuildMode }				from './surface-builder.js';

import {	getField,
			getNextFieldIndex,
			getPreviousFieldIndex } from './new-surface-controller.js';
			
import {	set_X_RotationVelocity,
			set_Y_RotationVelocity,
			set_X_TargetRotationVelocity,
			get_X_TargetRotationVelocity,
			set_Y_TargetRotationVelocity,
			get_Y_TargetRotationVelocity,
			isUpsideDown,
			toggleZMovement,
			disableZMovement,
			resetRotation }			from './animate.js';
import {	cube_colours }			from './cube-colour.js';
import {	sampling }				from './sampling.js';
import {	info_box }				from './info-box.js';
import {	animation_colours}		from './animation-colours.js';


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
const zMovementButton = document.getElementById("zMovement");
const animatedGenButton = document.getElementById("animated_gen");
const fullGenButton = document.getElementById("full_gen");
const sliceGenButton = document.getElementById("slice_gen");
const sizeButtons = document.querySelectorAll('.size-btn');

export function toggleHideControls() {
	hud.classList.toggle('hidden');
	controls.classList.toggle('hidden');
	hiddencontrols.classList.toggle('hidden');
}

export function processFlatShadingToggle() {
	const active = surface_builder.toggle_flat_shading();
	
	if(active)
		flatShadingButton.classList.add('is-active');
	else
		flatShadingButton.classList.remove('is-active');
		
	surface_builder.rebuild_surface();
}

export function nextSurface() {
    fieldIndex = getNextFieldIndex(fieldIndex);
	surface_builder.set_field_index(fieldIndex);
	surface_builder.rebuild_surface();
}

export function previousSurface() {
    fieldIndex = getPreviousFieldIndex(fieldIndex);
	surface_builder.set_field_index(fieldIndex);
	surface_builder.rebuild_surface();
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

export function doZMovement() {
	zMovementButton.classList.toggle('is-active');
	toggleZMovement();
}

export function doResetRotation() {
	set_X_RotationVelocity(0);
	set_X_TargetRotationVelocity(0);
	xRotationButton.classList.remove('is-active');
	xEnabled = false;
	
	set_Y_RotationVelocity(0);
	set_Y_TargetRotationVelocity(0);
	yRotationButton.classList.remove('is-active');
	yEnabled = false;
	
	disableZMovement();
	zMovementButton.classList.remove('is-active');
	
	resetRotation();
}

export function doAnimateGen() {
	animatedGenButton.classList.add('is-active');
	fullGenButton.classList.remove('is-active');
	sliceGenButton.classList.remove('is-active');

	//let acol_index = getAnimationsColour(fieldIndex);
	//info_box.setColourModeName(animation_colours.getAnimationColourName(acol_index));

	surface_builder.set_build_mode(BuildMode.Animated);
	surface_builder.rebuild_surface();
}

export function doFullGen() {
	animatedGenButton.classList.remove('is-active');
	fullGenButton.classList.add('is-active');
	sliceGenButton.classList.remove('is-active');
	surface_builder.set_build_mode(BuildMode.Full);
	surface_builder.rebuild_surface();
}

export function doSliceGen() {
	animatedGenButton.classList.remove('is-active');
	fullGenButton.classList.remove('is-active');
	sliceGenButton.classList.add('is-active');
	surface_builder.set_build_mode(BuildMode.Slice);
	surface_builder.rebuild_surface();
}

export function doNextVariant() {
	const field = getField(fieldIndex);
    field.nextVariant();
	surface_builder.rebuild_surface();
}

export function doPrevVariant() {
	const field = getField(fieldIndex);
    field.previousVariant(fieldIndex);
	surface_builder.rebuild_surface();
}

export function doPrevColour() {

	const field = getField(fieldIndex);

	if(surface_builder.get_build_mode() == BuildMode.Animated) {
		let new_index = animation_colours.getPreviousColour(field.getAnimationColour() - 1);
		field.setAnimationColour(new_index);
		info_box.setColourModeName(animation_colours.getAnimationColourName(new_index));
	}
	else {
		let new_colour_mode = cube_colours.getPreviousColour(field.getColourMode() - 1);
		field.setColourMode(new_colour_mode);
		info_box.setColourModeName(cube_colours.getColourName(new_colour_mode));
	}
	
	surface_builder.rebuild_surface();
}

export function doNextColour() {

	const field = getField(fieldIndex);
	
	if(surface_builder.get_build_mode() == BuildMode.Animated) {
		let new_index = animation_colours.getNextColour(field.getAnimationColour() + 1);
		field.setAnimationColour(new_index);
		info_box.setColourModeName(animation_colours.getAnimationColourName(new_index));
	}
	else {
		let new_colour_mode = cube_colours.getNextColour(field.getColourMode() + 1);
		field.setColourMode(new_colour_mode);
		info_box.setColourModeName(cube_colours.getColourName(new_colour_mode));
	}
	
	surface_builder.rebuild_surface();
}

export function doCubeLevel(level) {
	sizeButtons.forEach(btn => btn.classList.remove('is-active'));	
	if(level <= 5) sizeButtons[level-1].classList.add('is-active');
	sampling.setSamplingLevel(level - 1);
	surface_builder.rebuild_surface();
}

