import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Form({ route, method }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === 'login' ? 'Login' : 'Register';

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      const apiUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${route.startsWith('/') ? route.substring(1) : route}`;
      console.log('Submitting to route:', apiUrl);
      const res = await api.post(apiUrl, { username, password });
      console.log('API response:', res);
      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem('username', username);
        console.log('Stored username:', localStorage.getItem('username'));
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error during form submission:', error.response.data);
        alert(`An error occurred: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error during form submission:', error.message);
        alert('An error occurred. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black p-8 rounded shadow-md w-full max-w-sm mx-auto mt-16">
      <h1 className="text-white text-2xl font-bold mb-4 wheaton">
        {name}
        <img src="/icons/rubik.png" alt="Cube" className="inline-block w-7 h-7" />
      </h1>
      <input
        className="form-input bg-gray-800 text-white p-2 mb-4 rounded border border-gray-700 w-full"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input bg-gray-800 text-white p-2 mb-4 rounded border border-gray-700 w-full"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        className="form-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full wheaton"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading...' : name}
      </button>
    </form>
  );
}

export default Form;
