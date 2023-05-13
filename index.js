const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.static('build'));
app.use(express.json());

morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
})


morgan.format('post-requests', (tokens, req, res) => {
    if (req.method !== 'POST') {
        return null;
    }

    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        tokens['req-body'](req,res)
    ].join(' ');
});

app.use(morgan('post-requests'));



let persons = [
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

app.get('/api/persons', (request, response) => {
    response.status(200).json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (!person) {
        return response.status(404).json({
            error: 'invalid id',
        })
    }

    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const prevSize = persons.length;
    persons = persons.filter(p => p.id !== id);

    if (prevSize === persons.length) {
        return response.status(404).json({
            error: 'invalid id',
        });
    }
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const id = Math.round(Math.random() * 10000000);
    const { name, number } = request.body;
    if (!name || !number) {
        return response.status(400).json({
            error: 'missing information in body'
        });
    }
    const duplicateNameFlag = persons.map(person => person.name)
        .findIndex(existingName => existingName === name);
    if (duplicateNameFlag !== -1) {
        return response.status(400).json({
            error: 'Name already exists'
        })
    }
    const person = {
        id,
        name,
        number,
    };

    persons.push(person);
    response.status(201).json(person);
})

app.get('/info', (request, response) => {
    let info = `<p>Phonebook has info for ${persons.length} people</p>`;
    info = info.concat(`<p>${new Date()}</p>`);
    response.send(info);
})

app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})