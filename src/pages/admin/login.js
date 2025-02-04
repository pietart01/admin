import { useState } from 'react';
import { useRouter } from 'next/router';
import {post} from "../../lib/api/methods";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

/*
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const { token, user } = await res.json();
      console.log('token', token);
      console.log('user', user);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/admin/dashboard');
    }
*/

    try {
      const data = await post('/auth/login', {username, password});
      const { token, user } = data;
      console.log('token', token);
      console.log('user', user);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/admin/dashboard');

    } catch (error) {
        console.error(error);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Admin</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 mb-2 font-medium">ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-600 mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
