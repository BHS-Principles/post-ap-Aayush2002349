class Cards{

    //Creates a card
    constructor(type,numVal,strVal){
        this.type = type;
        this.num = numVal;
        this.str = strVal;
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
        cards.push(new Cards(current.type,current.num[i],current.str[0]));
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

    var card = new Cards(type,num,str);

    var cost = numSelect * currentCard.cost;
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

var allCardsInDeck = createStartingCards(allCards);
var discardedCards = [];
var currentCard = null;
var toDrawCards = deepCopyCardList(allCardsInDeck);
var cardsInShop = refresh(allCards,5);


var temp = document.getElementById("temp");
var target = document.getElementById("target")
var cardDisplay = temp.querySelector(".Card");

for(var i = 0; i < cardsInShop.length; i++){
    var currentCardDisplay = cardDisplay.cloneNode(true)

    currentCardDisplay.innerHTML = cardsInShop[i].num

    target.append(currentCardDisplay)
}