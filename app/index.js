const http = require('http');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
const Worker = require('./worker');

(async () => {
    console.info(`The server is start, pid#${process.pid}, ts#${Date.now()}`);
    process.on('exit', () => {
        console.info(`The server is stop, pid#${process.pid}, ts#${Date.now()}`);
    });

    process.on('message', message => {
        console.info('message', message);
    });

    try {
        const app = express();
        app.use(compression());
        app.use(bodyParser.json({ limit: '16mb' }));
        routes(app);
        console.info(`The server is running at ${config.serverHost}:${config.serverPort}`);
        const server = http.createServer(app);
        await new Promise((resolve, reject) => {
            server.on('error', reject);
            server.listen(config.serverPort, config.serverHost, resolve);
        });
        console.info(`The server is listening at ${server.address().address}:${server.address().port}`);

        const worker = new Worker();
        worker.start();
        try {
            const reason = await new Promise((resolve) => {
                process.on('SIGINT', () => resolve('interrupted'));
                process.on('SIGTERM', () => resolve('terminated'));
            });
            console.info(`The server is ${reason}, pid#${process.pid}, ts#${Date.now()}`);
        } finally {
            worker.stop();
            server.close();
        }
    } finally {
        // finalizers
    }
})();

