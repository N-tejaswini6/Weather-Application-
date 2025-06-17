// Weather Dashboard JavaScript

class WeatherApp {
    constructor() {
        this.currentWeather = null;
        this.forecast = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.getCurrentLocation();
    }

    bindEvents() {
        const searchForm = document.getElementById('searchForm');
        const locationBtn = document.getElementById('locationBtn');

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('locationInput').value.trim();
            if (location) {
                this.fetchWeatherByCity(location);
            }
        });

        locationBtn.addEventListener('click', () => {
            this.getCurrentLocation();
        });
    }

    showLoading() {
        this.isLoading = true;
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('weatherContent').classList.add('hidden');
        document.getElementById('welcomeMessage').classList.add('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
    }

    hideLoading() {
        this.isLoading = false;
        document.getElementById('loadingSpinner').classList.add('hidden');
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        document.getElementById('welcomeMessage').classList.add('hidden');
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': `<svg class="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5"></circle>
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                    </svg>`,
            '01n': `<svg class="w-12 h-12 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>`,
            '02d': `<svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '02n': `<svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '03d': `<svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '03n': `<svg class="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '04d': `<svg class="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '04n': `<svg class="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>`,
            '09d': `<svg class="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M16 14v2M8 14v2M12 16v2"></path>
                    </svg>`,
            '09n': `<svg class="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M16 14v2M8 14v2M12 16v2"></path>
                    </svg>`,
            '10d': `<svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M16 14v6M8 14v6M12 16v4"></path>
                    </svg>`,
            '10n': `<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M16 14v6M8 14v6M12 16v4"></path>
                    </svg>`,
            '11d': `<svg class="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>`,
            '11n': `<svg class="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>`,
            '13d': `<svg class="w-12 h-12 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M8 15h.01M8 18h.01M12 16h.01M12 19h.01M16 15h.01M16 18h.01"></path>
                    </svg>`,
            '13n': `<svg class="w-12 h-12 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      <path d="M8 15h.01M8 18h.01M12 16h.01M12 19h.01M16 15h.01M16 18h.01"></path>
                    </svg>`
        };
        
        return iconMap[iconCode] || iconMap['01d'];
    }

    getBackgroundGradient(iconCode) {
        const gradientMap = {
            '01d': 'from-blue-400 via-blue-500 to-blue-600',
            '01n': 'from-indigo-900 via-purple-900 to-gray-900',
            '02d': 'from-blue-300 via-blue-400 to-gray-500',
            '02n': 'from-gray-800 via-gray-900 to-black',
            '03d': 'from-gray-400 via-gray-500 to-gray-600',
            '03n': 'from-gray-700 via-gray-800 to-gray-900',
            '04d': 'from-gray-500 via-gray-600 to-gray-700',
            '04n': 'from-gray-800 via-gray-900 to-black',
            '09d': 'from-gray-600 via-blue-600 to-blue-700',
            '09n': 'from-gray-800 via-blue-900 to-black',
            '10d': 'from-blue-500 via-blue-600 to-gray-600',
            '10n': 'from-blue-900 via-gray-900 to-black',
            '11d': 'from-gray-700 via-yellow-600 to-orange-600',
            '11n': 'from-gray-900 via-purple-900 to-black',
            '13d': 'from-blue-200 via-blue-300 to-gray-400',
            '13n': 'from-blue-900 via-gray-800 to-gray-900'
        };
        
        return gradientMap[iconCode] || 'from-blue-400 via-blue-500 to-blue-600';
    }

    updateBackground(iconCode) {
        const app = document.getElementById('app');
        const gradient = this.getBackgroundGradient(iconCode);
        app.className = `min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000`;
    }

    async fetchWeatherData(lat, lon) {
        try {
            this.showLoading();
            this.hideError();
            
            // Simulated weather data for demo purposes
            const mockWeatherData = {
                name: 'San Francisco',
                country: 'US',
                temperature: 22,
                description: 'Partly cloudy',
                icon: '02d',
                feelsLike: 24,
                humidity: 65,
                windSpeed: 3.5,
                visibility: 10,
                pressure: 1013,
                uvIndex: 6
            };

            const mockForecastData = [
                { date: '2025-01-10', dayName: 'Today', high: 24, low: 18, description: 'Partly cloudy', icon: '02d' },
                { date: '2025-01-11', dayName: 'Tomorrow', high: 26, low: 19, description: 'Sunny', icon: '01d' },
                { date: '2025-01-12', dayName: 'Sunday', high: 23, low: 17, description: 'Light rain', icon: '10d' },
                { date: '2025-01-13', dayName: 'Monday', high: 21, low: 15, description: 'Cloudy', icon: '04d' },
                { date: '2025-01-14', dayName: 'Tuesday', high: 25, low: 18, description: 'Sunny', icon: '01d' }
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentWeather = mockWeatherData;
            this.forecast = mockForecastData;
            this.displayWeather();
            
        } catch (error) {
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async fetchWeatherByCity(cityName) {
        try {
            this.showLoading();
            this.hideError();
            
            // Simulated city-based weather data
            const mockWeatherData = {
                name: cityName,
                country: 'Demo',
                temperature: 18,
                description: 'Overcast',
                icon: '04d',
                feelsLike: 20,
                humidity: 78,
                windSpeed: 2.1,
                visibility: 8,
                pressure: 1008,
                uvIndex: 3
            };

            const mockForecastData = [
                { date: '2025-01-10', dayName: 'Today', high: 20, low: 15, description: 'Overcast', icon: '04d' },
                { date: '2025-01-11', dayName: 'Tomorrow', high: 22, low: 16, description: 'Partly cloudy', icon: '02d' },
                { date: '2025-01-12', dayName: 'Sunday', high: 19, low: 14, description: 'Light rain', icon: '10d' },
                { date: '2025-01-13', dayName: 'Monday', high: 17, low: 12, description: 'Cloudy', icon: '04d' },
                { date: '2025-01-14', dayName: 'Tuesday', high: 21, low: 15, description: 'Sunny', icon: '01d' }
            ];

            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentWeather = mockWeatherData;
            this.forecast = mockForecastData;
            this.displayWeather();
            
        } catch (error) {
            this.showError('City not found. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    this.showError('Location access denied. Showing weather for London instead.');
                    console.warn('Geolocation error:', error);
                    // Fallback to default city when geolocation is denied
                    this.fetchWeatherByCity('London');
                }
            );
        } else {
            this.showError('Geolocation is not supported by this browser. Showing weather for London instead.');
            // Fallback to default city when geolocation is not supported
            this.fetchWeatherByCity('London');
        }
    }

    displayWeather() {
        if (!this.currentWeather) return;

        const weather = this.currentWeather;
        
        // Update background
        this.updateBackground(weather.icon);
        
        // Update main weather info
        document.getElementById('locationName').textContent = `${weather.name}, ${weather.country}`;
        document.getElementById('weatherIcon').innerHTML = this.getWeatherIcon(weather.icon);
        document.getElementById('temperature').textContent = `${Math.round(weather.temperature)}°`;
        document.getElementById('description').textContent = weather.description;
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(weather.feelsLike)}°`;
        
        // Update weather details
        document.getElementById('windSpeed').textContent = `${weather.windSpeed} m/s`;
        document.getElementById('humidity').textContent = `${weather.humidity}%`;
        document.getElementById('visibility').textContent = `${weather.visibility} km`;
        document.getElementById('pressure').textContent = `${weather.pressure} hPa`;
        
        // Update forecast
        this.displayForecast();
        
        // Show weather content
        document.getElementById('weatherContent').classList.remove('hidden');
        document.getElementById('welcomeMessage').classList.add('hidden');
    }

    displayForecast() {
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';
        
        this.forecast.forEach((day, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'bg-white/10 rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 weather-card';
            
            forecastItem.innerHTML = `
                <div class="text-white font-semibold mb-2">${day.dayName}</div>
                <div class="flex justify-center mb-3 weather-icon">
                    ${this.getWeatherIcon(day.icon)}
                </div>
                <div class="text-white text-lg font-bold mb-1">
                    ${Math.round(day.high)}°
                </div>
                <div class="text-white/70 text-sm mb-2">
                    ${Math.round(day.low)}°
                </div>
                <div class="text-white/80 text-xs capitalize">
                    ${day.description}
                </div>
            `;
            
            forecastGrid.appendChild(forecastItem);
        });
    }
}

// Initialize the weather app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});