const gameContainer = document.getElementById('gameContainer');

const cards = [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb',
    'bell',
    'book',
    'compass',
    'globe'
];

const difficultyMenu = {
    title: 'Difficulty',
    options : {
        'Easy' : createGame(4),
        'Normal' : createGame(16),
        'Hard' : createGame(20)
    }
};
const mainMenu = {
    title: 'Memory Game',
    options : {
        'Play' : createMenu(difficultyMenu),
        'Instructions' : 'instructions.html'
    }
};

let activeCards = new Array(),
    currentMoves = 0,
    starRating = 3;
// Trying to dynamically create menus.
// Will return the DOM object needed to append straight to the body.
function createMenu(menuTemplate){
    // Creating the container for the menu
    const menuContainer = document.createElement('div');
    menuContainer.setAttribute('class', 'menuContainer');
    // Creating the title for the menu
    const menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = `<strong> ${menuTemplate.title} </strong>`;
    menuContainer.appendChild(menuTitle);
    // Checking if the amount of items inside menuOptions is greater than one
    // Using rest parameter so it could and in some cases it should
    if(menuTemplate.options){
        // Creating the list for the option to go in
        const menuOptionsList = document.createElement('ul');
        menuOptionsList.setAttribute('class', 'menuOptionsList');
        // Looping through the array and adding all the options to the list
        for(let option in menuTemplate.options){
            const optionsItem = document.createElement('li');
            const itemTitle = document.createElement('h3');
            itemTitle.innerHTML = option;

            optionsItem.appendChild(itemTitle);
            menuOptionsList.appendChild(optionsItem);
        }
        // Creating the eventListeners for the options menu
        // Doing this to allow hover effects and other things like that.
        menuOptionsList.addEventListener('mouseover', e => hoverOver(e, 'in'));
        menuOptionsList.addEventListener('mouseout', e => hoverOver(e, 'out'));
        menuOptionsList.addEventListener('click', e => menuClick(e, menuTemplate.options));
        menuContainer.appendChild(menuOptionsList);
    }

    return menuContainer;
}

function createGame(amountOfCards){
    const boardContainer = document.createElement('div');
    boardContainer.setAttribute('class', 'boardContainer');

    const gameHeader = document.createElement('header');
    const gameHeaderTitle = document.createElement('h1');
    gameHeaderTitle.innerHTML = `Memory Game!`;
    gameHeaderTitle.setAttribute('class', 'gameTitle');
    gameHeader.appendChild(gameHeaderTitle);

    boardContainer.appendChild(gameHeader);
    // This just generates the cards array we'll be using
    // TODO : Make the DOM elements to render the cards.
    const playingCards = generatePlayingCards(amountOfCards);
    const gameBoard = drawPlayingCards(playingCards);

    let difficulty;
    switch(amountOfCards){
        case 4:
            difficulty = 'easy';
            break;
        case 16:
            difficulty = 'normal';
            break;
        case 20:
            difficulty = 'hard';
            break;
        default:
            console.log('Somehow a difficulty setting wasn\'t picked');
    }

    gameBoard.classList.add(difficulty);
    gameBoard.addEventListener('click', e => cardClick(e));

    boardContainer.appendChild(gameBoard);

    return boardContainer;
}

document.addEventListener('DOMContentLoaded', e => {
    gameContainer.appendChild(createMenu(mainMenu));
});

/*
    CARD FUNCTIONS
*/

function generatePlayingCards(amountOfCards){
    // Need to write the rest of the board but this is a good start.
    let gameCards = new Array();

    // Have to divide the amount of cards by 2 so that
    // We can get 2 of each card
    for(let i = 0; i < amountOfCards / 2; i++){
        // Get a random card from the cards list
        // Also generate the cards we'll be using for the game.
        let random = Math.floor(Math.random() * cards.length);
        let card = cards[random];
        // If the card pair is already in the gameCards
        // Make the loop run another time so we can add another card
        // TODO: Find out how to optimise this.
        if(gameCards.includes(cards[random])){
            i--;
        }else{
            gameCards.push(card, card);
        }
    }
    // Shuffle the array to randomise cards positons
    gameCards = shuffle(gameCards);
    return gameCards;
}

// Return a HTML list with all the cards inside
function drawPlayingCards(playingCards){
    const gameBoard = document.createElement('ul');
    gameBoard.setAttribute('class', 'gameBoard');
    for(let card of playingCards){
        let _card = document.createElement('li');
        _card.setAttribute('class', 'card');

        let _icon = document.createElement('i');
        _icon.setAttribute('class', `fa fa-${card}`);
        _card.appendChild(_icon);
        gameBoard.appendChild(_card);
    }
    return gameBoard;
}

/*
    MISC FUNCTIONS
*/

// TODO : Write my own way of shuffling the card array.
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function cardsMatch(){
    return activeCards[0].className == activeCards[1].className;
}

function cardClick(event){
    if(activeCards.length < 2){
        let target = event.target,
            nodeName = target.nodeName.toLowerCase();
        if(nodeName == 'li' || nodeName.toLowerCase() == 'i'){
            if(nodeName == 'i'){
                target = target.parentElement;
            }
            if(!target.classList.contains('open') && !target.classList.contains('show')){
                target.classList.add('open', 'show');
                activeCards.push(target.firstChild);
            }

            if(activeCards.length == 2){
                if(cardsMatch()){
                    // TODO: Add some sort of class or animation to show success
                    activeCards = [];
                }
                else{
                    setTimeout(function(){
                        for(let activeCard of activeCards){
                            // TODO: Add some sort of class or animation to show fail
                            activeCard.parentElement.classList.remove('open', 'show');
                        }
                        activeCards = [];
                    }, 500);

                }
            }
        }
    }
}

// This is the event handler for clicking a button in the options
function menuClick(event, menuOptions){
    let target = event.target,
          nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'li' || nodeName == 'h3'){
        gameContainer.innerHTML = '';
        if(nodeName == 'li'){
            target = target.firstChild;
        }
        if(menuOptions['Instructions'] && target.innerHTML == 'Instructions'){
            window.location.href = menuOptions['Instructions'];
        }
        else{
            gameContainer.appendChild(menuOptions[target.innerHTML]);
        }
    }
}

// This is the event handler for hovering over the menu options
// It checks if you're hovering over and li or h3 inside a list

function hoverOver(event, inOrOut){
    let target = event.target,
        nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'li' || nodeName == 'h3'){
        if(inOrOut == 'in'){
            if(!target.classList.contains('hovered')){
                if(nodeName == 'h3')
                    target = target.parentElement;
                target.classList.add('hovered');
            }
            else return;
        }
        else if(inOrOut == 'out'){
            if(target.classList.contains('hovered')){
                target.classList.remove('hovered');
            }
            else return;
        }
    }
}
