import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const viewChart = (userId) => {
    navigate(`/user/${userId}/chart`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Search & View Other Users Chart Data</h1>
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
            <button
              onClick={() => viewChart(user.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              View Chart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;
