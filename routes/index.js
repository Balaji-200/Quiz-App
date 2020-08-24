var express = require('express');
var router = express.Router();
const authenticate = require('../src/authenticate');

/* GET home page. */
router.get('/',authenticate.unAuthenticated,(req,res,next)=>{
  res.render('login',{ err:req.app.get('loginErr')});
  req.app.set('loginErr','');
})

router.get('/dashboard',authenticate.verifyUser,authenticate.authenticated,function(req, res, next) {
  res.render('dashboard',{ user: req.user });
});

router.get('/quiz',authenticate.verifyUser,authenticate.authenticated,(req,res,next)=>{
  res.render('quiz');
})

router.get('/signup',authenticate.unAuthenticated,(req,res,next)=>{
  res.render('signup');
})
module.exports = router;
