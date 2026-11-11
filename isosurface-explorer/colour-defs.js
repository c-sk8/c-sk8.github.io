// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

export const SCOLS = {
    mint_green:    	{ r: 0.00, g: 1.00, b: 0.50 },
    cyan:     		{ r: 0.00, g: 0.40, b: 1.00 },
    warm_yellow:   	{ r: 1.00, g: 0.30, b: 0.00 },
    deep_red:      	{ r: 0.65, g:-0.10, b:-0.10 },
    warm_green:    	{ r: 0.60, g: 0.60, b: 0.00 },
    dark_green:    	{ r: 0.07, g: 0.10, b: 0.00 },
    pale_blue:   	{ r: 0.00, g: 0.40, b: 1.00 },
    dark_blue:     	{ r: 0.02, g: 0.04, b: 0.45 },
    purple:   		{ r: 0.10, g: 0.00, b: 0.10 },
    pink:		 	{ r: 0.90, g: 0.00, b: 0.90 },
    yellow: 		{ r: 1.00, g: 0.43, b: 0.00 },
    orange:  		{ r: 1.00, g: 0.20, b: 0.00 },
    latte_light:   	{ r: 0.82, g: 0.41, b: 0.12 },
    latte_dark:    	{ r: 0.80, g: 0.52, b: 0.25 },
    cloud_white:    { r: 1.00, g: 0.95, b: 0.95 },
    sky_blue:      	{ r: 0.00, g: 0.30, b: 0.50 },
    warm_pink:		{ r: 1.00, g: 0.00, b: 0.10 },
    grey_mauve:		{ r: 0.90, g: 0.45, b: 0.95 },
    black: 		   	{ r: 0.00, g: 0.00, b: 0.00 },
    raspberry_pink:	{ r: 0.80, g: 0.10, b: 0.30 },
    grey_blue:		{ r: 0.10, g: 0.30, b: 0.80 },
    pale_mauve:		{ r: 0.70, g: 0.43, b: 0.93 },
    grey_orange:	{ r: 0.93, g: 0.07, b: 0.07 },
    pale_pink:		{ r: 0.90, g: 0.70, b: 0.70 },
};

export const creamy_bands = [
  { r: 0.0000, g: 0.0134, b: 0.0272 },
  { r: 0.0084, g: 0.1268, b: 0.1103 },
  { r: 0.0736, g: 0.3591, b: 0.3662 },
  { r: 0.3805, g: 0.5452, b: 0.3371 },
  { r: 1.0000, g: 0.7874, b: 0.3185 },
  { r: 0.9480, g: 0.4005, b: 0.1652 },
  { r: 0.8440, g: 0.1614, b: 0.0120 },
  { r: 0.4091, g: 0.0279, b: 0.0149 },
  { r: 0.1658, g: 0.0250, b: 0.0028 }
];

export const meadow_green_bands = [
  { r: 0.5471, g: 0.9480, b: 0.2858 },
  { r: 0.3541, g: 0.8931, b: 0.2589 },
  { r: 0.2319, g: 0.8440, b: 0.2319 },
  { r: 0.1256, g: 0.6953, b: 0.2798 },
  { r: 0.0631, g: 0.5452, b: 0.3371 },
  { r: 0.0217, g: 0.3805, b: 0.4091 },
  { r: 0.0039, g: 0.2505, b: 0.4440 },
  { r: 0.0053, g: 0.1742, b: 0.3662 },
  { r: 0.0075, g: 0.1068, b: 0.2929 },
  { r: 0.0053, g: 0.0681, b: 0.1982 }
];

export const magma_inferno_bands = [
  { r: 0.0062, g: 0.0012, b: 0.0286 },
  { r: 0.0492, g: 0.0055, b: 0.1154 },
  { r: 0.2409, g: 0.0120, b: 0.2409 },
  { r: 0.4995, g: 0.0108, b: 0.1473 },
  { r: 0.8378, g: 0.0066, b: 0.0385 },
  { r: 0.9007, g: 0.0990, b: 0.0185 },
  { r: 0.9573, g: 0.4203, b: 0.0546 },
  { r: 0.9718, g: 0.8040, b: 0.2258 },
  { r: 1.0000, g: 1.0000, b: 0.5382 }
];

export const autumn_foliage_bands = [
  { r: 0.0400, g: 0.1000, b: 0.0100 },
  { r: 0.0800, g: 0.1500, b: 0.0200 },
  { r: 0.1005, g: 0.2049, b: 0.0363 }, // Fading green leaf
  { r: 0.2890, g: 0.3814, b: 0.0298 }, // Yellow-green transition
  { r: 0.7954, g: 0.5639, b: 0.0165 }, // Golden yellow
  { r: 0.8378, g: 0.2856, b: 0.0066 }, // Warm amber/orange
  { r: 0.6604, g: 0.0849, b: 0.0057 }, // Rust orange
  { r: 0.4770, g: 0.0291, b: 0.0072 }, // Deep terracotta
  { r: 0.2738, g: 0.0072, b: 0.0134 }  // Crimson autumn red
];

export const spectral_thermal_bands = [
  { r: 0.0116, g: 0.0023, b: 0.0593 },
  { r: 0.0042, g: 0.0512, b: 0.3768 },
  { r: 0.0062, g: 0.5256, b: 0.7639 },
  { r: 0.0283, g: 0.7031, b: 0.2330 },
  { r: 0.2957, g: 0.7776, b: 0.0571 },
  { r: 0.9157, g: 0.6884, b: 0.0628 },
  { r: 0.9007, g: 0.2633, b: 0.0185 },
  { r: 0.7639, g: 0.0357, b: 0.0062 },
  { r: 0.3998, g: 0.0027, b: 0.0027 }
];

export const blue_white_noise = [	{ r: 0.0, g: 0.0, b: 0.2 },
									{ r: 0.1, g: 0.1, b: 0.4 },
									{ r: 0.8, g: 0.8, b: 0.8 } ];
								
export const mag_cyan_noise = [		{ r: 0.6, g: 0.0, b: 0.6 },
									{ r: 0.0, g: 0.0, b: 1.0 },
									{ r: 0.0, g: 0.8, b: 0.8 } ];
								
export const yellow_green_noise = [		{ r: 0.0, g: 0.4, b: 0.0 },
									{ r: 0.0, g: 0.1, b: 0.0 },
        							{ r: 0.9, g: 0.55, b: 0.0 } ];
        						
export const greens_blues_noise = [	{ r: 0.0, g: 0.0, b: 0.2 },
									{ r: 0.0, g: 0.2, b: 0.3 },
        							{ r: 0.1, g: 0.5, b: 0.0 },
									{ r: 0.0, g: 0.2, b: 0.0 } ];
