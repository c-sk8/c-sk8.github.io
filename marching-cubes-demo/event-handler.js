// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	zoomIn, zoomOut,
			set_X_RotationVelocity, set_Y_RotationVelocity,
			isUpsideDown, resetRotation,
			set_X_TargetRotationVelocity, get_X_TargetRotationVelocity,
			set_Y_TargetRotationVelocity, get_Y_TargetRotationVelocity,
			set_Z_TargetRotationVelocity, get_Z_TargetRotationVelocity,
			} from './animate.js';
import {	nextVariant, previousVariant,
			nextColourMode, previousColourMode } from './field-functions-manager.js';
import { 	updateHUD } from './hud.js';
import {	toggleHideControls, processFlatShadingToggle,
			nextSurface, previousSurface, fieldIndex, animateGen,
			doXRotation, doYRotation, doResetRotation,
			doAnimateGen, doNextVariant, doPrevVariant,
			doNextColour, doPrevColour, doCubeLevel } from './event-process.js';

// ============================================================
//	Handle button presses
// ============================================================

document.getElementById("hideControls").onclick = () => { toggleHideControls(); }
document.getElementById("showControls").onclick = () => { toggleHideControls(); }
document.getElementById("zoomIn").onclick  = () => { zoomIn(); }
document.getElementById("zoomOut").onclick  = () => { zoomOut(); }
document.getElementById("flatShading").onclick  = () => { processFlatShadingToggle(); }
document.getElementById("animateGen").onclick  = () => { doAnimateGen(); }
document.getElementById("nextSurface").onclick = () => { nextSurface(); }
document.getElementById("prevSurface").onclick = () => { previousSurface(); }
document.getElementById("xRotation").onclick = () => { doXRotation(); }
document.getElementById("yRotation").onclick = () => { doYRotation(); }
document.getElementById("resetRotation").onclick = () => { doResetRotation(); }
document.getElementById("nextVariant").onclick = () => { doNextVariant(); }
document.getElementById("prevVariant").onclick = () => { doPrevVariant(); }
document.getElementById("prevColour").onclick  = () => { doPrevColour(); }
document.getElementById("nextColour").onclick  = () => { doNextColour(); }
document.getElementById("num1").onclick  = () => { doCubeLevel(1); }
document.getElementById("num2").onclick  = () => { doCubeLevel(2); }
document.getElementById("num3").onclick  = () => { doCubeLevel(3); }
document.getElementById("num4").onclick  = () => { doCubeLevel(4); }

// ============================================================
//	Handle key presses
// ============================================================

window.addEventListener('keydown', (e) => {
    
    if (e.key === 'X' || e.key === 'x') doXRotation();
    if (e.key === 'Y' || e.key === 'y') doYRotation();
    if (e.key === '=') doResetRotation();
    if (e.key === 'ArrowRight') nextSurface();
    if (e.key === 'ArrowLeft') previousSurface();
	if (e.key === "\\") doAnimateGen();
	if (e.key === "ArrowUp") doNextVariant();
	if (e.key === "ArrowDown") doPrevVariant();
    if (e.key === "+" || e.key === "w") zoomIn();
    if (e.key === "-" || e.key === "s") zoomOut();    
    if (e.key === "h" || e.key === "H") toggleHideControls();
	if (e.key === "/") processFlatShadingToggle();
	if (e.key === "]") doNextColour();
	if (e.key === "[") doPrevColour();
	if (e.key === "1") doCubeLevel(1);
	if (e.key === "2") doCubeLevel(2);
	if (e.key === "3") doCubeLevel(3);
	if (e.key === "4") doCubeLevel(4);

});

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
