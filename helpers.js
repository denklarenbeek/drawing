// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

exports.menu = [
    { slug: '/', title: 'home', icon: 'home', },
    { slug: '/pcf', title: 'pricecast', icon: 'euro-sign', },
    { slug: '/create-pcf', title: 'create pcf', icon: 'file-contract', },
    { slug: '/opportunities', title: 'opportunities', icon: 'file-invoice-dollar', },
    { slug: '/register', title: 'register', icon: 'user-plus', },
    { slug: '/logout', title: 'logout', icon: 'lock', }
];

exports.formatCurrency = function(number){
    return number.replace(/\d(?=(\d{3})+\.)/g, '€&,');
};
