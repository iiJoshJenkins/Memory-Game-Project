// Trying to dynamically create menus.
// Will return the DOM object needed to append straight to the body.
function createMenu(title, ...menuOptions){
    const menuContainer = document.createElement('div');
    menuContainer.setAttribute('class', 'menuContainer');

    const menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = `<strong> ${title} </strong>`;
    menuContainer.appendChild(menuTitle);

    const menuOptionsList = document.createElement('ul');
    menuOptionsList.setAttribute('class', 'menuOptionsList');
    for(let i = 0; i < menuOptions.length; i++){
        const optionsItem = document.createElement('li');
        const itemTitle = document.createElement('h3');
        itemTitle.innerHTML = menuOptions[i];

        optionsItem.appendChild(itemTitle);
        menuOptionsList.appendChild(optionsItem);
    }
    menuContainer.appendChild(menuOptionsList);

    menuOptionsList.addEventListener('mouseover', e => hoverOver(e, 'in'));

    menuOptionsList.addEventListener('mouseout', e => hoverOver(e, 'out'));

    return menuContainer;
}

const startMenu = createMenu("Memory Game", "Play", "Instructions"),
      difficultyMenu = createMenu("Difficulty", "Easy", "Medium", "Hard");

document.addEventListener('DOMContentLoaded', e => {
    document.getElementById('gameContainer').appendChild(startMenu);

    startMenu.addEventListener('click', e => {
        let target = e.target,
            nodeName = target.nodeName.toLowerCase(),
            option;
        if(nodeName == 'li' || nodeName == 'h3'){
            option = nodeName == 'li' ? target.firstElementChild.innerText : target.innerText;
            document.getElementById('gameContainer').innerHTML = '';
            if(option == 'Play'){
                document.getElementById('gameContainer').appendChild(difficultyMenu);
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
            else{
                return;
            }
        }
        else if(inOrOut == 'out'){
            if(target.classList.contains('hovered')){
                target.classList.remove('hovered');
            }
            else{
                return;
            }
        }
    }
}
