import { useEffect, useState } from "react";
import { socket } from "../socket";
import Canvas from "./Canvas";
import UserCard from "./ui/UserCard";
import Spinner from "./ui/Spinner";
import { ThumbsDownIcon } from "./ui/icons/thumbs-down";
import { ThumbsUpIcon } from "./ui/icons/thumbs-up";
import Countdown from "./ui/Countdown";
import ChatBar from "./ui/ChatBar";

type UserData = {
  userName: string;
  score: number;
  userId: string;
};

export type ChatData = {
  userId: string;
  message: string;
  type: "guess" | "join" | "left" | "";
};

export default function GamePage() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [round, setRound] = useState(1);
  const [user, setUser] = useState<UserData>({
    userName: "",
    userId: "",
    score: 0,
  });
  const [isdrawingid, setIsDrawingid] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [word, setWord] = useState("");
  const [chats, setChats] = useState<ChatData[]>([]);
  const [mode, setMode] = useState("break");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    socket.on("details", (data: UserData[]) => {
      if (data) {
        setUsers(data);
        const currUser = data.find((elem) => socket.id === elem.userId);
        if (currUser) {
          setUser(currUser);
        }
      }
    });

    socket.on("newDrawer", (data) => {
      if (data) {
        setIsDrawingid(data);
        setIsDrawing(socket.id === data);
      }
    });

    socket.on("word", setWord);
    
    socket.on("round", (data) => {
      if (data) {
        setRound(data.round);
        setMode(data.type)
      }
    });


    socket.on("gameStart", setIsGameStarted);
    
    socket.on("gameEnd", (data) => {
      if (data) {
        setMode("ended");
        setWinner(data.winner);
      }
    });

    socket.on("updatedScores", (data) => {
      if (data) {
        setUsers(data);
      }
    });


    return () => {
      socket.off("details");
      socket.off("newDrawer");
      socket.off("word");
      socket.off("round");
      socket.off("roundTimer");
      socket.off("gameStart");
      socket.off("gameEnd");
      socket.off("updatedScores");
    };
  }, []);

  useEffect(() => {
    if (users.length === 3 && chats.length < 3) {
      const newChats: ChatData[] = users.map((user) => ({
        message: `${user.userName} joined the Room !!!`,
        type: "join",
        userId: user.userId,
      }));
      setChats((prevChats) => [...prevChats, ...newChats]);
      console.log(chats);
    }
  }, [users]);

  if (isGameStarted) {
    return (
      <div className="max-h-screen max-w-screen box-border">
        <div className="max-w-screen bg-gray-200 grid grid-cols-5 top-0 mx-3 mt-2 rounded-lg h-16">
          {/* Header */}
          <div className="flex gap-20 col-span-1 items-center">
            <div className="ml-3 text-2xl font-bold countdown rounded-full size-10 justify-center flex items-center bg-slate-400">
              <Countdown/>
            </div>
            <div className="text-lg">Round {round} of 3</div>
          </div>
          <div className="col-span-3 mt-2 text-center">
            <div className="text-xs font-semibold">
              {isDrawing ? "DRAW THIS" : "GUESS THIS"}
            </div>
            <div className="text-2xl">{isDrawing ? word : "_a_a_a"}</div>
          </div>
          <div className="flex space-x-3 col-span-1 justify-end mr-10">
            <button className="text-green-500">
              <ThumbsUpIcon className="w-7 h-6" />
            </button>
            <button className="text-red-500">
              <ThumbsDownIcon className="w-7 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5">
          {/* Sidebar */}
          <div className="bg-gray-100 p-4 col-span-1 mt-5 ml-3 rounded-lg border-2 h-[550px]">
            <div className="mt-4 space-y-2">
              {users.map((player, index) => (
                <UserCard
                  key={player.userId}
                  index={index}
                  name={player.userName}
                  points={player.score}
                  isDrawingId={isdrawingid}
                  userId={player.userId}
                />
              ))}
            </div>
          </div>
          {/* Main canvas */}
          <div className="bg-white col-span-3">
            {mode === "running" ? (
              <Canvas isdrawing={isDrawing} />
            ) : (
              <div>Game will start soon ...</div>
            )}
            {mode === "ended" && <div>Winner is {winner}</div>}
          </div>
          {chats.length === 3 && (
            <ChatBar username={user.userName} chatProps={chats} isDrawingProps={isDrawing}/>
          )}
        </div>
      </div>
    );
  }

  return <Spinner />;
}
