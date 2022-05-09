var express = require('express');
var router = express.Router();
var Reclamation =require('../models/Reclamation');


/* GET all Reclamation */
    router.get('/getReclamations/:idRoom', async function(req, res){
        try {
            const reclamations = await Reclamation.find({RoomId:req.params.idRoom}).exec();
            res.status(200).json(reclamations);
          } catch (err) {
              res.status(500).json(err);
            }
  
  });

  /*POST Reclamation*/

  router.post('/postReclamation/:idRoom', async function(req, res, next) {
    const id = req.params.idRoom;
    const newReclamation= new Reclamation({
        Name: req.body.Name,
        Description: req.body.Description,
        RoomId: id
      
        
    });

    try {
        const reclamation = await newReclamation.save();
        return res.status(201).json(reclamation);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


    //Delete Reclamation 
  router.get('/deleteReclamation/:id', function(req, res, next){
  const id = req.params.id;
  Reclamation.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Reclamation was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Reclamation with id=" + id
          });
      });
    });
    //update Reclamation :
router.put('/updateReclamation/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Reclamation.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Reclamation with ${id}. Maybe playlist not found!`})
            }else{
                res.send({ message : ` Updated Reclamation with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Reclamation information"})
        })
}



);

//get Reclamation 
router.get("/getReclamation/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const reclamation = await Reclamation.findById(id);
      res.status(200).json(reclamation);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  
  
  
  
  

  
  module.exports = router;