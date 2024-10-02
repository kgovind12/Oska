
import copy
import math

#The main move generator that calls generate new states and returns all the possible next states.
def movegen(board,player):
    return generateNewStates(board,player)

# Takes in the current state, the player whose turn it is
# generates all the new states for a given player using for each of his pawns.
def generateNewStates(currState,player):
    newStates = []

    # iterating through the whole current state (rows and columns), finding all the instances of a pawn and their position.
    # checking if left, right, up, down are in the list of moveable states, and if any of them are, move in that direction.
    # We create the list of moveable states in the next function.
    for i in range(0,len(currState)):
        for j in range(0,len(currState[i])):
            if currState[i][j] == player:
                position = (i,j)
                if "left" in moveable(currState,player,position):
                    leftMove = moveLeft(currState,player,position)
                    newStates.append(leftMove)
                if "right" in moveable(currState,player,position):
                    rightMove = moveRight(currState,player,position)
                    newStates.append(rightMove)
                if "left" in jumpable(currState,player,position):
                    leftJump = jumpLeft(currState,player,position)
                    newStates.append(leftJump)
                if "right" in jumpable(currState,player,position):
                    rightJump = jumpRight(currState,player,position)
                    newStates.append(rightJump)

    # once it's finished generating states for all the pawns of that player, return all the new states
    return newStates


#function checks which directions a player can move, and adds the possible directions to a list in string form
def moveable(currState,player,position):
    moveable = []
    (i,j) = position
    
    #when is a move possible?

    # When player is white, for each case, there are two possible situations based on the position of the pawn.
    # Either it is above the middle or equal to the middle and below.
    if player == "w":

        # Above the middle
        # If it is not the leftmost pawn in a row and the next space diagonally left is empty, it can move left
        if i < math.floor(len(currState)/2) and j != 0 and currState[i+1][j-1] == "-":
            moveable.append("left")
        # Below or equal to the middle. Pawn should not be all the way at the bottom.
        elif i >= math.floor(len(currState)/2) and i != len(currState)-1 and currState[i+1][j] == "-":
            moveable.append("left")

        # Above the middle
        # If it is not the rightmost pawn in a row and the next space diagonally right is empty, then it can move right.
        if i < math.floor(len(currState)/2) and j != (len(currState[i])-1) and currState[i+1][j] == "-":
            moveable.append("right")
        #Below or equal to the middle. Pawn should not be all the way at the bottom
        elif i >= math.floor(len(currState)/2) and i != len(currState)-1 and currState[i+1][j+1] == "-":
            moveable.append("right")
            

    # Similar situations apply to black. But this time, the middle is included with the rows above the middle.
    elif player == "b":

        # Below the middle
        # Pawn can move left as long as it is not the leftmost pawn in a row, and the next space diagonally left is empty
        if i > math.floor(len(currState)/2) and j != 0 and currState[i-1][j-1] == "-":
            moveable.append("left")
        # Above or equal to the middle. Pawn should not be in the first row.
        elif i <= math.floor(len(currState)/2) and i!= 0 and currState[i-1][j] == "-":
            moveable.append("left")

        # Below the middle. Pawn can move right as long as it is not the last in the row and the next space diagonally right is empty.
        if i > math.floor(len(currState)/2) and j != (len(currState[i])-1) and currState[i-1][j] == "-":
            moveable.append("right")
        # Above or equal to the middle. Again, pawn should not be in the first row.
        elif i <= math.floor(len(currState)/2) and i!= 0 and currState[i-1][j+1] == "-":
            moveable.append("right")

    return moveable


