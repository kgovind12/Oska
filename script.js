import { movegen, oskaplayer } from './oskaplayer.js';

// Initial setup

// Log the selected piece


var rowMinus3 = document.querySelectorAll('[row="r-3"]');
var row0 = document.querySelectorAll('[row="r0"]');
var row1 = document.querySelectorAll('[row="r1"]');

// Initial board = [[w,w,w,w,w], [-,-,-,-], [-,-,-], [-,-] [-,-,-], [-,-,-,-] [b,b,b,b,b]]

var initialBoard = [
    ["w","w","w","w","w"],
    ["-","-","-","-"],
    ["-","-","-"],
    ["-","-"],
    ["-","-","-"],
    ["-","-","-","-"],
    ["b","b","b","b","b"]
];

console.log(initialBoard);
renderBoard(initialBoard);

// Render the board based on the list format
function renderBoard(currState) {
    for (var i = 0; i < currState.length; i++) {
        for (var j = 0; j < currState[i].length; j++) {
            var column = `s${i}${j}`;
            var square = document.getElementById(column);
            square.setAttribute("piece", currState[i][j]);
        }
    }
}

// When user clicks a piece, show all possible next positions
$('[piece="b"]').click(function(currState) {
    // display new positions - this will come from the movegen() function of python algorithm
    console.log("Black piece clicked");
    var newStates = movegen(currState, "b");
    for (var state of newStates) {
        // compare the new state to the current state. Whichever piece is different, highlight it with yellow
        // there has to be a more optimal way of doing this
        console.log(state);
    }
});

// When user clicks a piece, show all possible next positions
$('[piece="w"]').click(function(currState) {
    // display new positions - this will come from the movegen() function of python algorithm
    console.log("White piece clicked");
    var newStates = movegen(currState, "w");
    for (var state of newStates) {
        console.log(state);
    }
});

// AI ALGORITHM

// Algorithm gives the board representation in array (list) format, so we can use this list to render the board every time.
