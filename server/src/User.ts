import { Socket } from "socket.io";

export default class User{
    userSocket : Socket
    userName : string
    private score : number

    constructor(socket:Socket){
        this.userSocket = socket
        this.score = 0;
        this.userName = ""
    }

    addUserName(username:string){
        this.userName = username
    }
}   