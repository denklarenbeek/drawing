import axios from "axios";
import {createFlash} from './flashes';

function updateCronJobTimer(el){
    if(!el) return
    const inputField = document.getElementById('cron_jobs_timer');
    inputField.addEventListener('change', function(e){
        const val = this.value;
        axios
            .post('/api/v1/user/timer', {cron_jobs_timer: val})
            .then(res => {
                createFlash(res.data.code, `Succesfuly change timer for ${res.data.doc.name}`)
            })
            .catch(err => {
                createFlash(1, err)
            });
    })
}

function updateCronJobDays(el){
    if(!el) return
    const inputFields = document.querySelectorAll('.cron-job-day');
    inputFields.forEach(el => {
        el.addEventListener('change', function(e){
            const nameString = this.dataset.day;
            console.log(nameString);
            const cron_job_days = {};
            cron_job_days[nameString] = this.checked;
            axios
                .post('/api/v1/user/days', cron_job_days)
                .then(res => {
                    console.log(res)
                    createFlash(res.data.code, `Succesfuly changed day`)
                })
                .catch(err => {
                    createFlash(1, err)
                })
        })
    })
}

function updateCronJobActive(el){
    if(!el) return
    const inputField = document.querySelector('#cron_jobs');
    inputField.addEventListener('change', function(e){

        const days = document.querySelector('.job-day');
        const day = document.querySelector('.job-days');

        if(days.classList.contains('open') && day.classList.contains('open')){
            day.classList.remove('open');
            days.classList.remove('open');
        }

        const val = this.checked;

        if(!val){
            const inputFields = document.querySelectorAll('.cron-job-day');
            const inputField = document.querySelector('#cron_job_timer');
            inputFields.forEach(el => {
                el.checked = false;
            })
            inputField.value = 0;
        }

        if(val){
            day.classList.add('open');
            days.classList.add('open');
        }

        axios
            .post('/api/v1/user/cronjob', {cron_jobs: val})
            .then(res => {
                console.log(res.data);
                createFlash(res.data.code, 'Succesfully change active job')
            })
            .catch(err => {
                createFlash(1, err);
            });
    });
};

export {updateCronJobTimer, updateCronJobDays, updateCronJobActive}