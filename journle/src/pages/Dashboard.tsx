import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Define types for the journal entries
interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null); // You can replace 'any' with a more specific type if needed
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the logged-in user's session
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError('Failed to fetch user data');
        setLoading(false);
        return;
      }

      if (data?.user) {
        setUser(data.user);
        fetchJournalEntries(data.user.id);
      } else {
        // Redirect to login if no user is found
        window.location.href = '/';
      }
    };

    const fetchJournalEntries = async (userId: string) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        setError('Failed to fetch journal entries');
      } else if (data) {
        setEntries(data);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Journle</h1>
      {user && <h2>Hello, {user.email}</h2>}
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {loading ? (
        <p>Loading your journal entries...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <h3>Your Journal Entries</h3>
          {entries.length > 0 ? (
            <ul>
              {entries.map((entry) => (
                <li key={entry.id}>
                  <p>{entry.created_at}: {entry.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No entries found. Start writing today!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
