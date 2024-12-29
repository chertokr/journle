import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchJournalEntries(data.user.id);
      } else {
        window.location.href = '/';
      }
    };

    fetchUser();
  }, []);

  const fetchJournalEntries = async (userId: string) => {
    setLoading(true);  // Set loading to true before fetching

    try {
      // Fetch journal entries for the given user
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);  // Throw error to be caught by catch block
      }

      // Log the fetched entries to see what data is returned
      console.log('Fetched entries:', data);

      // Update state with the fetched data
      setEntries(data || []);
    } catch (err) {
      // Handle any errors that occurred during the fetch
      console.error('Error fetching entries:', err);
      setError('Failed to fetch journal entries. Please try again.');
    } finally {
      setLoading(false);  // Set loading to false when fetching is done
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleNewEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!newEntry.trim()) {
      setError('Entry cannot be empty.');
      return;
    }
  
    setSubmitting(true);
  
    // Insert the new journal entry into Supabase
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ user_id: user.id, content: newEntry }]);
  
    setSubmitting(false);
  
    if (error) {
      setError('Failed to save the entry. Please try again.');
    } else if (data) {
      // Directly update the entries state with the new entry at the top
      setEntries([data[0], ...entries]);
  
      // Reset the form
      setNewEntry('');
      setShowForm(false); // Hide the form
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Journle</h1>
      {user && <h2>Hello, {user.email}</h2>}
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading your journal entries...</p>
      ) : (
        <div>
          <button onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
            Write Daily Journal
          </button>

          {showForm && (
            <form onSubmit={handleNewEntrySubmit} style={{ marginBottom: '20px' }}>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                rows={4}
                cols={50}
                placeholder="Write your journal entry here..."
                style={{ display: 'block', marginBottom: '10px', color:'black' }}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Entry'}
              </button>
            </form>
          )}

          <h3>Your Journal Entries</h3>
          {entries.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  id={`entry-${entry.id}`}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                  }}
                >
                  <p>
                    <strong>{new Date(entry.created_at).toLocaleString()}</strong>: {entry.content}
                  </p>
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
