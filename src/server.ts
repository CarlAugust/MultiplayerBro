const config = {
    port: { dgram: 2337, app: 80 }, // used for both websocket and app
    rate_limit: 100, // minimum time (ms) between each request per user
    current_id: 0
}

import { Color, Player } from "../types/game-types"

import express, { Express, Request, Response } from "express";
import session from "express-session";
import path from "path";

import http from "http";
import { Server } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);


// Web server

app.use(session({
    secret: "pretty secret",
    resave: false,
    saveUninitialized: false
  }));

app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse urlencoded parameters

app.use(express.static(path.join(__dirname, '../public')));

// Game server

const players: Map<number, Player> = new Map();

io.on('connection', (socket) => {
    console.log("Player connected");

    let player: Player = {
        id: config.current_id,
        x: 500,
        y: 500,
        color: Color.red
    };

    players.set(player.id, player);
    config.current_id++;

    socket.emit("init", JSON.stringify([...players]));

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('move', (data) => {

        const updatingPlayer = players.get(player.id);
        if (updatingPlayer)
        {
            // switch (data)
            // {
            //     case "s":
            //         updatingPlayer.y += 10;
            //         break;
            //     case "w":
            //         updatingPlayer.y -= 10;
            //         break;
            //     case "d":
            //         updatingPlayer.x += 10;
            //         break;
            //     case "a":
            //         updatingPlayer.x -= 10;
            //         break;
            // }
            updatingPlayer.x = data.x;
            updatingPlayer.y = data.y;

            io.emit('update', updatingPlayer);
        }
    });
});

server.listen(config.port.app, () => {
    console.log(`Server is running on http://localhost:${config.port.app}`);
});
