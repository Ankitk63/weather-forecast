function tempBg(){
  document.getElementById("screen").classList.add("temporary-background");
}
tempBg();
//clock function
function clock() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("clock").textContent =
    hours + ":" + minutes + ":" + seconds;
}
setInterval(clock, 1000);

//weather functions
function getWeatherByCity() {
  let formData = new FormData(document.getElementById("location-form"));

  fetch("weatherApp.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then(updateUI);
}

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        getWeatherByCoords(lat, lon);
      },
      function () {
        alert("Location access denied");
      },
    );
  }
}

function getWeatherByCoords(lat, lon) {
  fetch("weatherApp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "lat=" + lat + "&lon=" + lon,
  })
    .then((response) => response.json())
    .then(updateUI);
}

function createRain(){
  const container = document.getElementById("weather-effects");
  container.innerHTML = "";
  for(let i = 0; i < 150; i++){
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.top = Math.random()*100 + "%";
    drop.style.left = Math.random()*100 + "%";
    container.appendChild(drop);
  }

}
function createStars(){
  const container = document.getElementById("weather-effects");
  container.innerHTML = "";

  for(let i = 0; i < 120; i++){
    const star = document.createElement("div");
    star.className = "star";

    star.style.top = Math.random()*100 + "%";
    star.style.left = Math.random()*100 + "%";

    container.appendChild(star);
  }
}

function updateUI(data) {
  console.log(data);
  if (data.error) {
    alert(data.error);
    return;
  }

  document.getElementById("location-name").innerText = data.location;
  document.querySelector(".temperature").innerText = data.temp + "°C";
  document.getElementById("hypo").innerHTML =
    "↑ " +
    data.temp_max +
    "° / ↓ " +
    data.temp_min +
    "°<br />Feels like " +
    data.feels_like +
    "°";
  document.querySelector(".weather-description").innerText = data.desc;
  document.querySelector(".measure-humidity").innerText = data.humidity + "%";
  document.getElementById("humidity-fill").style.width = data.humidity + "%";
  
  //wind
  let windKm = data.wind * 3.6;
  document.getElementById("wind-speed").innerText = Math.round(windKm);
  let percent_wind = windKm / 50;
  let circumference = 314;
  document.getElementById("wind-progress").style.strokeDashoffset =
    circumference - percent_wind * circumference;

  //pressure
  let min = 980;
  let max = 1050;
  let percent_pressure = (data.pressure - min) / (max - min);
  let arcLength = 251;
  document.getElementById("pressure-progress").style.strokeDashoffset =
    arcLength - percent_pressure * arcLength;
  document.getElementById("pressure-value").innerText = data.pressure;

  //visibility
  let visibilityKm = data.visibility / 1000;
  const weatherMain = data.main.toLowerCase();
  document.getElementById("visibility-km").innerText = visibilityKm.toFixed(1);
  let percent = (visibilityKm / 10) * 100;
  document.getElementById("visibility-fill").style.width = percent + "%";

  // Weather Suggestions 
  let suggestions = [];

  // Temperature suggestions
  if (data.temp >= 35) {
    suggestions.push("🔥 High temperature. Stay hydrated.");
    suggestions.push("☀️ Avoid direct sunlight during afternoon.");
  }
  else if (data.temp <= 15) {
    suggestions.push("🧥 Cold weather. Wear warm clothes.");
  }
  else {
    suggestions.push("🌤️ Pleasant weather for outdoor activities.");
  }

  // Humidity suggestions
  if (data.humidity > 70) {
    suggestions.push("💧 High humidity. It may feel hotter.");
  }
  if (data.humidity < 30) {
    suggestions.push("🧴 Low humidity. Keep yourself hydrated.");
  }

  // Wind suggestions
  if (windKm > 20) {
    suggestions.push("🌬️ Strong winds outside. Be careful.");
  }

  // Rain suggestions
  if (weatherMain.includes("rain")) {
    suggestions.push("☔ Carry an umbrella.");
  }

  // Visibility suggestions
  if (visibilityKm < 2) {
    suggestions.push("🚗 Low visibility. Drive carefully.");
  }

  // Extreme alerts
  if (data.temp >= 40) {
    suggestions.push("⚠️ Heatwave Alert!");
  }

  // Display suggestions
  let suggestionList = document.getElementById("suggestion-list");
  suggestionList.innerHTML = "";

  suggestions.forEach(function(item){
    let li = document.createElement("li");
    li.innerText = item;
    suggestionList.appendChild(li);
  });

  // Dynamic Background
  const screen = document.getElementById("screen");
  // Remove previous background classes
  screen.classList.remove(
    "temporary-background",
    "sunny-day",
    "cloudy-day",
    "rainy-day",
    "clear-night",
    "cloudy-night"
  );

  // Detect day or night using real time
  const currentTime = data.currentTime;
  const sunrise = data.sunrise;
  const sunset = data.sunset;

  const isDay = currentTime >= sunrise && currentTime < sunset;

  
  const effects = document.getElementById("weather-effects");
  effects.innerHTML = "";

  if (weatherMain.includes("clear") && isDay) {
    screen.classList.add("sunny-day");
    effects.innerHTML = '<div class="sun"></div>';
  } 
  else if (weatherMain.includes("clear") && !isDay) {
    screen.classList.add("clear-night");
    createStars();
  } 
  else if (weatherMain.includes("cloud") && isDay) {
    screen.classList.add("cloudy-day");
    effects.innerHTML = '<div class="cloud"></div>';
  } 
  else if (weatherMain.includes("cloud") && !isDay) {
    screen.classList.add("cloudy-night");
    effects.innerHTML = '<div class="cloud"></div>';
  } 
  else if (weatherMain.includes("rain")) {
    screen.classList.add("rainy-day");
    createRain();
  } 
  else {
    screen.classList.add("sunny-day");
    effects.innerHTML = '<div class="sun"></div>';
  }
}

window.onload = function () {
  detectLocation();
};
setInterval(detectLocation, 300000);

//form toggle
document.getElementById("location-name").onclick = function () {
  let input = document.getElementById("location-change");
  if (input.style.display === "none" || input.style.display === "") {
    input.style.display = "block";
    document.getElementById("location-input").focus();
    document.getElementById("submitbtn").onclick=function(){
      if(document.getElementById("location-input").value.trim()!==""){
        input.style.display="none";
      }
    };
  } else {
    input.style.display = "none";
  }
};

// Prevent closing when clicking inside form
document.getElementById("location-change").onclick = function (e) {
  e.stopPropagation();
};

document
  .getElementById("location-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    getWeatherByCity();
    document.getElementById("location-input").value="";
    document.getElementById("location-input").ariaPlaceholder="Enter location...";
  });