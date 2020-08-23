const fs = require('fs');
const path = require('path');
const absolutePath = path.resolve(__dirname,"../bin/YOUR CERTIFICATE.PEM");
const publicKey = fs.readFileSync(absolutePath, 'utf8');
module.exports = {
    secretKey: publicKey,
    mongoUrl: "YOUR MONGO URL HERE",
    facebookIds:{
        clientId: "YOUR CLIENT ID",
        clientSecret:"YOUR CLIENT SECRET"
    },
    googleOauth2:{
        clientId:"YOUR CLIENT ID",
        clientSecret:"YOUR CLIENT SECRET"
    }
}