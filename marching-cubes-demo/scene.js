// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';

export const scene = new THREE.Scene();
const ambiLight = new THREE.AmbientLight(0x2a2a2a);
const light = new THREE.DirectionalLight(0xffffee, 1);

scene.background = new THREE.Color('black');

light.position.set(1,1,2);

scene.add(ambiLight);
scene.add(light);
