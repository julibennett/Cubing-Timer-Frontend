import { useState, useEffect } from 'react';
import Timer from '../components/Timer';
import api from '../api';

const Home = () => {
  const [solves, setSolves] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTime, setEditingTime] = useState('');
  const [isSolvesCollapsed, setIsSolvesCollapsed] = useState(false);
  const [avgAllSolves, setAvgAllSolves] = useState(0);
  const [avgLast5Solves, setAvgLast5Solves] = useState(0);
  const [avgLast12Solves, setAvgLast12Solves] = useState(0);

  useEffect(() => {
    getSolves();
  }, []);

  const calculateAverages = (solves) => {
    if (solves.length > 0) {
      const totalSolves = solves.length;
      const totalTime = solves.reduce((sum, solve) => sum + solve.solvetime, 0);
      setAvgAllSolves(totalTime / totalSolves);

      if (totalSolves >= 5) {
        const last5Solves = solves.slice(-5);
        const totalLast5Time = last5Solves.reduce((sum, solve) => sum + solve.solvetime, 0);
        setAvgLast5Solves(totalLast5Time / 5);
      } else {
        setAvgLast5Solves(0);
      }

      if (totalSolves >= 12) {
        const last12Solves = solves.slice(-12);
        const totalLast12Time = last12Solves.reduce((sum, solve) => sum + solve.solvetime, 0);
        setAvgLast12Solves(totalLast12Time / 12);
      } else {
        setAvgLast12Solves(0);
      }
    } else {
      setAvgAllSolves(0);
      setAvgLast5Solves(0);
      setAvgLast12Solves(0);
    }
  };

  const getSolves = () => {
    api.get('/api/solves/')
      .then((res) => {
        console.log(res.data);
        setSolves(res.data);
        calculateAverages(res.data);
      })
      .catch((err) => {
        console.error('Error fetching solves:', err);
        alert('Error fetching solves:', err.message);
      });
  };

  const deleteSolves = (id) => {
    api.delete(`/api/solves/${id}/`).then((res) => {
      if (res.status === 204) {
        alert('Solve deleted!');
        getSolves();
      } else {
        alert('Failed to delete solve!');
      }
    }).catch((error) => {
      console.error('Error deleting solve:', error);
      alert('Failed to delete solve:', error.message);
    });
  };

  const deleteAllSolves = () => {
    Promise.all(solves.map(solve => api.delete(`/api/solves/${solve.id}/`)))
      .then((results) => {
        if (results.every(res => res.status === 204)) {
          alert('All solves deleted!');
          setSolves([]); // Clear the solves array
          calculateAverages([]); // Reset the averages
        } else {
          alert('Failed to delete some solves!');
        }
      })
      .catch((error) => {
        console.error('Error deleting solves:', error);
        alert('Failed to delete solves:', error.message);
      });
  };

  const startEdit = (solve) => {
    setEditingId(solve.id);
    setEditingTime(String(solve.solvetime.toString()));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTime('');
  };

  const editSolve = (id, newSolveTime) => {
    console.log("Received new solve time:", newSolveTime);
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
      cancelEdit();
    }).catch((error) => {
      console.error('Failed to update solve:', error);
      alert('Failed to update solve:', error.message);
    });
  };

  const createSolve = (solvetime) => {
    console.log('Received time for solve:', solvetime);
    const payload = {
      solvetime: solvetime,
      event: '3x3',
    };

    api.post('/api/solves/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log('Solve created!');
      getSolves();
    }).catch((error) => {
      console.error('Failed to create solve:', error);
      alert('Failed to add solve:', error.message);
    });
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-100 relative border-4 border-black overscroll-none pt-16"> {/* Added pt-16 for header height */}
      <div className="flex justify-between items-center w-full max-w-4xl px-4 mt-4 mb-4">
        <button 
          onClick={() => setIsSolvesCollapsed(!isSolvesCollapsed)} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 wheaton"
        >
          {isSolvesCollapsed ? 'Show' : 'Hide'} Session Solves
        </button>
        <button onClick={deleteAllSolves} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 wheaton">
          Delete All Solves
        </button>
      </div>
      <Timer onNewSolve={createSolve} />
      <div className="sticky bottom-0 bg-gray-100 text-center p-4 border-t border-gray-300 w-full">
        <p>Average of All Solves: {avgAllSolves.toFixed(2)} seconds</p>
        <p>Average of Last 5 Solves: {avgLast5Solves.toFixed(2)} seconds</p>
        <p>Average of Last 12 Solves: {avgLast12Solves.toFixed(2)} seconds</p>
      </div>
      <div className={`solves-panel ${isSolvesCollapsed ? 'hidden' : 'visible'} overflow-y-auto w-full max-w-4xl px-4`}>
        <h2 className="text-xl font-bold mb-2">All Session Solves</h2>
        <ul className="flex flex-col mt-4">
          {solves.map((solve, index) => (
            <li key={solve.id} className="bg-white shadow-md rounded p-4 m-2">
              {editingId === solve.id ? (
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={editingTime}
                    onChange={(e) => {
                      console.log('Input change:', e.target.value);
                      setEditingTime(e.target.value);
                    }}
                    step="0.01"
                    min="0.01"
                    className="mb-2 p-2 border rounded"
                  />
                  <div className="flex space-x-2">
                    <button onClick={() => editSolve(solve.id, editingTime)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                    <button onClick={cancelEdit} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="mb-2">{solves.length - index}) <span className="ml-2">{solve.solvetime.toFixed(2)} seconds</span></span>
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => deleteSolves(solve.id)} className="hover:opacity-75">
                      <img src="/icons/bin.png" alt="Delete" className="w-6 h-6" />
                    </button>
                    <button onClick={() => startEdit(solve)} className="hover:opacity-75">
                      <img src="/icons/edit.png" alt="Edit" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
