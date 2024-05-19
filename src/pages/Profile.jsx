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
      // add friends  back to bio if you can figure out how
      console.log('Sending update data:', updateData);
      await api.put('/api/profile/update/', updateData);
      console.log('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
      if (err.response) {
        console.log('Update profile error:', err.response.data);  // Log detailed error response
      } else {
        console.log('Update profile error:', err);
      }
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1 className='underline text-center'>{profile.user.username}'s Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label className='text-bold text-red-500'>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
      </div>
      {/* <div>
        <h2>Friends</h2>
        <ul>
          {friends.map(friendId => (
            <li key={friendId}>{friendId}</li>
          ))}
        </ul>
      </div> */}
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default Profile;
