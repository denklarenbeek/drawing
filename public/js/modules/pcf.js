let tab = 1;
let client;
let improvement;

function showHideArrow(tabNr){
    const arrow = document.querySelector('.back-arrow i');
    if(tabNr === 1){
        arrow.style.display = 'none'
    } else {
        arrow.style.display = 'block'
    }
}


if(location.pathname === '/pcf'){
    const buttons = document.querySelectorAll('button');
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click', () => {

            // remove active class from current
            const activeSection = document.querySelector('section.active');
            activeSection.classList.remove('active');
           
            // Set new tab number
            tab++

            // save value in variable
            if(buttons[i].dataset.client){
                client = buttons[i].dataset.client;
            }
            if(buttons[i].dataset.improvement){
                improvement = buttons[i].dataset.improvement
            }
            
            // render right section
            let search;
            if(tab === 3){
                search = `pcf-${improvement}`;
            } else {
                search = `pcf-${tab}`;
            }
            
            const newSection = document.getElementById(search);
            newSection.classList.add('active');

            showHideArrow(tab);

            console.log(tab, client, improvement);
        });
    }
}

if(location.pathname === '/pcf'){
    const backArrow = document.querySelector('.back-arrow i');
    
    backArrow.addEventListener('click', () => {
        const activeSection = document.querySelector('section.active');
        activeSection.classList.remove('active');

        tab--;

        let search = `pcf-${tab}`;
        const newSection = document.getElementById(search);
        newSection.classList.add('active');
        showHideArrow(tab);
    });
};


