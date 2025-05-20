//Size of the gameboard
var size = 2;

//previous placement of the x or o
var prev = {
  canPlaceAnywhere:true,
  outerRow:-1,
  outerColumn:-1,
  innerRow:-1,
  innerColumn:-1
};

//The current player
var player = "x";

//Current sizes of text (for scaling)
var textSize;
var bigTextSize;

//When a button is clicked this is the function that is called it adds an x and o and does all the steps needed to update the board
var addXO = function(event,outerRow,outerColumn,innerRow,innerColumn){
  //Makes sure that a piece can be placed where the user clicked according to the rules of super tic tac toe
  if(getProperty(event.targetId,"text") == ""){
    if((prev.canPlaceAnywhere || (prev.innerRow == outerRow && prev.innerColumn == outerColumn)) && data.bigData[outerRow][outerColumn] == 2){
      //Sets the button to an x or o depending on player
      setProperty(event.targetId,"text",player);
      //Now this click is the new previous one
      prev = {
        canPlaceAnywhere:false,
        outerRow:outerRow,
        outerColumn:outerColumn,
        innerRow:innerRow,
        innerColumn:innerColumn
      };
      //Updates data, 0 = "o", 2 = empty, 4 = "x"
      if(player == "x"){
        data.data[outerRow][outerColumn][innerRow][innerColumn] = 4;
      } else {
        data.data[outerRow][outerColumn][innerRow][innerColumn] = 0;
      }

      //Function names say what they do
      switchPlayer();
      checkSmallWin(size);
      checkBigWin(size);
      
      //If the new board to play on is already complete then you can play anywhere
      if(data.bigData[innerRow][innerColumn] != 2){
        prev.canPlaceAnywhere = true;
      }
      
      //Displays the big x's and o's when winning on the small board as well as the options of the next player
      displayBigScreen();
      displayOptions();
    }
  }
};

//Checks for a win on each smaller board
var checkSmallWin = function(size){
  //Iterate through every small board
  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      //If the board isn't already won on, then begin checking it for a win
      if(data.bigData[i][j] == 2){
        
        //Get the board
        var smallBoard = data.data[i][j];
        
        //Iterate through the rows and columns, and sum all the numbers. o's = 0, x's = 4 so 4*size in any value means an x win and 0 means an o win
        for(var k = 0; k < size; k++){
          var checkHorizontalWin = [0,0];
          for(var l = 0; l < size; l++){
            checkHorizontalWin[0] += smallBoard[k][l];
            checkHorizontalWin[1] += smallBoard[l][k];
          }
          
          //Checks for the win here in which case it updates that on the bigData board (which is the whole screen)
          if(checkHorizontalWin[0] == 0 || checkHorizontalWin[1] == 0){
            data.bigData[i][j] = 0;
          }
          if(checkHorizontalWin[0] == 4*size || checkHorizontalWin[1] == 4*size){
            data.bigData[i][j] = 4;
          }
        }
        
        //Checks the edge cases for diagonal wins
        var checkDiagonalWin = [0,0];
        for(k = 0; k < size; k++){
          checkDiagonalWin[0] += smallBoard[k][k];
          checkDiagonalWin[1] += smallBoard[size - k - 1][k];
        }
        if(checkDiagonalWin[0] == 0 || checkDiagonalWin[1] == 0){
          data.bigData[i][j] = 0;
        }
        if(checkDiagonalWin[0] == 4*size || checkDiagonalWin[1] == 4*size){
          data.bigData[i][j] = 4;
        }
      }
    }
  }
};
//Checks for big win
var checkBigWin = function(size){
    //Now there is only 1 board
    var board = data.bigData;
    
    //Similar code to each board of checkSmallWin
    for(var k = 0; k < size; k++){
      var checkHorizontalWin = [0,0];
      for(var l = 0; l < size; l++){
        checkHorizontalWin[0] += board[k][l];
        checkHorizontalWin[1] += board[l][k];
      }
      if(checkHorizontalWin[0] == 0 || checkHorizontalWin[1] == 0){
        console.log("o win");
      }
      if(checkHorizontalWin[0] == 4*size || checkHorizontalWin[1] == 4*size){
        console.log("x win");
      }
    }
    var checkDiagonalWin = [0,0];
    for(k = 0; k < size; k++){
      checkDiagonalWin[0] += board[k][k];
      checkDiagonalWin[1] += board[size - k - 1][k];
    }
    if(checkDiagonalWin[0] == 0 || checkDiagonalWin[1] == 0){
      console.log("o win");
    }
    if(checkDiagonalWin[0] == 4*size || checkDiagonalWin[1] == 4*size){
      console.log("x win");
    }
};

