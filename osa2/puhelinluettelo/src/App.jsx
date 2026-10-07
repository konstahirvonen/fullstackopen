import { useEffect, useState } from 'react'
import personService from './services/persons'
import {Notification, ErrorMessage} from './components/Notification'

const Filter = (props) => {

  const handleFilter = (e) => {
  props.setFilter(e.target.value)
}

  return (
    <div>
      <form>
      <div>
        filter shown with
        <input 
          onChange={handleFilter}
        />
      </div>
    </form>
    </div>
  )
}

const PersonForm = (props) => {

  const handleName = (e) => {
    props.setNewName(e.target.value)
  }

  const handleNumber = (e) => {
    props.setNewNumber(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    if (props.persons.some(person => person.name === props.newName)) {
      const existingPerson = props.persons.find(person => person.name === props.newName)
    
      if (window.confirm(`${props.newName} is already added to phonebook, replace the old number with a new one?`))
        personService
          .update(existingPerson.id, {
            name: props.newName,
            number: props.newNumber 
          })
          .then(returnedPerson => {
            props.setPersons(props.persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            props.setMessage(`Changed ${existingPerson.name} number`)
            setTimeout(() => {
              props.setMessage(null)
            }, 5000)
          })
          .catch(error => {
            props.setErrorMessage(`${existingPerson.name} has already been removed from the server`)
            console.log(error)
          })
      
      return
    }
    //Oma idea tämä tarkistus, jottei pysty laittamaan tyhjää nimeä
    if (props.newName.trim() === "")
      return alert("Name cannot be empty")

    const personObject = {
      name: props.newName,
      number: props.newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        console.log("response")
        props.setPersons(props.persons.concat(returnedPerson))
        props.setNewName("")
        props.setNewNumber("")
        props.setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          props.setMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      <form onSubmit={addPerson}>
      <div>
        name: 
        <input
          value={props.newName}
          onChange={handleName}
        />
      </div>
      <div>
        number:
        <input
          value={props.newNumber}
          onChange={handleNumber}  
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    </div>
  )
}

const Persons = (props) => {

  const personsToShow = props.persons.filter(person =>
    person.name.toLowerCase().includes(props.filter.toLowerCase())
  )
  
  const deletePerson = id => {
    const person = props.persons.find(person => person.id === id)
    
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          props.setPersons(
            props.persons.filter(person => person.id !== id)
          )
          props.setMessage(`Removed ${person.name}`)
          setTimeout(() => {
            props.setMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      {personsToShow.map(person => 
        <p key={person.name}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      <ErrorMessage errorMessage={errorMessage} />

      <Filter setFilter={setFilter}/>

      <h3>add a new</h3>

      <PersonForm 
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        message={message}
        setMessage={setMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      <h3>Numbers</h3>

      <Persons 
        persons={persons}
        filter={filter}
        setPersons={setPersons}
        message={message} 
        setMessage={setMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        />
      
    </div>
  )

}

export default App