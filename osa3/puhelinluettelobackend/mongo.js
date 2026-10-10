const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} 

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb://konsta:${password}@ac-urez9vz-shard-00-00.lcc3iwd.mongodb.net:27017,ac-urez9vz-shard-00-01.lcc3iwd.mongodb.net:27017,ac-urez9vz-shard-00-02.lcc3iwd.mongodb.net:27017/?ssl=true&replicaSet=atlas-13v17i-shard-0&authSource=admin&appName=puhelinluettelo`

mongoose.set("strictQuery", false)
mongoose.connect(url, {family: 4})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
    name: name,
    number: number,
})

if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
