var express = require('express');
var router = express.Router();
var Comment =require('../models/Comment');


/* GET all Comment */
    router.get('/getComments', async function(req, res){
      const comments = await Comment.find().exec();
      res.status(200).json(comments);
  
  });

  /*POST Comment*/

  router.post('/postComment/:idRoom', async function(req, res, next) {
    const id = req.params.idRoom;
    const newComment= new Comment({
        Author: req.body.Author,
        BodyCom: req.body.BodyCom,
        RoomId: id
      
        
    });

    try {
        const comment = await newComment.save();
        return res.status(201).json(comment);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


   

    //Delete Comment 
  router.get('/deleteComment/:id', function(req, res, next){
  const id = req.params.id;
  Comment.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Comment was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Comment with id=" + id
          });
      });
    });
    //update Comment :
router.put('/updateComment/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Comment with ${id}. Maybe playlist not found!`})
            }else{
                res.send({ message : ` Updated Comment with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Comment information"})
        })
}



);

//get Comment 
router.get("/getComment/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const comment = await Comment.find({RoomId:id})
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  
  
  
  
  

  
  module.exports = router;