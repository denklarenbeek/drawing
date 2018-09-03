function getDefaultValue(el){
    if(!el) return

    const category = document.getElementById('category').dataset.category;
    const modCategory = category.toLowerCase().replace(" ", "_");
    const id = `#category_${modCategory}`;
    console.log(id);
    const checkedInput = document.querySelector(id);
    checkedInput.checked = true;

}

export {getDefaultValue};