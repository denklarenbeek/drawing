/* 
    When the email field is not valid but there is value,
    add a class to hold the label translateY.
*/
function movelabel(e){
    const item = document.querySelector(".input-email");

    if(e.value){
        e.classList.add('input-has-value');
    } else {
        e.classList.remove('input-has-value');
    }
};

/* 
    Create the arrow element for the input preview
*/
function createArrowElement(type){
    // Create a delele button
    const arrow = document.createElement('i');
    arrow.classList.add('fal');
    arrow.classList.add('fa-times');
    if(type === 'picture'){
        arrow.classList.add('remove-picture');
    } else {
        arrow.classList.add('remove-file');
    }

    // Add on click event to clear the input cache.
    arrow.addEventListener('click', () => {
        const output = document.getElementById('output-upload');
        const input = document.getElementById('file');
        if(window.confirm('Do you really want to delete this upload?')){
            input.value = '';
            output.value = "";
            output.removeChild(document.getElementById('upload-file'))
        }
    });
    return arrow;
};

/*  
    Create the element for the upload file to be rendered
*/
function createUploadElement(upload){
    // Create a container div
    const containerDiv = document.createElement('div');
    containerDiv.id = 'upload-file';

    if(upload.type.startsWith('image/')){
        // Create a image element
        const img = document.createElement('img');

        // Add the preview URL to the image
        img.src = URL.createObjectURL(upload);

        //Append the img and the arrow to the div
        containerDiv.appendChild(img);
        containerDiv.appendChild(createArrowElement('picture'));
    }

    if(upload.type.startsWith('application/')){
        // Create p element
        const p = document.createElement('p');
        p.innerHTML = upload.name;

        containerDiv.appendChild(p);
        containerDiv.appendChild(createArrowElement('file'));
    }

    // Append arrow to the file or image
    return containerDiv;
};

/*
    Show the uploaded file due to the file input
*/
function showFileInput(elem, event) {

    const output = document.getElementById('output-upload');

    // Check if there's already a uploaded file and 
    if(document.getElementById('upload-file')) {
        //remove it from the preview
        output.removeChild(document.getElementById('upload-file'));
    };

    // Create the right element based on the type of file
    const createdElement = createUploadElement(event.target.files[0])

    // Append the file to the output div
    output.appendChild(createdElement);
};