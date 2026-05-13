// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { scene } from './scene.js';
import { mesh } from './surface-builder.js';

let x_rotation_velocity = 0;
let y_rotation_velocity = 0;
let z_rotation_velocity = 0;

let x_target_rotation_velocity = 0;
let y_target_rotation_velocity = 0;
let z_target_rotation_velocity = 0;

const VELOCITY_SCALE = 0.1;
const MOTION_DAMPENER = 0.06;

let cameraZ = 3;
let targetCameraZ = 3;
const step = 0.5;

let clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 2.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

export function zoomIn() { targetCameraZ -= step; }
export function zoomOut() { targetCameraZ += step; }

export function resetRotationVelocity() {
	x_rotation_velocity = 0;
	y_rotation_velocity = 0;
	z_rotation_velocity = 0;
}

export function set_X_RotationVelocity(velocity) {
	x_rotation_velocity = velocity;
}

export function set_Y_RotationVelocity(velocity) {
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

export function set_Z_TargetRotationVelocity(target_velocity) {
	z_target_rotation_velocity = target_velocity;
		}

export function get_Z_TargetRotationVelocity() {
	return z_target_rotation_velocity;
}

export function animate() {

    const delta = clock.getDelta();

    // --- Rotation ---
	x_rotation_velocity += (x_target_rotation_velocity - x_rotation_velocity) * MOTION_DAMPENER;
	mesh.rotation.x += x_rotation_velocity * VELOCITY_SCALE * delta;
	
	y_rotation_velocity += (y_target_rotation_velocity - y_rotation_velocity) * MOTION_DAMPENER;
	mesh.rotation.y += y_rotation_velocity * VELOCITY_SCALE * delta;
	
	z_rotation_velocity += (z_target_rotation_velocity - z_rotation_velocity) * MOTION_DAMPENER;
	mesh.rotation.z += z_rotation_velocity * VELOCITY_SCALE * delta;

	cameraZ += (targetCameraZ - cameraZ) * 0.1;
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

