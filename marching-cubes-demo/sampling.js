// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

export class Sampling {
	
    constructor() {
    
    	this.levelSteps = [0.04, 0.02, 0.0133, 0.01];
        this.sampling_level = 2;

        this.dimensions = {
            width: 0,
            height: 0,
            depth: 0
        };

        this.bounds = {
            min_x: -1,
            max_x:  1,

            min_y: -1,
            max_y:  1,

            min_z: -1,
            max_z:  1
        };

        this.step = {
            x: this.levelSteps[this.sampling_level],
            y: this.levelSteps[this.sampling_level],
            z: this.levelSteps[this.sampling_level]
        };
    }
    
    boundsWidth() { return this.bounds.max_x - this.bounds.min_x; }
    boundsHeight() { return this.bounds.max_y - this.bounds.min_y; }
    boundsDepth() { return this.bounds.max_z - this.bounds.min_z; }
    
    calculateDimensions() {
    	this.dimensions.width = Math.floor(this.boundsWidth() / this.step.x) + 1;
    	this.dimensions.height = Math.floor(this.boundsHeight() / this.step.y) + 1;
    	this.dimensions.depth = Math.floor(this.boundsDepth() / this.step.z) + 1;
    }
    
    setStep(step) {
    	this.step.x = step;
    	this.step.y = step;
    	this.step.z = step;
    }
    
    setBounds(vals) {
		this.bounds.min_x = vals[0];
		this.bounds.max_x = vals[1];
		this.bounds.min_y = vals[2];
		this.bounds.max_y = vals[3];
		this.bounds.min_z = vals[4];
		this.bounds.max_z = vals[5];
    }
    
    setSamplingLevel(level) {
    	this.sampling_level = Math.max(0, Math.min(3, level));
    	this.setStep(this.levelSteps[this.sampling_level]);
    	this.calculateDimensions();
    }
    
    resetSteps() {
    	this.setStep(this.levelSteps[this.sampling_level]);
    }

	enforceMinimumDimensions(minDimension = 25) {
	
		const widthRange  = this.boundsWidth();
		const heightRange = this.boundsHeight();
		const depthRange  = this.boundsDepth();
	
		if (this.dimensions.width < minDimension) {
			this.step.x = widthRange / (minDimension - 1);
		}
	
		if (this.dimensions.height < minDimension) {
			this.step.y = heightRange / (minDimension - 1);
		}
	
		if (this.dimensions.depth < minDimension) {
			this.step.z = depthRange / (minDimension - 1);
		}
	
		// Recalculate dimensions after changing step sizes
		this.calculateDimensions();
	}
	
	getDimensionsString() {
		return `${this.dimensions.width}·${this.dimensions.height}·${this.dimensions.depth}`;
	}
}

export let sampling = new Sampling();