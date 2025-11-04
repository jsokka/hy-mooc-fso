import { useEffect, useState, useRef } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const timeoutRef = useRef(null)

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
      if (!window.confirm(`'${newName}' is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const updateReq = { ...existingPerson, number: newNumber }
      personsService.updatePerson(updateReq.id, updateReq).then(updatedPerson => {
        setPersons(persons.map(p => p.id !== updateReq.id ? p : updatedPerson))
        showNotificationMessage(`Successfully updated phone number of '${updateReq.name}'`)
        setNewName('')
        setNewNumber('')
      })
    } else {
      const createReq = { name: newName, number: newNumber }
      personsService.createPerson(createReq).then(newPerson => {
        setPersons(persons.concat(newPerson))
        showNotificationMessage(`Successfully added '${newName}' to phonebook`)
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        console.log(error)
        showNotificationMessage(`Failed to add person! ${error.response.data.error}`, 'error', 10000)
      })
    }
  }

  const deletePerson = (id) => {
    var personToDelete = persons.find(p => p.id === id)
    if (!window.confirm(`Delete ${personToDelete.name}`)) {
      return
    }
    personsService.deletePerson(id).then(_ => {
      setPersons(persons.filter(p => p.id !== id))
      showNotificationMessage(`Successfully removed person '${personToDelete.name}' from phonebook`)
    }).catch(err => {
      showNotificationMessage(`'${personToDelete.name}' has already been removed from phone book`, "error", 10000)
      personsService.getAll().then(persons => {
        setPersons(persons)
      })
    })
  }

  const showNotificationMessage = (message, type = "", clearTimeout = 5000) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setMessage({ text: message, type: type })
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
      timeoutRef.current = null
    }, clearTimeout)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const shownPersons = filter.length > 0
    ? persons.filter(p => p.name.toLowerCase().indexOf(filter) != -1)
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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