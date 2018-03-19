var activeCards,
    currentMoves,
    starRating,
    gameDifficulty,
    gameStarted,
    remainingCards,
    timePlayed,
    timerInterval,
    minMoves,
    maxMoves;

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
        'Easy' : '',
        'Normal' : '',
        'Hard' : ''
    }
};
const mainMenu = {
    title: 'Memory Game',
    options : {
        'Play' : createMenu(difficultyMenu),
        'Instructions' : 'instructions.html'
    }
};

const modalMenu = {
    title : 'Congratulations',
    options : {
        'Play Again' : '', // TODO: Figure out how to recreate the same game, right now it just creates a new random game.
        'Menu' : ''
    }
}

const gameOver = {
    title : 'Game Over!',
    options : {
        'Play Again' : '',
        'Menu' : ''
    }
}

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
            optionsItem.setAttribute('class', 'menuOption');
            const itemTitle = document.createElement('h3');
            itemTitle.innerHTML = option;

            optionsItem.appendChild(itemTitle);
            menuOptionsList.appendChild(optionsItem);
        }
        // Creating the eventListeners for the options menu
        // Doing this to allow hover effects and other things like that.
        menuOptionsList.addEventListener('mouseover', e => hoverOver(e));
        menuOptionsList.addEventListener('mouseout', e => hoverOver(e));
        menuOptionsList.addEventListener('click', e => menuClick(e, menuTemplate.options));
        menuContainer.appendChild(menuOptionsList);
    }

    return menuContainer;
}

function createGame(amountOfCards){
    gameContainer.innerHTML = '';
    clearInterval(timerInterval);
    activeCards = new Array();
    currentMoves = 0;
    starRating = 3;
    gameStarted = false;
    timePlayed = 0;
    minMoves = amountOfCards;
    maxMoves = (amountOfCards / 2) + (amountOfCards / 4);

    const boardContainer = document.createElement('div');
    boardContainer.setAttribute('class', 'boardContainer');

    const gameHeader = document.createElement('header');
    const gameHeaderTitle = document.createElement('h1');
    gameHeaderTitle.innerHTML = `Memory Game!`;
    gameHeaderTitle.setAttribute('class', 'gameTitle');
    gameHeader.appendChild(gameHeaderTitle);
    boardContainer.appendChild(gameHeader);

    const starRatingList = document.createElement('ul');
    starRatingList.setAttribute('class', 'starRating');

    for(let i = 0; i < starRating; i++){
        const starIconContainer = document.createElement('li');
        const startIcon = document.createElement('i');
        startIcon.setAttribute('class', 'fa fa-star');
        starIconContainer.appendChild(startIcon);
        starRatingList.appendChild(starIconContainer);
    }

    gameHeader.appendChild(starRatingList);

    const timer = document.createElement('p');
    timer.setAttribute('class', 'timer');
    timer.innerHTML = `Time : ${timePlayed}`;
    gameHeader.appendChild(timer);

    const amountOfMoves = document.createElement('p');
    amountOfMoves.setAttribute('class', 'amountOfMoves');
    amountOfMoves.innerHTML = `Amount of moves : ${currentMoves}`;
    gameHeader.appendChild(amountOfMoves);

    const restartButton = document.createElement('span');
    restartButton.setAttribute('class', 'restartButton');
    const restartButtonIcon = document.createElement('i');
    restartButtonIcon.setAttribute('class', 'fa fa-refresh');
    restartButton.appendChild(restartButtonIcon);
    gameHeader.appendChild(restartButton);
    restartButton.addEventListener('click', e => gameContainer.appendChild(createGame(amountOfCards)));

    // This just generates the cards array we'll be using
    const playingCards = generatePlayingCards(amountOfCards);
    const gameBoard = drawPlayingCards(playingCards);

    gameBoard.classList.add(gameDifficulty);
    gameBoard.addEventListener('click', e => cardClick(e));

    boardContainer.appendChild(gameBoard);

    return boardContainer;
}

