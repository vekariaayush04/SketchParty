
const ChatMessage = ({index ,  type , message} : {
    index:number,
    type : string,
    message : string
}) => {
  return (
    <div
    key={index}
    className={`text-sm ${
      type === "join" ? "text-green-500" : type === "left" ? "text-red-500" : "text-black"
    }`}
  >
    {message}
  </div>
  )
}

export default ChatMessage