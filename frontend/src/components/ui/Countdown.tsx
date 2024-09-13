import  { useState } from 'react'
import { socket } from '../../socket';

const Countdown = () => {
  const [timer,setTimer] = useState(0)

  socket.on("roundTimer", (data) => {
    if (data) {
      setTimer(data.time);
      //setMode(data.type);
    }
  });
  return (
    <div>{timer}</div>
  )
}

export default Countdown