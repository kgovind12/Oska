const firstRow = 0;
const secondRow = 1;

//The main move generator that calls generate new states and returns all the possible next states.
function movegen(board, player) {
    return generateNewStates(board, player);
}

// Takes in the current state, the player whose turn it is
// generates all the new states for a given player using for each of his pawns.
function generateNewStates(currState, player) {
    var newStates = [];

    // iterating through the rows and columns
    for (var i=0; i<currState.length; i++) {
        for (var j=0; j<currState[i].length; j++) {
            if (currState[i][j] === player) {
                var position = {i,j};
                if (moveable(currState, player, position).includes("left")) {
                    var leftMove = moveLeft(currState, player, position);
                    newStates.push(leftMove);
                }
                if (moveable(currState, player, position).includes("right")) {
                    var rightMove = moveRight(currState, player, position);
                    newStates.push(rightMove);
                }
                if (jumpable(currState, player, position).includes("left")) {
                    var leftMove = moveLeft(currState, player, position);
                    newStates.push(leftMove);
                }
                if (jumpable(currState, player, position).includes("right")) {
                    var rightMove = moveRight(currState, player, position);
                    newStates.push(rightMove);
                }
            }
        }
    }

    // once it's finished generating states for all the pawns of that player, return all the new states
    return newStates;
}

// Checks which directions a player can move, and adds the possible directions to a list in string form
function moveable(currState, player, position) {
    var moveable = [];
    var {i,j} = position;
    const firstInRow = 0;
    const lastInRow = currState[i].length - 1;
    const middleRow = Math.floor(currState.length/2);
    const lastRow = currState.length - 1;

    // when is a move possible?

    // When a player is white, the following cases are possible:
    // a) piece is above the middle row
    // b) piece is below or equal to the middle row (indices change)

    if (player === "w") {
        if (i < middleRow && j != firstInRow && currState[i+1][j-1] === "-") {
            // Pawn is above middle row but not the first space in the row, then it can move left (assuming that space is empty)
            moveable.push("left");
        } else if (i < middleRow && j != lastInRow && currState[i+1][j] === "-") {
            // Pawn is above the middle row but not the last space in the row, then it can move right
            moveable.push("right");
        } else if (i >= middleRow && i !== lastRow && currState[i+1][j] === "-") {
            // Pawn is below or equal to the middle row, it can move left as long as
            // the space diagonally left is empty, and it has not reached the bottom
            moveable.push("left");
        } else if (i >= middleRow && i !== lastRow && currState[i+1][j+1] === "-") {
            // Same condition as above for moving right
            moveable.push("right");
        }
    } else if (player === "b") {
        // Similar situations apply to black. But this time, the middle is included with the rows above the middle
        if (i > middleRow && j != firstInRow && currState[i-1][j-1] === "-") {
            // If pawn is below the middle and not the leftmost (first) pawn in a row, pawn can move left
            moveable.push("left");
        } else if (i > middleRow && j !== lastInRow && currState[i-1][j] === "-") {
            // Same for right, as long as it is not the rightmost (last) in row, it can move right
            moveable.push("right");
        } else if (i <= middleRow && i !== firstRow && currState[i-1][j] === "-") {
            // If pawn is above or equal to the middle, just need to check if it reached the end
            // So as long as it is not in the first row, it can move left
            moveable.push("left");
        } else if (i <= middleRow && i !== firstInRow && currState[i-1][j+1]) {
            // Same for right, just need to check if it reached the end ie topmost row
            moveable.push("right");
        }
    }
}

