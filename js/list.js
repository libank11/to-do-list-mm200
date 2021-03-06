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
  
   
    let  authenticatedUser = req.body.user.id;
    let listTittel = req.body.inputTittel;
    let listBeskrivelse = req.body.inputBeskrivelse;
    let privacyValue = req.body.privacyValue;

    

    let query = `INSERT INTO "public"."lists"("listtittel", "userid", "beskrivelse", "privacy") 
        VALUES('${listTittel}', '${authenticatedUser}', '${listBeskrivelse}', '${privacyValue}') RETURNING "listid","listtittel", "userid", "beskrivelse"`;

    let code = await db.insert(query) ? 200:500;
    res.status(code).json({}).end()
})


router.post('/app/posts', async function(req,res,next){

// RETURNING "postid","postcontent", "userid", "dato", "listid"`;
    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
  
    let postcontent = req.body.inputText;
    let dato = req.body.inputDate;
    let  authenticatedUser = req.body.user.id;
    let listid = req.body.listid.id;
    

    let query = `INSERT INTO "public"."posts"("postcontent", "userid", "dato", "listid") 
        VALUES('${postcontent}', '${authenticatedUser}', '${dato}','${listid}')`; 

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

router.post('/app/posts/load', async function(req,res,next){


    console.log("Request ----------------------------------------------");
    console.dir(req.body);
    console.log("Request ----------------------------------------------");
  
  
    //let  authenticatedUser = req.body.user.id;
    //let userName = req.params.user.id;
    let listid = req.body.listid
    

    let query = `SELECT * from "public"."posts" WHERE "listid"='${listid}'`;

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

router.delete('/app/posts/', async function(req, res) {
    
    
    //let userid = req.params.user.id;
     let postid = req.body.postid

 

     let queryDeleteListContent = `DELETE FROM "public"."posts" WHERE "postid" = '${postid}' RETURNING *`;
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


  router.post("/app/lists/update", async function(req,res,next){

    let updateListId = req.body.listid;
    let updateTittel = req.body.updateTittel;
    let updateBeskrivelse = req.body.updateBeskrivelse;
    console.log("server side receives")
    
    let query = `UPDATE lists SET listtittel = '${updateTittel}', beskrivelse = '${updateBeskrivelse}' WHERE listid = '${updateListId}'`;
    
    console.log(query);

    let code = await db.update(query);
    let status = code ? 200 : 500;
    res.status(status).json(code).end()
    
});

router.post("/app/posts/update", async function(req,res,next){

    let updatePostId = req.body.updatePostId;
    let oppdaterOverskrift = req.body.oppdaterOverskrift;
    let oppdaterPostInnhold = req.body.oppdaterPostInnhold;

    let query = `UPDATE posts SET tittel = '${oppdaterOverskrift}', innhold = '${oppdaterPostInnhold}' WHERE postid = '${updatePostId}'`;
    
    console.log(query);

    let post = await db.update(query) 
    if(post){
    res.status(200).json(JSON.stringify(post)).end()
        }else{
            res.status(500).end()
        }
    
});


module.exports = router;