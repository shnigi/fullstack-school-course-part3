const mongoService = require('./models/tietokanta');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json());
// app.use(morgan('tiny'));
app.use(express.static('build'))

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body - :response-time ms'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/api/persons', (req, res) => {
    mongoService
    .find({}, {__v: 0})
    .then(result => {
      res.json(result.map(formatPerson));
      })
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  // const person = persons.filter(person => person.id !== id);
  // res.json(person);
  res.status(204).end();
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  // TODO
})

const nameExists = (data) => {
  const name = data.name;
  const person = persons.find(person => person.name === name);
  if (person) {
    return true;
  }
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body === undefined) {
    return res.status(400).json({error: 'content missing'})
  }
  if (!body.name || !body.number) {
    return res.status(400).json({error: 'Name or number missing'})
  }
  // if (nameExists(body)) {
  //   return res.status(400).json({error: 'Name must be unique'})
  // }

  const personData = new mongoService ({
    name: body.name,
    number: body.number
  });

  personData
    .save()
    .then(result => {
      res.status(201).end();
      })
})

app.get('/info', (req, res) => {
  const contactsAmount = persons.length;
  const date = Date();
  res.send(`<h1>Puhelinluettelossa on ${contactsAmount} henkilön tiedot</h1>
            <p>${date}</p>`);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
