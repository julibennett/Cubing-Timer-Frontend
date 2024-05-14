import { useState, useEffect, useRef } from 'react'

const Timer = ({ onNewSolve }) => {
    const [scramble, setScramble] = useState('')
    const preciseTimer = useRef(0); // Holds precise timer value without causing re-renders
    const [timerDisplay, setTimerDisplay] = useState(0);
    const timerId = useRef(null); // This holds the interval ID
    const isRunning = useRef(false); // Track running state


    useEffect(() => {
        setScramble(generateScramble())
        const handleSpacebar = (event) => {
            if (event.code === 'Space') {
                toggleTimer();
            }
        };
        window.addEventListener('keydown', handleSpacebar)
        return () => {
            window.removeEventListener('keydown', handleSpacebar)
        }
    }, [])

    const generateScramble = () => {
        const moves = ['U', 'D', 'L', 'R', 'F', 'B']
        const modifiers = ['', '\'', '2']
        const scrambleLength = 25
        let scramble = []
        let lastMove = ''
    
        for (let i = 0; i < scrambleLength; i++) {
            let nextMove = moves[Math.floor(Math.random() * moves.length)]
            let modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
    
            
            while (nextMove === lastMove) {
                nextMove = moves[Math.floor(Math.random() * moves.length)]
            }
    
            scramble.push(nextMove + modifier)
            lastMove = nextMove
        }
    
        return scramble.join(' ')
    }

    const toggleTimer = () => {
        if (!isRunning.current) {
            isRunning.current = true;
            preciseTimer.current = 0; // Reset precise timer
            setTimerDisplay(0); // Also reset the display timer
            timerId.current = setInterval(() => {
                preciseTimer.current += 0.01;
                setTimerDisplay(old => old + 0.01); // Update display
            }, 10);
        } else {
            clearInterval(timerId.current);
            isRunning.current = false;
            onNewSolve(preciseTimer.current.toFixed(2));
        }
    };

    return (
        <div>
            <h3>{scramble}</h3>
            <h1>{timerDisplay.toFixed(2)} seconds</h1>
        </div>
    )
}

export default Timer