function jumpable(currState, player, position) {
    var jumpable = [];
    var {i,j} = position;
    const firstInRow = 0;
    const secondInRow = 1;
    const lastInRow = currState[i].length - 1;
    const secondLastInRow = currState[i].length; - 2;
    const middleRow = Math.floor(currState.length/2);
    const secondLastRow = currState.length - 2;
    const rowAboveMiddle = Math.floor(currState.length/2 - 1);
    const rowBelowMiddle = Math.floor(currState.length/2 + 1);

    // when is a jump possible?

    // Here there are three main row situations for white. Piece is either:
    // a) above the middle row but not immediately above
    // b) below or equal to the middle row
    // c) row immediately above the middle row
    if (player === "w") {
        if (i < rowAboveMiddle && j !== firstRow && j !== secondInRow
            && currState[i+1][j-1] === "b" && currState[i+2][j-1] === "-") {
            // Pawn is above the middle row but not immediately above,
            // not the first or second in the row, and the diagonal left one is the opposite pawn
            // and the one diagonally left of that is empty, then it can move left
            jumpable.push("left");
        } else if (i < rowAboveMiddle && j !== lastInRow && j !== secondLastInRow
            && currState[i+1][j] === "b" && currState[i+2][j] === "-") {
            // Same for right, except it shouldn't be the last or second last in the row
            jumpable.push("right");
        } else if (i >= rowAboveMiddle && i < secondLastRow
            && currState[i+1][j] === "b" && currState[i+2][j] === "-") {
            // Pawn is below or equal to the row immediately above the middle row
            // then just check that it hasn't reached the end, ie the bottommost row
            // And the one diagonally left is the opposite pawn, and the one diagonally left of that is empty
            jumpable.push("left");
        } else if (i >= rowAboveMiddle && i < secondLastRow
            && currState[i+1][j+1] === "b" && currState[i+2][j+2] === "-") {
            // Same as above for jumping right
            jumpable.push("right");
        } else if (i === middleRow && j !== firstInRow
            && currState[i+1][j-1] === "b" && currState[i+2][j-1] === "-") {
            // special case: if the pawn is immediately above the middle row, then we need to adjust indices to take care of this edge case
            // because it will be jumping from one half of the board to the other half, while indices shift.
            jumpable.push("left");
        } else if (i === middleRow && j !== lastInRow
            && currState[i+1][j] == "b" && currState[i+2][j+1] == "-") {
            // Same for jumping right, as long as the pawn is not the last in the row, it will work
        }
    } else if (player === "b") {
        // Again, three possible situations. Above/equal to, below but not immediately below, and immediately below.
        if (i > rowBelowMiddle && j !== firstInRow && j !== secondInRow
            && currState[i-1][j-1] === "w" && currState[i-2][j-2] === "-") {
            // Pawn is below but not immediately below the middle row
            // It can move left as long as it it not the first two in row, and the same pattern as above
            jumpable.push("left");
        } else if (i > rowBelowMiddle && j !== lastInRow && j !== secondLastInRow
            && currState[i-1][j] === "w" && currState[i-2][j] === "-") {
            // Pawn is below but not immediately below the middle row
            // Can move right as long as it is not the last or second last in the row, remaining should follow same pattern 
            jumpable.push("right");
        } else if (i <= middleRow && i > secondRow
            && currState[i-1][j] === "w" && currState[i-2][j] === "-") {
            // Pawn is above or equal to the middle row
            // In that case, the only condition is it hasn't reached the end (ie, is not in the topmost 2 rows)
            jumpable.push("left");
        } else if (i <= middleRow && i > secondRow
            && currState[i-1][j+1] === "w" && currState[i-2][j+2] === "-") {
            // Pawn is above or equal to the middle row
            // Same as previous case, only have to check if it hasn't reached the end
            jumpable.push("right");
        } else if (i === rowBelowMiddle && j !== firstInRow
            && currState[i-1][j-1] === "w" && currState[i-2][j-1] === "-") {
            // Special case: if pawn is in the row immediately below the middle row, then we have to adjust indices as before
            // since it jumping over the middle row
            jumpable.push("left");
        } else if (i === rowBelowMiddle && j !== lastInRow
            && currState[i-1][j] === "w" && currState[i-2][j+1] === "-") {
            // Same special case, we have to adjust indices when it is jumping over the middle
            jumpable.push("right");
        }
    }

    return jumpable;
}

// Function to move the pawn left, taking in the current state, player and position of the pawn
// Returns the new state after it has been moved
function moveLeft(currState, player, position) {
    var newState = stringToList(currState);
    var {i,j} = position;
    const middleRow = Math.floor(currState.length/2);

    // There are the following cases for this
    if (player === "w") {
        if (i < middleRow) {
            // White and above the middle row
            newState[i][j] = "-";
            newState[i+1][j-1] = player;
        } else if (i >= middleRow) {
            // White and below/equal to the middle
            newState[i][j] = "-";
            newState[i+1][j] = player;
        }
    } else if (player === "b") {
        if (i > middleRow) {
            // Black and below the middle
            newState[i][j] = "-";
            newState[i-1][j-1] = player;
        } else if (i <= middleRow) {
            // Black and above/equal to the middle
            newState[i][j] = "-";
            newState[i-1][j] = player;
        }
    }

    return listToString(newState);
}

