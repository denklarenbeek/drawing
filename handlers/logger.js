const fs = require('fs');

const Logger = exports.Logger = {};

const infoStream = fs.createWriteStream('temp/info.txt', {flags: 'a'});

Logger.info = function(msg, type) {
    const message = type + new Date() + " : " + msg + "\n";
    infoStream.write(message);
};