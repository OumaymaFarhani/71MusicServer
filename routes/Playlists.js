var express = require('express');
var router = express.Router();
var Playlist =require('../models/Playlist');


/* GET all playlist */
    router.get('/getPlaylists', async function(req, res){
      const playlists = await Playlist.find().exec();
      res.status(200).json(playlists);
  
  });

  /*POST Playlist*/

  router.post('/postPlaylist', async function(req, res, next) {

    const newPlaylist = new Playlist({
        Name: req.body.Name,
        Description: req.body.Description,
        Type: req.body.Type,
        Photo: req.body.Photo
      
        
    });

    try {
        const playlist = await newPlaylist.save();
        return res.status(201).json(playlist);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


    //Delete Playlist 
  router.get('/deletePlaylist/:id', function(req, res, next){
  const id = req.params.id;
  Playlist.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Playlist was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Playlist with id=" + id
          });
      });
    });
    //update playlist :
router.put('/updatePlaylist/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Playlist.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update playlist with ${id}. Maybe playlist not found!`})
            }else{
                res.send({ message : ` Updated Playlist with id : ${id}. Succefully!`})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update playlist information"})
        })
}



);

//get playlist 
router.get("/getPlaylist/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const playlist = await Playlist.findById(id);
      res.status(200).json(playlist);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  
  
  
  
  

  
  module.exports = router;