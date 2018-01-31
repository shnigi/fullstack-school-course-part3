const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let persons = [
    {
    "name": "Jaska Jokunen",
    "number": "040-123456",
    "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "niki",
      "number": "11111",
      "id": 4
    }
  ];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
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
  const person = persons.filter(person => person.id !== id);

  res.status(204).end();
})


app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log('body', body);

  if (body === undefined) {
    return res.status(400).json({error: 'content missing'})
  }

  const personData = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: Date.parse(Date())/1000
  }

  persons = persons.concat(personData)

  res.json(persons)
})

app.get('/info', (req, res) => {
  const contactsAmount = persons.length;
  const date = Date();
  res.send(`<h1>Puhelinluettelossa on ${contactsAmount} henkilön tiedot</h1>
            <p>${date}</p>`);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
