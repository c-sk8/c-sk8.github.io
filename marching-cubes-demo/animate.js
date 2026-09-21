// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { scene } from './scene.js';
import { mesh } from './surface-builder.js';
import { AnimationClock } from './animation-clock.js';

let x_rotation_velocity = 0;
let y_rotation_velocity = 0;

let x_target_rotation_velocity = 0;
let y_target_rotation_velocity = 0;

const VELOCITY_SCALE = 0.1;
const MOTION_DAMPENER = 0.06;

let cameraZ = 3.5;
let targetCameraZ = 3.5;
const step = 0.3;

let cameraMoving = false;
let camera_z_start = 3.5;
const camera_z_distance = 1.8;
let camera_clock = new AnimationClock(Math.PI * 1.5, 0.1);
let rotation_clock = new AnimationClock();
rotation_clock.start();

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 2.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let mousePointerHidden = false;

export function zoomIn() {
	if(!cameraMoving)
		targetCameraZ -= step;
}

export function zoomOut() {
	if(!cameraMoving)
		targetCameraZ += step;
}

export function toggleZMovement() {
	
	if(cameraMoving == false)
	{
		cameraMoving = true;
		camera_clock.start();
	}
    else
    {
    	cameraMoving = false;
    	camera_clock.stop();
    }
}

export function disableZMovement() {
	cameraMoving = false;
	camera_clock.stop();
	camera_clock.reset();
}

export function set_X_RotationVelocity(velocity) {
	if(Math.abs(velocity) > 10)
    	x_target_rotation_velocity = Math.abs(x_target_rotation_velocity) * Math.sign(velocity);

	x_rotation_velocity = velocity;
}

export function set_Y_RotationVelocity(velocity) {
	if(Math.abs(velocity) > 10)
    	y_target_rotation_velocity = Math.abs(y_target_rotation_velocity) * Math.sign(velocity);
		
	y_rotation_velocity = velocity;
}

export function isUpsideDown() {
	return (Math.cos(mesh.rotation.x) < 0);
}

export function set_X_TargetRotationVelocity(target_velocity) {
	x_target_rotation_velocity = target_velocity;
}

export function get_X_TargetRotationVelocity() {
	return x_target_rotation_velocity;
}

export function set_Y_TargetRotationVelocity(target_velocity) {
	y_target_rotation_velocity = target_velocity;
}

export function get_Y_TargetRotationVelocity() {
	return y_target_rotation_velocity;
}

export function resetRotation() {
	mesh.rotation.x = 0;
	mesh.rotation.y = 0;
	x_rotation_velocity = 0;
	y_target_rotation_velocity = 0;
	targetCameraZ = 3.5;
}

export function animate() {

    const delta = rotation_clock.getDelta();
		
    // --- Rotation ---
	x_rotation_velocity += (x_target_rotation_velocity - x_rotation_velocity) * MOTION_DAMPENER;
	mesh.rotation.x += x_rotation_velocity * VELOCITY_SCALE * delta;
	
	y_rotation_velocity += (y_target_rotation_velocity - y_rotation_velocity) * MOTION_DAMPENER;
	mesh.rotation.y += y_rotation_velocity * VELOCITY_SCALE * delta;

	if(cameraMoving)
	{
		let elapsed_time = camera_clock.getTime();
		let camera_animation_position = (Math.sin(elapsed_time) + 1) / 2;
		targetCameraZ = camera_z_start - (camera_animation_position * camera_z_distance);
	}

	cameraZ += (targetCameraZ - cameraZ) * 0.08;
	camera.position.z = cameraZ;

	camera.lookAt(0, 0, 0);
	
	renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.addEventListener('resize', onWindowResize);

export function toggleHideMousePointer() {
	if(mousePointerHidden == false) {
		renderer.domElement.style.cursor = 'none';   // hide
		mousePointerHidden = true;
	}
	else {
		renderer.domElement.style.cursor = '';       // show
		mousePointerHidden = false;
	}
}

export function showMousePointer() {
		renderer.domElement.style.cursor = '';       // show
		mousePointerHidden = false;
}

