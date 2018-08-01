import { isMoment } from "../../../node_modules/moment";

function createPelement(nameOfClass, value){
    const p = document.createElement('p');
    p.className = nameOfClass;
    p.innerHTML = value;
    return p;
}

function createDivElement(nameOfClass){
    const div = document.createElement('div');
    div.className = nameOfClass;
    return div;
}

function showHistoryOpp(el){
    if(!el) return
    const oppContainers = document.querySelectorAll('.opp-container');
    for(let i=0; i < oppContainers.length; i++){
        oppContainers[i].addEventListener('click', function(e) {
            if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'i'){
                return
            }
            if(this.classList.contains('open')){
                this.classList.remove('open');
                return
            }
            if(this.children.length > 1){
                this.classList.add('open');
                return
            }
            const id = oppContainers[i].dataset.customid;
            axios
                .get(`/api/v1/getHistoricalOpp/${id}`)
                .then(res => {
                    const parentDiv = createDivElement('opp-container-historic');
                    for(let i=0; i < res.data.length; i++) {
                        const newdate = moment(res.data[i].timing).format("Q")
                        const modDate = `Q${newdate}`;
                        const newElement = createDivElement('opp-container-row');
                        const nameElement = createPelement('name', res.data[i].name);
                        const amountElement = createPelement('amount', res.data[i].amount);
                        const scotsmanElement = createPelement('scotsman', res.data[i].scotsman);
                        const weightedElement = createPelement('weighted_amount', res.data[i].weighted_amount);
                        const monthElement = createPelement('month', modDate);
                        newElement.appendChild(nameElement);
                        newElement.appendChild(amountElement);
                        newElement.appendChild(scotsmanElement);
                        newElement.appendChild(weightedElement);
                        newElement.appendChild(monthElement);
                        parentDiv.appendChild(newElement);
                    }
                    this.appendChild(parentDiv);
                    this.classList.add('open');
                })
                .catch(err => {
                    console.log(err);
                })
        })
    };
}

export {showHistoryOpp}