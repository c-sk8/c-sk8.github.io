import {	rebuildSurface, toggleFlatShading, initialiseGeometry, destroyGeometry} from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	incrementFieldFunction, decrementFieldFunction,
			incrementFFVariant, decrementFFVariant} from './field-functions.js';
import {	incrementColourMode, decrementColourMode } from './colour-modes.js';
import {	zoomIn, zoomOut } from './animate.js';

// ============================================================
//	Handle button presses
// ============================================================

document.getElementById("nextSurface").onclick = () => {
    incrementFieldFunction();
	rebuildSurface();
}

document.getElementById("prevSurface").onclick = () => {
    decrementFieldFunction();
	rebuildSurface();
}

document.getElementById("nextVariant").onclick = () => {
    incrementFFVariant();
	rebuildSurface();
}

document.getElementById("prevVariant").onclick = () => {
    decrementFFVariant();
	rebuildSurface();
}

document.getElementById("prevColour").onclick  = () => {
	decrementColourMode();
	rebuildSurface();
}

document.getElementById("nextColour").onclick  = () => {
	incrementColourMode();
	rebuildSurface();
}

document.getElementById("zoomIn").onclick  = () => {
	zoomIn();
}

document.getElementById("zoomOut").onclick  = () => {
	zoomOut();
}

document.getElementById("flatShading").onclick  = () => {
	toggleFlatShading();
	rebuildSurface();
}

document.getElementById("size30").onclick  = () => {
	destroyGeometry();
	setGridSize(30);
	initialiseGeometry();
	rebuildSurface();
}

document.getElementById("size60").onclick  = () => {
	destroyGeometry();
	setGridSize(60);
	initialiseGeometry();
	rebuildSurface();
}

document.getElementById("size90").onclick  = () => {
	destroyGeometry();
	setGridSize(90);
	initialiseGeometry();
	rebuildSurface();
}

document.getElementById("size120").onclick  = () => {
	destroyGeometry();
	setGridSize(120);
	initialiseGeometry();
	rebuildSurface();
}

document.getElementById("size150").onclick  = () => {
	destroyGeometry();
	setGridSize(150);
	initialiseGeometry();
	rebuildSurface();
}

// ============================================================
//	Handle key presses
// ============================================================

window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') {
        incrementFieldFunction();
        rebuildSurface();
    }

    if (e.key === 'ArrowLeft') {
    	decrementFieldFunction();
        rebuildSurface();
    }

	if (e.key === "ArrowUp") {
		incrementFFVariant();
    	rebuildSurface();
	}

	if (e.key === "ArrowDown") {
  		decrementFFVariant();
	    rebuildSurface();
	}

	if (e.key === "]") {
		incrementColourMode();
    	rebuildSurface();
	}

	if (e.key === "[") {
  		decrementColourMode();
	    rebuildSurface();
	}

	if (e.key === "/") {
		toggleFlatShading();
		rebuildSurface();
	}

    if (e.key === "+" || e.key === "w") zoomIn();
    if (e.key === "-" || e.key === "s") zoomOut();

});
