const apiKey = 'ba49b0ebd03dd496854f2123d3bf0407';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const feelsLikeElement = document.getElementById('feels-like');
const p = document.getElementById('p1');

// Event listener for search button
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeatherByCity(location);
    }
});

// Event listener for Enter key
locationInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const location = locationInput.value;
        if (location) {
            fetchWeatherByCity(location);
        }
    }
});

// Ask for user's location when the page loads
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                console.error('Error getting location:', error);
                p.textContent = "Location access denied. Please enter a city manually.";
            }
        );
    } else {
        p.textContent = "Geolocation is not supported by this browser.";
    }
};

// Function to fetch weather by city name
function fetchWeatherByCity(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetchWeather(url);
}

// Function to fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetchWeather(url);
}

// Function to fetch weather data and update UI
function fetchWeather(url) {
    p.textContent = "Loading..."; // Show loading message

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not available.');
            }
            return response.json();
        })
        .then(data => {
            const weather = data.weather[0].main.toLowerCase();

            locationElement.textContent = data.name;
            temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = `Condition: ${data.weather[0].description}`;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            windElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
            feelsLikeElement.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;

            // Update background image based on weather
            switch (weather) {
                case 'clear':
                    document.body.style.backgroundImage = "url('clear.jpg')";
                    break;
                case 'clouds':
                    document.body.style.backgroundImage = "url('clouds.jpg')";
                    break;
                case 'rain':
                    document.body.style.backgroundImage = "url('rain.jpg')";
                    break;
                case 'snow':
                    document.body.style.backgroundImage = "url('snow.jpg')";
                    break;
                case 'thunderstorm':
                    document.body.style.backgroundImage = "url('thunderstorm.jpg')";
                    break;
                case 'fog':
                case 'mist':
                case 'haze':
                    document.body.style.backgroundImage = "url('fog.jpg')";
                    break;
                default:
                    document.body.style.backgroundImage = "url('default.jpg')"; // Default background
                    break;
            }

            p.textContent = ""; // Clear loading message
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            p.textContent = "Please check your location or try again later.";
        });
}

// Reset to default when the input is edited
locationInput.addEventListener('input', () => {
    resetToDefault();
});

function resetToDefault() {
    locationElement.textContent = '';
    temperatureElement.textContent = '';
    descriptionElement.textContent = '';
    humidityElement.textContent = '';
    windElement.textContent = '';
    feelsLikeElement.textContent = '';
    p.textContent = '';
    document.body.style.backgroundImage = "url('default.jpg')";
}
