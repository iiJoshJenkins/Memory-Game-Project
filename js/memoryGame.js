// Trying to dynamically create menus.
// Will return the DOM object needed to append straight to the body.
function createMenu(title, ...menuOptions){
    const menuContainer = document.createElement('div');
    menuContainer.setAttribute('class', 'menuContainer');

    const menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = `<strong> ${title} </strong>`;
    menuContainer.appendChild(menuTitle);

    if(menuOptions.length > 0){
        const menuOptionsList = document.createElement('ul');
        menuOptionsList.setAttribute('class', 'menuOptionsList');
        for(let i = 0; i < menuOptions.length; i++){
            const optionsItem = document.createElement('li');
            const itemTitle = document.createElement('h3');
            itemTitle.innerHTML = menuOptions[i];

            optionsItem.appendChild(itemTitle);
            menuOptionsList.appendChild(optionsItem);
        }

        menuOptionsList.addEventListener('mouseover', e => hoverOver(e, 'in'));
        menuOptionsList.addEventListener('mouseout', e => hoverOver(e, 'out'));

        menuContainer.appendChild(menuOptionsList);
    }

    return menuContainer;
}

function createGame(amountOfCards){
    const gameMenu = createMenu("Memory Game");
    gameContainer.appendChild(gameMenu);
}

const startMenu = createMenu("Memory Game", "Play", "Instructions");

document.addEventListener('DOMContentLoaded', e => {
    const gameContainer = document.getElementById('gameContainer');
    document.getElementById('gameContainer').appendChild(startMenu);

    startMenu.addEventListener('click', e => {
        const target = e.target,
            nodeName = target.nodeName.toLowerCase();
        let option;
        if(nodeName == 'li' || nodeName == 'h3'){
            option = nodeName == 'li' ? target.firstElementChild.innerText : target.innerText;
            gameContainer.innerHTML = '';
            if(option == 'Play'){
                const difficultyMenu = createMenu("Difficulty", "Easy", "Normal", "Hard");
                gameContainer.appendChild(difficultyMenu);
                difficultyMenu.addEventListener('click', e => {
                    const target = e.target,
                          nodeName = target.nodeName.toLowerCase();
                    let option;
                    if(nodeName == 'li' || nodeName == 'h3'){
                        option = nodeName == 'li' ? target.firstElementChild.innerText : target.innerText;
                        gameContainer.innerHTML = '';
                        console.log(option);
                        switch(option){
                            case 'Easy':
                                createGame(9);
                                break;
                            case 'Normal':
                                createGame(16);
                                break;
                            case 'Hard':
                                createGame(20);
                                break;
                            default:
                                console.log("ERROR: Somehow an option wasn't pressed");
                        }
                    }
                });
            }
            else if(option == 'Instructions'){
                window.location.href = 'instructions.html';
            }
        }
    });
});


/*
    MISC FUNCTIONS
*/

// This is the event handler for hovering over the menu options
// It checks if you're hovering over and li or h3 inside a list

function hoverOver(event, inOrOut){
    let target = event.target,
        nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'li' || nodeName == 'h3'){
        if(inOrOut == 'in'){
            if(!target.classList.contains('hovered')){
                if(nodeName == 'h3') target = target.parentElement;
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
