(function () {
    'use strict';
    
    require('app-module-path').addPath(__dirname);
    
    let express = require('express');
    let app = express();
    let bodyParser = require('body-parser');
    let mongoose = require('mongoose');

    mongoose.connect('localhost:27017/jellypizzahack');

    let main = require('routes/main');
    let participants = require('routes/participants');
    let teams = require('routes/teams');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    let port = process.env.PORT || 3000;

    app.use('/', main);
    app.use('/participants', participants);
    app.use('/teams', teams);

    app.listen(port);
    console.log('Listening on port: ' + port);
})();