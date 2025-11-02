import weatherService from '../Services/weather'

const CountryWeather = ({ countryName, weather }) => {
  return (
    <div>
      <h2>Weather in {countryName}</h2>
      {weather ? (
        <div>
          <p>Temperature: {weather.main.temp} °C</p>
          <img src={weatherService.getWeatherIconUrl(weather.weather[0].icon)} alt="weather icon" />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  )
}

export default CountryWeather