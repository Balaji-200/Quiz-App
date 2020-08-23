const express = require('express');
const users = express.Router();
const bodyParser = require('body-parser');
const Users = require('../models/user');
const passport = require('passport');
const authenticate = require('../src/authenticate');
const imageUpload = require('../src/imageUpload');
const fs =require('fs');

users.use(bodyParser.json());

/* GET users listing. */
users.get('/signup',(req, res, next)=> {
  Users.find({}).then((user)=>{
    if(user){
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(user);
    }
  },err=> next(err))
  .catch(err=>next(err));
})

users.post('/signup',(req,res,next)=>{
  console.log(req.body);
  Users.findOne({ username: req.body.username }).then(user=>{
    if(user){
      res.statusCode = 409;
      res.setHeader('Content-Type','application/json');
      res.json({ success: false , message: `An account with username ${req.body.username } already exists!.` });
    }else{
    Users.register({ username: req.body.username },req.body.password,
    (err,user)=>{
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({ err: err });
      }else{
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({ success: true , message: `User ${ user.username } has been created.`,"user": user});
        })
      }
  })
}
  }, err=> next(err)
  ).catch(err=> next(err))
})

users.delete('/signup',(req,res,next)=>{
  Users.deleteMany({}).then(resp=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  })
});
//##############################################################################///
users.post('/login',(req,res,next)=>{
  passport.authenticate('local',{session: true,},(err,user,info)=>{
    if(err) return next(err)
    if(!user){
      console.log('No');
      req.app.set('loginErr','Username or password is Incorect')
      return res.status(200).send({ redirectUrl: '/'});
    }
     req.logIn(user,(err)=>{
      if(err) return next(err)
      var token = authenticate.getToken({ _id: req.user._id});
      req.session.j = token;
      req.session.cookie.maxAge = 86400000;
      req.app.set('loginErr','');
      res.statusCode = 200;
      return res.status(200).send({ redirectUrl: '/dashboard' });
    })
  })(req,res,next)
})

users.post('/logout',(req,res,next)=>{
  req.session.j='';
  req.session.isAuthenticated = false;
  req.logOut();
  req.session.destroy((err) => {
    if(err) return next(err)
  })
  res.redirect('/');
})

users.put('/score',authenticate.verifyUser,(req,res,next)=>{
  Users.findOne({ _id: req.user._id }).then((user)=>{
    user.Score.highScore +=req.body.highScore;
    user.Score.totalAnsweredQuestions+=req.body.totalAnsweredQuestions;
    user.Score.highestAnsweredCorrect+=req.body.highestAnsweredCorrect;
    user.save((err,user)=>{
      if (err) next(err);
      // res.status(200).send(user.Score);
      res.status(200).send({ redirectUrl: '/dashboard' });
    })
  }).catch(err=> next(err))

})

users.post('/uploadImage',authenticate.verifyUser,imageUpload.single('profileImage'),(req,res,next)=>{
  const img = fs.readFileSync(req.file.path);
  const encodedImg = img.toString('base64');
  const processedImg = {
    data: new Buffer(encodedImg,'base64'),
    contentType: req.file.mimetype
  }
  Users.findOne({_id: req.user._id }).then((user)=>{
    user.img = processedImg;
    user.save((err,user)=>{
      if(err) next(err);
      fs.unlinkSync(req.file.path);
      res.redirect('/dashboard')
    })
  }).catch(err=> next(err));
  // res.status(200).send(req.file);
})
module.exports = users;
