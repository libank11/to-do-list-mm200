var express = require('express')
var router = express.Router();
var db = require("./db.js");


router.get('/app/user',async function(req,res,next){
    let query = `Select * from "public"."user" `;
    let users = await db.select(query);
    if(users){
        res.status(200).json(users);
    }else{
        console.log("feil")
    }
});

router.post('/app/user',async function(req,res,next){
//let p = document.getElementById("txt").innerHTML="The user"('${userName}';
    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, async function(err, salt) {
        bcrypt.hash(req.body.pswHash, salt, async function(err, hash) {
            let userEmail = req.body.email;
            let userName = req.body.name;
            let paswordHash =hash;
            
        
            let query = `INSERT INTO "public"."user"("username", "hash","email") 
                VALUES('${userName}', '${paswordHash}','${userEmail}') RETURNING "id", "email", "username", "hash"`;
        
            let code = await db.insert(query) ? 200:500;
            res.status(code).json({}).end()
        });
    });
    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
    
})



router.get('/app/user/:userName', async function(req,res,next){

    

    let paswordHash = req.body.pswHash;
    let userName = req.params["userName"];

    let query = `Select * from "public"."user" where userName='${userName}' 
    and hash='${paswordHash}' RETURNING "id", "email", "username", "hash"`;

    let user = await db.select(query) ;

    if(user){
        res.status(200).json(user).end()
        console.log(query)
        
    } else{
        res.status(401).json({}).end();
    }
})


router.post('/app/user/load', async function(req,res,next){


    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
  
  
    let  authenticatedUser = req.body.user.id;
    //let userName = req.params.user.id;
    

    let query = `Select * from "public"."user" where userName='${userName}' 
    and hash='${paswordHash}' RETURNING "id", "email", "username", "hash"`;

    let code = await db.insert(query);
    let status = code ? 200 : 500;
    res.status(status).json(code).end()
    
})





module.exports = router;