const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log('Invalid parameters count');
}


const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster01-fullstackopen.dksmkwb.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).
    catch(err => {
        console.error('Connection to database failed');
        console.log(err.message);
        process.exit(1);
    })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Address = mongoose.model('contact', contactSchema);

if(process.argv.length === 5) {
    addContact();
} else if(process.argv.length === 3) {
    getAllContacts();
}

function addContact() {
    const name = process.argv[3];
    const number = process.argv[4];

    const newAddress = new Address({name, number});
    newAddress.save().then(result => {
        console.log(`Added '${result.name}: ${result.number}' to contacts`);
        mongoose.connection.close();
    })
}

function getAllContacts() {
    Address.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`);
        })
        mongoose.connection.close();
    })
}
