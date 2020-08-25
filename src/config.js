const fs = require('fs');
const path = require('path');
const absolutePath = path.resolve(__dirname,"../bin/certificate.pem");
const publicKey = fs.readFileSync(absolutePath, 'utf8');
module.exports = {
    secretKey: publicKey,
    mongoUrl: "mongodb://balaji:#12Aspirine@35.154.92.66/Quiz-Server",
    facebookIds:{
        clientId: "2829468820667711",
        clientSecret:"234697364f967fce70759afd9ba81bdf"
    },
    googleOauth2:{
        clientId:"922500157871-7ggiid26hibtcuontr93e3cneb4to9a1.apps.googleusercontent.com",
        clientSecret:"sdGerZMdA4LkLtb8MCnh6uQ0"
    }
}