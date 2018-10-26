const express = require('express');
const UserController = require('../controllers/cuser');

const router = express.Router();


//as we are going to sav a password we have to enrypt it so we are using a package called bcrypt

//the routes which must be reachable to users must not be protected

router.post("/signup",UserController.createUser);

router.post("/login",UserController.userLogin);




module.exports = router;