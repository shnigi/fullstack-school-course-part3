const mongoose = require('mongoose')

// const url = 'mongodb://admin:admin@ds223268.mlab.com:23268/koulukanta'
const url = process.env.MONGODB_URI;

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String
});

module.exports = Person
