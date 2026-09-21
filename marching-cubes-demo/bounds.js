// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

export class BoundingBox {
	constructor() {
		this.x = { min: Infinity, max: -Infinity };
		this.y = { min: Infinity, max: -Infinity };
		this.z = { min: Infinity, max: -Infinity };
	}
  
	setValues(values) {
		this.x.min = values[0];
		this.x.max = values[1];

		this.y.min = values[2]; 
		this.y.max = values[3];

		this.z.min = values[4];
		this.z.max = values[5];
	}
	
	scale(factor) {
		this.x.min *= factor;
		this.x.max *= factor;

		this.y.min *= factor;
		this.y.max *= factor;

		this.z.min *= factor;
		this.z.max *= factor;
	}
	
	clamp(min, max) {
		this.x.min = Math.max(this.x.min, min);
		this.x.max = Math.min(this.x.max, max);

		this.y.min = Math.max(this.y.min, min);
		this.y.max = Math.min(this.y.max, max);

		this.z.min = Math.max(this.z.min, min);
		this.z.max = Math.min(this.z.max, max);
	}
	
	roundout() {
		this.x.min = Math.floor(this.x.min);
		this.x.max = Math.ceil(this.x.max);

		this.y.min = Math.floor(this.y.min);
		this.y.max = Math.ceil(this.y.max);

		this.z.min = Math.floor(this.z.min);
		this.z.max = Math.ceil(this.z.max);
	}

	addPoint(px, py, pz) {
		this.x.min = Math.min(this.x.min, px);
		this.x.max = Math.max(this.x.max, px);
		
		this.y.min = Math.min(this.y.min, py);
		this.y.max = Math.max(this.y.max, py);
		
		this.z.min = Math.min(this.z.min, pz);
		this.z.max = Math.max(this.z.max, pz);
	}

	expand(amount) {
		this.x.min -= amount;
		this.x.max += amount;
		this.y.min -= amount;
		this.y.max += amount;
		this.z.min -= amount;
		this.z.max += amount;
	}
  
	round(precision = 4) {
		this.x.min = this.x.min.toFixed(precision);
		this.x.max = this.x.max.toFixed(precision);
		
		this.y.min = this.y.min.toFixed(precision);
		this.y.max = this.y.max.toFixed(precision);
		
		this.z.min = this.z.min.toFixed(precision);
		this.z.max = this.z.max.toFixed(precision);
	}
  
	getString = () => {
		return `[${this.x.min},${this.x.max},${this.y.min},${this.y.max},${this.z.min},${this.z.max}]`;
	}
	
	getDimensionsString = () => {
		const width = this.x.max - this.x.min;
		const height = this.y.max - this.y.min;
		const depth = this.z.max - this.z.min;
		return `${width} ${height} ${depth}`;
	}

	normalize(rMin, rMax) {
		this.x.min = (this.x.min - rMin) / (rMax - rMin);
		this.x.max = (this.x.max - rMin) / (rMax - rMin);

		this.y.min = (this.y.min - rMin) / (rMax - rMin);
		this.y.max = (this.y.max - rMin) / (rMax - rMin);

		this.z.min = (this.z.min - rMin) / (rMax - rMin);
		this.z.max = (this.z.max - rMin) / (rMax - rMin);
	}
}