import { useState, useEffect, useRef } from 'react';

const Timer = ({ onNewSolve }) => {
  const [scramble, setScramble] = useState('');
  const preciseTimer = useRef(0);
  const [timerDisplay, setTimerDisplay] = useState(0);
  const timerId = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    setScramble(generateScramble());
    const handleSpacebar = (event) => {
      if (event.code === 'Space') {
        toggleTimer();
      }
    };
    window.addEventListener('keydown', handleSpacebar);
    return () => {
      window.removeEventListener('keydown', handleSpacebar);
    };
  }, []);

  const generateScramble = () => {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scrambleLength = 25;
    let scramble = [];
    let lastMove = '';

    for (let i = 0; i < scrambleLength; i++) {
      let nextMove = moves[Math.floor(Math.random() * moves.length)];
      let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];

      while (nextMove === lastMove) {
        nextMove = moves[Math.floor(Math.random() * moves.length)];
      }

      scramble.push(nextMove + modifier);
      lastMove = nextMove;
    }

    return scramble.join(' ');
  };

  const toggleTimer = () => {
    if (!isRunning.current) {
      isRunning.current = true;
      preciseTimer.current = 0;
      setTimerDisplay(0);
      timerId.current = setInterval(() => {
        preciseTimer.current += 0.01;
        setTimerDisplay((old) => old + 0.01);
      }, 10);
    } else {
      clearInterval(timerId.current);
      isRunning.current = false;
      onNewSolve(preciseTimer.current.toFixed(2));
      setScramble(generateScramble());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-4">{scramble}</h3>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="text-6xl font-bold timer">{timerDisplay.toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default Timer;
