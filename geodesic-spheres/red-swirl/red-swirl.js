const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let angleX = 0;
let angleY = 0;
let angleZ = 0;

resizeCanvas();

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Example function to generate points on a geodesic sphere
function generateGeodesicSpherePoints(count) {
    let points = [];
    for (let i = 0; i < count; i++) {
        let phi = Math.acos(-1 + (2 * i) / count); // Latitude
        let theta = Math.PI * (1 + Math.sqrt(5)) * i; // Longitude
        let x = Math.cos(theta) * Math.sin(phi);
        let y = Math.sin(theta) * Math.sin(phi);
        let z = Math.cos(phi);
        points.push({ x, y, z });
    }
    return points;
}

function rotateX(point, angle) {
    let y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
    return { x: point.x, y, z};
}

function rotateY(point, angle) {
    let x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
    return { x, y: point.y, z};
}

function rotateZ(point, angle) {
    let x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    let y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
    return { x, y, z: point.z};
}

// Handle window resize
window.addEventListener('resize', () => {
	resizeCanvas();
});

// Generate sphere points
//const points = generateGeodesicSpherePoints(2562);
const points = generateGeodesicSpherePoints(2562);

function draw() {
   // ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'; // Fade effect
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	// Draw points with unique hues
    let projected = points.map(p => rotateX(rotateY(rotateZ(p, angleZ), angleY), angleX));

 	const sorted_projected = projected.slice().sort((a, b) => a.z - b.z);

	sorted_projected.forEach((p, i) => {
		let hue = (i / sorted_projected.length) * 360; // Unique hue for each point
        let brightness = ((p.z) / 2) * 50;
		ctx.fillStyle = `hsl(0, 100%, ${brightness}%)`;
		
		// Project 3D to 2D (simple perspective projection)
		let scale = 300;
		let x2D = canvas.width / 2 + p.x * scale;
		let y2D = canvas.height / 2 - p.y * scale;
		
		if(p.z > 0) {
		ctx.beginPath();
		ctx.arc(x2D, y2D, 2, 0, Math.PI * 2);
		ctx.fill();
		}
	});

    angleX += 0.003;
    angleY += 0.003;
    angleZ += 0.005;

   requestAnimationFrame(draw);

}

draw();