// Function to move the pawn right, taking in the current state, player and position of that pawn
// Returns the new state after it has been moved
function moveRight(currState, player, position) {
    var newState = stringToList(currState);
    var {i,j} = position;
    const middleRow = Math.floor(currState.length/2);

    // Same as moveLeft, there are 4 scenarios
    if (player === "w") {
        if (i < middleRow) {
            // White and above the middle
            newState[i][j] = "-";
            newState[i+1][j] = player;
        } else if (i >= middleRow) {
            // White and below/equal to the middle
            newState[i][j] = "-";
            newState[i+1][j+1] = player;
        }
    } else if (player === "b") {
        if (i > middleRow) {
            // Black and below the middle row
            newState[i][j] = "-";
            newState[i-1][j] = player;
        } else if (i <= middleRow) {
            newState[i][j] = "-";
            newState[i-1][j+1] = player;
        }
    }

    return listToString(newState);
}

function jumpLeft(currState, player, position) {
    var newState = stringToList(currState);
    var {i,j} = position;
    const middleRow = Math.floor(currState.length/2);
    const rowAboveMiddle = Math.floor(currState.length/2 - 1);
    const rowBelowMiddle = Math.floor(currState.length/2 + 1);

    if (player === "w") {
        if (i < rowAboveMiddle) {
            // Pawn is white and above the middle row but not immediately above
            newState[i][j] = "-";
            newState[i+2][j-2] = player;
            newState[i+1][j-1] = "-";
        } else if (i === rowAboveMiddle) {
            // Special case: pawn is in the row immediately above the middle
            newState[i][j] = "-";
            newState[i+2][j-1] = player;
            newState[i+1][j-1] = "-";
        } else if (i >= middleRow) {
            // Pawn is below or equal to the middle row
            newState[i][j] = "-";
            newState[i+2][j] = player;
            newState[i+1][j] = "-";
        }
    } else if (player === "b") {
        if (i > rowBelowMiddle) {
            // Pawn is black and below the middle row, but not immediately below
            newState[i][j] = "-";
            newState[i-2][j-2] = player;
            newState[i-1][j-1] = "-";
        } else if (i === rowBelowMiddle) {
            // Special case: Pawn is in the row immediately below the middle
            newState[i][j] = "-";
            newState[i-2][j-1] = player;
            newState[i-1][j-1] = "-";
        } else if (i <= middleRow) {
            // Pawn is above or equal to the middle row
            newState[i][j] = "-";
            newState[i-2][j] = player;
            newState[i-1][j] = "-";
        }
    }

    return listToString(newState);
}

// Takes in the currState (2D array) and converts it to a list of lists
function stringToList(currState) {
    var rowList = [];
    for (var i = 0; i < currState.length; i++) {
        for (var j = 0; j < currState[i].length; j++) {
            rowList.push(currState[i][j]);
        }
        currState[i] = rowList;
        rowList = [];
    }

    return currState;
}

// Function that takes currState (list of lists) and converts it back to a 2D array
function listToString(currState) {
    var rowString = "";
    for (var i = 0; i < currState.length; i++) {
        for (var j = 0; j < currState[i].length; j++) {
            rowString += currState[i][j];
        }
        currState[i] = rowString;
        rowString = "";
    }

    return currState;
}

// Function to check if black has won the game
function blackWins(currState) {
    for (var space of currState[0]) {
        if (space !== "b") {
            return false;
        }
    }
    return true;
}

// Function to check if white has won the game
function whiteWins(currState) {
    for (var space of currState[currState.length - 1]) {
        if (space !== "w") {
            return false;
        }
    }
    return true;
}

