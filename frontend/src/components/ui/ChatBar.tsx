import { useCallback, useEffect, useRef, useState } from "react";
import { ChatData } from "../GamePage";
import ChatMessage from "./ChatMessage";
import { socket } from "../../socket";

const ChatBar = ({
  username,
  chatProps,
  isDrawingProps,
}: {
  username: string;
  chatProps: ChatData[];
  isDrawingProps: boolean;
}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  //const [isDrawing, setIsDrawing] = useState(isDrawingProps);
  const [chats, setChats] = useState<ChatData[]>(chatProps);
  const [message, setMessage] = useState("");

  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats, scrollToBottom]);

  useEffect(() => {
    const handleCorrectGuess = (data: any) => {
      if (data) {
        setChats((prevChats) => [
          ...prevChats,
          {
            userId: data.userId,
            message: `${data.userName} guessed the word`,
            type: "guess",
          },
        ]);
      }
    };

    const handleIncorrectGuess = (data: any) => {
      if (data) {
        setChats((prevChats) => [
          ...prevChats,
          {
            userId: data.userId,
            type: data.type,
            message: `${data.userName}: ${data.message}`,
          },
        ]);
      }
    };

    socket.on("chat", (data) => {
        setChats((prevChats) => [
          ...prevChats,
          {
            userId: data.userId,
            message: data.message,
            type: data.type,
          },
        ]);
      });

    socket.on("correctGuess", handleCorrectGuess);
    socket.on("incorrectGuess", handleIncorrectGuess);

   
    return () => {
      socket.off("correctGuess", handleCorrectGuess);
      socket.off("incorrectGuess", handleIncorrectGuess);
      socket.off("chat")
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", {
        type: "guess",
        userId: socket.id,
        message: message.trim(),
        chatType: "guess",
        userName: username,
      });
      setMessage("");
    }
  };

  return (
    <div className="border p-4 flex flex-col  rounded-lg  justify-end md:h-[550px] backdrop-blur-lg bg-sky-300/30 md:mt-4 md:mr-4">
      <div className="overflow-y-auto space-y-2">
        {chats.map((chat, index) => (
          <ChatMessage key={index} index={index} type={chat.type} message={chat.message} />
        ))}
        <div ref={messageEndRef} />
      </div>
      {!isDrawingProps && (
        <form className="mt-4 flex " onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type your guess here..."
            className="w-full p-2 border rounded"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </form>
      )}
    </div>
  );
};

export default ChatBar;








