const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resizeCanvas();

let angleX = 0;
let angleY = 0;
let angleZ = 0;

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	scale = canvas.height * 0.4;
}

class Vector3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.h = 0;
    }

    add(v) {
        return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    norm() {
        const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Vector3d(this.x / length, this.y / length, this.z / length);
    }
}

function removeDuplicates(points) {
    const uniqueSet = new Set();
    const uniquePoints = [];

    for (const p of points) {
        const key = `${p.x.toFixed(6)},${p.y.toFixed(6)},${p.z.toFixed(6)}`; // Using 6 decimal places for precision
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            uniquePoints.push(p);
        }
    }

    return uniquePoints;
}

function subdivide(v1, v2, v3, spherePoints, depth) {
    if (depth === 0) {
        spherePoints.push(v1, v2, v3);
        return;
    }

    const v12 = v1.add(v2).norm();
    const v23 = v2.add(v3).norm();
    const v31 = v3.add(v1).norm();

    subdivide(v1, v12, v31, spherePoints, depth - 1);
    subdivide(v2, v23, v12, spherePoints, depth - 1);
    subdivide(v3, v31, v23, spherePoints, depth - 1);
    subdivide(v12, v23, v31, spherePoints, depth - 1);
}

function initializeSphere(spherePoints, depth) {
    const X = 0.525731112119133606;
    const Z = 0.850650808352039932;
    const vdata = [
        new Vector3d(-X, 0.0, Z), new Vector3d(X, 0.0, Z),
        new Vector3d(-X, 0.0, -Z), new Vector3d(X, 0.0, -Z),
        new Vector3d(0.0, Z, X), new Vector3d(0.0, Z, -X),
        new Vector3d(0.0, -Z, X), new Vector3d(0.0, -Z, -X),
        new Vector3d(Z, X, 0.0), new Vector3d(-Z, X, 0.0),
        new Vector3d(Z, -X, 0.0), new Vector3d(-Z, -X, 0.0)
    ];

    const tindices = [
        [0, 4, 1], [0, 9, 4], [9, 5, 4], [4, 5, 8], [4, 8, 1],
        [8, 10, 1], [8, 3, 10], [5, 3, 8], [5, 2, 3], [2, 7, 3],
        [7, 10, 3], [7, 6, 10], [7, 11, 6], [11, 0, 6], [0, 1, 6],
        [6, 1, 10], [9, 0, 11], [9, 11, 2], [9, 2, 5], [7, 2, 11]
    ];

    for (let i = 0; i < tindices.length; i++) {
        const [a, b, c] = tindices[i];
        subdivide(vdata[a], vdata[b], vdata[c], spherePoints, depth);
    }
}

// Example usage:
const spherePoints = [];
const depth = 4;  // Adjust depth as needed
initializeSphere(spherePoints, depth);
// This code produces duplicate points that we now need to remove.
console.log(`Generated ${spherePoints.length} points for the sphere.`);

let uniquePoints = [];
uniquePoints = removeDuplicates(spherePoints);

console.log(`Generated ${uniquePoints.length} points for the sphere.`);

for (let i = 0; i < uniquePoints.length; i++) {
	uniquePoints[i].h = (i / uniquePoints.length) * 360;
}
    
for (let i = 0; i < 6; i++) {
	const roundedx = uniquePoints[i].x.toFixed(2);
  //console.log(`x: ${roundedx} y: ${uniquePoints[i].y} z: ${uniquePoints[i].z} hue: ${uniquePoints[i].h}`);
}

function rotateX(point, angle) {
    let y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
    let h = point.h;
    return { x: point.x, y, z, h};
}

function rotateY(point, angle) {
    let x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
    let h = point.h;
    return { x, y: point.y, z, h};
}

function rotateZ(point, angle) {
    let x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    let y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
    let h = point.h;
    return { x, y, z: point.z, h};
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let projected = uniquePoints.map(p => rotateX(rotateY(rotateZ(p, angleZ), angleY), angleX));

 	const sorted_projected = projected.slice().sort((a, b) => a.z - b.z);

   sorted_projected.forEach(p => {
        let screenX = canvas.width / 2 + p.x * scale;
        let screenY = canvas.height / 2 + p.y * scale;

        // Calculate brightness based on z-depth
        //let pointsize = 1.5 + ((p.z + 1) / 2); 
        let pointsize = (scale / 150) + (((scale / 150) * p.z) / 3); 
        let brightness = (((p.z + 1) / 2) * 55) + 15;
 		//console.log(`${brightness}`);
       //let color = `rgb(${brightness}, ${brightness}, ${brightness})`;
		let color = `hsl(${p.h},70%,${brightness}%)`;
  		//console.log(p.h);

        ctx.beginPath();
        ctx.arc(screenX, screenY, pointsize, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });

    angleX += 0.003;
    angleY += 0.003;
    angleZ += 0.005;
    
   requestAnimationFrame(draw);
}

// Handle window resize
window.addEventListener('resize', () => {
	resizeCanvas();
});

draw();
