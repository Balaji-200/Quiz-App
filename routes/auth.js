const express = require('express');
const authRouter = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('../src/authenticate');

authRouter.use(bodyParser.json());

authRouter.get('/google',passport.authenticate('google',{ scope:['profile'] }));

authRouter.get('/google/callback',passport.authenticate('google',{ session: true }),(req,res)=>{
    if(req.user){
        const token = authenticate.getToken({_id: req.user._id });
        res.statusCode = 200;
        req.session.j = token;
        res.redirect('/dashboard')
    }
})

authRouter.get('/facebook',passport.authenticate('facebook'));

authRouter.get('/facebook/callback',passport.authenticate('facebook',{ session: true }),(req,res)=>{
    if(req.user){
        const token = authenticate.getToken({_id: req.user._id });
        res.statusCode = 200;
        req.session.j = token;
        res.redirect('/dashboard');
    }
})

module.exports = authRouter;