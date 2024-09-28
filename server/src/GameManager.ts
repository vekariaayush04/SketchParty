import { Socket } from "socket.io";
import Game from "./Game";
import User from "./User";
import { DRAW, GUESS, INIT_GAME } from "./message";

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
        this.handleMessage(user);
    }

    

    removeUser(socket: Socket) {
        const leavingUser = this.users.find(user => user.userSocket === socket);
        this.users = this.users.filter(user => user.userSocket !== socket);

        if (this.pendingGame) {
            this.pendingGame.removePlayer(socket);
            if (this.pendingGame.players.length === 0) {
                this.pendingGame = null; 
            }
        }

        this.games.forEach((game)=>{
            if(game.hasPlayer(leavingUser!)){
                game.removePlayer(socket)
                game.addMessage({
                    userId: leavingUser!.userId,
                    message: `${leavingUser!.userName} left the Room`,
                    type: "left"
                });
            }
        })


        console.log(this.pendingGame);
        
    }

    addToPendingGame(user: User) {
        if (this.pendingGame && this.pendingGame.hasPlayer(user)) {
            console.log(`User ${user.userName} is already in the pending game.`);
            return;
        }
        
        const activeGame = this.games.find(game => game.hasPlayer(user));
        if (activeGame) {
            console.log(`User ${user.userName} is already in an active game.`);
            return;
        }

        if (!this.pendingGame) {
            this.pendingGame = new Game();
        }

        this.pendingGame.addPlayer(user);

        if (this.pendingGame.players.length >= 5) {
            this.startGame(this.pendingGame);
            this.pendingGame = null; 
        }
    }


    startGame(game: Game) {
        this.games.push(game);
        //const gameId = `game:${game.gameId}`;
        //const data = JSON.stringify(game.toJSON())
        //await client.set(gameId,data)
        //console.log(game);
        
        game.start();
    }

    handleMessage(user: User) {
        user.userSocket.on("message", (data) => {
            const message = data
            console.log(message);
            
            if (message.type === INIT_GAME) {
                user.addUserName(message.userName);
                this.addToPendingGame(user);
                this.pendingGame?.isGameStarted();         
            }

            if (message.type === GUESS) {
                const game = this.games.find((game) => game.hasPlayer(user))
                // game?.addMessage({
                //     userId : message.userId,
                //     message : message.message,
                //     type : message.chatType
                // })
                game?.handleGuess(user,message)
            }

            if (message.type === DRAW) {
                const game = this.games.find((game) => game.hasPlayer(user))
                game?.handleDrawingEvent(message.event)
            }
        });
    }
}