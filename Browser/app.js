var SECONDS = 59;
var MINUTES = 3; 
var SCORE = [0,0]; 
var VALUE1;
var VALUE2;
var sliceCount = 0;
var p1data = [];
var p2data = [];
var p1trend = "0";
var p2trend = "0";
var multiplierA;
var multiplierB;
var makePointsFlag = true; 

function add(a, b) {
    return a + b;
}

function aggregateAverage () {//calculates the average SCORE of all players
    var average = 0; //holds a cumulative list of all of the player scores
    var tempString = localStorage.getItem("cumulativescores");
    var allScores = tempString.split(","); 
    average = allScores.reduce(function(a, b){a= parseFloat(a);b= parseFloat(b); return a+b;})
    // for (var i = 0; i < allScores.length; i++){

    average = Math.round(average/allScores.length);
    document.getElementById("average").innerHTML = ("The Average Score is: " + average);
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

    var re = new RegExp("\s*([A-Za-z\d]+)\s*");

    nameOne = re.exec(nameOne)[0];
    nameTwo = re.exec(nameTwo)[0];

    coupleName = this.nameMash (nameOne, nameTwo);

    document.getElementById("player-1").innerHTML = (nameOne + "'s Score is:");
    document.getElementById("player-2").innerHTML = (nameTwo + "'s Score is:");
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

    if (SCORE[0] > tempSCORE) {
        localStorage.setItem("highScore", SCORE[0]); 
    }
    if (SCORE[1] > tempSCORE) {
        localStorage.setItem("highScore", SCORE[1]);
    }
}


function initialization () {//initializes the persistant dashboard metrics for the first time

    if (localStorage.getItem("highScore") === 0) {
            localStorage.setItem("highScore", 0);
            localStorage.setItem("totalparticipants", 0);
            localStorage.setItem("average", 0);
            //localStorage.setItem("cumulativescores", )
        }
}


function myTimer() {//Simple, non-accurate clock funtion 
    var secs = "" + SECONDS;
    var min = MINUTES;

    if ( MINUTES >= 0){
        SECONDS --;

        if (SECONDS < 9) {
            secs = "0" + secs;
        }

        if (SECONDS === 0){
            SECONDS = 59;
            secs = "00";
            MINUTES --; 
        }
        if (MINUTES > 0){
            document.getElementById("timer-readout").innerHTML = (min + ":" + secs);
        }
        else {
            document.getElementById("timer-readout").innerHTML = (":" + secs);
        }
    }
    else {
        document.getElementById("timer-readout").innerHTML = ("Out of Time");
        makePointsFlag = false;
        storeScoresForAverages();
    }
}


function nameMash (p1,p2) {//celebrity name generator splits on the vowels or if all else fails just smash them together

    if (p1.length > 5 || p2.length > 5) {//TODO: Clean up this logic and make it more compact 
        //use the p1 and p2 arguments and loop through to grab the regex vowels
        var re = /[aeiou]/gi;
        var p1Array = p1.match(re);
        var p2Array = p2.match(re);
        //if there are more than 2 split on the second
        if (p1Array.length >= 2 && p2Array.length >= 2) {

            var i = 0
            while ((match = re.exec(p1)) != null) {
                i ++;
                if (i == p1Array.length){
                    var player1 = p1.substring(0,match.index + 1);
                } 
            }

            var z = 0
            while ((match = re.exec(p2)) != null) {
                z ++;
                if (z == p2Array.length){
                    var player2 = p2.substring(match.index - 2, p2.length);
                } 
            }
            return player1 + player2;
        }
        else {
            var i = 1
            while ((match = re.exec(p1)) != null) {
                i ++;
                if (i == 1){
                    var player1 = p1.substring(0,match.index + 1);
                } 
            }

            var z = 1
            while ((match = re.exec(p2)) != null) {
                z ++;
                if (z == 1){
                    var player2 = p2.substring(match.index - 1, p2.length);
                } 
            }
            return player1 + player2;

        }
        //else split on the first vowel
    }
    else {
        if (p1.length > 2 && p2.length > 2){
            return p1.substring(0,1).toUpperCase() + p1.substring(1,Math.floor(p1.length/2)).toLowerCase() + p2.substring(Math.floor(p2.length/2),p2.length).toLowerCase();
        }
        else {
            return p1.substring(0,1).toUpperCase() + p1.substring(1, p1.length).toLowerCase() + p2.substring(2,p2.length).toLowerCase();
        }
    }
}


