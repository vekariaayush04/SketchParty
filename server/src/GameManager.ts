import { Socket } from "socket.io";
import Game from "./Game";
import User from "./User";
import { INIT_GAME } from "./message";

export default class GameManager {
    private games: Game[];
    private users: User[];
    private pendingUsers: User[];

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUsers = [];
    }

    addUser(socket: Socket) {
        const user = new User(socket);
        this.users.push(user);
        this.pendingUsers.push(user);
        this.handleMessage(socket);
    }

    removeUser(socket: Socket) {
        this.users = this.users.filter(user => user.userSocket !== socket);
        this.pendingUsers = this.pendingUsers.filter(user => user.userSocket !== socket);
    }

    createGame() {
        if (this.pendingUsers.length >= 5) {
            const players = this.pendingUsers.splice(0, 5);
            const newGame = new Game(players);
            this.games.push(newGame);
            newGame.start();
        }
    }

    handleMessage(socket: Socket) {
        socket.on("message", (data) => {
            const message = data
            console.log(message);
            
            if (message.type === INIT_GAME) {
                this.createGame();
            }
        });
    }
}