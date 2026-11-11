// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

export default class Surface {
    constructor() {
        this.currentVariant = 0;
        this.colourMode = 0;
        this.animationsColour = 1;
    }

    // Default bounds fallback
    getBounds() {
        const bounds = this.bounds ?? [-1, 1, -1, 1, -1, 1];
        const vIndex = this.currentVariant;
        return this.variants?.[vIndex]?.bounds ?? bounds;
    }

    getAnimationBounds() {
        return this.animationBounds ?? [-1, 1, -1, 1, -1, 1];
    }

    nextVariant() {
        if (!this.variants) return;
        this.currentVariant = (this.currentVariant + 1) % this.variants.length;
    }

    previousVariant() {
        if (!this.variants) return;
        this.currentVariant = (this.currentVariant - 1 + this.variants.length) % this.variants.length;
    }

    getNoiseParams() {
        const defaultNoise = [1.5, 70];
        const vIndex = this.currentVariant;
        return this.variants?.[vIndex]?.noise ?? defaultNoise;
    }

    getColourMode() {
        return this.colourMode;
    }

    setColourMode(mode) {
        this.colourMode = mode;
    }

    getAnimationColour() {
        return this.animationsColour;
    }

    setAnimationColour(colour) {
        this.animationsColour = colour;
    }
}