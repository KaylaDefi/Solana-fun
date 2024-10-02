"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Import signIn from NextAuth

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const res = await fetch('/api/auth/csrf');
      const data = await res.json();
      setCsrfToken(data.csrfToken); 
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true); 

    try {
      const response = await fetch('/api/artist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, bio, email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error('Failed to create account: ' + errorMessage);
      }

      const signInResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
        csrfToken, 
      });

      if (!signInResponse.ok) {
        throw new Error('Failed to log in after account creation. Please try logging in manually.');
      }

      setSuccess('Account created successfully! Redirecting to your profile...');
      router.push('/artist/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Artist Account</h1>
      <p>Log in with your wallet if you are a regular user. Only artists need to create an account.</p>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
