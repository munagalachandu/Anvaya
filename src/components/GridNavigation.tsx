import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, GraduationCap, LayoutGrid, Users, Landmark, Wrench, Trophy, BookOpen, LogIn, User, UserCog } from 'lucide-react';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  subItems?: { title: string; icon: React.ReactNode; path: string }[];
}

const GridNavigation = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const navItems: NavItem[] = [
    {
      title: 'Home',
      icon: <LayoutGrid size={20} />,
      path: '/'
    },
    {
      title: 'Events',
      icon: <CalendarDays size={20} />,
      path: '#',
      subItems: [
        { title: 'Cultural', icon: <Landmark size={16} />, path: '/events/cultural' },
        { title: 'Sports', icon: <Trophy size={16} />, path: '/events/sports' },
        { title: 'Technical', icon: <Wrench size={16} />, path: '/events/technical' },
        { title: 'Workshops', icon: <BookOpen size={16} />, path: '/events/workshops' }
      ]
    },
    {
      title: 'Login',
      icon: <LogIn size={20} />,
      path: '#',
      subItems: [
        { title: 'Student', icon: <GraduationCap size={16} />, path: '/login?role=student' },
        { title: 'Faculty', icon: <User size={16} />, path: '/login?role=faculty' },
        { title: 'Admin', icon: <UserCog size={16} />, path: '/login?role=admin' }
      ]
    }
  ];
  
  const handleMenuClick = (title: string) => {
    if (activeMenu === title) {
      setActiveMenu(null);
    } else {
      setActiveMenu(title);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/4">
          <h1 className="text-3xl font-extrabold text-purple-600 tracking-wide">
            Anvaya
          </h1>
        </div>
        <div className="w-1/2 ml-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {navItems.map((item) => (
              <div key={item.title} className="relative">
                {item.subItems ? (
                  <button
                    onClick={() => handleMenuClick(item.title)}
                    className="flex flex-col items-center justify-center w-full h-16 bg-white shadow-sm rounded-lg hover:bg-gray-100 p-2"
                  >
                    <div className="text-purple-600 mb-1">{item.icon}</div>
                    <span className="text-xs font-medium">{item.title}</span>
                  </button>
                ) : (
                  <Link 
                    to={item.path} 
                    className="flex flex-col items-center justify-center w-full h-16 bg-white shadow-sm rounded-lg hover:bg-gray-100 p-2"
                  >
                    <div className="text-purple-600 mb-1">{item.icon}</div>
                    <span className="text-xs font-medium">{item.title}</span>
                  </Link>
                )}
                
                {/* Submenu */}
                {item.subItems && activeMenu === item.title && (
                  <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="text-purple-600 mb-1">{subItem.icon}</div>
                          <span className="text-xs font-medium">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridNavigation;