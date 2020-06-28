const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
const cors = require('cors');
const fs = require('fs')
app.use(cors());


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
    }
})

// Define the maximum size for uploading 
const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional 
        let filetypes = /text/;

        let mimetype = filetypes.test(file.mimetype);

        let extname = path.extname(file.originalname).toLowerCase();

        if (mimetype && extname) {
            console.log('success')
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // myFile is the name of file attribute 
}).single("myFile");


app.post("/uploadDoc", function (req, res) {
    

    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the file would not be uploaded! 

    upload(req, res, function (err) {
 
        if (err) {
            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.status(400).send('Something went wrong')
        }
        else {
            // SUCCESS, file successfully uploaded 

            fs.readFile(req.file.path, function (err, data) {
                if (err) res.status(400).send('Something went wrong')
                else {
                    let array = data.toString().split("\n");
                    res.send(array)
                }
            });

        }
    })
})

// Take any port number of your choice which 
// is not taken by any other process 
app.listen(8080, function (error) {
    if (error) throw error
    console.log("Server created Successfully on PORT 8080")
})  