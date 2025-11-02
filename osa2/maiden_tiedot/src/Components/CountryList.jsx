const CountryList = ({ countries, onSelectCountry }) => {
  if (countries.length > 10) {
    return <span>Too many matches, specify another filter</span>
  }
  return (
    <ul>
      {countries.map(c => <CountryLisItem key={c.cca2} country={c} onSelect={onSelectCountry} />)}
    </ul>
  )
}

const CountryLisItem = ({ country, onSelect }) => {
  return (
    <li style={{ padding: 2 }}>
      <label style={{ marginRight: 4 }}>{country.name.common}</label>
      <button onClick={() => onSelect(country)}>Show</button>
    </li>
  )
}

export default CountryList