const Users = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMailCtrl')
const { status } = require('express/lib/response')
const Videothumbnail = require('../models/Videothumbnail');
const ObjectID = require("mongoose").Types.ObjectId;
const path=require('path')

const {CLIENT_URL} = process.env
const {google}=require('googleapis')
const {OAuth2} = google.auth
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)
const userCtrl = {
    register: async (req, res) => {
        try {
            const {name,nickname,sexe, role,email, password} = req.body;
            const avatar=req.file
            console.log("fileeeee",req.body.avatar.name)
           if(!name ||!nickname|| !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})
    
            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid emails."})
    
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})
    
            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})
    
            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = {
                name,sexe,nickname,role, email,password:passwordHash,avatar
            }
            

            const activation_token = createActivationToken(newUser)
    
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, "Verify your email address")
    
            res.json({msg: "Register Success! Please activate your email to start."})
            console.log(passwordHash)
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 
    activateEmail: async (req, res) => {
        try {
            const avatar=req.body.avatar

            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name,nickname,sexe,role, email, password,followers,following} = user
            //console.log(file)


            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name,nickname,role,sexe,followers,following, email, password,avatar
            })
            console.log("hehehe",avatar)

            
            await newUser.save()
            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user._id,name:user.name})
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
           console.log(refresh_token)
            res.json({msg: "Login success!",refresh_token,name:user.name,email:user.email,nickname:user.nickname})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refresh_token
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/newpassword/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {OldPassword,NewPassword} = req.body
            console.log("aaaaaaa",NewPassword)
            //const emailLocalstorage=req.body.email
            const user=await Users.findOne(req.user._id)   
            console.log("aaaaaa",user)  
            console.log("aaaaaa",OldPassword)  
             const isMatch= await bcrypt.compare(OldPassword, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
            const passwordHash = await bcrypt.hash(NewPassword, 12)
             NewPassword:passwordHash
            console.log(user)

            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })
            

            res.json({msg: "Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    newPassword: async (req, res) => {
        try {
            const {password} = req.body
            console.log("pass",password)
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            res.json({msg: "Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserInfor: async (req, res) => {
        try {
            Users.findById(req.params.id, (err, docs) => {
            res.send(docs);
               
              }).select("-password"); 
        } catch (error) {
            console.log("ID unknown : " + err);
        }
       
    }, 
    //kel ada ken feha call back problem
    updateUser : async (req, res) => {
        if (!ObjectID.isValid(req.params.id))
          return res.status(400).send("ID unknown : " + req.params.id);
      
        try {
          await Users.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                name: req.body.name,
                nickname: req.body.nickname,
              },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
           
          ).then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));
          
        } catch (err) {
          return res.status(500).json({ message: err });
        }
      },
      searchUser: async (req, res) => {
        try {
            const users = await Users.find({name: {$regex: req.query.name}})
            .limit(10).select("name nickname ")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    
  /*   getVideoListByUser: async (req, res) => {
        try {

//const user =  Users.findById(req.user.id)
//console.log(user)
const list = await Videothumbnail.find({uploader_name:hela}).exec()

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, */
    getUsersAllInfor: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    delete:async(req,res)=>{
        try {
            var id = req.params.id;
            const user=await Users.findOneAndRemove({_id:id})
             res.json({msg:"Deleted succusfully"})
        }catch (error) {
            return status(500).json({msg:err.message})
        }
        
            },
    googleLogin: async (req, res) => {
                try {
                    const {tokenId} = req.body
        
                    const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
                    
                    const {email,name} = verify.payload
        
                    const password = email + process.env.GOOGLE_SECRET
        
                    const passwordHash = await bcrypt.hash(password, 12)
        
                   
        
                    const user = await Users.findOne({email})
                    console.log(user)
                    if(user){
                        const isMatch = await bcrypt.compare(password, user.password)
                        if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
        
                        const refresh_token = createRefreshToken({id: user._id})
                        res.cookie('refresh_token', refresh_token,name, {
                            httpOnly: true,
                            path: '/user/refresh_token',
                            maxAge: 7*24*60*60*1000 // 7 days
                        })
        
                        res.json({msg: "Login success!",refresh_token,email:user.email})
                    }else{
                        const newUser = new Users({
                            name,email, password: passwordHash
                        })
        
                        await newUser.save()
                        console.log(newUser)
                        const refresh_token = createRefreshToken({id: newUser._id})
                        res.cookie('refresh_token', refresh_token, {
                            httpOnly: true,
                            path: '/user/refresh_token',
                            maxAge: 7*24*60*60*1000 // 7 days
                        })
        
                        res.json({msg: "Login success!",refresh_token})
                    }
        
        
                } catch (err) {
                    return res.status(500).json({msg: err.message})
                }
            },
   Follow : async (req, res) => {
                if (
                  !ObjectID.isValid(req.params.id) ||
                  !ObjectID.isValid(req.body.idToFollow)
                )
                  return res.status(400).send("ID unknown : " + req.params.id);
              
                try {
                  // add to the follower list
                  await Users.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { following: req.body.idToFollow } },
                    { new: true, upsert: true },
                    
                  ).then((docs) => res.send(docs))
                  .catch((err) => res.status(500).send({ message: err }));
                  // add to following list
                  await Users.findByIdAndUpdate(
                    req.body.idToFollow,
                    { $addToSet: { followers: req.params.id } },
                    { new: true, upsert: true },
                
                  )
                  .catch((err) => res.status(500).send({ message: err }));
                } catch (err) {
                  return res.status(500).json({ message: err });
                }
              },
UnFollow:async(req,res)=>{
    if (
        !ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.body.idToUnfollow)
      )
        return res.status(400).send("ID unknown : " + req.params.id);
    
      try {
        await Users.findByIdAndUpdate(
          req.params.id,
          { $pull: { following: req.body.idToUnfollow } },
          { new: true, upsert: true },
         
        ).then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({ message: err }));
        // remove to following list
        await Users.findByIdAndUpdate(
          req.body.idToUnfollow,
          { $pull: { followers: req.params.id } },
          { new: true, upsert: true },
         
        ).catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
        return res.status(500).json({ message: err });
      }
    } ,
 
        
    
   
    

}
 
 function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl