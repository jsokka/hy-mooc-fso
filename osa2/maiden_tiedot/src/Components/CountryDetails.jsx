import CountryWeather from "./CountryWeather"

const CountryDetails = ({ country, weather, onClose }) => {
  const languages = Object.values(country.languages)
  return (
    <div>
      <h1>
        <button style={{ display: "block" }} onClick={onClose}>close</button>
        {country.name.common}
      </h1>
      <div>
        <div>Capital(s): {country.capital.join(', ')}</div>
        <div>Area: {country.area}</div>
      </div>
      <div>
        <h2>Languages</h2>
        <ul>
          {languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
      </div>
      <div>
        <img src={country.flags.svg} width={100} height={100} alt="flag" />
      </div>
      <CountryWeather countryName={country.name.common} weather={weather} />
    </div>
  )
}

export default CountryDetails