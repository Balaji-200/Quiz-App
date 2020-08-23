const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,__dirname+'/images');
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const imageFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('You can upload image files only.'),false);
    }
    cb(null,true);
}

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = upload;