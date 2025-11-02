import { useState } from 'react'
import { useEffect } from 'react'
import SearchForm from './Components/SearchForm'
import countryService from './Services/countries'
import weatherService from './Services/weather'
import CountryList from './Components/CountryList'
import CountryDetails from './Components/CountryDetails'

function App() {
  const [searchWord, setSearchWord] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCountryWeather, setSelectedCountryWeather] = useState(null)
  const [cachedWeathers, setCachedWeathers] = useState({})

  const hasApiKey = import.meta.env.VITE_WEATHER_API_KEY?.length > 0

  let matches = []
  if (allCountries.length > 0 && searchWord.length > 0) {
    matches = allCountries.filter(c => c.name.common.toLowerCase().indexOf(searchWord) != -1)
  }

  useEffect(() => {
    countryService.getAll().then((data) => {
      setAllCountries(data)
    })
  }, [])

  useEffect(() => {
    const exactMatch = matches.find(c => c.name.common.toLowerCase() == searchWord)
    if (exactMatch) {
      setSelectedCountry(exactMatch)
      return
    }

    if (matches.length > 1) {
      setSelectedCountry(null)
      return
    }

    if (matches.length === 1) {
      if (matches[0] !== selectedCountry) {
        setSelectedCountry(matches[0])
      }
      return
    }

    setSelectedCountry(null)
  }, [searchWord])

  useEffect(() => {
    if (selectedCountry) {
      const weather = cachedWeathers[selectedCountry.latlng]

      if (weather) {
        setSelectedCountryWeather(weather)
      } else {
        weatherService.getWeather(selectedCountry).then(weatherData => {
          setSelectedCountryWeather(weatherData)
          setCachedWeathers({
            ...cachedWeathers,
            [selectedCountry.latlng]: weatherData
          })
        })
      }
    }
  }, [selectedCountry])

  return (
    <>
      {!hasApiKey &&
        <div style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: 8, marginBottom: 12 }}>
          No API key for weather service defined!<br />
          Add a valid OpenWeatherMap API key as an env variable VITE_WEATHER_API_KEY
        </div>}
      <div style={{ marginTop: 12 }}>
        <SearchForm searchWord={searchWord} onChange={(value) => setSearchWord(value.toLowerCase())} />
      </div>
      {!selectedCountry
        ? <CountryList countries={matches} onSelectCountry={(c) => setSelectedCountry(c)} />
        : <CountryDetails
          country={selectedCountry}
          weather={selectedCountryWeather}
          onClose={() => setSelectedCountry(null)}
        />
      }
    </>
  )
}

export default App
