const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
   email: { type: String, unique: true,required: true },
   password: { type: String, required:true}
});

userSchema.plugin(uniqueValidator);//mongoose doesn't originally have this validation so a third party package is installed to get that uique validator
//to put an error


module.exports = mongoose.model('User',userSchema);