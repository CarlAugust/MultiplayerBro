const config = {
    port: { dgram: 2337, app: 80 }, // used for both websocket and app
    rate_limit: 100, // minimum time (ms) between each request per user
    current_id: 0
}

import express, { Express, Request, Response } from "express";
import session from "express-session";
import path from "path";

import http from "http";
import { Server } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);


// App handling

app.use(session({
    secret: "pretty secret",
    resave: false,
    saveUninitialized: false
  }));

app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse urlencoded parameters

app.use(express.static(path.join(__dirname, '../public')));

// Websocket handling

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('action', (data) => {
        io.emit('update', data);
    });

    socket.on('idpls', () => {
        socket.emit('id', config.current_id);
        config.current_id++;
    });
});

server.listen(config.port.app, () => {
    console.log(`Server is running on http://localhost:${config.port.app}`);
});
