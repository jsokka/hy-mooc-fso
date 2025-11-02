const SearchForm = ({ onChange, searchWord }) => {
  return (
    <form>
      <label>
        search countries: <input value={searchWord} onChange={(e) => onChange(e.target.value)} />
      </label>
    </form>
  )
}

export default SearchForm