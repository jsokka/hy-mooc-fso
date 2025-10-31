import { useEffect, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService.getAll().then(persons => {
      setPersons(persons)
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

  const addPerson = (e) => {
    e.preventDefault()

    if (newName.trim().length === 0) {
      return
    }

    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const updateReq = { ...existingPerson, number: newNumber }
      personsService.updatePerson(updateReq.id, updateReq).then(updatedPerson => {
        setPersons(persons.map(p => p.id !== updateReq.id ? p : updatedPerson))
      })
    } else {
      const createReq = { name: newName, number: newNumber }
      personsService.createPerson(createReq).then(newPerson => {
        setPersons(persons.concat(newPerson))
      })
    }

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    if (!window.confirm(`Delete ${persons.find(p => p.id === id).name}`)) {
      return
    }
    personsService.deletePerson(id).then(_ => {
      setPersons(persons.filter(p => p.id !== id))
    })
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
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={shownPersons} onDelete={(id) => deletePerson(id)} />
    </div>
  )

}

export default App