import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiPlus, FiSearch, FiClock, FiStar } from 'react-icons/fi';
import NoteCard from '../components/notes/NoteCard';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        setNotes(data.notes);
        setRecentNotes(data.notes.slice(0, 3));
        setFavoriteNotes(data.notes.filter(note => note.isFavorite).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch notes', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/notes/new"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiPlus className="text-primary-500" />
          <span className="font-medium">New Note</span>
        </Link>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Recent Notes</h3>
          {recentNotes.length > 0 ? (
            <ul className="space-y-2">
              {recentNotes.map(note => (
                <li key={note._id}>
                  <Link 
                    to={`/notes/${note._id}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent notes</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <FiStar className="mr-2 text-yellow-400" />
            Favorites
          </h3>
          {favoriteNotes.length > 0 ? (
            <ul className="space-y-2">
              {favoriteNotes.map(note => (
                <li key={note._id}>
                  <Link 
                    to={`/notes/${note._id}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No favorites yet</p>
          )}
        </div>
      </div>

      {/* Search and Notes List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">All Notes</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery ? 'No matching notes found' : 'You have no notes yet'}
            </p>
            {!searchQuery && (
              <Link
                to="/notes/new"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
              >
                Create your first note
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;