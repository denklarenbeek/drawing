const accounting = require('accounting');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

exports.menu = [
    { slug: '/', title: 'home', icon: 'home', },
    { slug: '/drawing', title: 'drawing', icon: 'paper-plane', },
    { slug: '/pcf', title: 'pricecast', icon: 'euro-sign', },
    { slug: '/create-pcf', title: 'create pcf', icon: 'file-contract', },
    { slug: '/opportunities', title: 'opportunities', icon: 'file-invoice-dollar', },
    { slug: '/register', title: 'register', icon: 'user-plus', },
    { slug: '/logout', title: 'logout', icon: 'lock', }
];

exports.formatCurrency = function(number){
    return accounting.formatMoney(number, "€", 0, ".", ",")
};

exports.dump = (obj) => JSON.stringify(obj, null, 2);
