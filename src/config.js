const fs = require('fs');
const path = require('path');
const absolutePath = path.resolve(__dirname,"../bin/certificate.pem");
const publicKey = fs.readFileSync(absolutePath, 'utf8');
module.exports = {
    secretKey: publicKey,
    mongoUrl: "YOUR URL",
    facebookIds:{
        clientId: "YOUR ID",
        clientSecret:"YOUR SECRET"
    },
    googleOauth2:{
        clientId:"YOUR ID",
        clientSecret:"YOUR SECRET"
    }
}
