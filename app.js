var cors = require('cors');
var compression = require('compression');
var mongoose = require('mongoose');
var config = require('./config');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

// Middlewares
app.use(cors());
app.use(compression());

// To support post requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// DB Connect
mongoose.connect(config.database);

server.listen(config.port, function () {
    console.log('Server listening at port %d',config.port);
});

/* Cualquier ruta */
app.get('/', function (req, res) {
	res.send('Api para estadisticas!');
});

// Routing
//app.use('/uploads', express.static('uploads'));
app.use(require('./modules/login'));
app.use(require('./middlewares/auth')); // Auth Urls
app.use(require('./modules/users'));
app.use(require('./modules/teams'));