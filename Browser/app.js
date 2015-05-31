 var seconds = 59;
 var minutes = 3; 
 var score = []; 

 function aggregateAverage () {
    var average;
    ///////Blocked by lack of python gerated timeseries data
    //creates the average
    //writes the average to localstorage
    localStorage.setItem("totalparticipants", average); 
 }

 function totalPoints () {
    var newTotal;
    ///////Blocked by lack of python gerated timeseries data
    //create a rolling total
    //writes the average to localstorage
    localStorage.setItem("totalparticipants", newTotal); 
 }

 function contactInfo () { //grabs the contact details and transforms them into a combination name and stores everything to local storage
    var coupleName, name, email;
    nameTemp = $('#form').serialize();
    chopped = nameTemp.split("&");
    nameData = chopped[0].split("=")[1];
    otherName = chopped[1].split("=")[1];
    coupleName = nameData + otherName;
    ///////for testing purposes we are going to use both fiedls for two names to make the mashup logic work solid REMOVE ME
    //does a mashup of the names, giving a few options
    /////split before and after the inner vowels
 
    document.getElementById("couple-name").innerHTML = ("Couple Name: " + coupleName);
    //writes to local storage
    localStorage.setItem("couplename", coupleName); 
    //
 }

 function totalParticipants () {
    //keeps a rolling total on how many times the test has been ran
    var newTotal = parseInt(localStorage.getItem("totalparticipants")) + 1;
    document.getElementById("participant-total").innerHTML = ("Total Number of Participants: " + newTotal); 
    //writes to local storage
    localStorage.setItem("totalparticipants", newTotal); 
 }

 function datesTimes () {//grabs the time... no network or persistant time... Need a GPS module for the Raspberry PI
    var cleanDate;
    cleanDate = new Date().toLocaleString()
    document.getElementById("date-time").innerHTML = ("Date and Time: " + cleanDate); 

    localStorage.setItem("timestamp", cleanDate); 
 }

 function dataLoader(){
    $.getJSON("./result.json", function(data) {
    	score[0] = data["player1"];
        score[1] = data["player2"];
    });
 }

 function scoreRender () {
    document.getElementById("player-1-score").innerHTML = (score[0]);
    document.getElementById("player-2-score").innerHTML = (score[1]);

    //sets the high scoreRender
    document.getElementById("high-score").innerHTML = ("The High Score is: " + localStorage.getItem("highscore"));
 }

function myTimer() {
    var s = seconds+"";
    if (seconds < 10) {
    	s = "0" + s;
    }
    document.getElementById("timer-readout").innerHTML = (minutes + ":" + s);
    seconds --;
    score[0,1] ++;
    if (seconds === 0){
    	seconds = 59;
    	minutes --; 
        score[0,1] + 10;
    }
    if (minutes === 0){
    	document.getElementById("timer-readout").innerHTML = ("Out of Time");
    }
}

function highScore () {
    var tempScore = parseInt(localStorage.getItem("highscore"));
    if (score > tempScore) {
    localStorage.setItem("highscore", score); 
    }

}

function initialization () {
    //initializes the persistant dashboard metrics
    localStorage.setItem("highscore", 0);
    localStorage.setItem("totalparticipants", 0);
}

function dataRender() {//keep bulk of execution of the app within this function
    if (localStorage.getItem("highscore") == null) {
        init = initialization();
    }
    people = totalParticipants();
    stamp = datesTimes();
    loop = setInterval(dataLoader, 1000);
    countdown = setInterval(myTimer,1000);
    points = setInterval(scoreRender,633);
    leader = setInterval(highScore,1000);
}

$(document).ready(function() {
    document.forms[0].elements[0].focus();
    $('#form')[0].reset();
	dataRender();
});

