// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { scene } from './scene.js';
import { mesh } from './surface-builder.js';

let rotationXVelocity = 0;
let rotationYVelocity = 0;
let rotationZVelocity = 0;
let targetXVelocity = 0.12;
let targetYVelocity = 0.15;
let targetZVelocity = 0;

let cameraZ = 2.5;
let targetCameraZ = 2.5;
const step = 0.5;

let clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1, 2.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

export function zoomIn() { targetCameraZ -= step; }
export function zoomOut() { targetCameraZ += step; }

export function resetRotationVelocity() {
	rotationXVelocity = 0;
	rotationYVelocity = 0;
	rotationZVelocity = 0;
}

export function animate() {

    const delta = clock.getDelta();

    // --- Rotation ---
	rotationXVelocity += (targetXVelocity - rotationXVelocity) * 0.02;
	mesh.rotation.x += rotationXVelocity * delta;
	
	rotationYVelocity += (targetYVelocity - rotationYVelocity) * 0.02;
	mesh.rotation.y += rotationYVelocity * delta;
	
	rotationZVelocity += (targetZVelocity - rotationZVelocity) * 0.02;
	mesh.rotation.z += rotationZVelocity * delta;

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

