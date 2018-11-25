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
    let deadLine = req.body.inputDate;
    let  authenticatedUser = req.body.user.id;
    

    let query = `INSERT INTO "public"."lists"("listcontent", "userid", "frist") 
        VALUES('${listContent}', '${authenticatedUser}', '${deadLine}') RETURNING "listid","listcontent", "userid", "frist"`;

    let code = await db.insert(query) ? 200:500;
    res.status(code).json({}).end()
})



router.post('/app/lists/load', async function(req,res,next){


    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
  
  
    let  authenticatedUser = req.body.user.id;
    //let userName = req.params.user.id;
    

    let query = `SELECT * from "public"."lists" WHERE "userid"='${authenticatedUser}'`;

    let code = await db.insert(query);
    let status = code ? 200 : 500;
    res.status(status).json(code).end()
    
})



router.get('/app/lists/load/:userid', async function(req,res,next){

    

 
    let userName = req.params.user.id;

    let query = `SELECT * from "public"."lists" WHERE "userid"='${userName}'`;

    let user = await db.select(query) ;

    if(user){
        res.status(200).json(user).end()
        console.log("loaded")
    } else{
        res.status(401).json({}).end();
    }
})

/*router.get('/app/lists/:userid', async function(req,res,next){

    

 
  

    let query = `SELECT * from "public"."lists"`;

    let user = await db.select(query) ;

    if(user){
        res.status(200).json(user).end()
        console.log("loaded")
    } else{
        res.status(401).json({}).end();
    }
})

*/

router.delete('/app/lists/', async function(req, res) {
    
    
    //let userid = req.params.user.id;
     let listid = req.body.listid

 

     let queryDeleteListContent = `DELETE FROM "public"."lists" WHERE "listid" = '${listid}' RETURNING *`;
     let deleted = await db.delete(queryDeleteListContent);
     let status = deleted ? 200 : 500;
         res.status(status).json({}).end();

 
});
router.delete('/app/lists/:userid', async function(req, res) {
    
    
       //let userid = req.params.user.id;
        let listid = req.body.listid

    

        let queryDeleteListContent = `DELETE FROM "public"."lists" WHERE "listid" = '${listid}' RETURNING *`;
        let deleted = await db.delete(queryDeleteListContent);
        let status = deleted ? 200 : 500;
            res.status(status).json({}).end();
  
    
  });





module.exports = router;