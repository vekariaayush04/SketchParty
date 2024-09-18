import { Socket } from "socket.io";
import User from "./User";
import { Chat, DrawingEvent, UserData } from "./types/types";
import { generateWords } from "./utils/Words";

export default class Game {
  players: User[];
  private currentDrawerIndex: number;
  private words: string[];
  private currentWord: string;
  private round: number;
  private turn: number
  private roundTime: number;
  private gameStarted: boolean;
  private chatData: Chat[];

  constructor(roundTime: number = 20) {
    this.players = [];
    this.currentDrawerIndex = 0;
    this.words = generateWords();
    this.currentWord = "";
    this.round = 1;
    this.roundTime = roundTime;
    this.gameStarted = false;
    this.chatData = [];
    this.turn = 0;
  }

  addPlayer(player: User) {
    if (this.players.length < 6 && !this.gameStarted) {
      this.players.push(player);
    }
  }

  hasPlayer(user: User) {
    return this.players.some(
      (player) => player.userSocket.id === user.userSocket.id
    );
  }

  removePlayer(socket: Socket) {
    this.players = this.players.filter(
      (player) => player.userSocket !== socket
    );
    this.getPlayersDetails();
  }

  isGameStarted() {
    this.players.forEach((player) => {
      player.userSocket.emit("gameStart", this.gameStarted);
    });
  }

  start() {
    if (this.players.length === 0) return;
    console.log("game started");

    this.gameStarted = true;
    this.isGameStarted();
    this.startRound();
  }

  getPlayersDetails() {
    const userData: UserData[] = [];

    this.players.forEach((player) => {
      const user: UserData = player.getUserData();
      userData.push(user);
    });

    this.players.forEach((player) => {
      player.userSocket.emit("details", userData);
    });
  }

  startTurn(){
    this.turn ++;

    if(this.turn === 6) {
      this.turn = 0;
      this.endRound()
      return
    }
    
    this.assignDrawer();
    this.sendWordToDrawer();
    this.runBreakTimer();
  }

  private startRound() {
    if (this.round > 3) {
      this.endGame();
      return;
    }

    this.getPlayersDetails();
    this.startTurn()
    // this.startRoundTimer();
  }

  addMessage(chat: Chat) {
    this.chatData.push(chat);

    this.players.forEach((player) => {
      player.userSocket.emit("chat", this.chatData.slice(-1)[0]);
    });
  }

  private assignDrawer() {
   
    this.currentDrawerIndex = this.turn % this.players.length;
    const currentDrawer = this.players[this.currentDrawerIndex];
    console.log("current user is : " + currentDrawer.userName);

    this.players.forEach((player) => {
      player.userSocket.emit("newDrawer", currentDrawer.userSocket.id);
    });
  }

  private sendWordToDrawer() {
    this.currentWord =
      this.words[Math.floor(Math.random() * this.words.length)];
    const currentDrawer = this.players[this.currentDrawerIndex];
    console.log("your word is " + this.currentWord);

    currentDrawer.userSocket.emit("word", this.currentWord);
  }

  private startRoundTimer() {
    let counter: number = this.roundTime;

    this.players.forEach((player) => {
      player.userSocket.emit("round", {
        round: this.round,
        time: this.roundTime,
        type: "running",
      });
    });

    const intervalId = setInterval(() => {
      this.players.forEach((player) => {
        player.userSocket.emit("roundTimer", {
          time: counter,
          type: "running",
        });
      });

      counter--;

      if (counter < 0) {
        clearInterval(intervalId);
        this.players.forEach(p => {
            p.guessed = false;
        })
        this.startTurn()
        // this.runBreakTimer()
        //this.endRound();
        // this.players.forEach(player => {
        //     player.userSocket.emit('round', { round: this.round, time: this.roundTime ,type : "ended"});
        // });
      }
    }, 1000);
  }

  handleDrawingEvent(event: DrawingEvent) {
    this.players.forEach((player) => {
      player.userSocket.emit("drawEvent", event);
    });
  }

  handleGuess(player: User, message: any) {
    if (message.message.toLowerCase() === this.currentWord.toLowerCase() && !player.guessed) {
      //let score = 100;
      let score = player.score;
      player.updateScore(score + 100);
      player.guessed = true;
      this.players.forEach((p) => {
        p.userSocket.emit("correctGuess", {
          userId: player.userId,
          userName: player.userName,
          message: `${player.userName} guessed the word!`,
          score: player.score,
        });
      });
      //this.endRound();
    } else {
      this.players.forEach((player) => {
        player.userSocket.emit("incorrectGuess", {
          userId: message.userId,
          userName: message.userName,
          message: message.message,
          type: message.chatType,
        });
      });
    }
  }

  private runBreakTimer() {
    let buffer: number = 5;
    this.players.forEach((player) => {
        player.userSocket.emit("round", {
          round: this.round,
          time: this.roundTime,
          type: "break",
        });
      });
  
    const bufferId = setInterval(() => {
      this.players.forEach((player) => {
        player.userSocket.emit("roundTimer", { time: buffer });
      });

      buffer--;

      if (buffer < 0) {
        this.updateScores();
        clearInterval(bufferId);
        this.startRoundTimer();
      }
    }, 1000);
  }

  private updateScores() {
    const userData: UserData[] = [];

    this.players.forEach((player) => {
      const user: UserData = player.getUserData();
      userData.push(user);
    });

    this.players.forEach((p) => {
      p.userSocket.emit("updatedScores", userData);
    });
  }

  private endRound() {
    this.round++;

    if (this.round <= 3) {
      this.startRound();
    } else {
      this.endGame();
    }
  }

  private endGame() {
    this.updateScores();
    let winner = "";
    let score = 0;
    this.players.forEach((p) => {
      console.log(p.userName + "score :" + p.score);

      if (score < p.score) {
        score = p.score;
        winner = p.userName;
      }
    });
    this.players.forEach((player) => {
      player.userSocket.emit("gameEnd", { winner: winner });
    });
  }

  private determineWinner(): User | null {
    //todo : add logic
    return null;
  }
}