# checks which directions a pawn for a given player can jump in, and returns a list of the possible ways it can jump
def jumpable(currState,player,position):
    jumpable = []
    (i,j) = position

    #When is a jump possible?

    # Here, there are three possible situations. Above the middle but not immediately above, below/equal to the middle, and immediately above the middle.
    if player == "w":

        # Pawn can move left as long as it is not the first or second in the row
        # And as long as the next diagonally left is the opposite color pawn and the next diagonally left of that is an empty space.
        # Otherwise, conditions are similar to those in the moveable function
        if i < math.floor((len(currState)/2)-1) and j != 0 and j!= 1 and currState[i+1][j-1] == "b" and currState[i+2][j-2] == "-":
            jumpable.append("left")
        elif i >= math.floor(len(currState)/2) and i < len(currState)-2 and currState[i+1][j] == "b" and currState[i+2][j] == "-":
            jumpable.append("left")

        # Pawn can move right as long as it is not the last or second last in a row.
        # And as long as the next two diagonally right follow the same rules. 
        if i < math.floor((len(currState)/2)-1) and j != (len(currState[i])-1) and j!= (len(currState[i])-2) and currState[i+1][j] == "b" and currState[i+2][j] == "-":
            jumpable.append("right")
        elif i >= math.floor(len(currState)/2) and i < len(currState)-2 and currState[i+1][j+1] == "b" and currState[i+2][j+2] == "-":
            jumpable.append("right")

        #special case: if the pawn is in the row immediately above the middle row, we need to adjust indices to take care of this edge case,
        # because it will be jumping from one half of the board to the other half, while indices shift.
        if i== math.floor((len(currState)/2)-1) and j!=0 and currState[i+1][j-1] == "b" and currState[i+2][j-1] == "-":
            jumpable.append("left")
        if i== math.floor((len(currState)/2)-1) and j!= (len(currState[i])-1) and currState[i+1][j] == "b" and currState[i+2][j+1] == "-":
            jumpable.append("right")

    # Again, three possible situations. Above/equal to, below but not immediately below, and immediately below.
    elif player == "b":

        # Pawn can move left as long as it is not the first two in the row, and if the next to diagonally left spaces follow the same rules (opposite pawn, then empty)
        if i > math.floor((len(currState)/2)+1) and j != 0 and j!= 1 and currState[i-1][j-1] == "w" and currState[i-2][j-2] == "-":
            jumpable.append("left")
        elif i <= math.floor(len(currState)/2) and i > 1 and currState[i-1][j] == "w" and currState[i-2][j] == "-":
            jumpable.append("left")

        # Pawn can move right if it is not in the last two in a row, and if the next two diagonally right follow the same rules.
        if i > math.floor((len(currState)/2)+1) and j != (len(currState[i])-1) and j!= (len(currState[i])-2) and currState[i-1][j] == "w" and currState[i-2][j] == "-":
            jumpable.append("right")
        elif i <= math.floor(len(currState)/2) and i > 1 and currState[i-1][j+1] == "w" and currState[i-2][j+2] == "-":
            jumpable.append("right")

        #special case: if the pawn is in the row immediately below the middle row, we will have to change indices, similar to above white case.
        if i== math.floor((len(currState)/2)+1) and j!=0 and currState[i-1][j-1] == "w" and currState[i-2][j-1] == "-":
            jumpable.append("left")
        if i== math.floor((len(currState)/2)+1) and j!= (len(currState[i])-1) and currState[i-1][j] == "w" and currState[i-2][j+1] == "-":
            jumpable.append("right")
            
    return jumpable


# Function to move a pawn left, taking in the current state, player, and position of the pawn, and returning the new state after it has been moved.
def moveLeft(currState,player,position):
    # Before moving the pawn, we create a copy of the state and convert it to a list of lists so it becomes mutable.
    # We convert it back to a list of strings at the end before returning it.
    newState = copy.deepcopy(currState)
    newState = stringToList(newState)
    (i,j) = position

    # Above the middle and white
    if player == "w" and i < math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+1][j-1] = player
    # Below/equal to the middle and white
    elif player == "w" and i >= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+1][j] = player
    # Below the middle and black
    elif player == "b" and i > math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-1][j-1] = player
    # Above/equal to the middle and black
    elif player == "b" and i <= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-1][j] = player
    return listToString(newState)


