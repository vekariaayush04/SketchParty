
const ChatMessage = ({index ,  type , message} : {
    index:number,
    type : string,
    message : string
}) => {
  return (
    <div
    key={index}
    className={`text-sm ${
      type === "join" ? "text-green-500 bg-green-100" : type === "left" ? "text-red-500 bg-red-100" : "text-white "
    } h-10 flex items-center pl-5 rounded-lg shadow-lg shadow-slate-40`}
  >
    {message}
  </div>
  )
}

export default ChatMessage