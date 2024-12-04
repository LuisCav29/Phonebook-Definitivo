const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Uso: node mongo.js <password> [<name> <number>]');
  process.exit(1);
}


const password = process.argv[2];


const url = `mongodb+srv://luisfelipecavazosarias:${password}@cluster0.iy81f.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);


mongoose.connect(url)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error conectándose a MongoDB:', err.message);
    process.exit(1);
  });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save()
    .then((result) => {
      console.log(`Added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error('Error al guardar la persona:', err.message);
      mongoose.connection.close();
    });

} else if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log('phonebook:');
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error('Error al recuperar los datos:', err.message);
      mongoose.connection.close();
    });
}
