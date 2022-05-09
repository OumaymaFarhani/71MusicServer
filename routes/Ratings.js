var express = require('express');
var router = express.Router();
var Rating =require('../models/Rating');


/* GET all Rating */
    router.get('/getRatings/:idRoom', async function(req, res){
        try {
      const ratings = await Rating.find({RoomId:req.params.idRoom}).exec();
            var rates= 0;
     
      var a=0;
      var nbreStars=0
        for (const i in ratings) {
            a++;
            nbreStars+=ratings[i].Rate;
        
            
  }
    } catch (err) {
        res.status(500).json(err);
      }
      rates=nbreStars/a;
      res.status(200).json(rates);

      console.log("Room static : "+rates+" ☆");
  
  });

  /*POST Rating*/

  router.post('/postRating/:idRoom', async function(req, res, next) {
    const id = req.params.idRoom;
    const newRating= new Rating({
     
        Rate: req.body.Rate,
        RoomId: id

      
      
        
    });

    try {
        const rating = await newRating.save();
        return res.status(201).json(rating);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


    //Delete Rating 
  router.get('/deleteRating/:id', function(req, res, next){
  const id = req.params.id;
  Rating.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Rating was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Rating with id=" + id
          });
      });
    });
    //update Rating :
router.put('/updateRating/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Rating.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update Rating with ${id}. Maybe playlist not found!`})
            }else{
                res.send({ message : ` Updated Rating with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update Rating information"})
        })
}



);

//get Rating 
router.get("/getRating/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const rating = await Rating.findById(id);
      res.status(200).json(rating);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  


  

  
  module.exports = router;