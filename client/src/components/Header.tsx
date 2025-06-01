import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../lib/auth';
import AnvayaLogo from '@/components/assets/Anvaya.png';
import DSCLogo from '@/components/assets/image.png';
import Fb from '@/components/assets/fb.png';
import Insta from '@/components/assets/insta.png';
import LinkedIn from '@/components/assets/linkedin.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      // Try to get user info from localStorage (set at login)
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <img src={DSCLogo} alt="DSCE Logo" className="w-12 h-12 rounded-full shadow-sm" />
          <p className="text-gray-800 text-base font-medium leading-snug">
            Dayananda Sagar College <br /> of Engineering
          </p>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-gray-800 text-base font-medium leading-snug">
              Department of Artificial Intelligence <br /> and Machine Learning
            </p>
            <div className="flex justify-end space-x-2 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={Fb} alt="Facebook" className="w-5 h-5 hover:scale-110 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={Insta} alt="Instagram" className="w-5 h-5 hover:scale-110 transition" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src={LinkedIn} alt="LinkedIn" className="w-5 h-5 hover:scale-110 transition" />
              </a>
            </div>
          </div>
          <img src={AnvayaLogo} alt="Anvaya Logo" className="w-12 h-12 rounded-full shadow-sm" />
        </div>
      </div>
    </header>
  );
};

export default Header;