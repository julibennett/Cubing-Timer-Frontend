import { useState, useEffect } from 'react'

const Timer = ({ onNewSolve }) => {
    const [scramble, setScramble] = useState('')
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [intervalId, setIntervalId] = useState(null)

    useEffect(() => {
        generateScramble()
        const handleSpacebar = (event) => {
            if (event.code === 'Space') {
                toggleTimer();
            }
        };
        window.addEventListener('keydown', handleSpacebar)
        return () => {
            window.removeEventListener('keydown', handleSpacebar)
        }
    }, [isRunning])

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
        setIsRunning(!isRunning)
        if (!isRunning) {
            setTime(0);  // Reset the time
            const intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else {  // If it was running, stop and log the time
            onNewSolve(time);
        }
    };

    return (
        <div>
            <h3>{scramble}</h3>
            <h1>{time} seconds</h1>
        </div>
    )
}

export default Timer
