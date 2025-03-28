import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiHeart, FiCornerUpLeft, FiMoreVertical } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';

const CommentSection = ({ noteId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/notes/${noteId}/comments`);
        setComments(data.comments);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [noteId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/notes/${noteId}/comments`, {
        content: newComment
      });
      setComments([...comments, data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyContent.trim()) return;

    try {
      const { data } = await api.post(`/comments/${commentId}/replies`, {
        content: replyContent
      });
      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, replies: [...comment.replies, data.reply] } 
          : comment
      ));
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      console.error('Failed to post reply', err);
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      await api.patch(`/comments/${commentId}/toggle-like`);
      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { 
              ...comment, 
              likes: comment.likes.includes(user.id) 
                ? comment.likes.filter(id => id !== user.id) 
                : [...comment.likes, user.id] 
            } 
          : comment
      ));
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(comment => comment._id !== commentId));
      } catch (err) {
        console.error('Failed to delete comment', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Comment Form */}
      <div className="p-4">
        <form onSubmit={handleSubmitComment}>
          <div className="flex space-x-2">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                alt=""
              />
            </div>
            <div className="flex-1">
              <textarea
                rows="2"
                className="input-field w-full"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="p-4">
            <div className="flex space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${comment.user.name}&background=random`}
                  alt=""
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium dark:text-white">{comment.user.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                      {comment.isEdited && ' • Edited'}
                    </p>
                  </div>
                  {comment.user._id === user?.id && (
                    <Menu as="div" className="relative">
                      <Menu.Button className="text-gray-400 hover:text-gray-500">
                        <FiMoreVertical className="h-5 w-5" />
                      </Menu.Button>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                  } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => deleteComment(comment._id)}
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
                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => toggleCommentLike(comment._id)}
                    className={`flex items-center space-x-1 text-sm ${
                      comment.likes.includes(user?.id) 
                        ? 'text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <FiHeart className={comment.likes.includes(user?.id) ? 'fill-current' : ''} />
                    <span>{comment.likes.length}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    <FiCornerUpLeft />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <textarea
                          rows="1"
                          className="input-field w-full"
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitReply(comment._id)}
                            className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="pt-3">
                        <div className="flex space-x-2">
                          <div className="flex-shrink-0">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={`https://ui-avatars.com/api/?name=${reply.user.name}&background=random`}
                              alt=""
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium dark:text-white">{reply.user.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentSection;