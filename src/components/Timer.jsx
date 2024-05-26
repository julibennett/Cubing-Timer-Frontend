import { useState, useEffect, useRef } from 'react';

const Timer = ({ onNewSolve }) => {
  const [scramble, setScramble] = useState('');
  const preciseTimer = useRef(0);
  const [timerDisplay, setTimerDisplay] = useState(0);
  const timerId = useRef(null);
  const isRunning = useRef(false);
  const isPressed = useRef(false);

  useEffect(() => {
    setScramble(generateScramble());

    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !isPressed.current) {
        isPressed.current = true;
        if (!isRunning.current) {
          setTimerDisplay(0);
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space' && isPressed.current) {
        isPressed.current = false;
        if (!isRunning.current) {
          startTimer();
        } else {
          stopTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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

  const startTimer = () => {
    isRunning.current = true;
    preciseTimer.current = 0;
    timerId.current = setInterval(() => {
      preciseTimer.current += 0.01;
      setTimerDisplay((old) => old + 0.01);
    }, 10);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
    isRunning.current = false;
    const newSolve = parseFloat(preciseTimer.current.toFixed(2));
    onNewSolve(newSolve);
    setScramble(generateScramble());
  };

  return (
    <div className="flex flex-col items-center justify-start h-full bg-gray-100 mt-10">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold mb-3">{scramble}</h3>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="font-bold timer text-6xl">{timerDisplay.toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default Timer;
