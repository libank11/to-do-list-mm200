const DEBUG = true;
var authenticationToken = null;
var authenticatedUser = null;

(function () { // Start point for our litle demo.
    displayLogin();
})()

// Ask the server to verify that there is a user with the given username and password registerd.
function authenticateUser(username, password) {
    log("Starting authentication request", `Username ${username}`, `Password ${password}`);

    // We are going to base our authentication on basic authentication. This is a authentication scheme suported by http (RFC 7617)
    // Read more about it at https://en.wikipedia.org/wiki/Basic_access_authentication and https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme

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
        console.log("yeah");
        
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

function displayWelcome() {

   
        window.location = 'modal-index.html';
   
    
  

   
}

function displayError(msg) {
    let errView = document.getElementById("errorView");
    errView.removeAttribute("hidden");
    errView.querySelector("#msg").textContent = msg;
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