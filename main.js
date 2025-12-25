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

    document.getElementById("currentWeather").innerHTML = (`
        <h1>Current Weather</h1>
        <h2>${data.current_weather.temperature}°C | ${data.current_weather.windspeed} km/h</h2>
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













