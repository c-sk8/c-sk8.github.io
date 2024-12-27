let accumulated_seconds = 0;
let previous_seconds = 0;
let accumulated_minutes = 0;
let previous_minutes = 0;
let accumulated_hours = 0;
let previous_hours = 0;

function intervalAction(animate = true) {
    const now = new Date();
	let second_hand = document.querySelector(".seconds");
	let minute_hand = document.querySelector(".minutes");
	let hour_hand = document.querySelector(".hours");

    const seconds = now.getSeconds();

	if(seconds != previous_seconds)
	{
		if(seconds < previous_seconds)
			accumulated_seconds += 60;
		previous_seconds = seconds;
	}	

	const minutes = now.getMinutes();

	if(minutes != previous_minutes)
	{
		if(minutes < previous_minutes)
			accumulated_minutes += 60;
		previous_minutes = minutes;
	}	

	const hours = now.getHours();

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

	if(animate == false)
	{
		second_hand.style.transition = "0s";
		minute_hand.style.transition = "0s";
		hour_hand.style.transition = "0s";
	}
	else
	{
		second_hand.style.transition = "0.25s";
		minute_hand.style.transition = "0.25s";
		hour_hand.style.transition = "1s";
	}

    // Set rotation angle for each hand
    second_hand.style.transform = `rotate(${secondsDegrees}deg)`;
    minute_hand.style.transform = `rotate(${minutesDegrees}deg)`;
    hour_hand.style.transform = `rotate(${hoursDegrees}deg)`;
        
	return intervalAction;
}

intervalAction(false);

const myInterval = setInterval(intervalAction, 1000);

let resizeTimer;

window.addEventListener("resize", () => {
	document.body.classList.add("resize-animation-stopper");
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		document.body.classList.remove("resize-animation-stopper");
	}, 1000);
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
		document.body.classList.add("resize-animation-stopper");
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			document.body.classList.remove("resize-animation-stopper");
		}, 1000);
        // console.log("Tab is now visible.");
    } else if (document.visibilityState === "hidden") {
        // console.log("Tab is now hidden.");
    }
});