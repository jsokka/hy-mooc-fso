import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNewNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNewNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const addNewName = (e) => {
    e.preventDefault()
    if (newName.trim().length === 0) {
      return
    }
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }

  const shownPersons = filter.length > 0
    ? persons.filter(p => p.name.toLowerCase().indexOf(filter) != -1)
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleNewNameChange}
        onNumberChange={handleNewNumberChange}
        onSubmit={addNewName}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons} />
    </div>
  )

}

export default App