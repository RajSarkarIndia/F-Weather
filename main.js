window.navigator.geolocation.getCurrentPosition(success, error);
let area,state,weather;

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getAddress(lat,lon);
}
function error(){

    window.alert("Cant Fetch location");

}

async function getAddress(lat, lon) {
    const fetchResult = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
    const jsondata = await fetchResult.json();
    area = jsondata.address.town || jsondata.address.city || jsondata.address.village;
    state = jsondata.address.state;

const areaName=window.document.getElementById("areaName");
    areaName.innerText=area;
    const stateName=window.document.getElementById("state");
    stateName.innerText=state;
    getWeather(lat,lon);
}
async function getWeather(lat, lon) {

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,precipitation,cloudcover,visibility,windspeed_10m,winddirection_10m,pressure_msl&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`);


    const data = await res.json();
    setWeather(data);
}


function setWeather(data) {
    //background image

    let weathercode = data.current_weather.weathercode;
    const weatherMeaning = {
        0: "Sunny",
        1: "MainlyClear",
        2: "PartlyCloudy",
        3: "Cloudy",
        45: "Fog",
        48: "FreezingFog",
        51: "LightDrizzle",
        53: "ModerateDrizzle",
        55: "DenseDrizzle",
        61: "LightRain",
        63: "ModerateRain",
        65: "HeavyRain",
        66: "FreezingRain",
        67: "FreezingRain",
        71: "LightSnow",
        73: "ModerateSnow",
        75: "HeavySnow",
        77: "SnowGrains",
        80: "LightRainShowers",
        81: "ModerateRainShowers",
        82: "HeavyRainShowers",
        85: "LightSnowShowers",
        86: "HeavySnowShowers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"
    };

    let weatherText = weatherMeaning[weathercode];
    document.body.style.backgroundImage = `url('https://loremflickr.com/1920/1080/${weatherText}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    document.getElementById("currentWeather").innerHTML = (`
        <h1>Current Weather</h1>
        <h2>${data.current_weather.temperature}°C | ${data.current_weather.windspeed} km/h</h2>
        <h2>${weatherText}</h2>
    `);


    const dailyweather=document.getElementById("dailyWeather");
    for(let i=0;i<7;i++){
        dailyweather.innerHTML =dailyweather.innerHTML+( `
            <div>
                <p>Day ${i+1}</p>
                <p>Max: ${data.daily.temperature_2m_max[i]}°C</p>
                <p>Min: ${data.daily.temperature_2m_min[i]}°C</p>
                <hr>
            </div>
        `);
    }

}




//front end design

const arr=["Free","OpenSource","Real Time"];
let text=window.document.getElementById("swap");
let i=0;
setInterval(() => {
    text.innerText = arr[i];
    i = (i + 1) % arr.length;
}, 3000);











