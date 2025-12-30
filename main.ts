window.navigator.geolocation.getCurrentPosition(success, error);
let area:string;
let state:string;
let weather:string;

function success(position:any):void {
    const lat:number = position.coords.latitude;
    const lon:number = position.coords.longitude;
    getAddress(lat,lon);
}

function error():void {
    window.alert("Cant Fetch location");
}

async function getAddress(lat:number, lon:number):Promise<void> {
    const fetchResult:Response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
    const jsondata:any = await fetchResult.json();

    area = jsondata.address.town || jsondata.address.city || jsondata.address.village;
    state = jsondata.address.state;

    const areaName = document.getElementById("areaName") as HTMLElement | null;
    if(areaName) areaName.innerText = area;

    const stateName = document.getElementById("state") as HTMLElement | null;
    if(stateName) stateName.innerText = state;

    await getWeather(lat,lon);
}

async function getWeather(lat:number, lon:number):Promise<void> {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,precipitation,cloudcover,visibility,windspeed_10m,winddirection_10m,pressure_msl&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`);
    const data:any = await res.json();
    setWeather(data);
}

function setWeather(data:any):void {
    let weathercode = data.current_weather.weathercode;

    const weatherMeaning:{[key:number]:string} = {
        0:"Sunny",1:"MainlyClear",2:"PartlyCloudy",3:"Cloudy",45:"Fog",48:"FreezingFog",51:"LightDrizzle",53:"ModerateDrizzle",55:"DenseDrizzle",
        61:"LightRain",63:"ModerateRain",65:"HeavyRain",66:"FreezingRain",67:"FreezingRain",71:"LightSnow",73:"ModerateSnow",75:"HeavySnow",77:"SnowGrains",
        80:"LightRainShowers",81:"ModerateRainShowers",82:"HeavyRainShowers",85:"LightSnowShowers",86:"HeavySnowShowers",95:"Thunderstorm",96:"Thunderstorm",99:"Thunderstorm"
    };

    let weatherText:string|undefined = weatherMeaning[weathercode];

    document.body.style.backgroundImage = `url('https://loremflickr.com/1920/1080/${weatherText}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    document.getElementById("currentWeather")!.innerHTML = (`
        <h1>Current Weather</h1>
        <h2>${data.current_weather.temperature}°C | ${data.current_weather.windspeed} km/h</h2>
        <h2>${weatherText}</h2>
    `);

    const dailyweather = document.getElementById("dailyWeather") as HTMLElement | null;
    if(dailyweather){
        dailyweather.innerHTML = "";
        for(let i=0;i<7;i++){
            dailyweather.innerHTML += `
                <div>
                    <p>Day ${i+1}</p>
                    <p>Max: ${data.daily.temperature_2m_max[i]}°C</p>
                    <p>Min: ${data.daily.temperature_2m_min[i]}°C</p>
                    <hr>
                </div>
            `;
        }
    }
}

const arr:string[]=["Free","OpenSource","Real Time"];
let text:HTMLElement|null = document.getElementById("swap");
let i:number=0;

setInterval(():void => {
    if (text)
            text.innerText = arr[i];
    i = (i + 1) % arr.length;
}, 3000);
