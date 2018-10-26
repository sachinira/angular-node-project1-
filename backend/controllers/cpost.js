const Post = require('../models/post'); 


exports.createPost = (req,res,next)=>{// we can pass an extra middleware before handling the request by us. single means expecting only  a single file and try to find it in image property of request body
    //const post = req.body;//body is given by body parser middleware
    const url = req.protocol + "://" + req.get("host"); //this creates the url to the server 
    //we are passing the Post object to the database
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,  //this image path should ba a url to that image 
        creator: req.userData.userId
    });

  
    post.save().then(result =>{
        
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
    })
    .catch(error=>{
        res.status(500).json({
            message:'Creating a post failed!'
        });
    }); //save method is provided by the mongoose package this post is called a document and it is save in a collection
    //normally collection gets the plural form of the model created 

    //we only log the post to the console write now. we have to send this post to the database    
}


exports.getAllPost = (req,res,next) =>{

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
            message: 'Posts fetched successfully',
            posts:postsFetched, //we return all the data in the posts
            count:count
        });
        //console.log(data);
        //we can add a catch block if we want it will be covered in the error handling section
    })
    .catch(error=>{
        res.status(500).json({
            message:"Fetching posts failed!" //catch will only reach if something goes wrong only
        });
    }); //By this find we get all the posts stored in the database find the ways to get only one resul
    //in the mongoose docs   
}


exports.getOnePost = (req,res,next)=>{

    //we have to reach the database and find a posts with the given id
    Post.findById(req.params.id).then(post=>{

        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post not found!'});
        }

    })
    .catch(error=>{
        res.status(500).json({
            message:"Couldn't fetch the post"
        });
    });
}

exports.deletePost = (req,res,next)=>{
    //console.log(req.params.id); we have to delete the relevent post that deletes
    //post is the model we created

    //by using the then we are seing the result of the operation
    Post.deleteOne({_id: req.params.id,creator:req.userData.userId }).then((result)=>{
        if(result.n > 0){
            res.status(200).json({message: 'Post deleted!'});
        }else{
            res.status(401).json({message: 'Unauthorized !'});
        }
    })
    .catch(err=>{
        res.status(401).json({message: "Couldn't delete the post"});
        
    });
}


exports.updatePost = (req,res,next)=>{
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
        imagePath:req.body.imagePath,
        creator:req.userData.userId
    });
 
    Post.updateOne({_id: req.params.id,creator: req.userData.userId},post)
    .then(result=>{
        if(result.n > 0){
            res.status(200).json({message: 'Post updated!'});
        }else{
            res.status(401).json({message: 'Unauthorized !'});
        }
    })
    .catch(err=>{
        res.status(401).json({message: "Couldn't update post"});
        
    });

}