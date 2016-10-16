// server.js
'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
}
else {
    // dependencies
    var app_root = __dirname;
    var express = require('express');
    var bodyParser = require('body-parser');
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync('./config/server.json'));

    // configure the server
    // create the express app
    var app = express();
    var router = express.Router();

    // parses request body -- available in request.body
    console.log(config);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(config.baseURL, router);

    router.get('/', (req, res) => {
            res.send('hello world from worker $process.pid');
    });

    // all routes anchored at / .. here you can change the base URL
    // app.use(config.baseURL, router);

    // start the server
    const server = app.listen(config.port, () => {
      console.log(`App is running at: localhost:${server.address().port}`);
    });
}
