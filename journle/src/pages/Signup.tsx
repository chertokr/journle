import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure supabaseClient.ts is correctly configured

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Use Supabase to sign up the user
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
    } else {
      // Access the user object from the data field
      const user = data?.user;

      if (user) {
        // Redirect to dashboard or login page after successful signup
        window.location.href = '/dashboard';
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ margin: '10px 0', padding: '10px' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ margin: '10px 0', padding: '10px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