//Displays the big x's and o's behind each smaller board
var displayBigScreen = function(){
  //Gets the board
  var board = data.bigData;
  
  //Iterates through the board
  for(var i = 0; i < board.length; i++){
    for(var j = 0; j < board.length; j++){
      
      //0 and 4 are o and x respectivly
      if(board[i][j] == 0){
        var id = "" + i + "_" + j + "_";
        setProperty(id,"text","o");
      }
      if(board[i][j] == 4){
        var id = "" + i + "_" + j + "_";
        setProperty(id,"text","x");
      }
      //Technically these lines are not required however for the 5d part, it is required to set up the inital position
      if(board[i][j] == 2){
        var id = "" + i + "_" + j + "_";
        setProperty(id,"text","");
      }
    }
  }
};

//Makes the valid placement options darker and bluer
var displayOptions = function(){
  
  //Gets all the small button ids
  var ids = allIds.ids;
  
  //Iterates through all ids
  for(var i = 0; i < ids.length; i++){
    
    //Get the location of the button from the id
    var loc = getLoc(ids[i]);
    
    //Initally all buttons are set to the default color
    setProperty(ids[i],"background-color",rgb(50,100,200,0.05));
    
    //If a button is empty, and can either be placed anywhere, or is in the correct place according to the rules of super tic tac toe and is on a board that doesn't have a winner
    if(getProperty(ids[i],"text") == ""){
      if((prev.canPlaceAnywhere || (prev.innerRow == loc.outerRow && prev.innerColumn == loc.outerColumn)) && data.bigData[loc.outerRow][loc.outerColumn] == 2){
        setProperty(ids[i],"background-color",rgb(50,100,255,0.3));
      }
    }
  }
};

//Gets the location of a button in the data from its id
var getLoc = function(id){
  //ids are formatted "num_num_num_num", the following code simply extracts all 4 numbers
  var loc = id.split("_");
  var locNums = {
    outerRow:Number(loc[0]),
    outerColumn:Number(loc[1]),
    innerRow:Number(loc[2]),
    innerColumn:Number(loc[3])
  };
  return locNums;
};

//Switches the player between x and o whenever called
var switchPlayer = function(){
  if(player == "x"){
    player = "o";
  } else {
    player = "x";
  }
};

//Creates the board, and the ids for each button
var makeBoard = function(size){
  
  //Ids will be stored here Big ids are for the big x's and o's for each board
  var ids = [];
  var bigIds = [];
  
  //Math for placement and arrangement on the screen
  var gapPercent = 0.25;
  var gapSize = (300 * gapPercent)/4;
  var buttonSize = ((1 - gapPercent) * 300)/4;
  var bigButtonSize = (buttonSize * size) + (gapSize * (size - 1))
  
  //First create size x size boards, then for each of those boards make another size x size board
  for(var outerRow = 0; outerRow < size; outerRow++){
    for(var outerColumn = 0; outerColumn < size; outerColumn++){
      
      //Does math to find placement of each big button
      var xBig = 10 + (outerRow * bigButtonSize) + (outerRow * 2 * gapSize);
      var yBig = 10 + (outerColumn * bigButtonSize) + (outerColumn * 2 * gapSize);
      var uidBig = "" + outerRow + "_" + outerColumn + "_";
      appendItem(bigIds,uidBig);
      
      //Creates and sets up each of the text labels for the big x's and o's, additionally get the text size
      textLabel(uidBig,"");
      setPosition(uidBig,xBig,yBig,bigButtonSize,bigButtonSize);
      bigTextSize = bigButtonSize/1.5;
      setProperty(uidBig,"font-size",bigTextSize);
      
      //Creates the smaller boards
      for(var innerRow = 0; innerRow < size; innerRow++){
        for(var innerColumn = 0; innerColumn < size; innerColumn++){
          
          //Gets the id and does math to find the x and y of each smaller space
          var uid = uidBig + innerRow + "_" + innerColumn;
          var x = xBig + (innerRow * gapSize) + (innerRow * buttonSize);
          var y = yBig + (innerColumn * gapSize) + (innerColumn * buttonSize);
          
          //Sets up each button and makes them look nice, additionally get the text size
          button(uid,"");
          setPosition(uid,x,y,buttonSize,buttonSize);
          textSize = buttonSize/2;
          setProperty(uid,"font-size",textSize);
          setProperty(uid,"background-color",rgb(50,100,255,0.3));
          setProperty(uid,"text-color","black");
          onEvent(uid,"click",addXO,outerRow,outerColumn,innerRow,innerColumn);
          
          appendItem(ids,uid);
        }
      }
    }
  }
  //Returns all the ids
  return {ids:ids,bigIds:bigIds};
};

