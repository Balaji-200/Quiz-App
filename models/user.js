const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String
    },
    admin:{
        type: Boolean,
        default: false
    },
    facebookId:{
        type: String,
        default: ''
    },
    googleId:{
        type: String,
        default: ''
    },
    profileImage:{
        type: String,
        default: 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png'
    },
    img:{
        data: Buffer,
        contentType: String
    },
    Score:{  
            highScore:{
            type: Number,
            default:0
        },
        totalAnsweredQuestions:{
            type: Number,
            default: 0
        },
        highestAnsweredCorrect:{
            type: Number,
            default: 0
        }
    
}
},{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)