// Function to print the board in proper shape (Not used in main functions, for debugging purposes only).
function printBoard(currState) {
    var subString = "| ";
    var emptySquare = "-";
    var space = " ";
    const middleRow = Math.floor(currState.length/2);
    const lastRow = currState.length - 1;

    console.log(`    ${emptySquare.repeat(4*currState[0].length - 1)}`);

    for (var i = 0; i < middleRow; i++) {
        for (var j = 0; j < currState[i].length; j++) {
            subString += currState[i][j] + " | ";
        }
        var numDashes = (4 * currState[i].length) - 1;
        var numSideSpaces = (4 * currState[i].length);
        var numSpaces = Math.floor(numSideSpaces / currState[i].length);

        console.log(space.repeat(numSpaces) + subString + space.repeat(numSpaces));
        subString = "| ";
        console.log(`    ${emptySquare.repeat(numDashes)}`);
    }

    for (var k = middleRow; k < lastRow; k++) {
        for (var l = 0; l < currState[k].length; l++) {
            subString += currState[k][l] + " | ";
        }
        numDashes = (4 * currState[k].length) + 3;
        numSpaces = Math.floor(numDashes / currState[k].length);
        console.log(space.repeat(numSpaces) + subString + space.repeat(numSpaces));
        subString = "| ";
        console.log(`    ${emptySquare.repeat(numDashes)}`);
    }

    var lengthOfLastRow = currState[currState.length - 1].length;

    for (var m = 0; m < lengthOfLastRow; m++) {
        substring += currState[lastRow][m] + " | ";
    }

    console.log(space.repeat(numSpaces) + subString + space.repeat(numSpaces));
    console.log(`    ${emptySquare.repeat((4 * lengthOfLastRow) - 1)}`);
}

//////////////////////////////// MOVE GENERATOR ENDS HERE /////////////////////////////

// Counts the number of pawns on the board for a specific player
function count(currState, player) {
    var count = 0;
    for (var i = 0; i < currState.length; i++) {
        for (var j = 0; j < currState[i]; j++) {
            if (currState[i][j] === player) {
                count++;
            }
        }
    }

    return count;
}

// Board evaluation function (using current state and player)
function findValue(currState, player) {
    var opponent = findOpponent(player); // Here, player refers to "your player"
    var winningIndex = 0;
    var opponentIndex = 0;
    var value = 0;

    // Find the winning and opponent winning index for your player
    // aka what is your player's "goal" row and what is the opponent's "goal" row
    if (player === "w") {
        winningIndex = currState.length - 1;
        opponentIndex = 0;
    } else if (player === "b") {
        winningIndex = 0;
        opponentIndex = currState.length - 1;
    }

    // Find the total number of pieces you have and your opponent has on the board
    var totalCountPlayer = count(currState, player);
    var totalCountOpponent = count(currState, opponent);

    // Number of player pieces and opponent pieces that have reached the goal
    var countInWinningIndex = 0
    var countInOpponentIndex = 0

    // Check if number of pieces in goal is equal to the total number of pieces; then it is a win
    for (var i = 0; i < currState[0].length; i++) {
        if (currState[winningIndex][i] === player) {
            countInWinningIndex++;
        }
    }
    for (var j = 0; j < currState[0].length; j++) {
        if (currState[opponentIndex][j] === opponent) {
            countInOpponentIndex++;
        }
    }

    // Any board state will have one of the following scenarios
    if (countInWinningIndex === totalCountPlayer && countInOpponentIndex !== totalCountOpponent) {
        // Player has won
        value = 10;
    } else if (count(currState, opponent) === 0) {
        // Opponent has lost all their pawns
        value = 10;
    } else if (countInOpponentIndex === totalCountOpponent && countInWinningIndex !== totalCountPlayer) {
        // Player has lost
        value = -10;
    } else if (count(currState, player) === 0) {
        // Player has lost all pawns
        value = -10;
    } else if (countInWinningIndex === totalCountPlayer && countInOpponentIndex === totalCountOpponent) {
        // Both players have reached their goals
        // Then we count the number of pieces in total that have reached their goal
        // Whoever has more pieces in their goal state wins (assuming some pieces are lost)
        if (countInWinningIndex > countInOpponentIndex) {
            value = 10;
        } else if (countInOpponentIndex > countInWinningIndex) {
            value = -10;
        } else {
            value = 0; // draw
        }
    } else {
        // What if it is not a clear win or loss?
        // If at least one of your pawns has reached the goal, we use the following heuristic:
        // number of your pieces at goal - number of opponent's pieces at goal
        // + (number of your remaining pieces - number of opponent's remaining pieces)

        // Scroll to the bottom to see why this heuristic works

        if (currState[winningIndex].includes(player)) {
            countPlayerRemaining = count(currState, player) - countInWinningIndex;
            countOpponentRemaining = count(currState, opponent) - countInOpponentIndex;
            value = countInWinningIndex - countInOpponentIndex + (countPlayerRemaining - countOpponentRemaining);
        } else {
            value = count(currState, player) - count(currState, opponent);
        }
    }

    return value;
}