# Function that takes in currrent state, player and position, and moves all the pawns for that player to the right, if possible.
def moveRight(currState,player,position):
    # Same as moveLeft, we copy the state and make it a list of lists.
    newState = copy.deepcopy(currState)
    newState = stringToList(newState)
    (i,j) = position

    # Above the middle and white
    if player == "w" and i < math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+1][j] = player
    # Below/equal to the middle and white
    elif player == "w" and i >= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+1][j+1] = player
    # Below the middle and black
    elif player == "b" and i > math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-1][j] = player
    # Above/equal to the middle and black
    elif player == "b" and i <= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-1][j+1] = player
    return listToString(newState)


# Function that takes in the same parameters as move functions, and returns the new states after each pawn for the given player has jumped left (if possible)
def jumpLeft(currState,player,position):
    # Create a copy of the state and make it a list of lists.
    newState = copy.deepcopy(currState)
    newState = stringToList(newState)
    (i,j) = position

    # Above the middle (but not immediate) and white
    if player == "w" and i < math.floor((len(currState)/2)-1):
        newState[i][j] = "-"
        newState[i+2][j-2] = player
        newState[i+1][j-1] = "-"

    #special case: immediately above the middle row and white
    elif player == "w" and i== math.floor((len(currState)/2)-1):
        newState[i][j] = "-"
        newState[i+2][j-1] = player
        newState[i+1][j-1] = "-"

    # Bottom half including middle row and white
    elif player == "w" and i >= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+2][j] = player
        newState[i+1][j] = "-"

    # Bottom half (not immediate) and black
    elif player == "b" and i > math.floor((len(currState)/2)+1):
        newState[i][j] = "-"
        newState[i-2][j-2] = player
        newState[i-1][j-1] = "-"

    #special case: Immediately below the middle row and black
    elif player == "b" and i== math.floor((len(currState)/2)+1):
        newState[i][j] = "-"
        newState[i-2][j-1] = player
        newState[i-1][j-1] = "-"

    #top half including middle row and black
    elif player == "b" and i <= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-2][j] = player
        newState[i-1][j] = "-"
    return listToString(newState)


# Takes in the same parameters, returns the new states after all pawns for the given player have jumped right (if possible)
def jumpRight(currState,player,position):
    # copy the state and make it list of lists.
    newState = copy.deepcopy(currState)
    newState = stringToList(newState)
    (i,j) = position

    # Above the middle(not immediate) and white
    if player == "w" and i < math.floor((len(currState)/2)-1):
        newState[i][j] = "-"
        newState[i+2][j] = player
        newState[i+1][j] = "-"

    #special case: immediately above the middle and white
    elif player == "w" and i== math.floor((len(currState)/2)-1):
        newState[i][j] = "-"
        newState[i+2][j+1] = player
        newState[i+1][j] = "-"

    # Below or equal to the middle and white
    elif player == "w" and i >= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i+2][j+2] = player
        newState[i+1][j+1] = "-"

    # Below the middle and black
    elif player == "b" and i > math.floor((len(currState)/2)+1):
        newState[i][j] = "-"
        newState[i-2][j] = player
        newState[i-1][j] = "-"

    #special case: immediately below the middle and black
    elif player == "b" and i== math.floor((len(currState)/2)+1):
        newState[i][j] = "-"
        newState[i-2][j+1] = player
        newState[i-1][j] = "-"

    #top half including middle row and black
    elif player == "b" and i <= math.floor(len(currState)/2):
        newState[i][j] = "-"
        newState[i-2][j+2] = player
        newState[i-1][j+1] = "-"
    return listToString(newState)


# function that takes in current state and converts it to a list of lists
def stringToList(currState):
    rowList = []
    for i in range(0,len(currState)):
        for j in range(0,len(currState[i])):
            rowList.append(currState[i][j])
        currState[i] = rowList
        rowList = []
    return currState


# function that takes in current state (list of lists form) and converts it back to a list of strings
def listToString(currState):
    rowString = ""
    for i in range(0,len(currState)):
        for j in range(0,len(currState[i])):
            rowString += currState[i][j]
        currState[i] = rowString
        rowString = ""
    return currState

