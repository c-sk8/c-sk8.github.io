let accumulated_seconds = 0;

function setClockSize() {
  const params = new URLSearchParams(window.location.search);
  const size = params.get('size');

  let clockSize;

  switch (size) {
    case 'small':
      clockSize = '300px';
      break;
    case 'medium':
      clockSize = '500px';
      break;
    case 'large':
      clockSize = '800px';
      break;
    case 'xlarge':
      clockSize = '1200px';
      break;
    case 'width':
      clockSize = '100vw';
      break;
    case 'height':
    default:
      clockSize = 'calc(100vh - 20px)';
      break;
  }

  document.documentElement.style.setProperty('--clock_size', clockSize);
}

setClockSize();

function intervalAction() {
    const now = new Date();
	let second_hand = document.querySelector(".second-hand");
	let minute_hand = document.querySelector(".minute-hand");
	let hour_hand = document.querySelector(".hour-hand");

	// Seconds keep going up for continuous smooth animation
	if (now.getSeconds() == 0) accumulated_seconds += 60;
    const seconds = accumulated_seconds + now.getSeconds();

	// Only move the minute hand once every 5 seconds. Less drawing needed.
	const minutes = now.getMinutes() + (Math.floor(seconds % 60 / 5) * 5) / 60;

	// Hour hand is redrawn once every minute.
	const hours = now.getHours() + (now.getMinutes() / 60);

    // Calculate hand rotation in degrees
    const secondsDegrees = Math.round((seconds / 60) * 360);
    const minutesDegrees = (minutes / 60) * 360;
    const hoursDegrees = ((hours % 12) / 12) * 360;

    // Set rotation angle for each hand
    second_hand.style.transform = `rotate(${secondsDegrees}deg)`;
    minute_hand.style.transform = `rotate(${minutesDegrees}deg)`;
    hour_hand.style.transform = `rotate(${hoursDegrees}deg)`;
        
	return intervalAction;
}

intervalAction();

const myInterval = setInterval(intervalAction, 1000);

let resizeTimer;

window.addEventListener("resize", () => {
	document.body.classList.add("resize-animation-stopper");
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		document.body.classList.remove("resize-animation-stopper");
	}, 1000);
});