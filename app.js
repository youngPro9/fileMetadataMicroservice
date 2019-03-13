const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mime = require("mime-types");

const app = express();

// ejs template
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload_files');
    },
    filename: function (req, file, cb) {
        const ext = mime.extension(file.mimetype);
        cb(null, file.fieldname + '-' + Date.now() + "." + ext);
    }
});

const upload = multer({
    storage: storage
});

app.get("/", (req, res) => {
    res.render("upload");
});

app.post("/", upload.single("file-to-upload"), (req, res) => {
    const fileSizeInStr = req.file.size.toString();
    let result = fileSizeInStr;
    
    if(fileSizeInStr.length > 3){
        result = fileSizeInStr.slice(0,-3) + " KB";
    }
    else if(fileSizeInStr.length > 6) {
        result = fileSizeInStr.slice(0,-6) + " MB";
    }
    else if(fileSizeInStr.length > 9) {
        result = fileSizeInStr.slice(0,-9) + " GB";
    }
    
    res.json({ filename: req.file.originalname, size: result});
    
});

const port = 3000;
app.listen(port, "0.0.0.0", () => {
    console.log("Server is running on port " + port);
});



