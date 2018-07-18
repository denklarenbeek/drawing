let debitor = {};

function addLocationRow(el){
    if(!el) return
    const tbody = document.querySelector('table tbody');
    const button = document.getElementById('createNewRow');
    button.addEventListener('click', () => {
        const row = document.createElement('tr');
        const columnOne = document.createElement('td');
        const inputName = document.createElement('input');
        inputName.type = 'text';
        columnOne.appendChild(inputName);
        row.appendChild(columnOne);
        
        const columnTwo = document.createElement('td');
        const inputHardware = document.createElement('input');
        inputHardware.type = 'checkbox';
        columnTwo.appendChild(inputHardware);
        row.appendChild(columnTwo);

        const columnThree = document.createElement('td');
        const inputFee = document.createElement('input');
        inputFee.type = 'number';
        columnThree.appendChild(inputFee);
        row.appendChild(columnThree);

        const columnFour = document.createElement('td');
        const inputIcon = document.createElement('i');
        inputIcon.className = 'fal fa-trash-alt btn-danger';
        inputIcon.addEventListener('click', () => {
            const tbody = document.querySelector('table tbody');
            tbody.removeChild(row);
       })
        columnFour.appendChild(inputIcon);
        row.appendChild(columnFour);

        tbody.appendChild(row);

    });
};

export {addLocationRow}