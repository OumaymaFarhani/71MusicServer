var express = require('express');
var router = express.Router();
var User=require('../models/User');
const bcrypt = require("bcryptjs");
const { redirect } = require('express/lib/response');
const jwt=require('jsonwebtoken');
const JWT_SECRET="mednaloualsjamlskqskhj"

const passport = require('passport');


/************************* LOGIN PAGE *************************/
router.get('/', function(req, res, next) {
    res.render('login.twig');
  });


/************************* REGISTER PAGE *************************/
router.get('/register', function(req, res, next){
    res.render("register.twig");
  });
  

/************************* REGISTER ACTION *************************/
router.post('/adduser', async(req, res, next)=> {
  const {FirstName,LastName,Birthday,Sexe,email,password:plainTextPassword}=req.body
  const password= await bcrypt.hash(plainTextPassword,7)
  
  try {
    const res= await User.create({
      FirstName,
      LastName,
      Birthday,
      Sexe,
      email,
      password
    })
    console.log("User created succefuly")
  } catch (error) {
    console.log(error)
    return res.json({status:"error"})
    
  }
  
  res.render('home.twig')
  
  });
  

/************************* LOGIN ACTION *************************/
router.post('/login',async(req,res,next)=>{
  const {email,password}=req.body
/*   const user=User.findOne({username}).select('password')
 */
const user = await User.findOne({ email }).lean()

console.log("aaaaaaaaaaaaaaaaaaaaa")

  console.log(user)
  console.log("aaaaaaaaaaaaaaaaaaaaa")

if(!user){
  return res.json({status:"error",error:"Invalid data"})
}
  if(await bcrypt.compare(password,user.password)){

    const token=jwt.sign({id:user._id,email:user.email},JWT_SECRET)
    return res.json({status:'ok',data:token})
    
  }
  
  return res.json({status:'error',error:'Invalide password'})
})

/************************* LOGIN facebook *************************/

module.exports = router;
  