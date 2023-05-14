const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

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

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})


const Address = mongoose.model('contact', contactSchema);

module.exports = Address;