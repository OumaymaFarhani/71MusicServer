var express = require('express');
var router = express.Router();
var Queue =require('../models/Queue');


/* GET all Queue */
    router.get('/getQueues/:idRoom', async function(req, res){
        try {
      const queues = await Queue.find({RoomId:req.params.idRoom}).exec();
      res.status(200).json(queues);
    } catch (err) {
        res.status(500).json(err);
      }
  
  });

  /*POST Queue*/

  router.post('/postQueue/:idRoom', async function(req, res, next) {
    const id = req.params.idRoom;
    const newQueue= new Queue({
        Participant: req.body.Participant,
        UrlSong: req.body.UrlSong,
        RoomId: id

      
      
        
    });

    try {
        const queue = await newQueue.save();
        return res.status(201).json(queue);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


    //Delete Queue 
  router.get('/deleteQueue/:id', function(req, res, next){
  const id = req.params.id;
  Queue.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Queue was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Queue with id=" + id
          });
      });
    });
    //update Queue :
router.put('/updateQueue/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Queue.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Queue with ${id}. Maybe playlist not found!`})
            }else{
                res.send({ message : ` Updated Queue with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Queue information"})
        })
}



);

//get Queue 
router.get("/getQueue/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const queue = await Queue.findById(id);
      res.status(200).json(queue);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  
  
  
  
  

  
  module.exports = router;