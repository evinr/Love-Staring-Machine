var seconds = 59;
var minutes = 3; 
var score = []; 
var value1;
var value2;
var sliceCount = 0;
var p1data = [];
var p2data = [];
var multiplierA;
var multiplierB;


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


function average(data){
    var sum = data.reduce(function(sum, value){
    return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
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
    document.getElementById("player-1").innerHTML = (nameOne + "'s Score is:");
    document.getElementById("player-2").innerHTML = (nameTwo + "'s Score is:");
    document.getElementById("couple-name").innerHTML = ("Couple Name: " + coupleName);
    //writes to local storage
    localStorage.setItem("player1", nameOne); 
    localStorage.setItem("player2", nameTwo); 
    localStorage.setItem("couplename", coupleName); 
    //
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

function nameMash (p1,p2) {
    if (p1.length > 2 && p2.length > 2){
        return p1.substring(0,1).toUpperCase() + p1.substring(1,Math.floor(p1.length/2)).toLowerCase() + p2.substring(Math.floor(p2.length/2),p2.length).toLowerCase();
    }
    else {
        return p1.substring(0,1).toUpperCase() + p1.substring(1, p1.length).toLowerCase() + p2.toLowerCase();
    }
}


function onRefreshInitialization () {
    //initializes the persistant dashboard metrics
    document.getElementById('p1').focus();
    $('#form')[0].reset();
}


function pointGenerator (multiplierA, multiplierB) {
    return true;
}


function scoreRender () {

    document.getElementById("player-1-score").innerHTML = value1 ? value1 : "Loading...";
    document.getElementById("player-2-score").innerHTML = value2 ? value2 : "Loading...";

    //sets the high scoreRender
    document.getElementById("high-score").innerHTML = ("The High Score is: " + localStorage.getItem("highscore"));
}


function standardDeviation(values){
    var avg = average(values);
    var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev; 
}


function timeSlice () {
    p1data[sliceCount] = value1;
    p2data[sliceCount] = value2;
    sliceCount ++;
    //Store 240 time slices (one per second) for both players
    console.log("player 1 ", standardDeviation(p1data));
    multiplierA = standardDeviation(p1data);
    multiplierB = standardDeviation(p2data);
    console.log("player 2 ", multiplierA);
    //this data is used for modeling the results

    //creates a baseline to determine if disconnet has occured
    //writes the list of time slices into localstorage
    localStorage.setItem("player1slices", p1data); 
    localStorage.setItem("player2slices", p2data); 
}


function totalParticipants () {
    //keeps a rolling total on how many times the test has been ran
    var newTotal = parseInt(localStorage.getItem("totalparticipants")) + 1;
    document.getElementById("participant-total").innerHTML = ("Total Number of Participants: " + newTotal); 
    //writes to local storage
    localStorage.setItem("totalparticipants", newTotal); 
}


function totalPoints () {
    var newTotal;
    //create a rolling total
    //writes the average to localstorage
    localStorage.setItem("totalparticipants", newTotal);
    localStorage.setItem("totalparticipants", newTotal);
}



///////////////////////////////////////////////////////////////////////////////
function dataRender() {//keep bulk of execution of the app within this function
    if (localStorage.getItem("highscore") == null) {
        initialization();
    }
    //display the aggregated average
    //
    onRefreshInitialization();
    totalParticipants();
    datesTimes();
    scoreRender();
    dataLoader();
    loop = setInterval(dataLoader, 1000);
    slice = setInterval(timeSlice, 1000);
    countdown = setInterval(myTimer,1000);
    points = setInterval(scoreRender, 633);
    leader = setInterval(highScore,1000);
}

$(document).ready(function() {
	dataRender();
});

