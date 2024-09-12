import { useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import bg from "./../assets/bgg.png"; // Import the background image

const StartPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  const startGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", { 
      type: "init_game",
      userName: playerName,
    });

    console.log("Game started with player:", playerName);
    navigate("/game");  
  };

  return (
    <div
      className="flex items-center flex-col justify-center h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bg})` }} // Apply the background image
    >
     
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-40">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Get Ready to Play!
        </h2>
        <form onSubmit={startGame} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-3 mb-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          />
          <button
            type="submit"
            className="w-full p-3 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-md mb-4"
          >
            Play Now
          </button>
          <button
            type="submit"
            className="w-full p-3 text-lg text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartPage;
