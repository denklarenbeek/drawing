function deleteFlash(el, time) {
    let seconds = time || 4000
    if(!el) return
    const flash = document.querySelector('.flash');
    const flashContainer = document.querySelector('.flash-messages');
    setTimeout(() => {
        flashContainer.removeChild(flash);
    }, seconds);
}

function createFlash(type, flash_text){
    const flash = document.createElement('div');
    flash.classList.add('flash');
    flash.classList.add(`flash--${type}`);
    const text = document.createElement('p');
    text.classList.add('flash__text');
    text.innerHTML = flash_text;
    flash.appendChild(text);
    return flash;
}

export {deleteFlash, createFlash}