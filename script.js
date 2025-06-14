document.addEventListener('DOMContentLoaded', () => {
    // -----------------
    // --- CONFIGURATION ---
    // -----------------
    // IMPORTANT: Get your own free API key from https://www.tomorrow.io/
    const TOMORROW_API_KEY = 'YOUR_TOMORROW_IO_API_KEY'; // <--- PASTE YOUR API KEY HERE

    // Search provider URL. {query} will be replaced with the search term.
    const SEARCH_PROVIDER = 'https://duckduckgo.com/?q={query}';

    // -----------------
    // DOM Elements
    // -----------------
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const weatherElement = document.getElementById('weather');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    // -----------------
    // Random Anime Background
    // -----------------
    function setRandomAnimeBackground() {
        const backgrounds = [
            'https://i.imgur.com/vH32p5A.jpg', // City at Night
            'https://i.imgur.com/sS4a5sA.jpg', // Girl on Train
            'https://i.imgur.com/1O8y01T.png', // Lofi Room
            'https://i.imgur.com/aQx4L9I.jpg', // Spirited Away Train
            'https://i.imgur.com/kR1w2i9.jpg', // Your Name Comet
            'https://i.imgur.com/k91Jv2J.jpg', // City Street
            'https://i.imgur.com/sT4IqVq.jpg', // Ramen Shop
            'https://i.imgur.com/mU4P2eL.jpg'  // Night Sky
        ];
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        const randomBgUrl = backgrounds[randomIndex];
        document.body.style.backgroundImage = `url('${randomBgUrl}')`;
    }

    // -----------------
    // Clock and Date
    // -----------------
    function updateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        clockElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
        dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    }

    // -----------------
    // Search
    // -----------------
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const searchUrl = SEARCH_PROVIDER.replace('{query}', encodeURIComponent(query));
            window.location.href = searchUrl;
        }
    });

    // -----------------
    // Weather
    // -----------------
    const weatherCodeMap = {
        0: { description: 'Unknown', icon: 'ph-fill ph-question' },
        1000: { description: 'Clear', icon: 'ph-fill ph-sun' },
        1100: { description: 'Mostly Clear', icon: 'ph-fill ph-sun' },
        1101: { description: 'Partly Cloudy', icon: 'ph-fill ph-cloud-sun' },
        1102: { description: 'Mostly Cloudy', icon: 'ph-fill ph-cloud' },
        1001: { description: 'Cloudy', icon: 'ph-fill ph-cloud' },
        2000: { description: 'Fog', icon: 'ph-fill ph-cloud-fog' },
        2100: { description: 'Light Fog', icon: 'ph-fill ph-cloud-fog' },
        4000: { description: 'Drizzle', icon: 'ph-fill ph-cloud-drizzle' },
        4001: { description: 'Rain', icon: 'ph-fill ph-cloud-rain' },
        4200: { description: 'Light Rain', icon: 'ph-fill ph-cloud-rain' },
        4201: { description: 'Heavy Rain', icon: 'ph-fill ph-cloud-lightning' },
        5000: { description: 'Snow', icon: 'ph-fill ph-cloud-snow' },
        5100: { description: 'Light Snow', icon: 'ph-fill ph-cloud-snow' },
        8000: { description: 'Thunderstorm', icon: 'ph-fill ph-cloud-lightning' },
    };

    async function fetchWeather(lat, lon) {
        if (TOMORROW_API_KEY === 'YOUR_TOMORROW_IO_API_KEY' || !TOMORROW_API_KEY) {
            weatherElement.innerHTML = `<span>Add API key for weather</span>`;
            console.error("Weather Error: Missing Tomorrow.io API Key in script.js");
            return;
        }
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}×teps=current&units=metric&apikey=${TOMORROW_API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            const values = data.timelines.minutely[0].values;
            const temp = Math.round(values.temperature);
            const weatherCode = values.weatherCode;
            const weatherInfo = weatherCodeMap[weatherCode] || weatherCodeMap[0];
            weatherElement.innerHTML = `
                <span>${temp}°C</span>
                <span>${weatherInfo.description}</span>
                <i class="${weatherInfo.icon}"></i>
            `;
        } catch (error) {
            weatherElement.innerHTML = `<span>Could not fetch weather</span>`;
            console.error("Weather fetch error:", error);
        }
    }

    function getWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
                (error) => {
                    console.error("Geolocation error:", error);
                    weatherElement.innerHTML = `<span>Enable location for weather</span>`;
                }
            );
        } else {
            weatherElement.innerHTML = `<span>Geolocation not supported</span>`;
        }
    }

    // -----------------
    // Initializations
    // -----------------
    setRandomAnimeBackground();
    updateTime();
    setInterval(updateTime, 1000);
    getWeather();
});
