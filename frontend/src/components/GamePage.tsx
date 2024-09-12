import { useEffect, useState } from "react";
import { socket } from "../socket";
import Canvas from "./Canvas";
import ChatMessage from "./ui/ChatMessage";
import UserCard from "./ui/UserCard";
import Spinner from "./ui/Spinner";
import { ThumbsDownIcon } from "./ui/icons/thumbs-down";
import { ThumbsUpIcon } from "./ui/icons/thumbs-up";

type UserData = {
  userName: string;
  score: number;
  userId: string;
};

type ChatData = {
  userId : string,
  message : string,
  type: "guess" | "join" | "left" | "",
}

export default function GamePage() {

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [round,setRound] = useState(1)
  const [user,setUser] = useState<UserData>({
    userName : "",
    userId : "",
    score : 0
  })
  const [isdrawingid, setIsDrawingid] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [word,setWord] = useState("")
  const [timer,setTimer] = useState(0)
  const [chats,setChats] = useState<ChatData[]>([])
  const [message,setMessage] = useState("")
  const [mode,setMode] = useState("break")
  const [winner,setWinner] = useState(null)
  //const [guess,setGuess] = useState(false)


  socket.on("details", (data:UserData[]) => {
    if(data){
      setUsers(data);
      const currUser = data.find((elem) => socket.id === elem.userId)
      setUser(currUser!)
    }
  });

  useEffect(()=>{
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
  },[])

  socket.on("word", (data) => {
    console.log(data);
      setWord(data)
  });

  socket.on("round",(data) => {
    if(data){
      console.log(data);
      setRound(data.round)      
    }
  }) 

  socket.on("roundTimer",(data) => {
    if(data){
      setTimer(data.time)
      setMode(data.type)
    }
  }) 
 
  useEffect(() => {
    if (users.length === 3 && chats.length < 3) {
      const newChats : ChatData[] = users.map((user) => ({
        message: `${user.userName} joined the Room !!!`,
        type: "join",
        userId : user.userId
      }));
      setChats([...chats, ...newChats]);
    }
  }, [users]);
  
  socket.on("gameStart", (data) => {
    setIsGameStarted(data);
  });

  socket.on("chat",(data)=>{
    console.log(data);
    setChats([...chats,{
      userId:data.userId,
      message:data.message,
      type:data.type
    }])
  })

  function sendMessage() {
    socket.emit("message",{
      type : "guess",
      userId : socket.id,
      message : message,
      chatType : "guess",
      userName : user.userName
    })
  }
  
  socket.on("correctGuess",(data) =>{
    if(data){
      setChats([...chats,{
        userId : data.userId,
        message : `${data.userName} guessed the word`,
        type : "guess"
      }])
      if(data.userId === socket.id){
        setUser({...user,score:data.score})
      }
    }
  })

  socket.on("gameEnd", (data) => {
    if(data){
      setMode("ended")
      setWinner(data.winner)
    }
  });

  socket.on("updatedScores", (data) => {
    if(data){
      setUsers(data)
    }
  });


  socket.on("incorrectGuess",(data) =>{
    if(data){
      setChats([...chats,{
        userId : data.userId,
        type : data.type,
        message : `${data.userName} : ${data.message}`
      }])
    }
  })

  if (isGameStarted) {
    return (
      <div className="flex h-screen">
        <div className="w-[250px] bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold countdown">
              {timer}
            </div>
            <div className="text-lg">Round {round} of 3</div>
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
          <div className="w-[780px] p-4 bg-gray-200 flex items-center justify-between top-0 fixed">
            {isDrawing ? (<div className="text-lg font-bold">DRAW THIS</div>) : (<div className="text-lg font-bold">GUESS THIS</div>)}
            {isDrawing ? (<div className="text-2xl" >{word}</div>) : (<div className="text-2xl">_a_a_a</div>)}
            
            <div className="flex space-x-2">
              <button className="text-green-500">
                <ThumbsUpIcon className="w-6 h-6" />
              </button>
              <button className="text-red-500">
                <ThumbsDownIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div>
          {mode === "running" ? (<Canvas isdrawing={isDrawing} />) : (<div>Game will start soon ...</div>)}
          {mode === "ended" && (
            <div>Winner is {winner}</div>
          )}
          </div>
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
          {!isDrawing && (<div className="mt-4 flex border-2 ">
            <input
              type="text"
              placeholder="Type your guess here..."
              className="w-full p-2 border rounded"
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>)}
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
