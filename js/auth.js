const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
var db = require("./db.js");

const SUPER_SECRET_KEY = process.env.TOKEN_KEY|| "Tokens";



app.get("/app/authenticate", async function (req, res, next) {

    console.log("Authentication request recived");
    let authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) { // If there is no authorization header the client has not done a proper request.
        log("Missing authentication header, ending request with 401 code");
        res.status(401).end(); // We respond by telling the client that it has not been authenticated as of yet. (this brakes with basic auth since we are not setting the header)
    } else {

        let credentials = authorizationHeader.split(' ')[1]; // We know that the header value starts with Basic and then a space. Annything following that space will be the credentials from the client.
        let rawData = Buffer.from(credentials, 'base64'); // At the moment the the credentials are in a base 64 encoded format, so we must do a transformative step.
        credentials = rawData.toLocaleString().split(":"); // We know that the username and password are delimited by a :. Spliting on : gives us an array wit username at pos 0 and password at pos 1. 

        console.log(`Authenticate : ${credentials[0]} `);

        let username = credentials[0].trim();
        let password = credentials[1].trim();

        let user = await databaseQuery(username, password) // if the username and password are correct we will get a user object in return at this point.

        if (user) {
            // There was a user in the database with the correct username and password
            // This is where we are diverging from the basic authentication standard. by creating a token for the client to use in all later corespondanse. 
            console.log("User is authenticated");
            let token = jwt.sign({
                id: user.id,
                username: user.name
            }, SUPER_SECRET_KEY); 
            console.log(token)// Create token 

            res.status(200).send({
                auth: token,
                user: {
                    id: user.id,
                    name: user.name
                }
            }).end(); // Send token and authenticated user to client.

        } else {
            // The request did not have valid credentials. 
            console.log("Bad credentials");
            res.status(401).end(); // We respond by telling the client that it has not been authenticated as of yet.
        }
    }
});

async function databaseQuery(username,password) {
   
   
   
   /* app.get('/app/user',async function(req,res,next){
        var query = `Select * from "public"."user" where username=${username} AND hash =${password} `;
       
    });*/
 

    const query = `Select * from "public"."user" where username = '${username}' `;
    let foundUser = await db.select(query);


    // 2. If we found a user, check the password. 
    if (foundUser && foundUser.length === 1) {
        const isCorrect = await bcrypt.compare(password, foundUser[0].hash); // We use bcrypt to compare the hash in the db with the password we recived. 
        // 3. if the password is correct the userobject is parsed on
        console.log("sjekker")
        if (!isCorrect) {
            foundUser = null;
        }
    }
    else{
        
        return
    }

    return Promise.resolve(foundUser);
}
module.exports = app;