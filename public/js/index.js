function loginBtn(){
    window.location = 'login.html';
}

        let form = document.getElementById("createUserForm");
        form.onsubmit = function (evt) {
            // Stops the form from submitting
            evt.preventDefault();
            
            let userName = document.getElementById("userName").value;
            let password = document.getElementById("password").value;
            let email = document.getElementById("email").value;
           
            
            fetch('/app/user',{
                method:"POST",
                body:JSON.stringify({
                    name:userName,
                    pswHash:password,
                    email:email

                   
                }),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },

            }).then(function(data){
                if(data.status < 400){
                   createdStatus();
                    console.log(data);
                    return data.json();
                   
                }
                else{
                    failStatus();
                }
                
            }).catch(err =>{
                console.error(err);
                failStatus();
            });

        }

function  createdStatus(){

    var t = document.createTextNode("User created successfully ");
    document.body.appendChild(t);
    document.getElementById("email").value="";
    document.getElementById("password").value="";
    document.getElementById("userName").value="";
}


    function  failStatus(){

var t = document.createTextNode("Try Again");
document.body.appendChild(t);
document.getElementById("email").value="";
document.getElementById("password").value="";
document.getElementById("userName").value="";
}
