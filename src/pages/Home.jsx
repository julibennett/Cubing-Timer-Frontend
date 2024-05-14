import { useState, useEffect } from "react"
import Timer from "../components/Timer"
import api from '../api'

const Home = () => {
    const [solves, setSolves] = useState([])
    // const [solvetime, setSolveTime] = useState('')

    useEffect(() => {
        getSolves()
    }, [])

    const getSolves = () => {
        api.get('/api/solves/')
        .then((res) => {
            setSolves(res.data)
            console.log(res.data)
        })
        .catch((err) => {
            console.error('Error fetching solves:', err)
            alert('Error fetching solves:', err.message)
        })
    }

    const deleteSolves = (id) => {
        api.delete(`/api/solves/${id}/`).then((res) => {
            if (res.status === 204) {
                alert('Solve deleted!')
                getSolves()
            } else {
                alert('Failed to delete solve!')
            }
        }).catch((error) => {
            console.error('Error deleting solve:', error)
            alert('Failed to delete solve:', error.message)
        })
    }

    const createSolve = (solvetime) => {
        const payload = {
            solvetime: solvetime,
            event: '3x3',
        }
    
        api.post('/api/solves/', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            console.log('Solve created!')
            getSolves()
        }).catch((error) => {
            console.error('Failed to create solve:', error)
            alert('Failed to add solve:', error.message)
        })
    }

  return (
    <div>
       <Timer onNewSolve={(createSolve)} />
            <h3>Session Solves</h3>
            <ul>
                {solves.map((solve) => (
                    <li key={solve.id}>
                        {solve.solvetime.toFixed(2)} seconds
                        <button onClick={() => deleteSolves(solve.id)}>Delete</button>
                    </li>
                ))}
            </ul>
    </div>
  )
}

export default Home