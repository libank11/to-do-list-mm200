const DEBUG = true;
var authenticationToken = null;
var authenticatedUser = null;
var activeListid;



//Displayer Login--------------------------

(function () {
    displayLogin();
   
    
})()



function displayLogin() {
    clearContainer();
    let loginView = getTemplate("loginView")
    let loginForm = loginView.querySelector("#loginForm")
    loginForm.onsubmit = function (evt) {
        evt.preventDefault();
        hideError();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        authenticateUser(username, password);
    }
    addToContainer(loginView);
}





function displayError(msg) {
    let errView = document.getElementById("errorView");
    errView.removeAttribute("hidden");
    errView.querySelector("#msg").textContent = msg;
    console.log(msg)
}

function hideError() {
    let errView = document.getElementById("errorView");
    errView.setAttribute("hidden", true);
}


//--------Main app----------------------------------------------------


function headerFunction() {
    let createHeader = getTemplate("headerTemplate");
    document.getElementById("header").appendChild(createHeader);
    let acc = document.getElementById("accountBtn")
    let myList = document.getElementById("myListBtn")
    acc.onclick = function (evt) {
        evt.preventDefault();
        clearList();
      
        displayAccount();
        
        

        let x = document.getElementById("listHeader");
        let y = document.getElementById("listView");
        
       let z = document.getElementById("accountContainer");
       let c = document.getElementById("taskContainer");

        
      
        x.style.display = "none"
        y.style.display = "none"
      
      z.style.display = "block"
      c.style.display = "none"
    }


    myList.onclick = function (evt) {
            evt.preventDefault();
            clearList();
       
            displayLists();
         
            

            
            let x = document.getElementById("listHeader");
            let y = document.getElementById("listView");
           
            let z = document.getElementById("accountContainer");
          
            x.style.display = "block"
            y.style.display = "block"
       
          z.style.display = "none"
   
           
        }


}

function fetchUser() {

    let data = JSON.stringify({
        token: authenticationToken,
        user: authenticatedUser
    });




    fetch('/app/user/load/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser
        },
        body: data
    }).then(respons => {
        if (respons.status < 400) {
            console.log("loading")
            loadLists(respons);
            
        } else {
           
            console.log('Did not load Database');
        }
    }).catch(err => console.error(err));


}


//Account settings----------------------

function displayAccount(respons) {
    //clearContainer();

    let accountForm = getTemplate("accountTemplate");
    document.getElementById("accountContainer").appendChild(accountForm);
  


    let accountView = document.getElementById("accountContainer");
    accountView.removeAttribute("hidden");
    accountEdit(respons);
}


async function accountEdit() {




}



//Displaying lists-----------------
function displayLists() {
    clearContainer();
    fetchLists();

    let createListsForm = getTemplate("listTemplate");
    document.getElementById("listHeader").appendChild(createListsForm);


    let form = document.getElementById("listBtn");
    form.onclick = function (evt) {
      

        // Stops the form from submitting
        evt.preventDefault();

        //Putting the content and a user id in the database-----------------------------

        let inputTittel = document.getElementById("listTittel").value;
        let inputBeskrivelse = document.getElementById("listBeskrivelse").value;
        let privacyValue = document.getElementById("privacy").value;

   


        if (inputTittel.length && inputBeskrivelse.length == 0) {
            inputBeskrivelse.value = "";
            inputTittel.value = "";
            document.getElementById("listTittel").placeholder = "Tomt. Prøv igjen";

        } else {
            fetch('/app/lists', {
                method: "POST",
                body: JSON.stringify({
                    inputTittel,
                    inputBeskrivelse,
                    user: authenticatedUser,
                    token: authenticationToken,
                    privacyValue
                    

                }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },

            }).then(function (data) {
                if (data.status < 400) {
                   
                  
                 
                    fetchLists();
                    return data.json();

                }

            }).catch(err => {
                console.error(err);
            });

        }
    }
}


function modal() {


    
    let createTaskForm = getTemplate("modal");
    document.getElementById("taskContainer").appendChild(createTaskForm);
    document.getElementById("taskContainer").style.display = "block";

    let form = document.getElementById("modalBtn");
    form.onclick = function (evt) {
        modal.style.display = "none";

        // Stops the form from submitting
        evt.preventDefault();
       let activeListid1 = localStorage.getItem("listid")



        //Putting the content and a user id in the database-----------------------------
        let inputText = document.getElementById("task").value;
        
        let inputDate = document.getElementById("myDate").value;
       
   

       
       
      
      
       let activeListid12 = { id: activeListid1 }; 


        if (inputText.length == 0) {
            inputText.value = "";
            document.getElementById("task").placeholder = "Tomt. Prøv igjen";

        } else {
            fetch('/app/posts', {
                method: "POST",
                body: JSON.stringify({
                    inputDate,
                    inputText,
                    user: authenticatedUser,
                    token: authenticationToken,
                    listid: activeListid12
                    


                }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },

            }).then(function (data) {
                if (data.status < 400) {
                    document.getElementById("task").value = "";
                  
                    fetchPosts(activeListid1);
                   
                    return data.json();

                }

            }).catch(err => {
                console.error(err);
            });



        }



    }




    // Modal functions-------------------------

    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";

    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


    //Enter key for button

    var input = document.getElementById("task");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("modalBtn").click();
        }
    });

}




