const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const goldenAngle = Math.PI * (3 - Math.sqrt(5));
const fadeDuration = 1000; // milliseconds for fade in/out
const fadeOutDelay = 5;   // ms between each deletedAt assignment
const seeds = [];

let currentSeed = 1;
let phase = "growing"; // or "waiting" or "fading"
let fadeStartIndex = 0;
let colorStopsIndex = 0;

let centerPoint = [];

function newCenterPoint() {
	centerPoint.x = canvas.width * 0.2;
	centerPoint.y = canvas.height * 0.2;
	centerPoint.x = centerPoint.x + (Math.random() * (canvas.width * 0.6));
	centerPoint.y = centerPoint.y + (Math.random() * (canvas.height * 0.6));
}

newCenterPoint();

const colorStopsArray=[

// Inspired by flowers
[[34,100,50],[120,60,40],[34,100,60],[120,40,30]],
[[300,60,70],[120,40,35],[300,70,60],[120,50,25]],
[[50,100,50],[40,100,40],[120,50,30],[120,60,40]],
[[0,100,50],[120,40,35],[0,100,60],[120,30,25]],
[[270,70,60],[120,40,30],[270,80,50],[120,30,20]],
[[39,100,60],[120,60,35],[39,100,50],[120,40,25]],
[[320,70,60],[120,50,30],[320,80,50],[120,40,20]],
[[190,80,50],[120,60,35],[190,90,60],[120,40,25]],
[[300,70,50],[330,70,60],[120,40,30],[120,30,20]],
[[33,100,55],[120,70,30],[33,90,45],[120,50,20]],

// Inspired by landscape and skies
[[210,100,70],[0,0,95],[120,60,35],[90,50,40]],
[[200,100,60],[0,0,100],[130,50,30],[80,40,30]],
[[20,100,50],[330,70,60],[270,60,50],[240,70,40]],
[[190,90,65],[0,0,98],[140,50,40],[60,80,60]],
[[210,100,65],[0,0,90],[120,50,30],[30,100,50]],
[[285,60,50],[320,80,60],[35,100,60],[0,0,95]],
[[240,90,60],[330,70,70],[30,100,50],[60,100,40]],
[[210,100,70],[0,0,100],[120,50,30],[35,100,50]],
[[195,100,60],[0,0,95],[140,60,30],[35,100,45]],
[[310,70,60],[28,100,55],[250,60,50],[0,0,90]],

// Rainbow inspired
[[210,100,50],[270,100,50],[330,100,50],[30,100,50],[90,100,50],[150,100,50],[180,100,50]],
[[60,100,50],[120,100,50],[180,100,50],[240,100,50],[300,100,50],[0,100,50],[30,100,50]],
[[120,100,50],[180,100,50],[240,100,50],[300,100,50],[0,100,50],[60,100,50],[90,100,50]],
[[300,100,50],[0,100,50],[30,100,50],[90,100,50],[150,100,50],[210,100,50],[270,100,50]],
[[180,100,50],[240,100,50],[300,100,50],[360,100,50],[60,100,50],[120,100,50],[150,100,50]]


];


colorStopsIndex = Math.floor(Math.random() * colorStopsArray.length);


function setSeedRadius() {
	const params = new URLSearchParams(window.location.search);
	const seed_radius = params.get('seedradius');

	if(seed_radius != null)
	{
		seedRadius = seed_radius;
		seedsScale = seedRadius * 1.3;
	}
}

let seedRadius = 15;
let seedsScale = seedRadius * 1.3;
setSeedRadius();

function setSeedsCount() {
	const params = new URLSearchParams(window.location.search);
	const seeds_count = params.get('seedscount');

	if(seeds_count != null)
		seedsCount = seeds_count;
}

let seedsCount = 610;
setSeedsCount();

// Interpolate between two HSL values
function interpolateColor(index, total, colorStops) {
    const t = index / (total - 1) * (colorStops.length - 1);
    const i = Math.floor(t);
    const frac = t - i;

    const [h1, s1, l1] = colorStops[i];
    const [h2, s2, l2] = colorStops[i + 1] || colorStops[i];

    // ---- hue interpolation with shortest path ----
    let dh = h2 - h1;
    if (Math.abs(dh) > 180) {
        dh = dh > 0 ? dh - 360 : dh + 360;
    }
    let h = (h1 + dh * frac + 360) % 360;

    // ---- standard linear interpolation for S and L ----
    const s = s1 + (s2 - s1) * frac;
    const l = l1 + (l2 - l1) * frac;

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function createSeed(index) {
  const rawAngle = index * goldenAngle;
  const angle = rawAngle;
  const radius = Math.sqrt(index) * seedsScale;

  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const color = interpolateColor(index, seedsCount, colorStopsArray[colorStopsIndex]);

  seeds.push({
    x,
    y,
    color,
    createdAt: performance.now(),
    deletedAt: null
  });
}


function assignDeletedAtSequentially() {
  if (fadeStartIndex < seeds.length) {
    seeds[fadeStartIndex].deletedAt = performance.now();
    fadeStartIndex++;
    setTimeout(assignDeletedAtSequentially, fadeOutDelay);
  } else {
    // Wait until all fades are complete then reset
    setTimeout(() => {
      seeds.length = 0;
      currentSeed = 1;
      phase = "growing";
      fadeStartIndex = 0;
      newCenterPoint();
    }, fadeDuration);
  }
}

function drawSeeds() {
  ctx.fillStyle = 'hsl(0, 0%, 0%)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const now = performance.now();
  for (const seed of seeds) {
    let radius = 0;
    let alpha = 0;

    if (phase === "growing" || phase === "waiting") {
      const progress = Math.min((now - seed.createdAt) / fadeDuration, 1);
      alpha = progress;
      radius = progress * seedRadius;
    } else if (phase === "fading" && seed.deletedAt) {
      const progress = Math.min((now - seed.deletedAt) / fadeDuration, 1);
      alpha = 1 - progress;
      radius = (1 - progress) * seedRadius;
    } else {
      alpha = 1;
      radius = seedRadius;
    }

    if (alpha > 0) {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(seed.x + centerPoint.x, seed.y + centerPoint.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = seed.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

function animate() {

  if (phase === "growing") {

    if (currentSeed < seedsCount) {
      drawSeeds(); // draw BEFORE adding new seed
      createSeed(currentSeed);
      currentSeed++;
    } else {
      phase = "waiting";
      setTimeout(() => {
        phase = "fading";
        // colorStopsIndex = (colorStopsIndex + 1) % colorStopsArray.length;
        colorStopsIndex = Math.floor(Math.random() * colorStopsArray.length);
        assignDeletedAtSequentially();
      }, 1000);
    }
  } else {
    drawSeeds();
  }

  requestAnimationFrame(animate);
}

animate();