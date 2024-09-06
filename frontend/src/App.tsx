import React, { useState } from 'react';
import { socket } from './socket';

export default function App() {
  const [playerName, setPlayerName] = useState('');

  const startGame = (e:any) => {
    e.preventDefault(); // Prevents form submission from reloading the page
    
    // Emit the 'init_game' event to the server
    socket.emit('message', {"type" : "init_game"});

    console.log('Game started with player:', playerName);
  };

  return (
    <div>
      <form onSubmit={startGame}>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)} 
        />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
}