const express = require('express');
const multer = require('multer');// to get files to backend th bodyparser only works for url encoded data or json data
// we are using this capital letter to show that this is from a blueprint
const Post = require('../models/post'); 

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg" //we can define mimetypes 
}


const router = express.Router();

const storage =  multer.diskStorage({
    destination: (req, file, callback)=>{//is a function executed whenever multer tries to save a file

        //we are going to put an error if the mimetype doesnot match one of the above
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mimetype");

        if(isValid){
            error = null;
        }

        callback(error,"backend/images"); //this image destination is tacken in relation to the server.js file
    },
    filename: (req, file, callback)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');//this expression will miss the filetype so,
        //multer automatically gives the mimetype

        //then we are getting the extention
        const extention = MIME_TYPE_MAP[file.mimetype]; //this file mimetype prperty will be one of the type in the map
        callback(null,name + '-' + Date.now() + '.' + extention);//ths set the filename from the backend
    }   //then we have tell multer what the filename is
    
});



//post contains extra data to be fetched in it  so we have to use a middleware called as 
//body parser which parses the incoming requests body and extract the incoming data 
router.post('',multer({storage:storage}).single("image"),(req,res,next)=>{// we can pass an extra middleware before handling the request by us. single means expecting only  a single file and try to find it in image property of request body
    //const post = req.body;//body is given by body parser middleware
    const url = req.protocol + "://" + req.get("host"); //this creates the url to the server 
    //we are passing the Post object to the database
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename  //this image path should ba a url to that image 
    });

    post.save().then(result =>{
        console.log(result);   
        
        console.log(post);
        res.status(201).json({
            message: 'posts added successfully',
            post: {


                //new way to to this migration
                ...result,//create a copy of the objet and override some selected properties
                id: result._id,
               /* title: result.title,
                content: result.content,
                imagePath: result.imagePath*/ //no writing all like this
            }
        });//use json to send back json data
    }); //save method is provided by the mongoose package this post is called a document and it is save in a collection
    //normally collection gets the plural form of the model created 

    //we only log the post to the console write now. we have to send this post to the database
    
});

router.get('',(req,res,next) =>{

    //using then is executing a promise

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;//these two are taken from the query parameters passed with the url
    let postsFetched;
    //we are goig to fetch a selected size of query for a selected 
    const postQuery = Post.find();

    if(pageSize && currentPage){
        //WE HAVE TO manipulate in case there is query parameters
        //here skip method and  is provided by mongooose
        //we will not retrive all ekements but skip the first n posts
        //limit limits he amount of documents we return 
        //this method is inapplicable for very large databases
        //the extracted values from the query parameters will always be strings
        postQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize);

        //we can also find how may posts we have by combining multiple different queries so we have to create a promise chain
        //to get the posts and count them and return both posts and count
    }

    postQuery
    .then( data =>{
        postsFetched = data;
        return Post.count(); //data returned cannot be used in this then block so it must be taken     
    })
    .then(count =>{
        res.status(200).json({
            message: 'Posts send successfully',
            posts:postsFetched,
            count:count
        });
        //console.log(data);
        //we can add a catch block if we want it will be covered in the error handling section
    }); //By this find we get all the posts stored in the database find the ways to get only one resul
    //in the mongoose docs   
});

// then we have to wireup the express app to the server the js
router.get('/:id',(req,res,next)=>{

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
router.delete('/:id',(req,res,next)=>{
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

//we have to multer here too
router.put('/:id',multer({storage:storage}).single("image"),(req,res,next)=>{
    //we use mongoose to update the resourse 

    let imagePath = req.body.imagePath;
    //imagepath will be imagepath we will already has
    //here the imagepath is being undefined if we are submitting a string
    if(req.file){
        const url = req.protocol + "://" + req.get("host"); //this creates the url to the server 
        imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:req.body.imagePath
    });

    console.log(req.file +" hihihih");

    console.log(post);

    Post.updateOne({_id: req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message: 'Post updated!'});

    });

});


module.exports = router;