import axios from 'axios';
import {deleteFlash, createFlash} from './flashes';

function addLocationRow(el){
    if(!el) return
    const tbody = document.querySelector('table tbody');
    const button = document.getElementById('createNewRow');
     
    button.addEventListener('click', () => {

        const index = document.querySelectorAll('table tbody tr').length;
        const row = document.createElement('tr');
        const columnOne = document.createElement('td');
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.name = 'location_name';
        inputName.id = `location_name-${index}`
        columnOne.appendChild(inputName);
        row.appendChild(columnOne);
        
        const columnTwo = document.createElement('td');
        const inputHardware = document.createElement('input');
        inputHardware.type = 'checkbox';
        inputHardware.id = `location_hardware-${index}`
        columnTwo.appendChild(inputHardware);
        row.appendChild(columnTwo);

        const columnThree = document.createElement('td');
        const inputFee = document.createElement('input');
        inputFee.type = 'number';
        inputFee.id = `location_fee-${index}`;
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

function submitForm(el){
    if(!el) return
    const form = document.getElementById('firstform');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const debitor = {
            company: document.getElementById('company').value,
            street: document.getElementById('street').value,
            zippcode: document.getElementById('zippcode').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value
        }

        const dates = {
            starting_date: document.getElementById('starting_date').value,
            contract_duration: document.getElementById('contract_duration').value
        }

        let send_to_email = document.getElementById('send_to_email').value || '';
        let send_to_name = document.getElementById('send_to_name').value || '';

        const options = {
            send_by_email: document.getElementById('send_by_email').checked,
            send_to_email: send_to_email,
            send_to_name: send_to_name
        }
        
        const locations = document.querySelectorAll('tbody tr');
        let modLocations = [];
        
        for (let i=0; i < locations.length; i++){
            let returnLocation = {};
            returnLocation.name = document.getElementById(`location_name-${i}`).value;
            returnLocation.hardware = document.getElementById(`location_hardware-${i}`).checked;
            returnLocation.fee = document.getElementById(`location_fee-${i}`).value;
            modLocations.push(returnLocation);
        };

        axios.post('/api/v1/generate-pcf-contract', {
            debitor: debitor,
            dates: dates,
            options: options,
            locations: modLocations
        }, {responseType: 'blob'})
        .then((res) => {
            const file = new Blob([res.data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            // front end flashes
            createFlash('success', 'contract is created', 10000);
            form.reset();
        })
        .catch((err) => {
            console.log(err)
        });
    })

}

function showEmailField(el){
    if(!el) return;

    const input = document.getElementById('send_by_email');
    input.addEventListener('change', function(){
        if(this.checked){
            document.getElementById('send_to_email_container').style.display = 'block';
        } else {
            document.getElementById('send_to_email_container').style.display = 'none';
        }
    })
}

export {addLocationRow, submitForm, showEmailField}