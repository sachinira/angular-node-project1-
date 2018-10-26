const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req,res,next)=>{

    //used in signup create a new user
    bcrypt.hash(req.body.password, 10) //10 is a hired number here a callback is fired when it is done and as an alternative a promise is used
    .then(hash =>{      //it takes the retured value of the bcrypt function as a hash value
        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
        .then(result=>{
            res.status(201).json({
                message: "user saved successfully",
                content: result
            })
        })
        .catch(err=>{
            res.status(500).json({ 
                    message: "Invalid  authetication credentials"
            });
        });
    });    
}


exports.userLogin = (req,res,next)=>{

    //first we have to fidout if the email address exists
    let fetchedUser;
    User.findOne({email:req.body.email})
    .then(user=>{
        
        if(!user){
            res.status(401).json({
                message: "Invalid  authetication credentials"
            });
        }
        fetchedUser = user;
        //hashes cannot be decoded but they create the same hash for same password 
        return bcrypt.compare(req.body.password,user.password);
    })
    .then(result=>{
          
        if(!result){
            res.status(401).json({
                message: "Invalid  authetication credentials"
            });
        }

        //second agument is the secret we created 
        const token = jwt.sign({ email:fetchedUser.email, userId: fetchedUser._id },
            "this_is_secret_this_must_be_long", //in node these environt variables are attached into a running process so we can access them there 
            { expiresIn: '1h'}
        );

        //we are creating a token with the id and email so that we can extract that id from the token
        
        res.status(200).json({
            message: "Authentication success",
            token: token,
            expiresIn:  3600,
            userId: fetchedUser._id
        });
    })
    .catch(err=>{
        res.status(401).json({
            message: "Invalid  authetication credentials"
        });
    });
}