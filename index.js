/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Contact = require('./models/contact');
const ElementNotFoundError = require('./utils/ElementNotFoundError');

app.use(express.static('build'));
app.use(express.json());

morgan.token('req-body', (req) => {
	return JSON.stringify(req.body);
});
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

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;

	Contact.findById(id)
		.then(contact => {
			if (!contact) {
				throw new ElementNotFoundError(`Element with id ${id} does not exist`);
			}

			response.json(contact);
		})
		.catch(err => next(err));
})

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;

	Contact.findByIdAndRemove(id)
		.then(res => {
			response.status(204).end();
		})
		.catch(err => next(err));
})

app.post('/api/persons', (request, response, next) => {
	const { name, number } = request.body;

	const contact = new Contact({
		name,
		number,
	})

	contact.save()
		.then(contact => {
			response.status(201).json(contact);
		})
		.catch(err => next(err));
})

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	const { name, number } = request.body;


	const contact = {
		name,
		number,
	}

	Contact.findByIdAndUpdate(id, contact, {
		new: true,
		runValidators: true,
		context: 'query',
	})
		.then(updatedContact => {
			if (!updatedContact) {
				throw new ElementNotFoundError(`Element with id ${id} does not exist`);
			}

			response.json(updatedContact);
		})
		.catch(err => next(err));
})

app.use((request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
})

//Error Handling
const errorHandler = (error, request, response, next) => {
	console.log(error.message);
	console.log(error.name);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformed id' });
	} else if (error.name === 'ElementNotFoundError') {
		return response.status(404).send({ error: 'Invalid ID: element does not exist' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message });
	}

	next(error);
}
app.use(errorHandler);

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})
