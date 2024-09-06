import { Socket } from "socket.io";

export default class User{
    userSocket : Socket
    private score : number

    constructor(socket:Socket){
        this.userSocket = socket
        this.score = 0;
    }
}   