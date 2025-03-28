import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiHeart, FiMessageSquare, FiShare2, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import CommentSection from '../../components/notes/CommentSection';

const NoteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`);
        setNote(data.note);
        setIsLiked(data.note.likes.includes(user?.id));
        setLikeCount(data.note.likes.length);
        setIsOwner(data.note.createdBy._id === user?.id);
      } catch (err) {
        console.error('Failed to fetch note', err);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [id, user, navigate]);

  const handleLike = async () => {
    try {
      await api.patch(`/notes/${id}/toggle-like`);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleEdit = () => {
    navigate(`/notes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete note', err);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/notes/${id}`);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!note) {
    return <div className="text-center py-12 text-gray-500">Note not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Note Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">{note.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Created by {note.createdBy.name} • {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-500"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
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

        {/* Note Content */}
        <div className="p-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        {/* Note Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <FiMessageSquare />
              <span>{note.comments?.length || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <FiShare2 />
              <span>Share</span>
            </button>
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
          >
            {showComments ? (
              <FiChevronUp className="h-5 w-5" />
            ) : (
              <FiChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <CommentSection noteId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewPage;