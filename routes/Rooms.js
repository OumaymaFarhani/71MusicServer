var express = require('express');
var router = express.Router();
var Room =require('../models/Room');


/* GET all rooms */
    router.get('/getRooms', async function(req, res){
      const rooms = await Room.find().exec();
      res.status(200).json(rooms);
  
  });

  /* GET all Public rooms */
  router.get('/getRoomsPublic/:status', async function(req, res){
    const rooms = await Room.find({Status : req.params.status}).exec();
    res.status(200).json(rooms);

});
/* GET all Private rooms */
router.get('/getRoomsPrivate/:status/:userId', async function(req, res){
    const rooms = await Room.find({Status : req.params.status,UserId : req.params.userId}).exec();
    res.status(200).json(rooms);

});

 //get user's all rooms
 router.get("/userRooms/:userId", async (req, res) => {

    try {
      //const user = await UserSchema.findOne({name : req.params.username})
      const rooms = await Room.find({UserId:req.params.userId})
      res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json(err);
      }
    });



 /*POST Room Public*/

 router.post('/postRoomPublic', async function(req, res, next) {
const status ="public"
  const newRoom = new Room({
      UserId: req.body.UserId,
      Name: req.body.Name,
      Description: req.body.Description,
      Type: req.body.Type,
      Status: status,
      StartDate: req.body.StartDate,
      isCreator: true
      
  });

  try {
      const room = await newRoom.save();
      return res.status(201).json(room);
  } catch (err) {
      return res.status(400).send(err);
  
  };

});

/*POST Room Private*/

router.post('/postRoomPrivate', async function(req, res, next) {
    const status ="private"
  const newRoom = new Room({
    UserId: req.body.UserId,
      Name: req.body.Name,
      Description: req.body.Description,
      
      Status: status,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      isCreator: true
  });

  try {
      const room = await newRoom.save();
      return res.status(201).json(room);
  } catch (err) {
      return res.status(400).send(err);
  
  };

});




  /*POST Room with Criter*/

  router.post('/postRoom/:Type', async function(req, res, next) {
    const Type = req.params.Type;
    var T1="Public";
    var T2="Private";
    if(Type.localeCompare(T1)){
        const newRoom = new Room({
            Name: req.body.Name,
            Description: req.body.Description,
            Type: req.body.Type,
          
            StartDate: req.body.StartDate,
            
            
        });
    }
  if(Type.localeCompare(T2)){
    const newRoom = new Room({
        Name: req.body.Name,
        Description: req.body.Description,
        Type: req.body.Type,
        StartDate: req.body.StartDate,
        EndDate: req.body.EndDate,
        
    });
  }


    try {
        const room = await newRoom.save();
        return res.status(201).json(room);
    } catch (err) {
        return res.status(400).send(err);
    
    };

  });


    //Delete Room 
  router.get('/deleteRoom/:id', async function(req, res, next){
  const id = req.params.id;

  try {
    const room = await Room.findById(id);
    if (room.UserId === req.body.UserId) {
      await room.deleteOne();
      res.status(200).json("The room has been deleted");
    } else {
      res.status(403).json("you can delete only your rooms");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//Delete Room For ADMIN
router.get('/deleteRoomAdmin/:id', function(req, res, next){
  const id = req.params.id;
  Room.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "Room was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Room with id=" + id
          });
      });
    });


//update room :
router.put('/updateRoom/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    try {
        const room = await Room.findById(req.params.id);
        if (room.UserId === req.body.UserId) {
          await room.updateOne({ $set: req.body });
          res.status(200).json("The room has been updated");
        } else {
          res.status(403).json("you can update only your rooms");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    });



//get room 
router.get("/getRoom/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findById(id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
  });






  module.exports = router;