//Deadline function--------------------------------

//var timer;
/*async function settimer(respons) {

    //clearInterval(timer);
    let data = await respons.json();

console.log(data)

    
    var timer_month = document.getElementById("month").value;
    var timer_day = document.getElementById("day").value;
    var timer_year = document.getElementById("year").value;
    var timer_hour = document.getElementById("hour").value;
    if (timer_hour == "") timer_hour = 0;
    var timer_min = document.getElementById("min").value;


    var timer_date = timer_month + "/" + timer_day + "/" + timer_year + " " + timer_hour + ":" + timer_min;


    //var end = new Date(timer_date); // Arrange values in Date Time Format

    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    function showtimer() {
        var now = new Date(); // Get Current date time
        let time = document.getElementById(elmID).innerHTML;
        var remain = time - now; // Get The Difference Between Current and entered date time
        console.log(timer_date);


        if (remain < 0) {
            clearInterval(timer);
            document.getElementById(elmID).innerHTML = 'Deadline Now!';
            return;
        }

        var days = Math.floor(remain / day);
        var hours = Math.floor((remain % day) / hour);
        var minutes = Math.floor((remain % hour) / minute);
        var seconds = Math.floor((remain % minute) / second);

        document.getElementById(elmID).innerHTML = days + 'Days ';

        if (days < 1) {
            document.getElementById("elmID").innerHTML = '1 day left';
        }
    }
   // timer = setInterval(showtimer, 1000); // Display Timer In Every 1 Sec
}*/