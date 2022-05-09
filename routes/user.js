const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const Users = require('../models/User')
const bcrypt = require('bcrypt')
const { authorize } = require('passport');
const jwt = require('jsonwebtoken')
const {CLIENT_URL} = process.env
const sendMail = require('../controller/sendMailCtrl')
const multer = require('multer');
var bodyParser = require('body-parser')
// Multer Configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '-'),file.originalname.replace(/\\/g, "/")}`;
    cb(null, fileName);
  },
});
const upload = multer({storage }).single('avatar')


router.post('/register',upload,userCtrl.register)
router.post('/activate',upload,userCtrl.activateEmail)
router.post('/login',userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgot', userCtrl.forgotPassword)
router.post('/reset', auth, userCtrl.resetPassword)
router.post('/newpassword',auth, userCtrl.newPassword)
//router.get('/getinfo',auth, userCtrl.getUserInfor)
router.get("/find/:id", userCtrl.getUserInfor);
router.put("/:id", userCtrl.updateUser);


//router.get('/getvideolist',auth, userCtrl.getVideoListByUser)
router.get('/getAllinfo', userCtrl.getUsersAllInfor)
router.get('/search', userCtrl.searchUser)
router.get('/logout', userCtrl.logout),
router.delete('/delete/:id', userCtrl.delete)
router.post('/google_login', userCtrl.googleLogin)
router.patch('/follow/:id',userCtrl.Follow)
router.patch('/unfollow/:id',userCtrl.UnFollow)





//test 
/*  router.post('/upload',upload,(req,res)=>{
  const {file}=req;
  res.send({

    file:file.originalname,
    path:file.path,
  })
})  */










 const validateEmail=(email)=> {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

module.exports = router;
