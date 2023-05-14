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
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        // [2/3 digits] - [1+ digits]
        const pattern = /\d{2,3}-\d+$/;

        return pattern.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
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