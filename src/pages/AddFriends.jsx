import React, { useState } from 'react'

import api from '../api';

const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a username to search.');
      return;
    }
    try {
      const response = await api.get(`/api/search-users/?username=${searchTerm}`);
      console.log(response.data);
      setSearchResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users.');
      console.log(err);
    }
  };

  const handleAddFriend = async (userId) => {
    if (!userId) {
      console.log('Invalid user ID provided');
      return;
    }
    try {
      // Fetch the current user's profile to get the current friends list
      const profileResponse = await api.get('/api/profile/');
      const currentFriends = profileResponse.data.friends;

      // Add the new friend to the friends list
      const updatedFriends = [...currentFriends, userId];

      // Update the profile with the new friends list
      await api.put('/api/profile/update/', { friends: updatedFriends });
      console.log('Friend added successfully.');
      setSearchResults([]);
    } catch (err) {
      console.log('Failed to add friend.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Add Friends</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by username"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {searchResults.map((user) => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => handleAddFriend(user.id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFriends;
