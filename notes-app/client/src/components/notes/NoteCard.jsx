import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiStar, FiMoreVertical } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';

const NoteCard = ({ note }) => {
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/notes/${note._id}/toggle-favorite`);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Link
      to={`/notes/${note._id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {note.title}
            </h3>
            <button
              onClick={toggleFavorite}
              className={`p-1 rounded-full ${isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors`}
            >
              <FiStar className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {truncateContent(note.content)}
          </p>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-gray-700 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(note.updatedAt)}
          </span>
          {isHovered && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <FiMoreVertical className="h-4 w-4" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Share
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Export
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-red-600`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;