import { Socket } from "socket.io";

export default class User {
    userSocket: Socket;
    userId : string
    userName: string;
    private score: number;

    constructor(socket: Socket) {
        this.userSocket = socket;
        this.userId = socket.id
        this.score = 0;
        this.userName = "";
    }

    addUserName(username: string) {
        this.userName = username;
    }

    getUserData() {
        return {
            userId : this.userId,
            userName: this.userName,
            score: this.score
        };
    }
}
