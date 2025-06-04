//If adding new card, add it to allCards, add it to card sheet, change scaling in css and add its card action to cardAction and draw, both its action and its position



class Cards{

    //There is currently nothing in the constructor because there are multiple ways to create a card
    constructor(){
    }

    //Sets the info of the card
    setInfo(isBack,type,numVal,strVal,index){
        if(isBack){
            this.index = index;
        } else {
            this.type = type;
            this.num = numVal;
            this.str = strVal;
            this.index = index;
            this.cost = null;
        }
    }

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
        return {type:this.type, num:this.num, str:this.str, cost:this.cost, index:this.index};
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

        //Displays which card it is
        card.style.backgroundPositionX = "" + -10*xCard + "rem"
        card.style.backgroundPositionY = "" + -15*yCard + "rem"

        //Puts where the card is on the screen
        card.style.position = "absolute"
        card.style.left = "" + xPos + "rem"
        card.style.top = "" + yPos + "rem"

        console.log("" + xPos + "rem" + " " + yPos + "rem")

        target.append(card)

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
    setStartingDeck(){
    }
    deepCopyCards(){
        var copiedCards = [];
        for(var i = 0; i < this.cards.length; i++){
            copiedCards.push(this.cards[i].deepCopy);
        }
        return copiedCards;
    }
}

//Has all the cards
var allCards = [
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

//Creates the starting deck
var createStartingCards = function(allCards){

    var cards = [];
    var current = allCards[0];

    for(var i = 0; i < current.num.length; i++){
        var cardTemp = new Cards()
        cardTemp.setInfo(false,current.type,current.num[i],current.str[0],i)
        cards.push(cardTemp);
    }

    

    return cards;
}

//Deepcopies a list of cards
var deepCopyCardList = function(cards){
    var copiedCards = [];
    for(var i = 0; i < cards.length; i++){
        copiedCards.push(cards[i].deepCopy);
    }
}

//Gets n random cards (which is used to refresh the shop)
var refresh = function(allCards,maxPoints,num){
    var cards = [];
    for(var i = 0; i < num; i++){

        var cardTemp = new Cards()
        cardTemp.makeRandomCard(allCards,maxPoints)

        cards.push(cardTemp);
    }
    return cards;
};

//Draw a random card (everything is local)
var drawCard = function(currentCard,drawPile,discardPile,state){
    //Reshuffle
    if(drawPile.length == 0){
        drawPile = discardPile
        discardPile = []
    }

    //Manipulate cards
    var drawnIndex = Math.floor(Math.random()*drawPile.length);
    discardPile.push(currentCard)
    currentCard = drawPile.pop(drawnIndex)
    
    //Does all the card actions
    var info = doCardAction(currentCard,state)

    return {points:info.points,state:info.state,currentCard:currentCard,drawPile:drawPile,discardPile:discardPile}
}

var doCardAction = function(currentCard,state){
    var points = 0

    //All different cards and their behaviors
    if(currentCard.type == "num"){
        points = currentCard.num
    }
    if(currentCard.type == "multPrev"){
        points = state.prev * currentCard.num
    }
    if(currentCard.type == "chance"){
        if(Math.random() <= currentCard.num){
            points = 5/currentCard.num
        } else {
            points = 0
        }
    }
    if(currentCard.type == "multNext"){
        state.nextMults.push({num: Math.floor(currentCard.num / 10) , type:1 + currentCard.num % 10})
    }


    //Reduces the turn timers on state calcs by one and multiplies points by each multiplier currently active
    for(var i = 0; i < state.nextMults.length; i++){

        points *= state.nextMults[i].num
        
        state.nextMults[i].turns -= 1
        
        if(state.nextMults[i].turns == 0){
            state.nextMults.pop(i)
            i -= 1
        }
    }

    state.prev = points

    return {points:points,state:state}
}

//Call this function every time a card is drawn, it will do all the math and display stuff
var onCardDraw = function(){

    //All the math is complete
    var info = drawCard(currentCard,drawPile,discardPile,state)

    totalPoints += info.points
    state = info.state
    drawPile = info.drawPile
    discardPile = info.discardPile
    currentCard = info.currentCard
}


var allCardsInDeck = createStartingCards(allCards);
var discardPile = [];
var currentCard = null;
var drawPile = deepCopyCardList(allCardsInDeck);
var cardsInShop = refresh(allCards,maxPoints,5);

var state = {
    prevVal:0,
    nextMults:[]
}

var totalPoints = 0
var maxPoints = 0


//Testing drawing cards
var testing = refresh(allCards,maxPoints,100);

for(var i = 0; i < testing.length; i++){
    testing[i].draw(10*(i%10),15*Math.floor(i/10))
}