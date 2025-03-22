let accumulated_seconds = 0;
let previous_seconds = 0;
let accumulated_minutes = 0;
let previous_minutes = 0;
let accumulated_hours = 0;
let previous_hours = 0;

function intervalAction(animate = true) {
	let now = new Date();
    let ukTime = new Intl.DateTimeFormat('en-GB', { 
        timeZone: 'Europe/London', 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    }).format(now);

    let [hours, minutes, seconds] = ukTime.split(':').map(Number);
    
	let second_hand = document.querySelector(".second-hand");
	let minute_hand = document.querySelector(".minute-hand");
	let hour_hand = document.querySelector(".hour-hand");

	// Seconds keep going up for continuous smooth animation
	
	if(seconds != previous_seconds)
	{
		if(seconds < previous_seconds)
			accumulated_seconds += 60;
		previous_seconds = seconds;
	}	

	// Only move the minute hand once every 15 seconds. Less drawing needed.
	const fminutes =	minutes + (Math.floor(seconds % 60 / 15) * 15) / 60;
	
	if(fminutes != previous_minutes)
	{
		if(fminutes < previous_minutes)
			accumulated_minutes += 60;
		previous_minutes = fminutes;
	}	
	
	// Hour hand is redrawn once every minute.
	const fhours = hours % 12 + (minutes / 60);

	if(fhours != previous_hours)
	{
		if(fhours < previous_hours)
			accumulated_hours += 12;
		previous_hours = fhours;
	}	

    // Calculate hand rotation in degrees
    const secondsDegrees = ((accumulated_seconds + seconds) / 60) * 360;
    const minutesDegrees = ((accumulated_minutes + fminutes) / 60) * 360;
    const hoursDegrees = ((accumulated_hours + fhours) / 12) * 360;

	if(animate == false)
	{
		second_hand.style.transition = "0s";
		minute_hand.style.transition = "0s";
		hour_hand.style.transition = "0s";
	}
	else
	{
		second_hand.style.transition = "transform 1s linear";
		minute_hand.style.transition = "1s";
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