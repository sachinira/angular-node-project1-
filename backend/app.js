const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/angular-database')
.then(()=>{
    console.log('Connected to the database!');   
}).catch(()=>{
    console.log('Connection failed!');   
});



// we are using this capital letter to show that this is from a blueprint
const Post = require('./models/post'); 

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

// another feature of body parser 
//app.use(bodyparser.urlencoded({ extended: false}));//parse url ncoded data

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, DELETE, PATCH, PUT, OPTIONS");
    next();
});

//post contains extra data to be fetched in it  so we have to use a middleware called as 
//body parser which parses the incoming requests body and extract the incoming data 
app.post('/api/posts',(req,res,next)=>{
    //const post = req.body;//body is given by body parser middleware

    //we are passing the Post object to the database
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save().then(result =>{
        console.log(result);   
        
        console.log(post);
        res.status(201).json({
            message: 'posts added successfully',
            postId: result._id
        });//use json to send back json data
    }); //save method is provided by the mongoose package this post is called a document and it is save in a collection
    //normally collection gets the plural form of the model created 

    //we only log the post to the console write now. we have to send this post to the database
    
});

app.get('/api/posts',(req,res,next) =>{

    Post.find().then(data=>{
        res.status(200).json({
            message: 'Posts send successfully',
            posts:data
        });
        console.log(data);
        //we can add a catch block if we want it will be covered in the error handling section
        
    }); //By this find we get all the posts stored in the database find the ways to get only one resul
    //in the mongoose docs   
});

// then we have to wireup the express app to the server the js


app.get('/api/posts/:id',(req,res,next)=>{

    //we have to reach the database and find a posts with the given id
    Post.findById(req.params.id).then(post=>{

        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post not found!'});
        }

    });

});


//deleting a post in the app
app.delete('/api/posts/:id',(req,res,next)=>{
    //console.log(req.params.id); we have to delete the relevent post that deletes
    //post is the model we created

    //by using the then we are seing the result of the operation
    Post.deleteOne({_id: req.params.id }).then((result)=>{
        console.log(result);
    });
    res.status(200).json({message: 'Post deleted!'});
});

//we have to create a put request to update the posts we get sing the id where we can put a new resourse completely update
//the old one with it or patch  only update an existing resorse new values
app.put('/api/posts/:id',(req,res,next)=>{
    //we use mongoose to update the resourse 

    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    });
    Post.updateOne({_id: req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message: 'Post updated!'});

    });

});


module.exports = app;

