// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import Decocube from "./surface-classes/decocube.js";
import Tooth from "./surface-classes/tooth.js";
import TwistedTorus from "./surface-classes/twisted-torus.js";
import Geodesic from "./surface-classes/geodesic.js";
import Chair from "./surface-classes/chair.js";
import SinedSphere from "./surface-classes/sined-sphere.js";
import Algebraic from "./surface-classes/algebraic.js";
import Gumdrop from "./surface-classes/gumdrop.js";
import FlattenedWave from "./surface-classes/flattened-wave.js";
import Rhombicuboctahedron from "./surface-classes/rhombi.js";
import BlobRing from "./surface-classes/blob-ring.js";
import CosinePattern from "./surface-classes/cosine.js";
import ThreeTori from "./surface-classes/three-tori.js";
import MoebiusStrip from "./surface-classes/moebius-strip.js";
import SuperSphere from "./surface-classes/supersphere.js";
import RadialWaveSphere from "./surface-classes/radial.js";
import PiriformDiabolo from "./surface-classes/piriform.js";
import SpheredSchwarzP from "./surface-classes/schwarz-p.js";
import GyroidFloor from "./surface-classes/gyroid.js";
import LidinoidSurface from "./surface-classes/lidinoid.js";
import CylinderCross from "./surface-classes/cylinder-cross.js";
import SpiderCage from "./surface-classes/spider-cage.js";
import CylinderSphere from "./surface-classes/cylinder-sphere.js";
import NoiseSphere from "./surface-classes/noise-sphere.js";
import SurfaceNoise from "./surface-classes/surface-noise.js";
//import Tetrahedral from "./surface-classes/tetrahedral.js";

const fields = [
    new Decocube(),
    new Tooth(),
    new Gumdrop(),
    new Chair(),
    new Geodesic(),
    new TwistedTorus(),
    new SinedSphere(),
    new Algebraic(),
    new RadialWaveSphere(),
    new FlattenedWave(),
    new Rhombicuboctahedron(),
    new BlobRing(),
    new CosinePattern(),
    new ThreeTori(),
    new SuperSphere(),
    new PiriformDiabolo(),
    new SpheredSchwarzP(),
    new GyroidFloor(),
    new LidinoidSurface(),
    new MoebiusStrip(),
	new CylinderCross(),
	new SpiderCage(),
	new CylinderSphere(),
	new NoiseSphere(),
	new SurfaceNoise()
//  new Tetrahedral(),
];

export function getField(index) {
    return fields[index];
}

export function getNextFieldIndex(index) {
    return (index + 1 >= fields.length) ? 0 : index + 1;
}

export function getPreviousFieldIndex(index) {
    return (index - 1 < 0) ? fields.length - 1 : index - 1;
}

export default fields;