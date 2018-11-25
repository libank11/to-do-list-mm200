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


        modal();
        fetchData();
        var x = document.getElementById("container");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }



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
    let container = document.getElementById("taskContainer");
    //var container = document.getElementById("myDIV");
    if (container.style.display === "none") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }



    /* while (container.firstChild) {
        container.removeChild(container.firstChild);
    }*/
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
    let createTaskForm = getTemplate("createTaskTemplate");
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
                user: authenticatedUser,
                token: authenticationToken

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


function modal() {


    clearContainer();

    localStorage.setItem('Token', JSON.stringify(authenticationToken))
    let createTaskForm = getTemplate("modal");
    document.getElementById("taskContainer").appendChild(createTaskForm);


    let form = document.getElementById("modalBtn");
    form.onclick = function (evt) {
        modal.style.display = "none";

        // Stops the form from submitting
        evt.preventDefault();

        //Putting the content and a user id in the database-----------------------------
        let inputText = document.getElementById("task").value;
        let inputTag = document.getElementById("tag").value;
        //  let inputDate = document.getElementById("task").value;
        let inputMonth = document.getElementById("month").value;
        let inputDay = document.getElementById("day").value;
        let inputYear = document.getElementById("year").value;
        let inputHour = document.getElementById("hour").value;
        let inputMin = document.getElementById("min").value;
        var inputDate = inputMonth + " " + inputDay + "." + inputYear + "." + inputHour + "." + inputMin;
        settimer();
        console.log(inputDate)

        if (inputText.length == 0) {
            inputText.value = "";
            document.getElementById("task").placeholder = "Tomt. Prøv igjen";

        } else {
            fetch('/app/lists', {
                method: "POST",
                body: JSON.stringify({
                    inputDate,
                    inputText,
                    user: authenticatedUser,
                    token: authenticationToken

                }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },

            }).then(function (data) {
                if (data.status < 400) {
                    document.getElementById("task").value = "";
                    console.log(data);
                    fetchData();

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
    /*
    var input = document.getElementById("task");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("modalBtn").click();
        }
    });*/

}

var timer;

//Deadline function--------------------------------
function settimer() {

    //clearInterval(timer);

    var timer_month = document.getElementById("month").value;
    var timer_day = document.getElementById("day").value;
    var timer_year = document.getElementById("year").value;
    var timer_hour = document.getElementById("hour").value;
    if (timer_hour == "") timer_hour = 0;
    var timer_min = document.getElementById("min").value;


    var timer_date = timer_month + "/" + timer_day + "/" + timer_year + " " + timer_hour + ":" + timer_min;


    var end = new Date(timer_date); // Arrange values in Date Time Format

    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    function showtimer() {
        var now = new Date(); // Get Current date time
        var remain = end - now; // Get The Difference Between Current and entered date time
        console.log(timer_date);

        if (remain < 0) {
            clearInterval(timer);
            document.getElementById("timer_value").innerHTML = 'Deadline Now!';
            return;
        }

        var days = Math.floor(remain / day);
        var hours = Math.floor((remain % day) / hour);
        var minutes = Math.floor((remain % hour) / minute);
        var seconds = Math.floor((remain % minute) / second);

        document.getElementById("timer_value").innerHTML = days + 'Days ';

        if (days < 1) {
            document.getElementById("timer_value").innerHTML = '1 day left';
        }
    }
    //timer = setInterval(showtimer, 1000); // Display Timer In Every 1 Sec
}


//Fetch list from DB----------------------------

function fetchData() {



    let data = JSON.stringify({
        token: authenticationToken,
        user: authenticatedUser
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
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));


}





async function loadLists(respons) {
    let data = await respons.json();
    //let listJSON = data[0].
    console.log(data);
    // content = document.getElementById("container");
    //content.innerHTML = data[0].listcontent;
    let view = document.createElement("div");
    let listForDisplay = "";//view;

    //let postC = ["hello", "world"]
    for (let i = 0; i < data.length; i++) {

        //let postCd = data[i].listcontent;
        let postCd = data[i].listcontent;
        let postF = data[i].frist;
        let postlistId = data[i].listid;

        let div = document.createElement("div");
        div.class = "dropdown"
        div.id = "lists";


        let DBlist = `
        
        <div id="${i}">
        <ul>
        <li onmouseover="settimer()"  border="0"  width="32" height="32" >To Remember: ${postCd} 
        Deadline: ${postF} <button id="deleteBtn" onclick="deleteListElement(${postlistId})")>delete</button></li>
        </ul>
        </div>
        <div class="dropdown">
        <button class="dropbtn">Dropdown</button>
        <div class="dropdown-content">
        <p id="timer_value"></p>
        </div>
      </div>`;

        div.innerHTML = DBlist;
        div.id = i;
        // view.appendChild(div);

        listForDisplay += DBlist;
        // document.getElementById("container").innerHTML += div;

    }

    //document.getElementById("container").innerHTML = div;
    //let display = document.getElementById("container");
    document.getElementById("todocontainer").innerHTML = listForDisplay;

}

function deleteListElement(listvalue) {

    let data = JSON.stringify({

        listid: listvalue

    });

    fetch('/app/lists', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": authenticatedUser,
            "Listid": listvalue
        },
        body: data
    }).then(response => {
        if (response.status < 400) {
            console.log("loading")
            fetchData();

        } else {
            // TODO: MESSAGE
            console.log('Did not load presentation :(');
        }
    }).catch(err => console.error(err));


}