// Making sure the DOM is loaded before trying to add things too it.
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
    if(!gameStarted){
        remainingCards = document.getElementsByClassName('card');
        const timer = document.querySelector('.timer');
        timerInterval = setInterval(function(){
            timePlayed++;
            time = new Date(null);
            time.setSeconds(timePlayed);
            timer.innerHTML = `Time : ${time.toISOString().substr(11,8)}`;
        }, 1000)
        gameStarted = true;
    }
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
                currentMoves++;
                if(currentMoves > maxMoves && starRating > 0){
                    starRating -= 1;
                    let starRatingList = document.querySelector('.starRating');
                    starRatingList.innerHTML = '';
                    for(let i = 0; i < 3; i ++){
                        const starIconContainer = document.createElement('li');
                        const startIcon = document.createElement('i');
                        if(i == 2){
                            switch(true){
                                case (starRating <= 2):
                                    icon = 'fa fa-star-o';
                                    break;
                                default:
                                    icon = 'fa fa-star'
                            }
                        }else if(i == 1){
                            switch(true){
                                case (starRating <= 1):
                                    icon = 'fa fa-star-o';
                                    break;
                                default:
                                    icon = 'fa fa-star'
                            }
                        }else{
                            icon = 'fa fa-star'
                        }
                        console.log(icon);
                        startIcon.setAttribute('class', icon);

                        starIconContainer.appendChild(startIcon);
                        starRatingList.appendChild(starIconContainer);
                    }
                }

                if(starRating == 1){
                    gameContainer.appendChild(createMenu(gameOver));
                }
                const amountOfMoves = document.querySelector('.amountOfMoves');
                amountOfMoves.innerHTML = `Amount of moves : ${currentMoves}`;
                if(cardsMatch()){
                    for(let activeCard of activeCards){
                        activeCard.parentElement.classList.add('match');
                    }

                    // Removing all cards from remainingCards if they have more than the className 'card', eg. .open ect.
                    remainingCards = Array.prototype.filter.call(remainingCards, e => e.className == 'card');
                    activeCards = [];
                }
                else{
                    for(let activeCard of activeCards){
                        activeCard.parentElement.classList.add('noMatch');
                    }
                    setTimeout(function(){
                        for(let activeCard of activeCards){
                            activeCard.parentElement.classList.remove('open', 'show', 'noMatch');
                        }
                        activeCards = [];
                    }, 1000);

                }
            }
        }
        if(remainingCards.length == 0){
            // TODO: Leaderboard? Save to file?

            clearInterval(timerInterval);
            let gameTime = new Date(null);
            gameTime.setSeconds(timePlayed);

            const modalMenuElement = createMenu(modalMenu);
            const modalContainer = document.createElement('div');
            modalContainer.setAttribute('class', 'modalContainer');

            const modalContent = document.createElement('div');
            modalContent.setAttribute('class', 'modalContent');

            const modalClose = document.createElement('span');
            modalClose.setAttribute('class', 'modalClose');
            modalContent.appendChild(modalClose);

            const modalText = document.createElement('p');
            modalText.setAttribute('class', 'modalText');
            // TODO: Make the starRating display as the starIcons instead of the number.
            modalText.innerHTML =  `Moves : ${currentMoves} \n Time : ${gameTime.toISOString().substr(11,8)} \n Rating : ${starRating}`;
            modalContent.appendChild(modalText);

            modalContainer.appendChild(modalContent);
            modalMenuElement.insertBefore(modalContainer, modalMenuElement.childNodes[0].nextSibling);
            modalMenuElement.classList.add('modalMenu');
            gameContainer.appendChild(modalMenuElement);
        }
    }
}

// This is the event handler for clicking a button in the options
function menuClick(event, menuOptions){
    let target = event.target,
          nodeName = target.nodeName.toLowerCase();
          console.log
    if(nodeName == 'li' || nodeName == 'h3'){
        gameContainer.innerHTML = '';
        if(nodeName == 'li'){
            target = target.firstChild;
        }
        if(menuOptions['Instructions'] && target.innerHTML == 'Instructions'){
            window.location.href = menuOptions['Instructions'];
        }
        else if(target.innerHTML == 'Menu'){
            location.reload();
        }
        else if(target.innerHTML == 'Easy' || target.innerHTML == 'Normal' || target.innerHTML == 'Hard'){
            let game;
            switch(target.innerHTML){
                case 'Easy':
                    gameDifficulty = 'easy';
                    game = createGame(4);
                    break;
                case 'Normal':
                    gameDifficulty = 'normal';
                    game = createGame(16);
                    break
                case 'Hard':
                    gameDifficulty = 'hard';
                    game = createGame(20);
                    break;
                default:
                    console.error('Somehow a difficulty setting wasn\'t pressed');
            }
            gameContainer.appendChild(game);
        }
        else if(target.innerHTML == 'Play Again'){
             gameContainer.appendChild(createGame(cardAmount = gameDifficulty == 'easy' ? 4 : gameDifficulty == 'normal' ? 16 : 20))
        }
        else{
            gameContainer.appendChild(menuOptions[target.innerHTML]);
        }
    }
}


// This is the event handler for hovering over the menu options
// It checks if you're hovering over and li or h3 inside the menuOptionsList

function hoverOver(event){
    let target = event.target,
        type = event.type,
        nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'li' || nodeName == 'h3'){
        if(type == 'mouseover'){
            if(!target.classList.contains('hovered')){
                if(nodeName == 'h3')
                    target = target.parentElement;
                target.classList.add('hovered');
            }
            else return;
        }
        else if(type == 'mouseout'){
            if(target.classList.contains('hovered')){
                target.classList.remove('hovered');
            }
            else return;
        }
    }
}
