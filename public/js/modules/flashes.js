function deleteFlash(el, time) {
    let seconds = time || 4000
    if(!el) return
    setTimeout(() => {
        el.parentElement.removeChild(el);
    }, seconds);
}

function createFlash(type, flash_text, duration){
    let flashType;
    if(type === 0){
        flashType = 'success';
    }
    if(type === 1){
        flashType = 'error'
    }
    const flashContainer = document.querySelector('.flash-messages');
    const flash = document.createElement('div');
    flash.classList.add('flash');
    flash.classList.add(`flash--${flashType}`);
    const text = document.createElement('p');
    text.classList.add('flash__text');
    text.innerHTML = flash_text;
    flash.appendChild(text);
    flashContainer.appendChild(flash);
    deleteFlash(flash, duration)
}

export {deleteFlash, createFlash}