function deleteAllOppsByUser(el){
    if(!el) return;

    const btns = document.querySelectorAll('.deleteOpps');
    btns.forEach(el => {
        el.addEventListener('click', function(e){
            e.preventDefault();
            const userid = el.dataset.userid;
            axios.post(`/api/v1/deleteAllOppsByUser/${userid}`)
                .then(res => {
                    console.log('res');
                })
                .catch(err => {
                    if(err) console.log(err);
                })
        })
    })

};


export {deleteAllOppsByUser};
