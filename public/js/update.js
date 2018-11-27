function updateListElement(postvalue) {
    console.log(postvalue);
    //let listide = localStorage.getItem("listid");
    let data = JSON.stringify({

        postid: postvalue

    });

    fetch('/app/posts', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
            "postid": postvalue
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            fetchPosts(listid);

        } else {
            // TODO: MESSAGE
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));


}

function updateLists(listvalue) {
    console.log(listvalue);

    var updateTittel = prompt("Ny Tittel", "");
    var updateBeskrivelse = prompt("Ny Beskrivelse", "");
   
   
   // let listide = localStorage.getItem("listid");
   let data = JSON.stringify({

        listid: listvalue,
        updateTittel: updateTittel,
        updateBeskrivelse: updateBeskrivelse

    });

    fetch('/app/lists/update', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
            "listid": listvalue
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            fetchLists();

        } else {
            // TODO: MESSAGE
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));



}

function updateList(){
    updateListId = kategorierListeId;
    
    let oppdaterTittel = document.getElementById("oppdaterTittel").value;
    let oppdaterInnhold = document.getElementById("oppdaterInnhold").value;
    
    fetch('/app/list/update',{
                method:"POST",
                body:JSON.stringify({
                    updateListId:updateListId,
                    oppdaterTittel:oppdaterTittel,
                    oppdaterInnhold:oppdaterInnhold
                }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            }).then(function(data){
                if(data.status < 400){
                    return data.json();
                }
            }).then(function(existingposts){
                clearScreen();
                displayUserListView();
                //displayExistingLists(); //Oppdaterer listen med lister når man lager ny liste
            }).catch(err =>{
            console.error(err);
        });
}

