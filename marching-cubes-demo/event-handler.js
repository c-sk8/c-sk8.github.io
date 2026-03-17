import {	rebuildSurface, toggleFlatShading, initialiseGeometry, destroyGeometry} from './surface-builder.js';
import {	setGridSize} from './cube-marcher.js';
import {	incrementFieldFunction, decrementFieldFunction } from './field-functions.js';
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

document.getElementById("prevColour").onclick  = () => {
	decrementColourMode();
	rebuildSurface();
}

document.getElementById("nextColour").onclick  = () => {
	incrementColourMode();
	rebuildSurface();
}

document.getElementById("zoomIn").onclick  = () => { zoomIn() }
document.getElementById("zoomOut").onclick  = () => { zoomOut() }

document.getElementById("flatShading").onclick  = () => {
	toggleFlatShading();
	rebuildSurface();
}

document.getElementById("size50").onclick  = () => {
	destroyGeometry();
	setGridSize(50);
	initialiseGeometry();
	rebuildSurface();
}

document.getElementById("size100").onclick  = () => {
	destroyGeometry();
	setGridSize(100);
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
		incrementColourMode();
    	rebuildSurface();
	}

	if (e.key === "ArrowDown") {
  		decrementColourMode();
	    rebuildSurface();
	}

    if (e.key === "+" || e.key === "w") zoomIn();
    if (e.key === "-" || e.key === "s") zoomOut();

});
