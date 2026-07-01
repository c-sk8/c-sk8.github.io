// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

let colour_mode = 0;

export function automaticMode() {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.remove("dark", "light");
    colour_mode = 0;
    automaticModeChange(prefersDark ? "dark" : "light");
}

export function lightMode() { 
    document.body.classList.remove("dark","light");
    document.body.classList.add("light");
	changeThemeColor('#F2F2F7');
    colour_mode = 1;
}

export function darkMode() {
    document.body.classList.remove("dark","light");
    document.body.classList.add("dark");
	changeThemeColor('#1E1E1E');
    colour_mode = 2;
}

export function automaticModeChange(mode) {
	if(colour_mode == 0) {
	    document.body.classList.remove("dark","light");
		if(mode == 'light') {
		    document.body.classList.add("light");
			changeThemeColor('#F2F2F7');
		} else if (mode == 'dark') {
		    document.body.classList.add("dark");
			changeThemeColor('#1E1E1E');
		}
    }
}

function changeThemeColor(newColor) {
    // 1. Update the body
    document.body.style.backgroundColor = newColor;
    
    // 2. Update your fixed header (if you have one)
    const topHeader = document.querySelector('header'); // Change selector to match your layout
    if (topHeader) {
        topHeader.style.backgroundColor = newColor;
    }
}