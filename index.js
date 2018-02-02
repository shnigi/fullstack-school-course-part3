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
  mongoService
     .findById(req.params.id, {__v: 0})
     .then(result => {
       res.json(formatPerson(result));
     })
     .catch(error => {
       res.status(400).send({ error: 'malformatted id' })
     })
});

app.delete('/api/persons/:id', (req, res) => {
  mongoService
    .findByIdAndRemove(req.params.id, {__v: 0})
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  mongoService
     .findByIdAndUpdate(req.params.id, req.body, { new: true } )
     .then(updatedPerson => {
       res.json(formatPerson(updatedPerson))
     })
     .catch(error => {
       console.log(error)
       res.status(400).send({ error: 'malformatted id' })
     })
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

  mongoService
  .find({name: body.name})
  .then(result => {
    if (result.length > 0) {
      res.send(405, 'Duplicate found, method Not Allowed');
    }

    personData
      .save()
      .then(result => {
        res.status(201).end();
        })

  })
})

app.get('/info', (req, res) => {
  mongoService
  .find({}, {__v: 0})
  .then(result => {
    console.log('result', result);
    const contactsAmount = result.length;
    const date = Date();
    res.send(`<h1>Puhelinluettelossa on ${contactsAmount} henkilön tiedot</h1>
          <p>${date}</p>`);
    })
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
