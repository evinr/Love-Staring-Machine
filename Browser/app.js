var SECONDS = 59;
var MINUTES = 3; 
var SCORE = []; 
var VALUE1;
var VALUE2;
var sliceCount = 0;
var p1data = [];
var p2data = [];
var multiplierA;
var multiplierB;


function aggregateAverage () {//calculates the average SCORE of all players
    var average = []; //holds a cumulative list of all of the player scores

    var allSCOREs = localStorage.getItem("cumulativeSCOREs"); 
    
    average =   allSCOREs.reduce(function(previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                })/allSCOREs.length;
    
    document.getElementById("average").innerHTML = ("The Average SCORE is: " + average);
}


function average (data) {
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

    coupleName = this.nameMash (nameOne, nameTwo);

    document.getElementById("player-1").innerHTML = (nameOne + "'s SCORE is:");
    document.getElementById("player-2").innerHTML = (nameTwo + "'s SCORE is:");
    document.getElementById("couple-name").innerHTML = ("Couple Name: " + coupleName);
    localStorage.setItem("player1", nameOne); 
    localStorage.setItem("player2", nameTwo); 
    localStorage.setItem("couplename", coupleName); 
}


function datesTimes () {//grabs the time... no network or persistant time... Need a GPS module for the Raspberry PI
    var cleanDate;

    cleanDate = new Date().toLocaleString()

    document.getElementById("date-time").innerHTML = ("Date and Time: " + cleanDate); 
    localStorage.setItem("timestamp", cleanDate); 
}


function dataLoader(){//pulls the data from a local JSON file
    $.getJSON("../result.json", function(data) {

        VALUE1 = data["player1"];
        VALUE2 = data["player2"];
    });
}


function highScore () {//checks if any of the present SCOREs are higher than the all time high SCORE
    var tempSCORE = parseInt(localStorage.getItem("highScore"));

    if (SCORE > tempSCORE) {
        //TODO: update the high SCORE on the board
        localStorage.setItem("highScore", SCORE); 
    }
}


function initialization () {//initializes the persistant dashboard metrics for the first time

    if (localStorage.getItem("highScore") == null) {
            localStorage.setItem("highScore", 0);
            localStorage.setItem("totalparticipants", 0);
            localStorage.setItem("average", 0);
        }
}


function myTimer() {//Simple, non-accurate clock funtion 
    var secs = "" + SECONDS;

    if ( MINUTES > 0){
        SECONDS --;
    }

    if (SECONDS < 10) {
        secs = "0" + secs;
    }

    if (SECONDS === 0){
        SECONDS = 59;
        MINUTES --; 
    }

    if (MINUTES === 0){
        document.getElementById("timer-readout").innerHTML = ("Out of Time");
    }

    document.getElementById("timer-readout").innerHTML = (MINUTES + ":" + secs);
}


function nameMash (p1,p2) {//celebrity name generator splits on the vowels or if all else fails just smash them together

    if (p1.length > 5 || p2.length > 5) {//TODO: better qualifier to catch allow exceptions to be dumped into the else.
        //use the p1 and p2 arguments and loop through to grab the regex vowels
        //if there are more than 2 split on the second
        //else split on the first vowel
    }
    else {
        if (p1.length > 2 && p2.length > 2){
            return p1.substring(0,1).toUpperCase() + p1.substring(1,Math.floor(p1.length/2)).toLowerCase() + p2.substring(Math.floor(p2.length/2),p2.length).toLowerCase();
        }
        else {
            return p1.substring(0,1).toUpperCase() + p1.substring(1, p1.length).toLowerCase() + p2.toLowerCase();
        }
    }
}


function onRefreshInitialization () {//initializes the persistant dashboard metrics
    document.getElementById('p1').focus();
    $('#form')[0].reset();
}


function pointGenerator (multiplierA, multiplierB) {//this function computes the points 
    return true;

}


function scoreRender () {

    document.getElementById("player-1-score").innerHTML = VALUE1 ? VALUE1 : "Loading...";
    document.getElementById("player-2-score").innerHTML = VALUE2 ? VALUE2 : "Loading...";

    //sets the high scoreRender
    document.getElementById("high-score").innerHTML = ("The High Score is: " + localStorage.getItem("highScore"));
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

    p1data[sliceCount] = VALUE1;
    p2data[sliceCount] = VALUE2;
    sliceCount ++;
    //Store 240 time slices (one per second) for both players

    multiplierA = standardDeviation(p1data);
    multiplierB = standardDeviation(p2data);
    //this data is used for modeling the results

    //creates a baseline to determine if disconnet has occured
    //writes the list of time slices into localstorage
    localStorage.setItem("player1slices", p1data); 
    localStorage.setItem("player2slices", p2data); 
}


function totalParticipants () {//keeps a rolling total on how many times the test has been ran
    var newTotal = parseInt(localStorage.getItem("totalparticipants")) + 1;
    
    document.getElementById("participant-total").innerHTML = ("Total Number of Participants: " + newTotal); 
    localStorage.setItem("totalparticipants", newTotal); 
}


function totalPoints () {//create a rolling total
    var newTotal;

    localStorage.setItem("averagepoints", rollingAverage);
    localStorage.setItem("totalparticipants", newTotal);
}



///////////////////////////////////////////////////////////////////////////////
function render() {//keep all of the execution of the app within this function
    initialization();
    onRefreshInitialization();

    //TODO: display the aggregated average
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
	render();
});

