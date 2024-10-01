import { useEffect, useState } from "react";
import { socket } from "../socket";
import Canvas from "./Canvas";
import UserCard from "./ui/UserCard";
import Spinner from "./ui/Spinner";
import ChatBar from "./ui/ChatBar";
import Header from "./ui/Header";

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

    socket.on("round", (data) => {
      if (data) {
        console.log(data);
        setRound(data.round);
        setMode(data.type);
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
    socket.on("newDrawer", (data) => {
      if (data) {
        setIsDrawing(socket.id === data);
      }
    });

    return () => {
      socket.off("newDrawer");
      socket.off("details");
      socket.off("round");
      socket.off("roundTimer");
      socket.off("gameStart");
      socket.off("gameEnd");
      socket.off("updatedScores");
    };
  }, []);

  useEffect(() => {
    if (users.length === 5 && chats.length < 5) {
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
      <div className="overflow-hiddenw-screen h-screen box-border bg-gradient-to-b from-blue-800 via-blue-500 to-blue-800">
        {/* desktop */}
        <div>
        <div className="pt-3 hidden md:block">
          <Header round={round} isDrawing={isDrawing} />
        </div>
        <div className="md:grid md:grid-cols-5 hidden md:mb-3 gap-3">
        
          {/* Sidebar */}
          <div className="border p-4 col-span-1 mt-5 ml-3 rounded-lg  h-[550px] backdrop-blur-lg bg-sky-300/30">
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
          <div className="col-span-3 overflow-hidden">
          <div className=" flex items-center justify-center">
            {mode === "running" ? (
              <Canvas isdrawing={isDrawing} />
            ) : (
              <div>Game will start soon ...</div>
            )}
            <div>{winner}</div>
          </div>
          </div>

          {chats.length === 5 && (
            <ChatBar
              username={user.userName}
              chatProps={chats}
              isDrawingProps={isDrawing}
            />
          )}
        </div>
        </div>
        {/* mobile */}
        <div className="md:hidden h-screen grid grid-rows-10">
          {/* header */}
        <div className="row-span-1">
          <Header round={round} isDrawing={isDrawing} />
        </div>
          {/* Main canvas */}
          <div className="row-span-5 flex items-center justify-center box-border  h-[80%]">
            {mode === "running" ? (
              <Canvas isdrawing={isDrawing} />
            ) : (
              <div className=" flex justify-center items-center text-white">Game will start soon ...</div>
            )}
            <div className="text-white">{winner}</div>
          </div>
          {/* Sidebar */}
          <div className="grid grid-cols-2 gap-2 row-span-4 p-4">
            <div className="border col-span-1  rounded-lg  backdrop-blur-lg bg-sky-300/30">
              <div className="mt-4 space-y-2 overflow-auto p-4 ">
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

            <div className="col-span-1 flex justify-center flex-grow">
            {chats.length === 5 && (
              <ChatBar
                username={user.userName}
                chatProps={chats}
                isDrawingProps={isDrawing}
              />
            )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Spinner />;
}
