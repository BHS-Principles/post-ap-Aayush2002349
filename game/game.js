//If adding new card, add it to allCards in game class, add it to card sheet, change scaling in css and add its card action to cardAction and draw, both its action and its position



class Cards{

    //There is currently nothing in the constructor because there are multiple ways to create a card
    constructor(){
        this.cardElement = null
    }

    //Sets the info of the card
    setInfo(isBack,type,numVal,strVal,index){
        if(isBack){
            this.index = index;
            this.type = type;
        } else {
            this.type = type;
            this.num = numVal;
            this.str = strVal;
            this.index = index;
            this.cost = null;
        }
    }

    //Creates a random card
    makeRandomCard(allCards,maxPoints){

        //Gets a random kind of card
        var info = allCards[Math.floor(Math.random()*allCards.length)];

        //Extracts all the info from the card
        var type = info.type;
        var index = Math.floor(Math.random()*info.num.length);

        var num = info.num[index];
        var str = info.str[Math.floor(Math.random()*info.str.length)];

        var cost = Math.ceil(((index/3+1) * info.cost)/2) * Math.ceil((maxPoints + 1)/16);

        //Sets the card's properties
        this.setInfo(false,type,num,str,index);
        this.setCost(cost);

    }

    //Sets the card's cost
    setCost(cost){
        this.cost = cost;
    }

    //Deep copies a card
    deepCopy(){
        var copiedCard = new Cards()
        copiedCard.setInfo(false,this.type,this.num,this.str,this.index)
        copiedCard.setCost(this.cost)
        return copiedCard;
    }

    //Draws the card onto the screen
    draw(xPos,yPos){

        //Gets html elements
        var temp = document.getElementById("temp");
        var target = document.getElementById("target")
        var cardCopy = temp.querySelector(".Card");
        
        //Gets the card from the card sheet
        var xCard = 0;
        var yCard = 0;
        if(this.type == "back"){
            yCard = 0
        }
        if(this.type == "num"){
            yCard = 1
        }
        if(this.type == "multPrev"){
            yCard = 2
        }
        if(this.type == "chance"){
            yCard = 3
        }
        if(this.type == "multNext"){
            yCard = 4
        }
        
        xCard = this.index

        //Creating the card
        var card = cardCopy.cloneNode(true)
        this.cardElement = card;

        //Displays which card it is
        card.style.backgroundPositionX = "" + -10*xCard + "rem"
        card.style.backgroundPositionY = "" + -15*yCard + "rem"

        //Puts where the card is on the screen
        card.style.position = "absolute"
        card.style.left = "" + xPos + "rem"
        card.style.top = "" + yPos + "rem"

        target.append(card)

    }

    //Removes the card from the screen
    unDraw(){
        if(this.cardElement != null){
            this.cardElement.remove();    
        }
        if(this.button != null){
            this.button.remove();
        }
    }
    //Gets points and state based on the card action
    doCardAction(state){
        var points = 0

        //All different cards and their behaviors
        if(this.type == "num"){
            points = this.num
        }
        if(this.type == "multPrev"){
            points = state.prev * this.num
        }
        if(this.type == "chance"){
            if(Math.random() <= this.num){
                points = 5/this.num
            } else {
                points = 0
            }
        }
        if(this.type == "multNext"){
            state.nextMults.push({num: Math.floor(this.num / 10) , turns:1 + this.num % 10})
        }


        //Reduces the turn timers on state calcs by one and multiplies points by each multiplier currently active
        for(var i = 0; i < state.nextMults.length; i++){

            points *= state.nextMults[i].num
            
            state.nextMults[i].turns -= 1
            
            if(state.nextMults[i].turns <= 0){
                state.nextMults.pop(i)
                i -= 1
            }
        }

        state.prev = points

        return {points:points,state:state}
    }
}
class Deck{
    
    //There are multiple ways to create a deck
    constructor(){
        this.cards = [];
        this.drawPile = [];
        this.current = null;
        this.discardPile = [];
    }

    //Creates the starting deck of the player
    setStartingDeck(allCards){
        var cards = [];
        var current = allCards[0];

        for(var i = 0; i < current.num.length; i++){
            var cardTemp = new Cards()
            cardTemp.setInfo(false,current.type,current.num[i],current.str[0],i)
            cards.push(cardTemp);
        }

        this.cards = cards
        this.drawPile = this.deepCopyCards()
    }
    
