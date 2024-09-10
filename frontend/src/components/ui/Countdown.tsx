import  { useState, useEffect } from 'react';

const Countdown = ({timer} : {
    timer : number
}) => {
    console.log(timer);
    
    const [timeLeft, setTimeLeft] = useState(timer);
    useEffect(() => {
        setTimeLeft(timer);
      }, [timer]);
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds:any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <h1>Time Left: {formatTime(timeLeft)}</h1>
    </div>
  );
};

export default Countdown;
