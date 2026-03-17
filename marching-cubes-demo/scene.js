import * as THREE from './three.module.js';

export const scene = new THREE.Scene();
const ambiLight = new THREE.AmbientLight(0x2a2a2a);
const light = new THREE.DirectionalLight(0xffffff, 2);

scene.background = new THREE.Color('black');

light.position.set(1,1,2);

scene.add(ambiLight);
scene.add(light);