# function to print the board in proper shape (Not used in main functions, for debugging purposes only).
def printBoard(currState):
    substring = "| "
    print("    "+(4*len(currState[0])-1)*"-")
    for i in range(0,math.floor(len(currState)/2)):
        for j in range(0,len(currState[i])):
            substring += currState[i][j]+" | "
        numDashes = (4*len(currState[i]))-1
        numSideSpaces = (4*len(currState[i]))
        numSpaces = math.floor(numSideSpaces/len(currState[i]))
        print(numSpaces*" "+ substring + numSpaces*" ")
        substring = "| "
        print("    "+ numDashes*"-")
        
    for k in range(math.floor(len(currState)/2),len(currState)-1):
        for l in range(0,len(currState[k])):
            substring += currState[k][l] +" | "
        numDashes = (4*len(currState[k]))+3

        numSpaces = math.floor(numDashes/len(currState[k]))
        print(numSpaces*" "+ substring + numSpaces*" ")
        substring = "| "
        print("    "+ numDashes*"-")

    for m in range(0,len(currState[-1])):
        substring += currState[-1][m] + " | "
    print(numSpaces*" "+ substring + numSpaces*" ")
    print("    "+(4*len(currState[-1])-1)*"-")



######### MOVE GENERATOR ENDS HERE ###########

# function that counts the number of pawns on the board for a specific player
def count(currState,player):
    count = 0
    for i in range(0,len(currState)):
        for j in range(0,len(currState[i])):
            if currState[i][j] == player:
                count = count + 1
    return count


# board evaluation function (using current state and player)
def findValue(currState,yourPlayer):
    opponent = findOpponent(yourPlayer)
    winningIndex = 0
    opponentIndex = 0

    # finding the total number of player and opponent pieces on the board
    totalCountPlayer = count(currState,yourPlayer)
    totalCountOpponent = count(currState,opponent)

    # number of player pieces and opponent pieces that have reached the goal
    countInWinningIndex = 0
    countInOpponentIndex = 0

    # finding the winning and opponent winning index for your player
    if yourPlayer == "w":
        winningIndex = len(currState)-1
        opponentIndex = 0
    elif yourPlayer == "b":
        winningIndex = 0
        opponentIndex = len(currState)-1

    # checking if number of pieces in goal is equal to the total number of pieces; then it is a win
    for i in currState[winningIndex]:
        if i == yourPlayer:
            countInWinningIndex += 1
    for j in currState[opponentIndex]:
        if j == opponent:
            countInOpponentIndex += 1

    if countInWinningIndex != 0 and countInWinningIndex == totalCountPlayer and countInOpponentIndex != totalCountOpponent:
        # player has won
        value = 10
    elif count(currState,opponent) == 0:
        # opponent has lost all their pawns
        value = 10
    elif countInOpponentIndex !=0 and countInOpponentIndex == totalCountOpponent and countInWinningIndex != totalCountPlayer:
        # player has lost
        value = -10
    elif count(currState,yourPlayer) == 0:
        # player has lost all pawns
        value = -10

    # in case both reach their goals
    elif countInWinningIndex == totalCountPlayer and countInOpponentIndex == totalCountOpponent:
        # if you have more pieces in your goal, you win
        if countInWinningIndex > countInOpponentIndex:
            value = 10
        # if your opponent has more pieces in their goal, they win
        elif countInOpponentIndex > countInWinningIndex:
            value = -10
        # otherwise, value = 0 - draw
        else:
            value = 0

    # what if it is not a clear win or loss:
    
    else:
        # if one of your pawns has reached the goal, value is:
        # number of your pieces at goal - number of opponent's pieces at goal + (number of your remaining pieces - number of opponent's remaining pieces)
        # this is because it would be a disadvantage to lose a pawn if none of your pawns have reached the goal yet,
        # since it makes you closer to losing all of your pawns.
        # However, if one of your pawns has reached the goal, it would be a benefit to lose your remaining pawns as that would mean a win
        # The same logic applies with the opponent losing his pawn. If the opponent has one pawn at the goal, we prefer to leave his pawn there.
        # Otherwise, we prefer to take his pawn and make him closer to losing all his pawns.
        
        if yourPlayer in currState[winningIndex]:
            # number of pieces at goal + (number of opponent pieces - number of remaining pieces (pieces not at goal) )
            countPlayerRemaining = count(currState,yourPlayer) - countInWinningIndex
            countOpponentRemaining = count(currState,opponent) - countInOpponentIndex
            value = countInWinningIndex - countInOpponentIndex + (countPlayerRemaining - countOpponentRemaining)
        else:
            value = count(currState,yourPlayer) - count(currState,opponent)
    return value


