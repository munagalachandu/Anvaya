
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/placeholder.svg" 
            alt="College Logo" 
            className="w-12 h-12"
          />
          <div>
            <div className="text-sm text-gray-600">Department of Computer Science</div>
            <h1 className="text-2xl font-bold text-primary">Anvaya</h1>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md z-50 md:hidden animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link to="/" className="text-gray-800 hover:text-primary">Home</Link>
              <div>
                <div className="text-gray-800 mb-2">Events</div>
                <div className="pl-4 flex flex-col space-y-2">
                  <Link to="/events/cultural" className="text-gray-600 hover:text-primary">Cultural</Link>
                  <Link to="/events/sports" className="text-gray-600 hover:text-primary">Sports</Link>
                  <Link to="/events/technical" className="text-gray-600 hover:text-primary">Technical</Link>
                  <Link to="/events/workshops" className="text-gray-600 hover:text-primary">Workshops</Link>
                </div>
              </div>
              <Link to="/login" className="text-gray-800 hover:text-primary">Login</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
