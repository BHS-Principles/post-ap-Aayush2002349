//If adding new card, add it to allCards in game class, add it to card sheet, change scaling in css and add its card action to cardAction and draw, both its action and its position



class Cards{

    //There is currently nothing in the constructor because there are multiple ways to create a card
    constructor(){
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

        var cost = Math.ceil(((index+1) * info.cost)/2) * Math.ceil((maxPoints + 1)/8);

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

    unDraw(){
        this.cardElement.remove();
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
        this.state = {
            prevVal:0,
            nextMults:[]
        }
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
        this.drawPile = this.deepCopyCards()
    };

    //Draws a card from the deck and does its action
    drawCard(){
        console.log(this.drawPile);
        //Reshuffle
        if(this.drawPile.length == 0){
            this.discardPile.push(this.currentCard)
            this.drawPile = this.discardPile
            this.discardPile = []
            this.currentCard = null
        }

        //Manipulate cards
        if(this.currentCard != null){
            this.discardPile.push(this.currentCard)
        }
        var drawnIndex = Math.floor(Math.random()*this.drawPile.length);
        console.log(drawnIndex);
        this.currentCard = this.drawPile.pop(drawnIndex)
        
        //Does all the card actions
        var info = this.currentCard.doCardAction(this.state)

        //Sets and returns information
        this.state = info.state

        return info.points
    }
}
class Game{
    //Creates the game
    constructor(type){
        this.type = type
        this.playerDeck = new Deck();
        this.shop = new Deck();
        this.points = 0
        this.maxPoints = 0
        if(type == "standard"){
            this.createStandardGame()
            this.displayStandardGame()
        }
    }

    createStandardGame(){
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
    }
    displayStandardGame(){
        this.drawPileDisplay = new Cards()
        this.drawPileDisplay.setInfo(true,"back",null,null,1)
        this.discardPileDisplay = new Cards()
        this.discardPileDisplay.setInfo(true,"back",null,null,2)
        this.drawPileDisplay.draw(0,0)
        this.discardPileDisplay.draw(20,0)
    }
    doCardDraw(){
        if(this.playerDeck.currentCard != null){
            this.playerDeck.currentCard.unDraw()
        }

        var pointsGained = this.playerDeck.drawCard()
        this.points += pointsGained
        if(this.points > this.maxPoints){
            this.maxPoints = this.points
        }
        this.playerDeck.currentCard.draw(10,0)
    }
}

var game = new Game("standard");
for(var i = 0; i < 4; i++){
    game.doCardDraw()
}