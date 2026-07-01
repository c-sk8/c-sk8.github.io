// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import { } from './event-handler.js';
import { automaticMode } from './event-process.js';

let accumulated_seconds = 0;
let previous_seconds = 0;
let accumulated_minutes = 0;
let previous_minutes = 0;
let accumulated_hours = 0;
let previous_hours = 0;
let resizeTimer;

const second_hand = document.querySelector(".second-hand");
const minute_hand = document.querySelector(".minute-hand");
const hour_hand = document.querySelector(".hour-hand");

function intervalAction(animate = true) {
    const now = new Date();

	let milliseconds = now.getMilliseconds(); // Gets milliseconds (0-999)

	// Seconds keep going up for continuous smooth animation
    const seconds = now.getSeconds();
	
	if(seconds != previous_seconds)
	{
		if(seconds < previous_seconds)
			accumulated_seconds += 60;
		previous_seconds = seconds;
	}	

	// Only move the minute hand once every 15 seconds. Less drawing needed.
	const minutes =	now.getMinutes() + (Math.floor(seconds % 60 / 15) * 15) / 60;
	
	if(minutes != previous_minutes)
	{
		if(minutes < previous_minutes)
			accumulated_minutes += 60;
		previous_minutes = minutes;
	}	
	
	// Hour hand is redrawn once every minute.
	const hours = now.getHours() % 12 + (now.getMinutes() / 60);

	if(hours != previous_hours)
	{
		if(hours < previous_hours)
			accumulated_hours += 12;
		previous_hours = hours;
	}	

    // Calculate hand rotation in degrees
    const secondsDegrees = ((accumulated_seconds + seconds) / 60) * 360;
    const minutesDegrees = ((accumulated_minutes + minutes) / 60) * 360;
    const hoursDegrees = ((accumulated_hours + hours) / 12) * 360;

    // Set rotation angle for each hand
	updateHands(secondsDegrees, minutesDegrees, hoursDegrees);
	
	if(animate) enableAnimation();
        
	return intervalAction;
}

let lastUpdate = Date.now();

function updateHands(seconds_degrees, minutes_degrees, hours_degrees) {

    const now = Date.now();
    
    if (now - lastUpdate > 500) {   // computer was probably asleep
		disableAnimation();

		second_hand.style.transform = `rotate(${seconds_degrees}deg)`;
		minute_hand.style.transform = `rotate(${minutes_degrees}deg)`;
		hour_hand.style.transform = `rotate(${hours_degrees}deg)`;

        // force browser reflow
        void second_hand.offsetWidth;
    } else {
		second_hand.style.transform = `rotate(${seconds_degrees}deg)`;
		minute_hand.style.transform = `rotate(${minutes_degrees}deg)`;
		hour_hand.style.transform = `rotate(${hours_degrees}deg)`;
    }

    lastUpdate = now;
}

window.addEventListener("resize", () => {
	document.body.classList.add("resize-animation-stopper");
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		document.body.classList.remove("resize-animation-stopper");
	}, 1);
});

document.addEventListener("visibilitychange", () => {
	disableAnimation();
});

function disableAnimation() {
	second_hand.style.transition = "0s";
	minute_hand.style.transition = "0s";
	hour_hand.style.transition = "0s";
}

function enableAnimation() {
	second_hand.style.transition = "transform 0.1s linear";
	minute_hand.style.transition = "1s";
	hour_hand.style.transition = "1s";
}

automaticMode();
disableAnimation();
intervalAction(false);
const myInterval = setInterval(intervalAction, 100);


