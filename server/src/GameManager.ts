import { Socket } from "socket.io";
import Game from "./Game";
import User from "./User";
import { INIT_GAME } from "./message";

export default class GameManager {
    private games: Game[];
    private users: User[];
    private pendingGame: Game | null;

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingGame = null;
    }

    addUser(socket: Socket) {
        const user = new User(socket);
        this.users.push(user);
        //this.addToPendingGame(user);
        this.handleMessage(user);
    }

    removeUser(socket: Socket) {
        this.users = this.users.filter(user => user.userSocket !== socket);

        if (this.pendingGame) {
            this.pendingGame.removePlayer(socket);
            if (this.pendingGame.players.length === 0) {
                this.pendingGame = null; // Reset if no players left
            }
        }

        this.games.forEach(game => game.removePlayer(socket));
        console.log(this.pendingGame);
        
    }

    addToPendingGame(user: User) {
        if (!this.pendingGame) {
            this.pendingGame = new Game();
        }

        this.pendingGame.addPlayer(user);

        if (this.pendingGame.players.length >= 5) {
            this.startGame(this.pendingGame);
            this.pendingGame = null; // Reset pendingGame for next set of players
        }
    }

    startGame(game: Game) {
        this.games.push(game);
        game.start();
    }

    handleMessage(user: User) {
        user.userSocket.on("message", (data,playerName) => {
            const message = data
            console.log(message);
            
            if (message.type === INIT_GAME) {
                user.addUserName(playerName)
                this.addToPendingGame(user)
                console.log(this.pendingGame);            
            }
        });
    }
}