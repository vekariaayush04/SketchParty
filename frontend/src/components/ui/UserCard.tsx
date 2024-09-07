
const UserCard = ({index, name , points} : {
    index:number
    name :string,
    points : number
}) => {
  return (
    <div key={index} className="flex items-center space-x-2 border border-slate-800">
    <img src="/placeholder.svg" alt={name} className="w-10 h-10 rounded-full" />
    <div>
      <div className="font-bold">{name}</div>
      <div className="text-sm text-gray-500">{points} points</div>
    </div>
  </div>
  )
}

export default UserCard