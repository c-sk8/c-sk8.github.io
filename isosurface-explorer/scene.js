// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';

export const scene = new THREE.Scene();

const ambiLight = new THREE.AmbientLight(0x2a2a2a);
const top_light = new THREE.DirectionalLight(0xffffff, 1);
const bottom_light = new THREE.DirectionalLight(0xffffff, 0.2);

scene.background = new THREE.Color('black');

top_light.position.set(1, 1, 2);
bottom_light.position.set(-1, -1, 2);

scene.add(ambiLight);
scene.add(top_light);
scene.add(bottom_light);

export let geometry = new THREE.BufferGeometry();

// Initial capacity: 500,000 vertices.
let max_vertices = 500000;

export let positions = new Float32Array(max_vertices * 3);
export let normals = new Float32Array(max_vertices * 3);
export let colors = new Float32Array(max_vertices * 3);

function setGeometryAttributes() {
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
            .setUsage(THREE.DynamicDrawUsage)
    );

    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, 3)
            .setUsage(THREE.DynamicDrawUsage)
    );

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
            .setUsage(THREE.DynamicDrawUsage)
    );
}

setGeometryAttributes();

geometry.setDrawRange(0, 0);

const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    shininess: 60,
    specular: new THREE.Color(0x333333),
    flatShading: false
});

export let mesh = new THREE.Mesh(geometry, material);
//mesh.rotation.x = Math.PI / 5;
//mesh.rotation.y = Math.PI / 4;
scene.add(mesh);


// Increase buffer capacity only when required.
// Capacity doubles until it can accommodate the requested vertex count.
export function ensureVertexCapacity(requiredVertices) {

    if (requiredVertices <= max_vertices) {
        return;
    }

    let newMaxVertices = max_vertices;

    while (newMaxVertices < requiredVertices) {
        newMaxVertices *= 2;
    }

    positions = growBuffer(positions, newMaxVertices * 3);
    normals = growBuffer(normals, newMaxVertices * 3);
    colors = growBuffer(colors, newMaxVertices * 3);

    max_vertices = newMaxVertices;

    setGeometryAttributes();

    console.log(`Vertex buffer capacity increased to ${max_vertices}`);
}


// Allocate a larger array while preserving existing data.
function growBuffer(oldBuffer, newLength) {
    const newBuffer = new Float32Array(newLength);
    newBuffer.set(oldBuffer);
    return newBuffer;
}


// Useful for debugging and checking current capacity.
export function getVertexCapacity() {
    return max_vertices;
}