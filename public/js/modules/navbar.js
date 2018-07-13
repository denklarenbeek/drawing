/* 
    Control the collapsing navbar
*/
function controlCollapNavbar(e){
    e.preventDefault();
    const body = document.querySelector('body');
    if(document.querySelector('.body-left')){
        body.classList.remove('body-left');
    } else {
        body.classList.add('body-left');
    } 
};