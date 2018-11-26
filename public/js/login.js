// Ask the server to verify that there is a user with the given username and password registerd.

function authenticateUser(username, password) {
    console.log("Starting authentication request", `Username ${username}`, `Password ${password}`);

    // We are going to base our authentication on basic authentication. This is a authentication scheme suported by http (RFC 7617)


    let credentials = `Basic ${btoa(username + ":" + password)}`; // This creates a string that looks similar to  "Basic KL9zxHppU2VCX". btoa is a function of the window object.

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


        //modal();
        headerFunction();
        displayLists();
        
        var x = document.getElementById("container");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        var listHeader = document.getElementById("listHeader");
        if (listHeader.style.display === "none") {
            listHeader.style.display = "block";
        } else {
            listHeader.style.display = "none";
        }

        clearContainer()




    }).catch(function (err) {
        // fetch could not complete the request.
        displayError(err.message);
    });

}