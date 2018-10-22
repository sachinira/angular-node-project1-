const express = require('express');
const path  = require('path'); //this converts paths safe to ru on any operating system
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb://localhost:27017/angular-database')
.then(()=>{
    console.log('Connected to the database!');   
}).catch(()=>{
    console.log('Connection failed!');   
});



//create the express app
const app = express();
// this is constant as we never override the concept

//every part of the funnel can do something from the middleware use keyword uses a middleware
/*
app.use((req,res,next) =>{
    console.log('First middleware');
    next();
    //if we exeecute the next function it continues it's journey
    //WHEN WE COMMENT THE NEXT THE FIRST MIDDLEWARE EXECUTED AND IT DOESN'T SEND A RESPONSE SO THAT IT ,TIMEOUT AFTER SOMETIME
});*/

app.use(bodyparser.json());//returns a valid express middleware to parse the data in the request body
app.use("/images",express.static(path.join("backend/images")));  //we are using the middleware to access the images file  this means any request targetting /images must given authentication
//path allows to forward the url targetting /images to backend/images
// another feature of body parser 
//app.use(bodyparser.urlencoded({ extended: false}));//parse url ncoded data

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, DELETE, PATCH, PUT, OPTIONS");
    next();
});


//we configure the file posts to only requests which are configured to the routes "/api/posts"
app.use("/api/posts",postsRoutes);

module.exports = app;

