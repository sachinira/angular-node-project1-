const multer = require('multer');// to get files to backend th bodyparser only works for url encoded data or json data

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg" //we can define mimetypes 
}



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

module.exports = multer({storage:storage}).single("image")