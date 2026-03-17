import * as THREE from './three.module.js';
import {	rebuildSurface } from './surface-builder.js';
import {	animate } from './animate.js';
import './event-handler.js';

// ============================================================
//	BASIC THREE.JS SETUP
// ============================================================

rebuildSurface();
animate();