function clearInput(){
    
}
  
/// if the submit butto is clicked, the modal closes
    modalBtn.onclick = function(){
        modal.style.display = "none";
        settimer();
        
        //delay of clear inputvalue function
        setTimeout(function() {
            document.getElementById("task").value="";
        },100);
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



var timer;
var todos = [];

function get_todos() {
         
         var todos_str = localStorage.getItem('todos');
         
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
 
  return false;
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

function check() {
    console.log("hey");
   
    var id = this.getAttribute('id');
    var todos = get_todos();
    todos.strike(id,1)
    var todos2 = document.getElementById(id);
    //todos2.style.setProperty("text-decoration", "line-through");
    

    //localStorage.setItem('todo', JSON.stringify(todos));
    show();
    modal.style.display = "none";
    return false;
  }



    console.log("check")
    
//second modal


var editmodal = document.getElementById('editModal');

// Get the button that opens the modal
var editBtn = document.getElementsByClassName("editBttn");

// Get the <span> element that closes the modal
let editSpan = document.getElementsByClassName("editClose")[0];

let checkBtn = document.getElementById("checkModalBtn");

// When the user clicks the button, open the modal 
editBtn.onclick = function() {
    editmodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
editSpan.onclick = function() {
    editmodal.style.display = "none";
}



let form = document.getElementById("modalBtn");
form.onclick = function (evt) {

    settimer();
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

}
var input = document.getElementById("task");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("modalBtn").click();
    }
});
function show() {
    console.log("hey");
    let todos = get_todos();

    let time = '<p id="timer_value">';
    let html = '<ul class="list">';
    let button = '<button class="editBttn"></button>';
  
    for (var i = 0; i < todos.length; i++) {
        html +=  '<li  id="'+ i+ '">' + todos[i] + button + time;
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
  editModal[i].addEventListener('click', editBtn.onclick = function() {
    editmodal.style.display = "block";
});
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
document.getElementById('checkModalBtn').addEventListener('click', check);
show();


//Deadline function

function settimer(){
   
 clearInterval(timer);

 var timer_month=document.getElementById("month").value;
 var timer_day=document.getElementById("day").value;
 var timer_year=document.getElementById("year").value;
 var timer_hour=document.getElementById("hour").value;
 if(timer_hour=="")timer_hour=0;
 var timer_min=document.getElementById("min").value;
 if(timer_min=="")timer_min=0;
 var timer_sek=document.getElementById("sek").value;
 var timer_date=timer_month+"/"+timer_day+"/"+timer_year+" "+timer_hour+":"+timer_min+":"+timer_sek;
 
 
 var end = new Date(timer_date); // Arrange values in Date Time Format
 
 var second = 1000; 
 var minute = second * 60; 
 var hour = minute * 60; 
 var day = hour * 24; 

 function showtimer() {
    var now = new Date(); // Get Current date time
  var remain = end - now; // Get The Difference Between Current and entered date time
  console.log(timer_date);

  if(remain < 0) 
  {
   clearInterval(timer);
   document.getElementById("timer_value").innerHTML = 'Deadline Now!';
   return;
  }
  
  var days = Math.floor(remain / day); 
  var hours = Math.floor((remain % day) / hour); 
  var minutes = Math.floor((remain % hour) / minute); 
  var seconds = Math.floor((remain % minute) / second); 
 
  document.getElementById("timer_value").innerHTML = days + 'Days ';
  
  if(days < 1){
    document.getElementById("timer_value").innerHTML = '1 day left'; 
  }
 }
 timer = setInterval(showtimer, 1000); // Display Timer In Every 1 Sec
}