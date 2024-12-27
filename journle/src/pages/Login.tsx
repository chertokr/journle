// src/pages/Login.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Assuming this is the file with your Supabase client
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        setSuccessMessage('Login successful! Redirecting...');
        // Redirect or handle logged-in state here
        setTimeout(() => {
          window.location.href = '/dashboard'; // Example: redirect to dashboard
        }, 2000);
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
          
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>
          Login
        </button>

        <p>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </p>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
