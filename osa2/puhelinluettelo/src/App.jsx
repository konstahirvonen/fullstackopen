import { useEffect, useState } from 'react'
import axios from 'axios'

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

    if (props.persons.some(person => person.name === props.newName))
      return alert(`${props.newName} is already added to phonebook`)

    props.setPersons([...props.persons, {name: props.newName, number: props.newNumber}])
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
  
  return (
    <div>
      {personsToShow.map(person => 
        <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")

  const hook = () => {
    console.log('effect')
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook, [])
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter setFilter={setFilter}/>

      <h3>add a new</h3>

      <PersonForm 
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App