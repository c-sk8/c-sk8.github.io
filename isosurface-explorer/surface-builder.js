// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import * as THREE from './three.module.js';
import { 	geometry } from './scene.js';
import {	resetVertexCount, getVertexCount, XYCubeMarcher, CubeMarcher, FastMarcher,
			vertexCount, computeSlice } from './cube-marcher.js';
import {	cube_colours } from './cube-colour.js';
import {	animation_colours } from './animation-colours.js';
import {	sampling } from './sampling.js';
import {	info_box } from './info-box.js';
import { 	getField } from './new-surface-controller.js';

export const BuildMode = { Slice: 0, Full: 1, Animated: 2};

export class SurfaceBuilder {
	
    constructor() {
    	this.zIndex = null;
    	this.build_mode = BuildMode.Slice;
    	this.generated_token = 0;
    	this.flat_shading = true;
    	this.field_index = 0;
    	this.slice0 = null;
    	this.slice1 = null;
    	this.frames = 120;
    	this.frame = 0;
    	this.animations_index = 0;
    	this.start_time = 0;
	}


	generate_animated_geometry(token, field) {		

		if (token !== this.generated_token) return;
	
        let params = null;
        //let bounds = null;
        let doAnimation = false;

        const animations = field.animations;
        const frames = field.frames[this.animations_index];
            
        const bounds = [-1, 1, -1, 1, -1, 1];

        if (animations != null && this.animations_index < animations.length - 1) {

            doAnimation = true;

            const progress = this.frame / frames;

            const startVariant = animations[this.animations_index];
            const endVariant = animations[this.animations_index + 1];

            const startParams = field.animationVariants[startVariant].params;
            const endParams = field.animationVariants[endVariant].params;

            params = startParams.map((start, i) => start + (endParams[i] - start) * progress);

            //const startBounds = getVariantBounds(this.field_index, startVariant);
            //const endBounds = getVariantBounds(this.field_index, endVariant);

            //bounds = startBounds.map((start, i) => start + (endBounds[i] - start) * progress);

        } else {
            // Animation has finished: use the final variant.
            //const variant = getCurrentVariant(this.field_index);

            params = field.animationVariants[animations[0]].params;
            //bounds = getVariantBounds(this.field_index, variant);
        }

        //sampling.setBounds(field.animationBounds);
        //sampling.resetSteps();
        //sampling.calculateDimensions();
        //sampling.enforceMinimumDimensions();
        
        //info_box.setSamplingDimensions(sampling.getDimensionsString());

		geometry.setDrawRange(0, 0);

		this.start_time = performance.now();

		FastMarcher(sampling, field.field, params,
					animation_colours.getAnimationColourFunction(field.animationsColour));
		
		geometry.setDrawRange(0, getVertexCount());
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;

	    info_box.setVertexCount(vertexCount);
	    
		info_box.setTime(performance.now() - this.start_time);
   
    	this.frame += 1;  

		if(this.frame >= frames) {
			this.frame = 0;
			this.animations_index += 1;
		}
	
		if(doAnimation == true)
			requestAnimationFrame(() => this.generate_animated_geometry(token, field));
	}
	
	prepare_slices(field) {
	
		this.start_time = performance.now();
		
		this.zIndex = 0;
		
		const noise = field.getNoiseParams(this.field_index);
		
		this.slice0 = computeSlice(	0,
									sampling,
									field.field,
									field.variants[field.currentVariant].params,
									noise);
		this.slice1 = computeSlice(	1,
									sampling,
									field.field,
									field.variants[field.currentVariant].params,
									noise);
	}
	
	generate_sliced_geometry(token, field) {
	
		if (token !== this.generated_token) return;
	
		const field_fn = field.field;
		const field_fn_params = field.variants[field.currentVariant].params;
		const noise = field.getNoiseParams(this.field_index);

		XYCubeMarcher(	this.zIndex, this.slice0, this.slice1, sampling,
						this.flat_shading, field_fn, field_fn_params, noise,
						cube_colours.getColourFunction(field.colourMode) );

		this.zIndex++;
		
		if (token !== this.generated_token) return;

		geometry.setDrawRange(0, getVertexCount());
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;
	
		info_box.setVertexCount(vertexCount);
    
		const elapsed = performance.now() - this.start_time;
		info_box.setTime(elapsed);

		if (this.zIndex < sampling.dimensions.depth) {
			this.slice0 = this.slice1;
			this.slice1 = computeSlice(	this.zIndex + 1, sampling, field_fn, field_fn_params, noise);
			requestAnimationFrame(() => this.generate_sliced_geometry(token, field));
		}
	}
	
	generate_full_geometry(field) {
		geometry.setDrawRange(0, 0);
		
		const params = field.variants[field.currentVariant].params;

		info_box.clearTime();
		const start = performance.now();

		CubeMarcher(this.flat_shading, sampling,
					field.field,
					params,
					field.getNoiseParams(this.field_index),
					cube_colours.getColourFunction(field.colourMode));
					
		const elapsed = performance.now() - start;
		info_box.setTime(elapsed);
			
		geometry.setDrawRange(0, getVertexCount());
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;
	
		info_box.setVertexCount(vertexCount);  
	}
	
	rebuild_surface () {
	
		let bounds = null;
		
		this.generated_token++;
		resetVertexCount();
		
		const field = getField(this.field_index);
		
		info_box.setSurfaceName(field.name);
		
		switch(this.build_mode) {
			case BuildMode.Slice:
				sampling.setLevelSet(0);
				bounds = field.getBounds(this.field_index);
				sampling.setBounds(bounds);
        		sampling.resetSteps();
		        sampling.calculateDimensions();
        		sampling.enforceMinimumDimensions();
        		info_box.setSamplingDimensions(sampling.getDimensionsString());
				info_box.setColourModeName(cube_colours.getColourName(field.colourMode));
				this.zIndex = null;
				info_box.clearTime();
				this.prepare_slices(field);
				this.generate_sliced_geometry(this.generated_token, field);
				break;
			case BuildMode.Full:
				sampling.setLevelSet(0);
				bounds = field.getBounds(this.field_index);
				sampling.setBounds(bounds);
        		sampling.resetSteps();
		        sampling.calculateDimensions();
        		sampling.enforceMinimumDimensions();
        		info_box.setSamplingDimensions(sampling.getDimensionsString());
				info_box.setColourModeName(cube_colours.getColourName(field.colourMode));
				this.generate_full_geometry(field);
				break;
			case BuildMode.Animated:
				sampling.setLevelSet(1);
				info_box.setColourModeName(animation_colours.getAnimationColourName(field.animationsColour));
    			this.frame = 0;
    			this.animations_index = 0;
				sampling.setBounds(field.animationBounds);
				sampling.resetSteps();
				sampling.calculateDimensions();
				sampling.enforceMinimumDimensions();				
				info_box.setSamplingDimensions(sampling.getDimensionsString());
				this.generate_animated_geometry(this.generated_token, field);
				break;
			default:
				console.warn( 'rebuild_surface() unknown build mode');
		}
	}
	
	toggle_flat_shading() {
		this.flat_shading = !this.flat_shading;
		return this.flat_shading;
	}
	
	set_field_index(field_index) {
		this.field_index = field_index;
	}
	
	set_build_mode(build_mode) {
		this.build_mode = build_mode;
	}
	
	get_build_mode() {
		return this.build_mode;
	}
	
}

export let surface_builder = new SurfaceBuilder();