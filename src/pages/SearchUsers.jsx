import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [starredUsers, setStarredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStarredUsers();
  }, []);

  const fetchStarredUsers = async () => {
    try {
      const response = await api.get('/api/starred-users/');
      setStarredUsers(response.data);
    } catch (error) {
      console.error('Error fetching starred users:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a username to search.');
      return;
    }
    try {
      const response = await api.get(`/api/search-users/?username=${searchTerm}`);
      setSearchResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users.');
      console.log(err);
    }
  };

  const handleStarUser = async (userId) => {
    try {
      await api.post('/api/starred-users/', { starred_user: userId });
      fetchStarredUsers(); 
    } catch (error) {
      console.error('Failed to star user:', error);
    }
  };

  const handleUnstarUser = async (userId) => {
    try {
      await api.post('/api/unstar-user/', { starred_user_id: userId });
      fetchStarredUsers(); 
    } catch (error) {
      console.error('Failed to unstar user:', error);
    }
  };

  const handleViewCharts = (userId, username) => {
    navigate(`/user/${userId}/chart`, { state: { username } });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 wheaton">Search Users</h1>
      <h4 className='font-bold text-center mb-4 wheaton'>
        To view another user's chart data, star them!
        <img src="/public/icons/star.png" alt="star icon" className="inline-block w-6 h-6" />
        </h4>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username"
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 wheaton"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {searchResults.map((user) => (
          <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-md shadow-sm">
            <span>{user.username}</span>
            <button
              onClick={() => handleStarUser(user.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <img src="/public/icons/star.png" alt="Star" className="w-6 h-6" />
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-center my-6 wheaton">Starred Users</h2>
      <ul>
        {starredUsers.length > 0 ? (
          starredUsers.map((user) => (
            <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-md shadow-sm">
              <span>{user.username}</span>
              <div>
                <button
                  onClick={() => handleUnstarUser(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2 wheaton"
                >
                  Unstar
                </button>
                <button
                  onClick={() => handleViewCharts(user.id, user.username)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 wheaton"
                >
                  View Charts
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No starred users</p>
        )}
      </ul>
    </div>
  );
};

export default SearchUsers;
