var express = require('express')
var router = express.Router();
var db = require("./db.js");
const auth = require("./auth.js");


/*router.get('/app/lists',async function(req,res,next){
    let query = `Select * from "public"."lists" `;
    let listArray = await db.select(query);
    if(listArray){
        res.status(200).json(listArray);
    }else{
        console.log("feil")
    }
});*/

router.post('/app/lists', async function(req,res,next){


    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
  
    let listContent = req.body.inputText;
    let  authenticatedUser = req.body.user.id;
    

    let query = `INSERT INTO "public"."lists"("listcontent", "userid") 
        VALUES('${listContent}', '${authenticatedUser}') RETURNING "listid","listcontent", "userid"`;

    let code = await db.insert(query) ? 200:500;
    res.status(code).json({}).end()
})



router.get('/app/lists/:userid', async function(req,res,next){

    

 
    let userName = req.params.userid;

    let query = `SELECT * from "public"."lists" WHERE userid='${userName}'`;

    let user = await db.select(query) ;

    if(user){
        res.status(200).json(user).end()
        console.log(query)
    } else{
        res.status(401).json({}).end();
    }
})






module.exports = router;