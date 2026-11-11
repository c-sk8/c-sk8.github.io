// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

export class AnimationClock {

    constructor(startTime = 0, speed = 1) {
        this.startTime = startTime;
        this.elapsedTime = startTime;
        this.speed = speed;

        this.running = false;
        this.lastTime = 0;
        this.delta = 0;
    }


    start() {
        if (!this.running) {
            this.lastTime = performance.now();
            this.running = true;
        }
    }


    stop() {
        if (this.running) {
            this.update();
            this.running = false;
        }
    }


    reset() {
        this.elapsedTime = this.startTime;
        this.lastTime = performance.now();
    }


    update() {
        if (!this.running) return;

        const currentTime = performance.now();
        this.delta = (currentTime - this.lastTime) / 1000;
        this.elapsedTime += this.delta * this.speed;
        this.lastTime = currentTime;
    }


    getTime() {
        this.update();
        return this.elapsedTime;
    }
    
    getDelta() {
    	this.update();
    	return this.delta;
    }


    getSpeed() {
        return this.speed;
    }


    setSpeed(speed) {
        this.update();
        this.speed = speed;
    }


    setTime(time) {
        this.update();
        this.elapsedTime = time;
    }
}