//Fetch list and posts from DB----------------------------

function fetchLists() {



    let data = JSON.stringify({
        token: authenticationToken,
        user: authenticatedUser,
       
    });




    fetch('/app/lists/load/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            loadLists(response);
        } else {
            // TODO: MESSAGE
            console.log('Did not load Database');
        }
    }).catch(err => console.error(err));


}



async function loadLists(response) {

    let data = await response.json();
   
    var container = document.getElementById("listView");
    let listsForDisplay = "";
    let value = document.getElementById("pivacySel").value;
   
if (value == "Privat"){
    for (var i = 0; i < data.length; i++) {
        if (data[i].privacy == "Privat"){
            
        let listT = data[i].listtittel;
        let listB = data[i].beskrivelse;
        let listid = data[i].listid;

        container.style.display = "block";


        let DBlists =

            `
            
            <div id="listBox">
        
       <h1 onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listT}</h1>
       <p onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listB}</p>
        
       <button onclick="deleteLists(${listid})">Delete</button>
       <button onclick="updateLists(${listid})">Edit</button>

        
        </div>
        `;

        listsForDisplay += DBlists;
        } else {console.log("did not make the cut");}
    }
}
    else if (value == "Public"){
        for (var i = 0; i < data.length; i++) {
            if (data[i].privacy == "Public"){
            let listT = data[i].listtittel;
            let listB = data[i].beskrivelse;
            let listid = data[i].listid;
    
            container.style.display = "block";
    
    
            let DBlists =
    
                `
                
                <div id="listBox">
            
           <h1 onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listT}</h1>
           <p onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listB}</p>
            
           <button onclick="deleteLists(${listid})">Delete</button>
           <button onclick="updateLists(${listid})">Edit</button>
    
            
            </div>
            `;
    
            listsForDisplay += DBlists;
            }
        }
    }
        else if (value == "all"){
            for (var i = 0; i < data.length; i++) {
                
                let listT = data[i].listtittel;
                let listB = data[i].beskrivelse;
                let listid = data[i].listid;
        
                container.style.display = "block";
        
        
                let DBlists =
        
                    `
                    
                    <div id="listBox">
                
               <h1 onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listT}</h1>
               <p onclick ="clearList(); modal(), fetchPosts(${listid}) "> ${listB}</p>
                
               <button onclick="deleteLists(${listid})">Delete</button>
               <button onclick="updateLists(${listid})">Edit</button>
        
                
                </div>
                `;
        
                listsForDisplay += DBlists;
                
                }
            }
            document.getElementById("listView").innerHTML = listsForDisplay;
            document.getElementById("listView").style.cursor = "pointer";
        }
  





function fetchPosts(elm) {
 

localStorage.setItem("listid", elm);


//activeListid.valueOf();
    let data = JSON.stringify({
        token: authenticationToken,
        user: authenticatedUser,
        listid: elm
    });




    fetch('/app/posts/load/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            loadPosts(response);
          

        } else {
            // TODO: MESSAGE
            console.log('Did not load Database');
        }
    }).catch(err => console.error(err));


}


async function loadPosts(response) {
    let data = await response.json();

   

    let view = document.createElement("div");
    let listForDisplay = "";//view;


    for (let i = 0; i < data.length; i++) {

        let postCd = data[i].postcontent;
        let postF = data[i].dato;
        let postlistId = data[i].postid;
        
        let div = document.createElement("div");
        div.class = "dropdown"
        div.id = "lists";


        let DBlist = `
        
        <div id="${i}">
        
        <ul>
        
        <li>To Remember: ${postCd} Deadline: ${postF} <button id="deleteBtn" onclick="deleteListElement(${postlistId})")>delete</button>
        
        </li>
        </ul>
        
        </div>
        `;

        div.innerHTML = DBlist;
        div.id = i;
        

        listForDisplay += DBlist;
        // document.getElementById("container").innerHTML += div;

    }
    
    document.getElementById("todocontainer").innerHTML = listForDisplay;

}