// Function takes in player and returns the opponent
function findOpponent(player) {
    if (player === "w") {
        return "b";
    } else if (player === "b") {
        return "w";
    }
}

/////////////////// FINDING THE BEST MOVE //////////////////////

// Function takes in the current state, player, and depth and calls the MaxValue and MinValue functions.
// Returns the corresponding state with the max heuristic value (best move)
// This follows the minimax pattern for finding the best next state.
function oskaplayer(currState, player, depth) {
    var bestMove = currState;
    var maxVal = Number.NEGATIVE_INFINITY;
    var neighbors = movegen(currState, findOpponent(player));
    var currVal = 0;
    for (var neighbor of neighbors) {
        currVal = MinValue(neighbor, player, depth - 1);
        if (currVal > maxVal) {
            maxVal = currVal;
            bestMove = neighbor;
        }
    }

    return bestMove;
}

// For max level players, will use this function.
// Finds the neighbors of the current state and calls MinValue on them until the depth is reached.
// MaxValue and MinValue keep alternatively calling each other.
// Returns the value using minimax
function MaxValue(currState, player, depth) {
    // Find next states for the player
    var neighbors = movegen(currState, player);
    // Find next states for the opponent, just to see if it is a leaf node (no next steps)
    var opponentNeighbors = movegen(currState, findOpponent(player));
    var maxVal = 0;
    if (depth === 0 || (neighbors.length === 0 && opponentNeighbors.length === 0)) {
        maxVal = findValue(currState, player);
        console.log("max ", maxVal); 
        return maxVal;
    } else if (neighbors.length === 0 && opponentNeighbors.length !== 0) {
        // if the player cannot move but the opponent can move, call MaxValue again with the opponent move
        // Switch the player next states and the opponent next states
        var temp = opponentNeighbors;
        opponentNeighbors = neighbors;
        neighbors = temp;

        for (var neighbor of neighbors) {
            value = MaxValue(neighbor, player, depth - 1);
        }

        return value;
    } else {
        // else, call MinValue with the player move
        value = Number.NEGATIVE_INFINITY;
        for (var neighbor of neighbors) {
            value = Math.max(value, MinValue(neighbor, player, depth - 1));
        }

        return value;
    }
}

// For min level players, will use this function
// Finds the neighbors of the opponent's move and calls MaxValue on them until the depth is reached.
// Returns a value using minimax
function MinValue(currState, player, depth) {
    // Now we are finding the next states for the opponent
    // Here, the neighbor and opponent are switched
    var neighbors = movegen(currState, findOpponent(player));
    // Find next states for the player, just to see if it is a leaf node (no next states)
    var opponentNeighbors = movegen(currState, player);

    var minVal = 0;
    if (depth === 0 || (neighbors.length === 0 && opponentNeighbors.length === 0)) {
        // If the depth is reached or none of the players can move (leaf node), then return the heuristic of that state
        minVal = findValue(currState, player);
        console.log("min ", minVal);
        return minVal;
    } else if (neighbors.length === 0 && opponentNeighbors.length !== 0) {
        // if the opponent cannot move but the player can move, call MinValue again with the player move
        // Switch the player next states and the opponent next states
        var temp = opponentNeighbors;
        opponentNeighbors = neighbors;
        neighbors = temp;

        for (var neighbor of neighbors) {
            value = MinValue(neighbor, player, depth - 1);
        }

        return value;
    } else {
        // else, call MaxValue with the opponent move
        value = Number.NEGATIVE_INFINITY;
        for (var neighbor of neighbors) {
            value = Math.min(value, MaxValue(neighbors, player, depth - 1));
        }

        return value;
    }
}

export { movegen, oskaplayer }; 

// Explanation behind the heuristic:
// There are two cases for calculating the heuristic.
// If none of your pawns have reached the goal.
// In this case, it would be a disadvantage to lose a pawn because it brings you closer to losing all your pawns
// and therefore losing the game.
// However, in case one of your pawns has reached the goal, then it would be an advantage to lose the rest of your pawns.
// Same applies with the opponent. If the opponent has at least one pawn at the goal, then we prefer to leave their pawns
// on the board. And if they don't have any pawns at the goal, then we prefer to take all their pawns.