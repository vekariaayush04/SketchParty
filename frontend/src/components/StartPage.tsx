import { useState } from "react";
import { socket } from "../socket";
import bg from "./../assets/bgg.png";
import mobilebg from "./../assets/bgg mobile1.jpg";
import tablet from "./../assets/bgg mobile.jpg";
import GamePage from "./GamePage";
// import Avatar from "boring-avatars";
// import { generateColors } from "../util/colorGenerator";

const StartPage = () => {
  const [playerName, setPlayerName] = useState("");
  const [isPlayed,setIsPlayed] = useState(false)

  const startGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      type: "init_game",
      userName: playerName,
    });

    console.log("Game started with player:", playerName);
    setIsPlayed(true)
    //navigate("/game");
  };

  if(isPlayed){
    return (
      <GamePage/>
    )
  }

  return (
    <div
      className="flex items-center flex-col justify-center h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${bg})`, 
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage: `url(${mobilebg})`,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block lg:hidden"
        style={{
          backgroundImage: `url(${tablet})`,
        }}
      />
      <div className="max-w-80 w-full p-6 sm:p-8 bg-white rounded-lg shadow-lg mt-20 sm:mt-32 relative z-10 sm:mx-10 sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-gray-700">
          Get Ready to Play!
        </h2>
        <form onSubmit={startGame} className="flex flex-col ">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-2 sm:p-3 mb-3 sm:mb-4 text-base sm:text-lg rounded-md border text-black border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          />
          <button
            type="submit"
            className="w-full p-2 sm:p-3 text-base sm:text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-md mb-3 sm:mb-4"
          >
            Play Now
          </button>
          <button
            type="button"
            className="w-full p-2 sm:p-3 text-sm sm:text-lg text-gray-700 bg-blue-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartPage;
