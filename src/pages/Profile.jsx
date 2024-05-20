import React, { useState, useEffect } from 'react';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile/');
        setProfile(response.data);
        setBio(response.data.bio);
        setFriends(response.data.friends);
      } catch (err) {
        setError('Failed to fetch profile.');
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updateData = { bio };
      console.log('Sending update data:', updateData);
      await api.put('/api/profile/update/', updateData);
      console.log('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
      if (err.response) {
        console.log('Update profile error:', err.response.data);  
      } else {
        console.log('Update profile error:', err);
      }
    }
  };

  if (!profile) {
    return <p className="text-center">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold underline text-center mb-6">{profile.user.username}'s Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Bio:
          <textarea
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
      </div>
      {/* <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Friends</h2>
        <ul className="list-disc list-inside">
          {friends.map(friendId => (
            <li key={friendId} className="text-gray-700">{friendId}</li>
          ))}
        </ul>
      </div> */}
      <button
        onClick={handleUpdateProfile}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
