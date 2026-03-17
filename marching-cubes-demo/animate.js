import * as THREE from './three.module.js';
import { 	scene } from './scene.js';
import { 	isGenerating, mesh } from './surface-builder.js';

let rotationVelocity = 0;
let targetVelocity = 0.1;

let cameraZ = 3;
let targetCameraZ = 3;
const step = 0.5;

let clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1, 2.6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

export function zoomIn() { targetCameraZ -= step; }
export function zoomOut() { targetCameraZ += step; }

export function animate() {

    const delta = clock.getDelta();

    // --- Rotation ---
    if (!isGenerating) {
        rotationVelocity += (targetVelocity - rotationVelocity) * 0.02;
        mesh.rotation.y += rotationVelocity * delta;
        mesh.rotation.x += rotationVelocity * delta;
    }

	cameraZ += (targetCameraZ - cameraZ) * 0.1;
	camera.position.z = cameraZ;
	camera.lookAt(0, 0, 0);

	renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

