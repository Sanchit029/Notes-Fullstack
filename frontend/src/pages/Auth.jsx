import { useState } from 'react';
import axios from 'axios';

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:5001/api/auth/login'
      : 'http://localhost:5001/api/auth/signup';

    try {
      const res = await axios.post(url, form);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        alert('Signup successful! Now login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Notes App</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="block w-full p-2 mb-4 border border-gray-300 rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? 'No account?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;