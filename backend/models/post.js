const mongoose = require('mongoose');


//here we create a bluprint of t he object in the collection as the table classes in java tis is called a schema 

const postSchema = mongoose.Schema({
    title: { type: String , required: true},
    content: { type: String , required: true},
    imagePath: {type: String , required: true}
});


//this is the module wchich export to the other files we use in the app.js file 

module.exports = mongoose.model('Post', postSchema);