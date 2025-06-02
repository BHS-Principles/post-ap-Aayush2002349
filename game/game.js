//If adding new card, add it to allCards, add it to card sheet, change scaling in css and add its card action to cardAction



class Cards{

    //Creates a card
    constructor(type,numVal,strVal,index){
        this.type = type;
        this.num = numVal;
        this.str = strVal;
        this.index = index;
        this.cost = null;
    }

    //Sets the card's cost
    setCost(cost){
        this.cost = cost;
    }

    //Deep copies a card
    deepCopy(){
        return {type:this.type, num:this.num, str:this.str, cost:this.cost};
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
        cards.push(new Cards(current.type,current.num[i],current.str[0],i));
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

//Gets a random card
var getRandomCard = function(allCards){
    
    var currentCard = allCards[Math.floor(Math.random()*allCards.length)];

    var type = currentCard.type;
    var numSelect = Math.floor(Math.random()*currentCard.num.length);
    var num = currentCard.num[numSelect];
    var str = currentCard.str[Math.floor(Math.random()*currentCard.str.length)];

    var card = new Cards(type,num,str,numSelect);

    var cost = (numSelect+1) * currentCard.cost;
    card.setCost(cost);
    return card;
}

//Gets n random cards (which is used to refresh the shop)
var refresh = function(allCards,num){
    var cards = [];
    for(var i = 0; i < num; i++){
        cards.push(getRandomCard(allCards));
    }
    return cards;
};

//Draw a random card
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
}

var cardAction(currentCard,state){
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
}

var allCardsInDeck = createStartingCards(allCards);
var discardPile = [];
var currentCard = null;
var drawPile = deepCopyCardList(allCardsInDeck);
var cardsInShop = refresh(allCards,5);

var state = {
    prevVal:0,
    nextMults:[]
}

var temp = document.getElementById("temp");
var target = document.getElementById("target")
var cardDisplay = temp.querySelector(".Card");

for(var i = 0; i < 52; i++){
    var currentCardDisplay = cardDisplay.cloneNode(true)
    currentCardDisplay.style.backgroundPositionX = "" + 10*(i%13) + "rem"
    currentCardDisplay.style.backgroundPositionY = "" + 15*(Math.floor(i/13))+ "rem"
    currentCardDisplay.innerHTML = i

    target.append(currentCardDisplay)
}