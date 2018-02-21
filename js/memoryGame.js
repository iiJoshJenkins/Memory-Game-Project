const gameContainer = document.getElementById('gameContainer');
const difficultyMenu = {
    title: 'Difficulty',
    options : {
        'Easy' : createGame(9),
        'Normal' : createGame(16),
        'Hard' : createGame(20)
    }
}
const mainMenu = {
    title: 'Memory Game',
    options : {
        'Play' : createMenu(difficultyMenu),
        'Instructions' : 'instructions.html'
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
    // Needs to return a dom element, for now just adding a header
    const gameHeader = document.createElement('h1');
    gameHeader.innerHTML = `Game created with ${amountOfCards} cards!`

    return gameHeader;
}

document.addEventListener('DOMContentLoaded', e => {
    gameContainer.appendChild(createMenu(mainMenu));
});

/*
    MISC FUNCTIONS
*/

// This is the event handler for clicking a button in the options
function menuClick(event, menuOptions){
    gameContainer.innerHTML = '';
    let target = event.target,
          nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'li' || nodeName == 'h3'){
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
