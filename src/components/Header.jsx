import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/logout');
  };

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-4xl font-bold headfont">
        R U R' U'
      </Link>      
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/profile" className="text-white hover:text-gray-300">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/add-friends" className="text-white hover:text-gray-300">
              Add Friends
            </Link>
          </li>
          <li>
            <Link to="/chart" className="text-white hover:text-gray-300">
              Charts
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <img src="/log-out.png" alt="Logout" className="w-6 h-6" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