function onRefreshInitialization () {//initializes the persistant dashboard metrics
    document.getElementById('p1').focus();
    $('#form')[0].reset();
}


function pointGenerator () {//this function computes the points 
    //TODO: Make a funtion to check directional trends and integrate the result into this function
    if (makePointsFlag) {
        var temp1Multipiler,
            temp2Multipler,
            trendValue1,
            trendValue2;

        if (multiplierA < .1) {
            temp1Multipiler = .1;
        }
        else {
            temp1Multipiler = multiplierA;
        }
        if (multiplierB < .1) {
            temp2Multipiler = .1;
        }
        else {
            temp2Multipiler = multiplierB;
        }

        trendOfReadings();
        if (p1trend === '0'){
            trendValue1 = 10;
        }
        else if (p1trend === '+'){
            trendValue1 = 100;
        }
        else if (p1trend === '-'){
            trendValue1 = 1;
        }
        else {
            trendValue1 = 5;
        }
        if (p2trend === '0'){
            trendValue2 = 10;
        }
        else if (p2trend === '+'){
            trendValue2 = 100;
        }
        else if (p2trend === '-'){
            trendValue2 = 1;
        }
        else {
            trendValue2 = 5;
        }
        temp1Multipiler ? SCORE[0] += Math.round(trendValue1 * temp1Multipiler) : null;
        temp2Multipiler ? SCORE[1] += Math.round(trendValue2 * temp2Multipiler) : null;
        scoreRender();
    }
}


function scoreRender () {

    document.getElementById("player-1-score").innerHTML = SCORE[0] ? SCORE[0] : "Loading...";
    document.getElementById("player-2-score").innerHTML = SCORE[1] ? SCORE[1] : "Loading...";

    //sets the high scoreRender
    document.getElementById("high-score").innerHTML = (localStorage.getItem("highScore"));
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

function storeScoresForAverages() {
    var tempArray = [];
    tempArray.push(localStorage.getItem("cumulativescores"));
    tempArray.push(SCORE[0]);
    tempArray.push(SCORE[1]);
    localStorage.setItem("cumulativescores", tempArray);
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

function trendOfReadings () {//Takes in the last n readings and makes comparison to determine directional trending
    var driftDebounce = 0; //tune based off of how much it wobbles

    if (sliceCount > 5){

        //simple and needs refactoring
        //TODO: take the last five averages and do a simple comparison for smoothing
        if (p1data[sliceCount - 0] > p1data[sliceCount - 1] &&  p1data[sliceCount - 1] > p1data[sliceCount - 2]){
            p1trend = "+";
        }
        else if (p1data[sliceCount - 0] < p1data[sliceCount - 1] && p1data[sliceCount - 1] < p1data[sliceCount - 2]){
            p1trend = "-";
        }
        else {
            p1trend = "0";
        }
        
         if (p2data[sliceCount - 0] > p2data[sliceCount - 1] &&  p2data[sliceCount - 1] > p2data[sliceCount - 2]){
            p2trend = "+";
        }
        else if (p2data[sliceCount - 0] < p2data[sliceCount - 1] && p2data[sliceCount - 1] < p2data[sliceCount - 2]){
            p2trend = "-";
        }
        else {
            p2trend = "0";
        }
    }

}



///////////////////////////////////////////////////////////////////////////////
function render() {//keep all of the execution of the app within this function
    initialization();
    onRefreshInitialization();
    aggregateAverage();
    storeScoresForAverages();
    //TODO: display the aggregated average
    totalParticipants();
    datesTimes();
    scoreRender();
    dataLoader();
    setInterval(scoreRender, 1000);
    loop = setInterval(dataLoader, 1000);
    slice = setInterval(timeSlice, 1000);
    countdown = setInterval(myTimer,1000);
    points = setInterval(pointGenerator, 333);
    leader = setInterval(highScore,1000);
}


$(document).ready(function() {
	render();
});

