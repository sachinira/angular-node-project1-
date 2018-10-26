const jwt = require("jsonwebtoken");

//middleware executes before any other function execute in the routes

module.exports = (req,res,next)=>{

    //if we don't have an header trying to get it will throw an error
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "this_is_secret_this_must_be_long");

        req.userData = {
            email:decodedToken.email,
            userId:decodedToken.userId
        };//so this must be added before the next because next allows to run otherthings  

        next(); //this let the execution continue

        //by using the verify method the token is validated again
        //express js can add new fields /data to the request
        
    }
    catch(err){
        res.status(401).json({
            message: "You are not authenticated!",
            error:err
        })
    }
    //the token in the header is carried as Bearer jfvjwfv2'.. so we have to take the real token like this
};