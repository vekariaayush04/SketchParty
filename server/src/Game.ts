import { Socket } from "socket.io";
import User from "./User";
import { Chat } from "./Chat";

interface UserData {
    userId : string,
    userName : string,
    score : number
}

type DrawingEvent = {
    Drawingtype: 'start' | 'draw' | 'end' | "clear"
    x: number
    y: number
    color: string
  }

export default class Game {
    players: User[];
    private currentDrawerIndex: number;
    private words: string[];
    private currentWord: string;
    private round: number;
    private roundTime: number;
    private gameStarted: boolean;
    private chatData : Chat[];

    constructor(roundTime: number = 60) {
        this.players = [];
        this.currentDrawerIndex = 0; // Start with the first player
        this.words = this.generateWords(); // Generate an array of 50 random words
        this.currentWord = '';
        this.round = 1;
        this.roundTime = roundTime;
        this.gameStarted = false;
        this.chatData = []
    }

    private generateWords(): string[] {
        const wordList = [
            "apple", "banana", "grape", "orange", "pear", "pineapple", "strawberry", "watermelon", "cherry", "blueberry",
            "car", "bus", "train", "airplane", "bicycle", "motorcycle", "truck", "boat", "submarine", "helicopter",
            "house", "apartment", "castle", "cottage", "mansion", "tent", "igloo", "lighthouse", "skyscraper", "villa",
            "dog", "cat", "elephant", "giraffe", "lion", "tiger", "bear", "monkey", "zebra", "kangaroo",
            "book", "pen", "notebook", "pencil", "eraser", "ruler", "scissors", "glue", "marker", "crayon"
        ];

        return wordList.sort(() => Math.random() - 0.5); // Shuffle the words array
    }

    addPlayer(player : User){
        if(this.players.length < 6 && !this.gameStarted){
            this.players.push(player)
        }
    }

    hasPlayer(user:User){
        return this.players.some(player => player.userSocket.id === user.userSocket.id)
    }

    removePlayer(socket: Socket) {
        this.players = this.players.filter(player => player.userSocket !== socket);
        this.getPlayersDetails()
    }

    isGameStarted(){
        this.players.forEach((player) => {
            player.userSocket.emit("gameStart",this.gameStarted)
        })
    }

    start() {
        if (this.players.length === 0) return;
        console.log("game started");
        
        this.gameStarted = true;
        this.isGameStarted();
        this.startRound();
    }

    getPlayersDetails(){
        const userData : UserData[]  = [];

        this.players.forEach(player => {
            const user : UserData = player.getUserData()
            userData.push(user)
        })

        this.players.forEach(player => {
            player.userSocket.emit('details', userData);
        });
    }

    private startRound() {
        if (this.round > 3) {
            this.endGame();
            return;
        }
        this.getPlayersDetails()
        this.assignDrawer();
        this.sendWordToDrawer();
        this.startRoundTimer();
    }

    addMessage(chat : Chat){

        this.chatData.push(chat)

        this.players.forEach(player => {
            player.userSocket.emit('chat', this.chatData.slice(-1)[0]);
        });

    }

    sendMessage(){

    }

    private assignDrawer() {
        this.currentDrawerIndex = this.round % this.players.length;
        const currentDrawer = this.players[this.currentDrawerIndex];
        console.log("current user is : " + currentDrawer.userName);
        
        // Notify all players about the new drawer
        this.players.forEach(player => {
            player.userSocket.emit('newDrawer', currentDrawer.userSocket.id);
        });
    }

    private sendWordToDrawer() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        const currentDrawer = this.players[this.currentDrawerIndex];
        console.log("your word is " + this.currentWord);
        
        currentDrawer.userSocket.emit('word', this.currentWord);
    }

    private startRoundTimer() {
        let counter: number = this.roundTime;
    
        // Notify all players that the round has started
        this.players.forEach(player => {
            player.userSocket.emit('round', { round: this.round, time: this.roundTime });
        });
    
        const intervalId = setInterval(() => {
            console.log(counter);
    
            // Emit the current timer value to all players
            this.players.forEach(player => {
                player.userSocket.emit('roundTimer', { time: counter , type : "running"});
            });
    
            counter--;
    
            // Check if the timer has reached 0
            if (counter < 0) {
                clearInterval(intervalId); // Clear the interval to stop the timer
                this.endRound(); // End the round
            }
        }, 1000);
    }
    

    // Add this method to handle drawing events
    handleDrawingEvent(event: DrawingEvent) {
        this.players.forEach(player => {
            player.userSocket.emit('drawEvent', event);
        });
    }

    handleGuess(player: User, guess: string) {
        if (guess.toLowerCase() === this.currentWord.toLowerCase()) {
            player.userSocket.emit('correctGuess', { word: this.currentWord });
            this.players.forEach(p => {
                if (p !== player) {
                    p.userSocket.emit('otherPlayerGuessed', player.userSocket.id);
                }
            });
            //this.endRound();
        } else {
            player.userSocket.emit('incorrectGuess');
        }
    }

    private endRound() {
        this.round++;
        let buffer:number = 15;
        if (this.round <= this.players.length * 3) {
             // Example: 3 rounds per player
            const bufferId = setInterval(() => {
                this.players.forEach(player => {
                    player.userSocket.emit('roundTimer', { time: buffer , type: "break" });
                });
        
                buffer--;
        
                // Check if the timer has reached 0
                if (buffer < 0) {
                    clearInterval(bufferId); // Clear the interval to stop the timer
                    this.startRound(); // End the round
                }
            },1000)
            //this.startRound();
        } else {
            this.endGame();
        }
    }

    private endGame() {
        // Logic to handle end of game, e.g., send scores, declare winner, etc.
        this.players.forEach(player => {
            player.userSocket.emit('gameEnd', { winner: this.determineWinner() });
        });
    }

    private determineWinner(): User | null {
        // Implement logic to determine the winner based on scores, etc.
        return null; // Placeholder logic
    }
}
