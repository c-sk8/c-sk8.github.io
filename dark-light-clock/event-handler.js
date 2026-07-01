// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

import {	automaticMode, lightMode, darkMode, automaticModeChange } from './event-process.js';

export function initialise() {
}

// =====================================================================================
//	Handle button presses
// =====================================================================================

document.getElementById("automatic_mode").onclick = () => { automaticMode(); }
document.getElementById("light_mode").onclick = () => { lightMode(); }
document.getElementById("dark_mode").onclick  = () => { darkMode(); }

// =====================================================================================
//	Handle dark and light mode switch
// =====================================================================================

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

darkModeQuery.addEventListener("change", (event) => {
    automaticModeChange(event.matches ? "dark" : "light");
});