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
      await api.put('/api/profile/update/', { bio, friends });
      console.log('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
      console.log(err);
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1>{profile.user.username}'s Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
      </div>
      <div>
        <h2>Friends</h2>
        <ul>
          {friends.map((friendId) => (
            <li key={friendId}>{friendId}</li> // You might want to fetch and display the friend's username instead of ID
          ))}
        </ul>
      </div>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default Profile;
