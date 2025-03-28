import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiBook, 
  FiStar, 
  FiFileText, 
  FiUsers,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const navItems = [
    {
      name: 'My Notes',
      icon: <FiBook className="mr-3" />,
      path: '/dashboard'
    },
    {
      name: 'Favorites',
      icon: <FiStar className="mr-3" />,
      path: '/favorites'
    },
    {
      name: 'Shared',
      icon: <FiUsers className="mr-3" />,
      path: '/shared',
      subItems: [
        { name: 'Shared With Me', path: '/shared/incoming' },
        { name: 'Shared By Me', path: '/shared/outgoing' }
      ]
    },
    {
      name: 'Templates',
      icon: <FiFileText className="mr-3" />,
      path: '/templates'
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="p-4 h-full flex flex-col">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              <div
                onClick={() => item.subItems && toggleSection(item.name)}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg cursor-pointer ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.subItems ? (
                    <span>{item.name}</span>
                  ) : (
                    <NavLink to={item.path} className="block w-full">
                      {item.name}
                    </NavLink>
                  )}
                </div>
                {item.subItems && (
                  openSection === item.name ? (
                    <FiChevronUp className="ml-2" />
                  ) : (
                    <FiChevronDown className="ml-2" />
                  )
                )}
              </div>

              {item.subItems && openSection === item.name && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.path}
                      className={`block px-4 py-2 text-sm rounded-lg ${
                        location.pathname === subItem.path
                          ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;