//Creates an empty datatable to store everything in
var getDataTable = function(size){
  //Creates a 4d array where each element nested all the way down is 2 (which represents empty)
  var outerRow = [];
  for(var i = 0; i < size; i++){
    var outerColumn = [];
    for(var j = 0; j < size; j++){
      var row = [];
      for(var k = 0; k < size; k++){
        var column = [];
        for(var l = 0; l < size; l++){
          appendItem(column,2);
        }
        appendItem(row,column);
      }
      appendItem(outerColumn,row);
    } 
    appendItem(outerRow,outerColumn);
  }
  
  //Does the exact same except with a 2d array for the big x's and o's
  var row = [];
  for(var k = 0; k < size; k++){
    var column = [];
    for(var l = 0; l < size; l++){
      appendItem(column,2);
    }
    appendItem(row,column);
  }
  
  //Returns the data
  return {bigData:row,data:outerRow};
};

//Gets the data as well as the ids
var data = getDataTable(size);

var allIds = makeBoard(size);

//Creates an input map to make inputs happen much smoother. On keydown the selected key will be set to true, on keyUp will be set to false
var inputMap = {
  up:false,
  down:false,
  right:false,
  left:false,
  zoomIn:false,
  zoomOut:false
};

//Uses the input map to move around
var moveAround = function(inputMap,allIds,speed,zoomSpeed){
  var ids = allIds.ids;
  var bigIds = allIds.bigIds;
  //For each direction control, iterate through both the small and big ids and move their x or y coordinate positive or negative depending on direction
  
  //Commented for left:
  if(inputMap.left){
    //Go through every single one of the buttons, set its x coordinate to its current x coordinate + a constant (moving left means moving the camera left, which is equivalent to moving everything else right)
    for(var i = 0; i < ids.length; i++){
      setProperty(ids[i],"x",getProperty(ids[i],"x") + speed);
    }
    for(var i = 0; i < bigIds.length; i++){
      setProperty(bigIds[i],"x",getProperty(bigIds[i],"x") + speed);
    }
  }
  if(inputMap.right){
    for(var i = 0; i < ids.length; i++){
      setProperty(ids[i],"x",getProperty(ids[i],"x") - speed);
    }
    for(var i = 0; i < bigIds.length; i++){
      setProperty(bigIds[i],"x",getProperty(bigIds[i],"x") - speed);
    }
  }
  if(inputMap.up){
    for(var i = 0; i < ids.length; i++){
      setProperty(ids[i],"y",getProperty(ids[i],"y") + speed);
    }
    for(var i = 0; i < bigIds.length; i++){
      setProperty(bigIds[i],"y",getProperty(bigIds[i],"y") + speed);
    }
  }
  if(inputMap.down){
    for(var i = 0; i < ids.length; i++){
      setProperty(ids[i],"y",getProperty(ids[i],"y") - speed);
    }
    for(var i = 0; i < bigIds.length; i++){
      setProperty(bigIds[i],"y",getProperty(bigIds[i],"y") - speed);
    }
  }
  
  //zooming in and out is also similar
  if(inputMap.zoomIn){
    //Caps how far you can zoom in
    if(getProperty(ids[0],"width") < 100){
      //Go through all the ids then do some math
      for(var i = 0; i < ids.length; i++){
        //This scales it about the center. To do that we first get the vector from the center to the button, scale that, then translate it back to the center
        var newX = zoomSpeed * (getProperty(ids[i],"x") - 160) + 160;
        var newY = zoomSpeed * (getProperty(ids[i],"y") - 225) + 225;
        
        //Gets the new size and text size of the buttons
        var newSize = zoomSpeed * getProperty(ids[i],"width");
        textSize = newSize/2;
        
        //Sets the newfound information of the button
        setPosition(ids[i],newX,newY,newSize,newSize);
        setProperty(ids[i],"font-size",textSize);
      }
      
      //Repeat for big ids
      for(var i = 0; i < bigIds.length; i++){
        var newX = zoomSpeed * (getProperty(bigIds[i],"x") - 160) + 160;
        var newY = zoomSpeed * (getProperty(bigIds[i],"y") - 225) + 225;
        var newSize = zoomSpeed * getProperty(bigIds[i],"width");
        bigTextSize = newSize/1.5;
        setPosition(bigIds[i],newX,newY,newSize,newSize);
        setProperty(bigIds[i],"font-size",bigTextSize);
      }
    }
  }
  //Same as zooming in except divison by zoomSpeed rather than multiplication
  if(inputMap.zoomOut){
    if(getProperty(ids[0],"width") > 25){
      for(var i = 0; i < ids.length; i++){
        var newX = (getProperty(ids[i],"x") - 160)/zoomSpeed + 160;
        var newY = (getProperty(ids[i],"y") - 225)/zoomSpeed + 225;
        var newSize = getProperty(ids[i],"width")/zoomSpeed;
        textSize = newSize/1.5;
        setPosition(ids[i],newX,newY,newSize,newSize);
        setProperty(ids[i],"font-size",textSize);
      }
      for(var i = 0; i < bigIds.length; i++){
        var newX = (getProperty(bigIds[i],"x") - 160)/zoomSpeed + 160;
        var newY = (getProperty(bigIds[i],"y") - 225)/zoomSpeed + 225;
        var newSize = getProperty(bigIds[i],"width")/zoomSpeed;
        bigTextSize = newSize/1.5;
        setPosition(bigIds[i],newX,newY,newSize,newSize);
        setProperty(bigIds[i],"font-size",bigTextSize);
      }
    }
  }
};

