import { useState } from "react";
import { socket } from "../socket";
import Canvas from "./Canvas";
import ChatMessage from "./ui/ChatMessage";
import UserCard from "./ui/UserCard";
import Spinner from "./ui/Spinner";

type UserData = {
  userName: string;
  score: number;
  userId: string;
};

export default function GamePage() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [users, setUsers] = useState<UserData[]>();
  const [isdrawingid, setIsDrawingid] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [word,setWord] = useState("")

  socket.on("details", (data) => {
    setUsers(data);
    ``;
  });

  socket.on("newDrawer", (data) => {
    if (data) {
      setIsDrawingid(data);
      if (socket.id === data) {
        setIsDrawing(true);
        console.log("you are the drawer" + typeof socket.id);
      } else {
        setIsDrawing(false);
      }
    }
  });

  socket.on("word", (data) => {
    console.log(data);
      setWord(data)
  });

  console.log(users);

  //   const users = [
  //     { name: "M3lee", points: 0, avatar: "/placeholder.svg?height=40&width=40" },
  //     { name: "moon", points: 0, avatar: "/placeholder.svg?height=40&width=40" },
  //     { name: "Ghost", points: 0, avatar: "/placeholder.svg?height=40&width=40" },
  //     {
  //       name: "ayush (You)",
  //       points: 0,
  //       avatar: "/placeholder.svg?height=40&width=40",
  //     },
  //     {
  //       name: "Daddy",
  //       points: 0,
  //       avatar: "/placeholder.svg?height=40&width=40",
  //     },
  //     {
  //       name: "Shrota",
  //       points: 0,
  //       avatar: "/placeholder.svg?height=40&width=40",
  //     },
  //     { name: "Krish", points: 0, avatar: "/placeholder.svg?height=40&width=40" },
  //   ];

  const chats = [
    { message: "Krish joined the room!", type: "join" },
    { message: "sapna joined the room!", type: "join" },
    { message: "sapna left the room!", type: "leave" },
    { message: "Ghost: vegeta", type: "chat" },
    {
      message: "Mia joined the room!",
      type: "join",
    },
    {
      message: "Mia left the room!",
      type: "leave",
    },
    {
      message: "Ghost: ani",
      type: "chat",
    },
    { message: "Krish: boy", type: "chat" },
    { message: "Ghost: ani", type: "chat" },
    { message: "CHALU PANDEY joined the room!", type: "join" },
    { message: "CHALU PANDEY left the room!", type: "leave" },
  ];

  socket.on("gameStart", (data) => {
    setIsGameStarted(data);
  });

  if (isGameStarted) {
    return (
      <div className="flex h-screen">
        <div className="w-[250px] bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">29</div>
            <div className="text-lg">Round 1 of 3</div>
          </div>
          <div className="mt-4 space-y-2">
            {users?.map((player, index) => (
              <UserCard
                index={index}
                name={player.userName}
                points={player.score}
                isDrawingId={isdrawingid}
                userId={player.userId}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white flex flex-col items-center justify-center">
          <div className="w-full p-4 bg-gray-200 flex items-center justify-between">
            {isDrawing ? (<div className="text-lg font-bold">DRAW THIS</div>) : (<div className="text-lg font-bold">GUESS THIS</div>)}
            {isDrawing ? (<div className="text-2xl" >{word}</div>) : (<div className="text-2xl">__a___h_</div>)}
            
            <div className="flex space-x-2">
              <button className="text-green-500">
                <ThumbsUpIcon className="w-6 h-6" />
              </button>
              <button className="text-red-500">
                <ThumbsDownIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          {/* <canvas className="w-full h-full border" /> */}
          <Canvas />
        </div>
        <div className="w-[250px] bg-gray-100 p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.map((chat, index) => (
              <ChatMessage
                index={index}
                type={chat.type}
                message={chat.message}
              />
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Type your guess here..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Spinner />
    </div>
  );
}

function ThumbsDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}