    //Deep copies all the cards in deck.cards
    deepCopyCards(){
        var copiedCards = [];
        for(var i = 0; i < this.cards.length; i++){
            copiedCards.push(this.cards[i].deepCopy());
        }
        return copiedCards;
    }

    //Sets the deck to all random cards
    setRandomCards(allCards,maxPoints,num){
        var cards = [];
        for(var i = 0; i < num; i++){

            var cardTemp = new Cards()
            cardTemp.makeRandomCard(allCards,maxPoints)

            cards.push(cardTemp);
        }
        this.cards = cards
        this.cards = this.deepCopyCards()
        this.drawPile = this.deepCopyCards()
    };

    //Draws a card from the deck and does its action
    drawCard(state){
        //Reshuffle
        if(this.drawPile.length == 0){
            this.discardPile.push(this.currentCard.deepCopy())
            this.drawPile = this.discardPile
            this.discardPile = []
            this.currentCard = null
        }

        //Manipulate cards
        if(this.currentCard != null){
            this.discardPile.push(this.currentCard.deepCopy())
        }
        var drawnIndex = Math.floor(Math.random()*this.drawPile.length);
        this.currentCard = this.drawPile[drawnIndex].deepCopy()
        this.drawPile.splice(drawnIndex,1)
        //Does all the card actions
        var info = this.currentCard.doCardAction(state)

        //Returns information

        return info
    }
}
class Game{
    //Creates the game
    constructor(type,turns){
        this.type = type
        this.playerDeck = new Deck();
        this.shop = new Deck();
        this.points = 0
        this.maxPoints = 0
        this.state = {
            prevVal:0,
            nextMults:[]
        }
        this.newGameReady = false
        this.refreshCost = 10
        if(type == "standard"){
            this.createStandardGame(turns)
            this.displayStandardGame()
        }
    }

    //Creates a standard game
    createStandardGame(turns){
        //Stores all possible types of cards
        this.allCards = [
            {
                type:"num",
                num:[2,3,4,5,6,7,8,9,10],
                str:[""],
                cost:2
            },
            {
                type:"multPrev",
                num:[2,3,4],
                str:[""],
                cost:10
            },
            {
                type:"chance",
                num:[0.1,0.25,0.5],
                str:[""],
                cost:5
            },
            {
                type:"multNext",
                num:[22,23,24,32,33,34,42,43,44],
                str:[""],
                cost:20
            }
        ];
        this.playerDeck.setStartingDeck(this.allCards)
        this.shop.setRandomCards(this.allCards,0,5)
        this.turnsLeft = turns
    }

    //Displays all the elements for a standard card game
    displayStandardGame(){
        //Display the shop and deck
        this.addShopDisplay()
        this.addDeckDisplay()
        //Displays the draw pile
        this.drawPileDisplay = new Cards()
        this.drawPileDisplay.setInfo(true,"back",null,null,1)
        this.drawPileDisplay.draw(0,0)
        this.drawPileDisplay.cardElement.addEventListener("click",this.doCardDraw.bind(this))
        //Displays the points display
        this.pointsDisplay = new Cards()
        this.pointsDisplay.setInfo(true,"back",null,null,0)
        this.pointsDisplay.draw(20,0)
        this.pointsDisplay.cardElement.innerHTML = "Points: 0"
        //Displays the refresh display
        this.refreshDisplay = new Cards()
        this.refreshDisplay.setInfo(true,"back",null,null,3)
        this.refreshDisplay.draw(30,0)
        this.refreshDisplay.cardElement.innerHTML = "Cost: " + this.refreshCost
        this.refreshDisplay.cardElement.addEventListener("click",this.doRefresh.bind(this))
        //Display the turns display
        this.turnsDisplay = new Cards()
        this.turnsDisplay.setInfo(true,"back",null,null,0)
        this.turnsDisplay.draw(40,0)
        this.turnsDisplay.cardElement.innerHTML = "Turns: " + this.turnsLeft
    }

