const express = require('express');
const app = express();

app.use(express.json());

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons',(request,response) => {
    response.status(200).json(persons);
});

app.get('/api/persons/:id',(request,response)=> {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if(!person) {
        return response.status(404).json({
            error:'invalid id',
        })
    }

    response.json(person);
})

app.get('/info',(request,response)=> {
    let info = `<p>Phonebook has info for ${persons.length} people</p>`;
    info = info.concat(`<p>${new Date()}</p>`);
    response.send(info);
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
})