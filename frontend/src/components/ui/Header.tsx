import { useEffect, useState } from "react"
import Countdown from "./Countdown"
import { ThumbsDownIcon } from "./icons/thumbs-down"
import { ThumbsUpIcon } from "./icons/thumbs-up"
import { socket } from "../../socket"

const Header = ({round , isDrawing} : {
    round : number,
    isDrawing : boolean
}) => {
    const [word, setWord] = useState("");
    

    useEffect(()=>{
        socket.on("word", setWord);
        
        
  
        return () => {
            socket.off("word")
            
        }
    })
  return (
    <div className="max-w-screen grid grid-cols-5 mx-3 rounded-lg h-16 border backdrop-blur-lg bg-sky-300/30">
          {/* Header */}
          <div className="flex md:gap-20 gap-10 col-span-1 items-center">
            <div className="ml-5 md:ml-3 text-2xl font-bold countdown rounded-full size-10 justify-center flex items-center md:bg-gray-300">
              <Countdown/>
            </div>
            <div className="md:text-lg bg-gray-300 md:h-10 flex items-center justify-center md:px-2 rounded-xl text-xs px-3">Round {round} of 3</div>
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
  )
}

export default Header