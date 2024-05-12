import { useState, useEffect } from "react"
import api from '../api'

const Home = () => {
    const [solves, setSolves] = useState([])

    useEffect(() => {
        getSolves()
    }, [])

    const getSolves = () => {
        api.get('/api/solves/')
        .then((res) => res.data)
        .then((data) => { setSolves(data); console.log(data)})
        .catch((err) => alert(err))
    }

    const deleteNote = (id) => {
        api.delete(`/api/solves/delete/${id}/`).then((res) => {
            if (res.status === 204) alert ('Solve deleted!')
            else alert('Failed to delete solve!')
        }).catch((error) => alert(error))
        getSolves()
    }

    const createSolve = (e) => {
        api.post('/api/solves/', {solvetime}).then((res) => {
            if (res.status === 201) console.log('solve created!')
            else console.log('failed to create solve!')
        }).catch((err) => alert(err))
        getSolves()
    }

  return (
    <div>
        <div>
            <h3>Session Solves</h3>
        </div>
    </div>
  )
}

export default Home