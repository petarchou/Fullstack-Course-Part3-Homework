require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Contact = require('./models/contact');


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
        tokens['req-body'](req, res)
    ].join(' ');
});
app.use(morgan('post-requests'));



//API
//TODO - Error Handling
app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts =>
        response.status(200).json(contacts)
    );
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;


    Contact.findById(id).then(contact => {
        response.json(contact);
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Contact.deleteOne({ _id: id }).then(res =>
        response.status(204).end());
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;
    if (!name || !number) {
        return response.status(400).json({
            error: 'missing information in body'
        });
    }
    // const duplicateNameFlag = persons.map(person => person.name)
    //     .findIndex(existingName => existingName === name);
    // if (duplicateNameFlag !== -1) {
    //     return response.status(400).json({
    //         error: 'Name already exists'
    //     })
    // }
    const contact = new Contact({
        name,
        number,
    })

    contact.save().then(contact => {
        response.status(201).json(contact);
    })
})

app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})