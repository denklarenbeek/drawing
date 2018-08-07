function searchOpportunities (el){
    if(!el) return

    const inputField = document.getElementById('searchInput');
    inputField.addEventListener('keyup', function(){
        
        const inputValue = document.getElementById('searchInput').value.toLowerCase();
        const rows = document.querySelectorAll('.opp-container-row');
        for(let i =0; i < rows.length; i++){
            const account = rows[i].querySelector('.hidden-name');
            const name = rows[i].querySelector('.name');

            // Check if the search value is inside the account_name of name of the opp
            if(account.innerHTML.toLowerCase().indexOf(inputValue) > -1 || name.innerHTML.toLowerCase().indexOf(inputValue) > -1){
                rows[i].parentElement.style.display = ''
            } else {
                rows[i].parentElement.style.display = 'none'
            }
        }
        const containers = document.querySelectorAll('.account-container');
        for(let i = 0; i < containers.length; i++){
            const [...a] = containers[i].children;
            // Return an array with active rows
            const x = a.filter(el => {
                return el.dataset.row === 'true' && el.style.display !== 'none';
            })

            // Change te count based on active rows
            const span = containers[i].querySelector('.count');
            span.innerHTML = x.length;

            // If there are no rows left don't display the parent
            if(x.length === 0){
                containers[i].style.display = 'none';
            } else {
                containers[i].style.display = '';
                
            }
        }
    })
}

export {searchOpportunities};