    //Ends the standard game
    endStandardGame(){
        this.removeAllDisplay()
        this.pointsDisplay.draw(0,0)
        this.pointsDisplay.cardElement.innerHTML = "Final Points: " + this.points
        this.pointsDisplay.cardElement.addEventListener("click",this.doRefresh.bind(this))
        this.pointsDisplay.cardElement.addEventListener("click",this.resetStandardGame.bind(this))
    }

    //Allows the game to be reset (to start a new game create a new game object)
    resetStandardGame(){
        this.removeAllDisplay()
        this.newGameReady = true
    }

    //Does the process of drawing a card
    doCardDraw(){
        if(this.turnsLeft > 0){
            //Removes the previous card drawn
            if(this.playerDeck.currentCard != null){
                this.playerDeck.currentCard.unDraw()
            }

            //Draws a card and gets the info from drawing the card
            var info = this.playerDeck.drawCard(this.state)
            this.state = info.state
            this.points += info.points
            if(this.points > this.maxPoints){
                this.maxPoints = this.points
            }

            //Puts the drawn card and points onto the screen
            this.playerDeck.currentCard.draw(10,0)
            this.pointsDisplay.cardElement.innerHTML = "Points: " + this.points

            //Decrements the turns and displays it
            this.turnsLeft -= 1
            this.turnsDisplay.cardElement.innerHTML = "Turns: " + this.turnsLeft
        } else {
            this.endStandardGame()
        }
    }

    //Adds and removes displays
    addShopDisplay(){
        for(var i = 0; i < this.shop.cards.length; i++){
            this.shop.cards[i].draw(i*10,15)
            this.shop.cards[i].cardElement.innerHTML = "Cost: " + this.shop.cards[i].cost
            this.shop.cards[i].cardElement.addEventListener("click",this.doCardBuy.bind(this,this.shop.cards[i]))
        }
    }
    addDeckDisplay(){
        for(var i = 0; i < this.playerDeck.cards.length; i++){
            this.playerDeck.cards[i].draw(10*(i%5),30+15*Math.floor(i/5))
        }
    }
    removeShopDisplay(){
        for(var i = 0; i < this.shop.cards.length; i++){
            this.shop.cards[i].unDraw()
        }
    }
    removeDeckDisplay(){
        for(var i = 0; i < this.playerDeck.cards.length; i++){
            this.playerDeck.cards[i].unDraw()
        }
    }
    removeAllDisplay(){
        this.drawPileDisplay.unDraw()
        this.pointsDisplay.unDraw()
        this.refreshDisplay.unDraw()
        this.turnsDisplay.unDraw()
        this.playerDeck.currentCard.unDraw()
        this.removeShopDisplay()
        this.removeDeckDisplay()
    }

    //Does all the logic behind whether or not the shop can be reset and resets it
    doRefresh(){
        if(this.points >= this.refreshCost){
            this.points -= this.refreshCost
            this.refreshCost = this.maxPoints
            this.removeShopDisplay()
            this.shop.setRandomCards(this.allCards,this.maxPoints,5)
            this.addShopDisplay()
            this.refreshDisplay.cardElement.innerHTML = "Cost: " + this.refreshCost
            this.pointsDisplay.cardElement.innerHTML = "Points: " + this.points
        }
    }

    //Does all the logic to buy a card
    doCardBuy(card){
        if(card.cost <= this.points){
            this.removeDeckDisplay()
            this.points -= card.cost
            this.pointsDisplay.cardElement.innerHTML = "Points: " + this.points
            var cardCopy = card.deepCopy()
            this.playerDeck.cards.push(cardCopy)
            this.playerDeck.discardPile.push(cardCopy)
            this.addDeckDisplay()
            card.unDraw()
        }
    }
}
class Player{

    //Creates the game a player can play
    constructor(type,turns){
        this.type = type
        this.turns = turns
        this.playGame()
    }

    //Plays the game
    playGame(type,turns){
        this.game = new Game(this.type,this.turns);
        setInterval(this.startNewGame.bind(this),500)
    }

    //Starts a new game
    startNewGame(){
        if(this.game.newGameReady){
            this.game = new Game(this.type,this.turns)
        }
    }
}

var player = new Player("standard",100);
