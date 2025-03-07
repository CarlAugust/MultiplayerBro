const config = {
    port: { dgram: 2337, app: 80 }, // used for both websocket and app
    rate_limit: 100, // minimum time (ms) between each request per user
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

    socket.on('message', (data) => {
        console.log('Message from client:', data);
        io.emit('message', data);
    });
});

server.listen(config.port.app, () => {
    console.log(`Server is running on http://localhost:${config.port.app}`);
});
