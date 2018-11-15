function clearInput(){
    
}
    
/// if the submit butto is clicked, the modal closes
    modalBtn.onclick = function(){
        modal.style.display = "none";
        
        
        //delay of clear inputvalue function
        /*setTimeout(function() {
            document.getElementById("task").value="";
        },1000);*/
    }
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}




var todos = [];

function get_todos() {
         
         var todos_str = localStorage.getItem('todo');
         
         if (todos_str !== null) {
           todos = JSON.parse(todos_str);
         }
          return todos;


       }

function add() {
  var inputTxt = document.getElementById('task').value;
  var todos = get_todos();
  
  if(inputTxt.length == 0){
console.log("tomt");

  }
  else {
    todos.push(inputTxt);
   
  
  //localStorage.setItem('todo', JSON.stringify(todos));
  console.log(todos);
  show();
 
 // return false;
  }
}

function remove() {
  var id = this.getAttribute('id');
  var todos = get_todos();
  todos.splice(id, 1);
  localStorage.setItem('todo', JSON.stringify(todos));
  show();
  return false;
}


function listModal(){
    console.log("hey")
    
//second modal


var editmodal = document.getElementById('editModal');

// Get the button that opens the modal
var editBtn = document.getElementsByClassName("editBttn");

// Get the <span> element that closes the modal
var editSpan = document.getElementsByClassName("editClose")[0];

// When the user clicks the button, open the modal 
editBtn.onclick = function() {
    editmodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
editSpan.onclick = function() {
    editmodal.style.display = "none";
}


}
/*let form = document.getElementById("modalBtn");
form.onclick = function (evt) {
// Stops the form from submitting
evt.preventDefault();
modal.style.display = "none";

let inputText = document.getElementById("task").value;


fetch('/app/lists',{
   method:"POST",
   body:JSON.stringify({    
       inputText

      
   }),
   headers: {
       "Content-Type": "application/json; charset=utf-8"
   },

}).then(function(data){
   if(data.status < 400){
    document.getElementById("task").value="";
       console.log(data);
       return data.json();
       
   }

}).catch(err =>{
   console.error(err);
});

}*/
function show() {
    console.log("hey");
    let todos = get_todos();
    let html = '<ul class="list">';
    let button = '<button class="editBttn"><i class="fa fa-bars"></i></button>';
  
    for (var i = 0; i < todos.length; i++) {
         html +=  '<li  id="'+ i+ '">' + todos[i] + button;
         console.log("kjører")
         
            
  };
          
          html += '</ul>';
          document.getElementById('todos').innerHTML = html;
console.log(i)

  
  var button_delete = document.getElementsByClassName('remove');
  for (var i = 0; i < button_delete.length; i++) {
  button_delete[i].addEventListener('click', remove);
  
 
  
};

 /*var button_modal = document.getElementsByClassName('editBttn');
  for (var i = 0; i < button_modal.length; i++) {
  button_modal[i].addEventListener('click', listModal);
  }*/

  var editModal = document.getElementsByClassName('editBttn');
  for (var i = 0; i < editModal.length; i++) {
      localStorage.clear(todos);
  editModal[i].addEventListener('click', listModal);
 }

};


  

console.log(todos);
let list = document.getElementById("todos");

list.onclick = function(){

    var id = this.getAttribute('id');
    var element= todos.slice(0);
    console.log(event.target)

}



document.getElementById('modalBtn').addEventListener('click', add);
show();