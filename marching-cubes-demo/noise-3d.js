// =====================================================================================
// Copyright (C) 2026 Christopher Kent http://c-sk8.github.io
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, version 3.
// =====================================================================================

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function fade(t) {
    return t * t * (3.0 - 2.0 * t);
}

function hash(x, y, z) {
    let h = x * 374761393 + y * 668265263 + z * 2147483647;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

export function noise3D(x, y, z) {

    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);

    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const n000 = hash(xi,     yi,     zi);
    const n100 = hash(xi + 1, yi,     zi);
    const n010 = hash(xi,     yi + 1, zi);
    const n110 = hash(xi + 1, yi + 1, zi);

    const n001 = hash(xi,     yi,     zi + 1);
    const n101 = hash(xi + 1, yi,     zi + 1);
    const n011 = hash(xi,     yi + 1, zi + 1);
    const n111 = hash(xi + 1, yi + 1, zi + 1);

    const x00 = lerp(n000, n100, u);
    const x10 = lerp(n010, n110, u);
    const x01 = lerp(n001, n101, u);
    const x11 = lerp(n011, n111, u);

    const y0 = lerp(x00, x10, v);
    const y1 = lerp(x01, x11, v);

    return lerp(y0, y1, w);
}
