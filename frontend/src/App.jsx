import './index.css';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Auth from './pages/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/notes', {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5001/api/notes/${editingId}`,
          form,
          { headers: { Authorization: token } }
        );
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5001/api/notes', form, {
          headers: { Authorization: token },
        });
      }
      setForm({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`, {
        headers: { Authorization: token },
      });
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token,fetchNotes]);

  if (!token) return <Auth setToken={setToken} />;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex justify-between w-full max-w-5xl mb-4">
        <h1 className="text-4xl font-bold">Notes App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? 'Edit Note' : 'Create Note'}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">All Notes</h2>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl">
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded-lg shadow-md w-64"
          >
            <h3 className="text-xl font-bold">{note.title}</h3>
            <p className="mb-2">{note.content}</p>
            <small className="block mb-4 text-gray-500">
              Created: {new Date(note.createdAt).toLocaleString()}
            </small>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(note)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;