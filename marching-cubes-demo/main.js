// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import {	rebuildSurface } from './surface-builder.js';
import {	animate } from './animate.js';
import { 	updateHUD } from './hud.js';
//import {	generateAllBounds } from './bounds-generator.js';

rebuildSurface(0);
updateHUD();
animate();

//generateAllBounds();