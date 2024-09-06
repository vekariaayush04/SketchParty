import { Socket } from "socket.io";
import User from "./User";

export default class Game {
    players: User[];
    private currentDrawerIndex: number;
    private words: string[];
    private currentWord: string;
    private round: number;
    private roundTime: number;
    private gameStarted: boolean;

    constructor(roundTime: number = 60) {
        this.players = [];
        this.currentDrawerIndex = 0; // Start with the first player
        this.words = this.generateWords(); // Generate an array of 50 random words
        this.currentWord = '';
        this.round = 1;
        this.roundTime = roundTime;
        this.gameStarted = false;
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

    removePlayer(socket: Socket) {
        this.players = this.players.filter(player => player.userSocket !== socket);
    }

    start() {
        if (this.players.length === 0) return;
        console.log("game started");
        
        this.gameStarted = true;
        this.startRound();
    }

    private startRound() {
        if (this.round > this.players.length * this.round) {
            this.endGame();
            return;
        }

        this.assignDrawer();
        this.sendWordToDrawer();
        this.startRoundTimer();
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
        // Notify all players that the round has started
        this.players.forEach(player => {
            player.userSocket.emit('roundStart', { round: this.round, time: this.roundTime });
        });

        setTimeout(() => {
            this.endRound();
        }, this.roundTime * 1000);
    }

    handleGuess(player: User, guess: string) {
        if (guess.toLowerCase() === this.currentWord.toLowerCase()) {
            player.userSocket.emit('correctGuess', { word: this.currentWord });
            this.players.forEach(p => {
                if (p !== player) {
                    p.userSocket.emit('otherPlayerGuessed', player.userSocket.id);
                }
            });
            this.endRound();
        } else {
            player.userSocket.emit('incorrectGuess');
        }
    }

    private endRound() {
        this.round++;

        if (this.round <= this.players.length * 3) { // Example: 3 rounds per player
            this.startRound();
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
