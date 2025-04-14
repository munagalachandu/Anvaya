
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
      icon: <LayoutGrid size={24} />,
      path: '/'
    },
    {
      title: 'Events',
      icon: <CalendarDays size={24} />,
      path: '#',
      subItems: [
        { title: 'Cultural', icon: <Landmark size={20} />, path: '/events/cultural' },
        { title: 'Sports', icon: <Trophy size={20} />, path: '/events/sports' },
        { title: 'Technical', icon: <Wrench size={20} />, path: '/events/technical' },
        { title: 'Workshops', icon: <BookOpen size={20} />, path: '/events/workshops' }
      ]
    },
    {
      title: 'Login',
      icon: <LogIn size={24} />,
      path: '#',
      subItems: [
        { title: 'Student', icon: <GraduationCap size={20} />, path: '/login?role=student' },
        { title: 'Faculty', icon: <User size={20} />, path: '/login?role=faculty' },
        { title: 'Admin', icon: <UserCog size={20} />, path: '/login?role=admin' }
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
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {navItems.map((item) => (
          <div key={item.title} className="relative">
            {item.subItems ? (
              <button
                onClick={() => handleMenuClick(item.title)}
                className="nav-grid-item w-full bg-white shadow-sm rounded-lg hover:bg-secondary/50"
              >
                <div className="text-primary mb-2">{item.icon}</div>
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            ) : (
              <Link to={item.path} className="nav-grid-item w-full bg-white shadow-sm rounded-lg hover:bg-secondary/50">
                <div className="text-primary mb-2">{item.icon}</div>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            )}

            {/* Submenu */}
            {item.subItems && activeMenu === item.title && (
              <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden animate-slide-up">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      to={subItem.path}
                      className="nav-grid-item text-center p-3"
                    >
                      <div className="text-primary mb-1">{subItem.icon}</div>
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
  );
};

export default GridNavigation;
