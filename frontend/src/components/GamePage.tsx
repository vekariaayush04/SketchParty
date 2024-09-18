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
      <div className="max-w-screen h-screen box-border bg-gradient-to-b from-blue-800 via-blue-500 to-blue-800 flex flex-col  justify-between">
        <div className="pt-3">
          <Header round={round} isDrawing={isDrawing} />
        </div>
        <div className="md:grid md:grid-cols-5 hidden md:mb-3">
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
          <div className="col-span-3 flex items-center justify-center">
            {mode === "running" ? (
              <Canvas isdrawing={isDrawing} />
            ) : (
              <div>Game will start soon ...</div>
            )}
            <div>{winner}</div>
          </div>

          {chats.length === 5 && (
            <ChatBar
              username={user.userName}
              chatProps={chats}
              isDrawingProps={isDrawing}
            />
          )}
        </div>
        <div className="md:hidden flex flex-col justify-center items-center">
          {/* Main canvas */}
          <div className="col-span-3 flex items-center justify-center h-[440px]">
            {mode === "running" ? (
              <Canvas isdrawing={isDrawing} />
            ) : (
              <div className=" flex justify-center items-center">Game will start soon ...</div>
            )}
            <div>{winner}</div>
          </div>
          {/* Sidebar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border col-span-1 mt-5  rounded-lg  backdrop-blur-lg bg-sky-300/30">
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
