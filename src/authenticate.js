const passport = require('passport');
const { secretKey, facebookIds, googleOauth2 } = require('./config');

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleOauth20 = require('passport-google-oauth20').Strategy;

const jwt = require('jsonwebtoken');

const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/user');

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user,secretKey,{ algorithm: 'HS256',expiresIn: 604800 });
}


exports.verifyUser = async (req,res,next)=>{
    if(await req.session.j){
         jwt.verify(await req.session.j,secretKey,{ algorithms:['HS256'] },(err,decoded)=>{
            if(err){
                req.session.j='';
                req.session.isAuthenticated = false;
                res.redirect('/');
            }
            Users.findOne({ _id: decoded._id }).then(user=>{
                if(user){
                req.user = user;
                req.session.isAuthenticated = true;
                next();
            }
          },err=>next(err))
        });
      }else{
        req.session.isAuthenticated = false;
        res.redirect('/')
      }
}

exports.authenticated = async (req,res,next)=>{
    if(await req.session.isAuthenticated){
        return next();
    }else{
        return res.redirect('/');
    }
}

exports.unAuthenticated = async (req,res,next)=>{
    if(await req.session.isAuthenticated){
        return res.redirect('/dashboard')
    }else{
        return next()
    }
}
exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin){
        next();
    }else{
        var err = new Error('You are Not authorized!!');
        err.status = 403;
        return next(err);
    }
}
passport.use(new FacebookStrategy({
    clientID: facebookIds.clientId,
    clientSecret: facebookIds.clientSecret,
    callbackURL: "https://quizapp-nodejs.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'picture.type(large)', 'emails', 'displayName']
},(accessToken, refreshToken, profile, done)=>{
    Users.findOne({ username: profile.displayName },(err,user)=>{
        if(err){
            return done(err,false);
        }
        if(!err && user!==null){
            return done(null,user)
        }else{
            const user = new Users({ username: profile.displayName });
            user.facebookId = profile.id;
            user.profileImage = `https://graph.facebook.com/v8.0/${profile.id}/picture?height=200&width=200`;
            user.save((err,user)=>{
                if(err){
                    return done(err,false);
                }else{
                    return done(null,user);
                }
            })
        }
    })
}))

passport.use(new GoogleOauth20({
    clientID: googleOauth2.clientId,
    clientSecret: googleOauth2.clientSecret,
    callbackURL: "https://quizapp-nodejs.herokuapp.com/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    Users.findOne({ username: profile.displayName },(err,user)=>{
        if(err){
            return done(err,false);
        }else if(!err && user!=null){
            return done(null,user)
        }else{
            const user = new Users({ username: profile.displayName });
            user.googleId = profile.id;
            user.profileImage = profile._json.picture;
            user.save((err,user)=>{
                if(err){
                    return done(err,false);
                }else{
                    return done(null,user);
                }
            })
        }
    })
}))

