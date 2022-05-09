var express = require('express');
var router = express.Router();
var Conservatory =require('../models/Conservatory');
const cloudinary = require('../utils/cloudinary');
const fs = require("fs");

const DIR = './public/';
const { v4: uuidv4 } = require('uuid');
uuidv4();
const path=require('path')
 /*
const TYPE_IMAGE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  };

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + TYPE_IMAGE[file.mimetype])
    }
});
  
var upload = multer({ storage: storage });
*/
/*
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});*/
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagesConservatoire')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
        
    }
   
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('picture')
/* GET all Conservatory */
    router.get('/getConservatories', async function(req, res){
      const conservatories = await Conservatory.find().exec();
      res.status(200).json(conservatories);
  
  });

  /*POST Conservatory*/
   


  const remove = path.join(__dirname,'..','public')

  router.post('/postConservatory', upload, async function(req, res, next) {
 try{
     const result = await cloudinary.uploader.upload(req.file.path);
 
   let newConservatory1 = new Conservatory({
        
        picture:/* (req.file.path.replace(remove,'').replace(/\\/g,'/')&& req.file.filename)*/ result.secure_url,
        cloudinary_id: result.public_id,
        Title: req.body.Title,
        Description: req.body.Description,
        downVoted:req.body.downVoted,
        upVoted:req.body.upVoted

    
    });
   /* const c = await Conservatory.create(newConservatory1)
    res.status(200).send(c)
    console.log(c)*/
    await newConservatory1.save();
    res.json(newConservatory1);
}catch(err){
    console.log(err)
}
/*

const url = req.protocol + '://' + req.get('host');
    const newConservatory = new Conservatory({
        Title: req.body.Title,
        picture: //(req.file && req.file.filename),
        url + '/public/uploads/' + req.file.filename,
        Description: req.body.Description
       
    });

    try {
        const conservatory = await newConservatory.save();
        return res.status(201).json(conservatory);
    } catch (err) {
        return res.status(400).send(err);
    
    };*/

  });


    //Delete Conservatory 
  router.get('/deleteConservatory/:id', function(req, res, next){
  const id = req.params.id;
  Conservatory.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Conservatory  was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Conservatory  with id=" + id
          });
      });
    });
    //update Conservatory 
router.put('/updateConservatory/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Conservatory.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Conservatory  with ${id}. Maybe this Conservatory  not found!`})
            }else{
                res.send({ message : ` Updated Conservatory  with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Conservatory  information"})
        })
}



);


////Vote conservatoire
router.put('/updateVote/:id', async (req,res) => {
    const id = req.params.id;
    console.log(req.user);
  
        await Conservatory.findByIdAndUpdate(id, { upVoted : req.body.upVoted, downVoted: req.body.downVoted }, { useFindAndModify: false}).then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Conservatory  with ${id}. Maybe this Conservatory  not found!`})
            }else{
                res.send({ message : ` Updated Conservatory  with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Conservatory  information"})
        })
}



);



//get Conservatory 
router.get("/getConservatory/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const conservatory = await Conservatory.findById(id);
      res.status(200).json(conservatory);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  /*
    router.post("/ajouter",upload.single('img'),async (req, res) => {
        console.log(req.file);
        res.send("single upload");
    });
  
  */

    //supprimer
    // Delete Student
router.delete("/delete/:id", 
(req, res, next) => {
  Conservatory.findByIdAndRemove(
      req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});



router.post("/addConservatory", async (req, res) => {
    const { Title,Description,picture } = req.body;
    newConservatories = new Conservatory({
        Title,
        Description,
        picture,

      });
  
  
      const savedConservatory = await newConservatories.save();
      res.json(savedConservatory);
   
  });
  
  module.exports = router;