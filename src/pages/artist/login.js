import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Login successful!');
        localStorage.setItem('token', data.token); // Store JWT token

        router.push(`/artist/${data.artistId}`);
      } else {
        try {
          const errorData = await response.json();
          setError(errorData.message || 'Login failed');
        } catch {
          setError('Login failed, and the server response is invalid.');
        }
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
