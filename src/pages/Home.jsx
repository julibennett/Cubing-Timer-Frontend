import { useState, useEffect } from "react"
import Timer from "../components/Timer"
import api from '../api'

const Home = () => {
    const [solves, setSolves] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editingTime, setEditingTime] = useState('')

    useEffect(() => {
        getSolves()
    }, [])

    const getSolves = () => {
        api.get('/api/solves/')
        .then((res) => {
            console.log(res.data)
            setSolves(res.data)
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

    const startEdit = (solve) => {
        setEditingId(solve.id);
        setEditingTime(String(solve.solvetime.toString()));    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditingTime('');
    }

    const editSolve = (id, newSolveTime) => {
        console.log("Received new solve time:", newSolveTime)
        const parsedTime = parseFloat(newSolveTime);

    if (isNaN(parsedTime) || parsedTime <= 0) {
        alert("Please enter a valid solve time.");
        return;
    }
        const payload = {
            solvetime: parseFloat(newSolveTime),
            event: '3x3',  
        };

        console.log('Updating solve with ID:', id);
        console.log('Payload:', payload);
    
        api.put(`/api/solves/${id}/`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            console.log('Solve updated!');
            getSolves();
            cancelEdit()
        }).catch((error) => {
            console.error('Failed to update solve:', error);
            alert('Failed to update solve:', error.message);
        });
    };
    

    const createSolve = (solvetime) => {
        console.log('Received time for solve:', solvetime)
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
            <Timer onNewSolve={createSolve} />
            <h3 className="underline">Session Solves</h3>
            <ul>
                {solves.map((solve) => (
                    <li key={solve.id}>
                        {editingId === solve.id ? (
                            <>
                                <input 
                                    type="number" 
                                    value={editingTime} 
                                    onChange={(e) => {
                                        console.log('Input change:', e.target.value)
                                        setEditingTime(e.target.value)
                                    }} 
                                    step="0.01"
                                    min="0.01"
                                />
                                <button onClick={() => editSolve(solve.id, editingTime)} >Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {solve.solvetime.toFixed(2)} seconds
                                <button onClick={() => deleteSolves(solve.id)}>Delete</button>
                                <button onClick={() => startEdit(solve)}>Edit</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home