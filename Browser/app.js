var seconds = 59;
var minutes = 3; 
var score = []; 
var value1;
var value2;
var sliceCount = 0;
var p1data = [];
var p2data = [];


 function aggregateAverage () {
    var average = []; //holds a list of all of the player scores
    //calculates the average score of all players
    //writes the average to localstorage
    var allScores = localStorage.getItem("cumulativescores"); 
    average =   allScores.reduce(function(previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                })/allScores.length;
    document.getElementById("average").innerHTML = ("The Average Score is: " + average);
 }

function timeSlice () {
    p1data[sliceCount] = value1;
    p2data[sliceCount] = value2;
    sliceCount ++;
    //Store 240 time slices (one per second) for both players
    //this data is used for modeling the results
    //creates a baseline to determine if disconnet has occured
    //writes the list of time slices into localstorage
    localStorage.setItem("player1slices", p1data); 
    localStorage.setItem("player2slices", p2data); 
 }

 function totalPoints () {
    var newTotal;
    //create a rolling total
    //writes the average to localstorage
    localStorage.setItem("totalparticipants", newTotal);
    localStorage.setItem("totalparticipants", newTotal);
 }

 function contactInfo () { //grabs the contact details and transforms them into a combination name and stores everything to local storage
    var coupleName, name, email;
    nameTemp = $('#form').serialize();
    chopped = nameTemp.split("&");
    nameOne = chopped[0].split("=")[1];
    nameTwo = chopped[1].split("=")[1];
    //coupleName = nameOne + nameTwo;
    //does a mashup of the names, giving a few options

    coupleName = this.nameMash (nameOne, nameTwo);
    /////split before and after the inner vowels
 
    document.getElementById("couple-name").innerHTML = ("Couple Name: " + coupleName);
    //writes to local storage
    localStorage.setItem("player1", nameOne); 
    localStorage.setItem("player2", nameTwo); 
    localStorage.setItem("couplename", coupleName); 
    //
 }

 function nameMash (p1,p2) {
    if (p1.length > 2 && p2.length > 2){
        return p1.substring(0,1).toUpperCase() + p1.substring(1,Math.floor(p1.length/2)).toLowerCase() + p2.substring(Math.floor(p2.length/2),p2.length).toLowerCase();
    }
    else {
        return p1.substring(0,1).toUpperCase() + p1.substring(1, p1.length).toLowerCase() + p2.toLowerCase();
    }
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
    $.getJSON("../result.json", function(data) {
    	value1 = data["player1"];
        value2 = data["player2"];
    });
 }

 function scoreRender () {

    document.getElementById("player-1-score").innerHTML = value1 ? value1 : "Loading...";
    document.getElementById("player-2-score").innerHTML = value2 ? value2 : "Loading...";

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
    localStorage.setItem("average", 0);

}

function onRefresh () {
    //initializes the persistant dashboard metrics
    document.forms[0].elements[0].focus();
    $('#form')[0].reset();
}

function dataRender() {//keep bulk of execution of the app within this function
    if (localStorage.getItem("highscore") == null) {
        init = initialization();
    }
    //display the aggregated average
    //
    refresh = onRefresh();
    people = totalParticipants();
    stamp = datesTimes();
    scoreRender();
    slice = setInterval(timeSlice, 1000);
    loop = setInterval(dataLoader, 1000);
    countdown = setInterval(myTimer,1000);
    points = setInterval(scoreRender, 633);
    leader = setInterval(highScore,1000);
}

$(document).ready(function() {
	dataRender();
});

