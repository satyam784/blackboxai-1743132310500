import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiTrash2, FiTag, FiUsers } from 'react-icons/fi';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isNew] = useState(id === 'new');

  useEffect(() => {
    if (!isNew) {
      const fetchNote = async () => {
        try {
          const { data } = await api.get(`/notes/${id}`);
          setTitle(data.note.title);
          setContent(data.note.content);
          setTags(data.note.tags?.join(', ') || '');
          setIsPublic(data.note.isPublic);
          setCollaborators(data.note.collaborators || []);
        } catch (err) {
          console.error('Failed to fetch note', err);
          navigate('/dashboard');
        }
      };
      fetchNote();
    }
  }, [id, isNew, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const noteData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic,
        collaborators
      };

      if (isNew) {
        await api.post('/notes', noteData);
      } else {
        await api.patch(`/notes/${id}`, noteData);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setIsSaving(false);
    }
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Note title"
            className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full p-0 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            {!isNew && (
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FiTrash2 className="mr-2" />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center">
            <FiTag className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              className="input-field"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <FiUsers className="text-gray-500 mr-2" />
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                <div className={`block w-10 h-6 rounded-full ${isPublic ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isPublic ? 'transform translate-x-4' : ''}`}
                ></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-300">
                {isPublic ? 'Public' : 'Private'}
              </div>
            </label>
          </div>
        </div>

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className="border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Start writing your note here..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;