import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [starredUsers, setStarredUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStarredUsers();
  }, []);

  const fetchStarredUsers = async () => {
    try {
      const response = await api.get('/api/starred-users/');
      setStarredUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch starred users.', err);
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

  const viewUserCharts = (userId, username) => {
    navigate(`/user/${userId}/chart`, { state: { username } });
  };

  const handleStarUser = async (user) => {
    try {
      await api.post('/api/starred-users/', { starred_user: user.id });
      fetchStarredUsers();
    } catch (err) {
      console.error('Failed to star user.', err);
      if (err.response && err.response.data) {
        console.error('Response data:', err.response.data);
      }
    }
  };

  const handleUnstarUser = async (userId) => {
    try {
      await api.post('/api/unstar-user/', { starred_user_id: userId });
      fetchStarredUsers();
    } catch (err) {
      console.error('Failed to unstar user.', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Search Users</h1>
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
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {searchResults.map((user) => (
          <li key={user.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-md shadow-sm">
            <span>{user.username}</span>
            <div>
              <button
                onClick={() => viewUserCharts(user.id, user.username)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
              >
                View Charts
              </button>
              <button
                onClick={() => handleStarUser(user)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Star
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold text-center mt-8 mb-4">Starred Users</h2>
      <ul>
        {starredUsers.map(({ id, starred_user }) => (
          <li key={id} className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-md shadow-sm">
            <span>{starred_user.username}</span>
            <div>
              <button
                onClick={() => viewUserCharts(starred_user.id, starred_user.username)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
              >
                View Charts
              </button>
              <button
                onClick={() => handleUnstarUser(starred_user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Unstar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;
