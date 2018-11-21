const DEBUG = true;
var authenticationToken = null;
var authenticatedUser = null;


//Displayer Login--------------------------

(function () { 
    displayLogin();
})()

// Ask the server to verify that there is a user with the given username and password registerd.
function authenticateUser(username, password) {
    console.log("Starting authentication request", `Username ${username}`, `Password ${password}`);

    // We are going to base our authentication on basic authentication. This is a authentication scheme suported by http (RFC 7617)
   

    let credentials = `Basic ${ btoa(username + ":" + password)}`; // This creates a string that looks similar to  "Basic KL9zxHppU2VCX". btoa is a function of the window object.

    let request = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': credentials
        }
    }

    fetch("/app/authenticate", request).then(function (respons) {
        if (respons.status < 400) {
            console.log("bruker er logget inn"); 
            // OK we are authenticated.
            return respons.json(); // Grab the JSON payload. 
           
        } else if (respons.status === 401) {
            // Username or password was wrong, informe the user.
            return Promise.reject(new Error("Wrong username or password"));
        } else {
            // Some other thing went wrong.
            return Promise.reject(new Error("Could not log you in at this time, try again later"));
        }
    }).then(function (responsJSON) {
      
        authenticationToken = responsJSON.auth; // Because this is where the server puts the token.
        authenticatedUser = responsJSON.user; // Information about the user. 
    
        console.log(authenticationToken);
        console.log(authenticatedUser);
        
        
            displayWelcome();
       
        
        
    }).catch(function (err) {
        // fetch could not complete the request.
        displayError(err.message);
    });

}




// View code ----------------------------------------------------------------------------------
// Moste things after this point is just UI code and not important for the discussion.

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

// Utility functions ---------------------------------------------------------------------

function getTemplate(templateID) {
    let template = document.getElementById(templateID);
    template = document.importNode(template.content, true);
    return template;
}

function addToContainer(node) {
    document.getElementById("container").appendChild(node);
}

function clearContainer() {
    let container = document.getElementById("container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function log(...messages) {
    if (DEBUG) {
        messages.forEach(msg => {
            console.log(msg);
        })
    }
}


//--------Main app----------------------------------------------------


function displayWelcome() {

    clearContainer();
       //  window.location = 'main.html';
    
        
         localStorage.setItem('Token', JSON.stringify(authenticationToken))
         let createTaskForm =  getTemplate("createTaskTemplate");
         document.getElementById("container").appendChild(createTaskForm);
 
         let form = document.getElementById("submitTask");
         form.onclick = function (evt) {
         
            
             // Stops the form from submitting
             evt.preventDefault();
            
         //Putting the content and a user id in the database-----------------------------
             let inputText = document.getElementById("innhold").value;
         
         
             fetch('/app/lists', {
                 method: "POST",
                 body: JSON.stringify({
                 inputText,
                 user:authenticatedUser,
                 token:authenticationToken
                     
                 }),
                 headers: {
                     "Content-Type": "application/json; charset=utf-8"
                 },
         
             }).then(function (data) {
                 if (data.status < 400) {
                     document.getElementById("innhold").value = "";
                     console.log(data);
                     return data.json();
         
                 }
         
             }).catch(err => {
                 console.error(err);
             });
         
         }
 


}


function modal(){

// Modal functions
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