const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', (req) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    console.log(person.name)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.number){
        return response.status(400).json({
            error: "number missing from request"
        })
    }else if(!body.name){
        return response.status(400).json({
            error: "name missing from request"
        })
    }else if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const updatedPerson = {
        "id": Math.floor(Math.random()*1000000000000),
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(updatedPerson)

    response.json(persons)
    
})

app.get('/info', (request, response) => {
    const numEntries = persons.length
    const article = numEntries > 1 ? 'people' : 'person'
    response.send(`<p>Phonebook has info for ${numEntries} ${article}</p><p>${Date().toLocaleString()}<\p>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)