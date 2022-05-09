var express = require('express');
var router = express.Router();
var Record =require('../models/record');


/* GET all records */
router.get('/getRecords', async function(req, res){
    const records = await Record.find().exec();
    res.status(200).json(records);

});

 /*POST Record*/

 router.post('/postRecord', async function(req, res, next) {

    const newRecord = new Record({
        Category: req.body.Category,
        Title: req.body.Title,
        Score: req.body.Score
        
    });

    try {
        const record = await newRecord.save();
        return res.status(201).json(record);
    } catch (err) {
        return res.status(400).send(err);
    
    };
  
  });



   //Delete Record 
   router.get('/deleteRecord/:id', function(req, res, next){
    const id = req.params.id;
    Record.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. maybe the id doesnt exist!`})
            }else{
                res.send({
                    message : "Record was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Record with id=" + id
            });
        });
      });
  
//update record :
router.put('/updateRecord/:id', async function(req, res, next) {

    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty!"})
    }

    const id = req.params.id;
    Record.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update record with ${id}. Maybe record not found!`})
            }else{
                res.send({ message : ` Updated Record with id : ${id}. Succefully!`})            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update record information"})
        })
});


//getRecordById: detailedRecord 
router.get("/getRecord/:id", async (req, res) => {
    try {


      const id = req.params.id;
      const record = await record.findById(id).exec();
      res.status(200).json(record);
    } catch (err) {
      res.status(500).json(err);
    }
    });




  

module.exports = router;