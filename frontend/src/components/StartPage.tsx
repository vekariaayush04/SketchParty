import { useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  const startGame = (e: any) => {
    e.preventDefault();

    socket.emit("message", { 
      type: "init_game",
      userName : playerName,
    });

    console.log("Game started with player:", playerName);
    navigate("/game");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Start Your Game
        </h1>
        <form onSubmit={startGame} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-3 mb-4 text-lg rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 text-lg rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartPage;
