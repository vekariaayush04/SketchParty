import Avatar from "boring-avatars"
import pencil from "./../../assets/pencil.svg"
import { generateColors } from "../../util/colorGenerator"

const UserCard = ({index, name , points ,isDrawingId , userId} : {
    index:number
    name :string,
    points : number,
    isDrawingId : string,
    userId : string
}) => {
  return (
    <div key={index} className="grid grid-cols-4 rounded-xl shadow-sm shadow-white" >
       {/* <div key={index} className=" items-center space-x-2  border-slate-800">  */}
        {/* <img src="/placeholder.svg" alt={name} className="w-10 h-10 rounded-full col-span-1 bg-gray-400" /> */}
        <div className="flex items-center justify-center">
        <Avatar name={name} colors={generateColors(5)} variant="beam"  size={40}/>
        </div>
        <div className="col-span-2 pl-3">
          <div className="font-bold text-white">{name}</div>
          <div className="text-sm text-white">{points} points</div>
        </div>
        <div className="col-span-1 flex items-center">
        {isDrawingId === userId  && (
          <img src={pencil} alt="" className="size-5"/>
        )}
        </div>
    </div>
  )
}

export default UserCard