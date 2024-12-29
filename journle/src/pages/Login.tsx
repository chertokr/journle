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
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '50px' }}>
      <div className="box"> 
      <div className="typewriter">
        <h1> Journle</h1> </div> 
      <div className="slogan"> one day, one entry</div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0', background: 'white', color: 'black'}}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' ,background: 'white', color: 'black'}}
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
    </div>
  );
};

export default Login;
