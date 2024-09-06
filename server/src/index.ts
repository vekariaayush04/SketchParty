import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import GameManager from "./GameManager";

const app = express();

const corsOptions = {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], 
};
app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
});

const gameManager = new GameManager()

io.on("connection", (socket) => {
    console.log("user connected");

    gameManager.addUser(socket)

    socket.on("disconnect", () => {
        console.log("disconnect");
        gameManager.removeUser(socket)
    });
});

server.listen(3000, () => {
    console.log("server on 3k");
});
