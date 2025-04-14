
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-600 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/events/cultural" className="block text-gray-600 hover:text-primary transition-colors">Events</Link>
              <Link to="/login" className="block text-gray-600 hover:text-primary transition-colors">Login</Link>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-600 mt-1" />
                <span className="text-gray-600">contact@anvaya-department.edu</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-600 mt-1" />
                <span className="text-gray-600">+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-gray-600 mt-1" />
              <address className="text-gray-600 not-italic">
                Department of Computer Science,<br />
                University Campus,<br />
                City, State - 560001
              </address>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Anvaya. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