//Checks for keyDowns to change the input map
var addInputMap = function(event){
  if(event.key == "Up" || event.key == "w"){
    inputMap.up = true;
  }
  if(event.key == "Down" || event.key == "s"){
    inputMap.down = true;
  }
  if(event.key == "Left" || event.key == "a"){
    inputMap.left = true;
  }
  if(event.key == "Right" || event.key == "d"){
    inputMap.right = true;
  }
  if(event.key == "e"){
    inputMap.zoomIn = true;
  }
  if(event.key == "r"){
    inputMap.zoomOut = true;
  }
};

//Checks for keyUps to change the input map
var removeInputMap = function(event){
  if(event.key == "Up" || event.key == "w"){
    inputMap.up = false;
  }
  if(event.key == "Down" || event.key == "s"){
    inputMap.down = false;
  }
  if(event.key == "Left" || event.key == "a"){
    inputMap.left = false;
  }
  if(event.key == "Right" || event.key == "d"){
    inputMap.right = false;
  }
  if(event.key == "e"){
    inputMap.zoomIn = false;
  }
  if(event.key == "r"){
    inputMap.zoomOut = false;
  }
};

//Checks for key presses and releases and updates the input map based on that
onEvent("screen1","keydown",addInputMap);
onEvent("screen1","keyup",removeInputMap);

//Simply calls the moveAround function every 100 ms
var onTime = function(){
  moveAround(inputMap,allIds,20,1.5);
};

timedLoop(100,onTime);


