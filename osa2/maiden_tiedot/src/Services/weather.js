import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric'
const baseIconUrl = 'https://openweathermap.org/img/wn'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (country) => {
  if ((apiKey || '').length === 0) {
    return Promise.resolve(null)
  }
  return axios.get(baseUrl, {
    params: {
      appid: apiKey,
      lat: country.latlng[0],
      lon: country.latlng[1]
    }
  }).then(res => res.data).catch(err => {
    if (err.response.status === 401) {
      alert("Invalid API key for weather service")
    }
    console.error("Error fetching weather data:", err)
    return null
  })
}

const getWeatherIconUrl = (iconCode) => {
  return `${baseIconUrl}/${iconCode}@2x.png`
}

export default { getWeather, getWeatherIconUrl }