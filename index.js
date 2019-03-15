var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var http = require('http');
var conf = require('./conf/conf.json');

var port = conf.port;

//global.Promise = require('bluebird');

var app = express();

// app.use(bodyParser.json({
//     verify: (req, res, buf)=>{
//         req.base64Body = buf.toString('base64');
//     },
// }));
// app.use(bodyParser.raw({
//     verify: (req, res, buf)=>{
//         req.base64Body = buf.toString('base64');
//     },
// }));

app.use(compression());

app.set('port', port);

app.use((req, res, next)=>{
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', require('./routes'));

app.get('/favicon.ico', (req, res) => {
    res.status(204).send('');
});

app.use(function(req, res, next) {
    var err;
    err = new Error('Not Found');
    err.http_status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(2222, err)
    if (err && err.message && err.stack) {
        if (!err.hasOwnProperty('http_status')) {
            err.http_status = err.status || 500;
        }
        if (err.http_msg == null) {
            err.http_msg = err.message;
        }
    }
    else{
        if(!_.isObject(err)){
            err = {str: err};
        }
        err.message = JSON.stringify(err);
    }
    res.status(err.http_status || 500);
    res.send(JSON.stringify({
        message: err.message,
        error: err
    }));
});

var server = http.Server(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('server started');


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
