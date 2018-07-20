function deleteFlash(el) {
    if(!el) return
    const flash = document.querySelector('.flash');
    const flashContainer = document.querySelector('.flash-messages');
    setTimeout(() => {
        flashContainer.removeChild(flash);
    }, 2000);
}

export {deleteFlash}