# function takes in player and finds the opponent
def findOpponent(player):
    opponent = ""
    if player == "w":
        opponent = "b"
    elif player == "b":
        opponent = "w"
    return opponent

                       
### FINDING THE BEST MOVE

# Following code is referenced from the textbook

# takes in current state, player, and depth, and calls MaxValue and MinValue functions
# Finds the minimax value of each of the moves and the max of that.
# Returns the corresponding state with the max heuristic value (best move)
def oskaplayer(currState,player,depth):
    bestMove = currState
    maxVal = float("-inf")
    neighbors = movegen(currState,player)
    opponentNeighbors = movegen(currState,findOpponent(player))
    for neighbor in neighbors:   
        currVal = MinValue(neighbor,player,depth-1)
        if currVal > maxVal:
            maxVal = currVal
            bestMove = neighbor
    return bestMove

# for max level players, will use this function. Finds the neighbors of the current state and calls MinValue on them until the depth is reached
# MaxValue and MinValue keep alternatively calling each other
# returns the value using minimax
def MaxValue(currState,player,depth):
    # finding the next states for the player
    neighbors = movegen(currState,player)
    # finding next states for the opponent, just to see if it is a leaf node
    opponentNeighbors = movegen(currState,findOpponent(player))
    if depth == 0 or (neighbors == [] and opponentNeighbors == []):
        #print("max ",findValue(currState,player))
        return findValue(currState,player)

    # if the player cannot move but the opponent can move, call MaxValue again with the opponent move
    elif neighbors == [] and opponentNeighbors != []:
        # switch the player next states and the opponent next states
        temp = opponentNeighbors
        opponentNeighbors = neighbors
        neighbors = temp
        
        for neighbor in neighbors:
            value = MaxValue(neighbor,player,depth-1)
        return value

    #else, call MinValue with the player move
    else:
        value = float("-inf")
        for neighbor in neighbors:
            value = max(value, MinValue(neighbor,player,depth-1))
        return value


# for min level players, will use this function. Finds the neighbors of the opponents move and calls MaxValue on them until the depth is reached.
# returns a value using minimax
def MinValue(currState,player,depth):
    # in this case, we are finding the next states for the opponent
    neighbors = movegen(currState,findOpponent(player))
    # finding the next states for the player, just to see if it is a leaf node
    opponentNeighbors = movegen(currState,player)

    # if the depth is reached or none of the players can move (leaf node), then return the heuristic of that state
    if depth == 0 or (neighbors == [] and opponentNeighbors == []):
        #print("min ",findValue(currState,player))
        return findValue(currState,player)

    # if the opponent cannot move but the player can move, call MinValue again with the player move
    elif neighbors == [] and opponentNeighbors != []:
        # switch the player next states and the opponent next states
        temp = opponentNeighbors
        opponentNeighbors = neighbors
        neighbors = temp
        
        for neighbor in neighbors:
            value = MinValue(neighbor,player,depth-1)
        return value

    # else, call MaxValue with the opponent move
    else:
        value = float("inf")
        for neighbor in neighbors:
            value = min(value,MaxValue(neighbor,player,depth-1))
        return value

           
