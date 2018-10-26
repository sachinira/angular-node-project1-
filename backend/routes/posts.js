const express = require('express');
// we are using this capital letter to show that this is from a blueprint
const tokenValidator = require("../middleware/token-validator");
const postController = require("../controllers/cpost");

const Multer = require("../middleware/file");


const router = express.Router();


//post contains extra data to be fetched in it  so we have to use a middleware called as 
//body parser which parses the incoming requests body and extract the incoming data 
router.post('',tokenValidator,Multer,postController.createPost);

router.get('',postController.getAllPost);

// then we have to wireup the express app to the server the js
router.get('/:id',postController.getOnePost);


//deleting a post in the app w have to deny if the post is created by another user
router.delete('/:id',tokenValidator,postController.deletePost);

//we have to create a put request to update the posts we get sing the id where we can put a new resourse completely update
//the old one with it or patch  only update an existing resorse new values

//we have to multer here too
router.put('/:id',tokenValidator,Multer,postController.updatePost);


module.exports = router;