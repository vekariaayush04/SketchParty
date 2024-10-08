import { Socket } from "socket.io";

export default class User {
    userSocket: Socket;
    userId : string
    userName: string;
    score: number;
    guessed : boolean

    constructor(socket: Socket) {
        this.userSocket = socket;
        this.userId = socket.id
        this.score = 0;
        this.userName = "";
        this.guessed = false
    }

    addUserName(username: string) {
        this.userName = username;
    }

    updateScore(score: number){
        this.score = score
    }

    getUserData() {
        return {
            userId : this.userId,
            userName: this.userName,
            score: this.score
        };
    }
}
