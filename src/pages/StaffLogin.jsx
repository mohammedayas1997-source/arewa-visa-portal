import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { Lock, User, ShieldAlert } from "lucide-react";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Using .trim() to remove any accidental spaces and .toLowerCase() for consistency
      await signInWithEmailAndPassword(auth, username.trim().toLowerCase(), password);
      onLogin(true);
    } catch (err) {
      console.error("Auth Error:", err.code);
      // Detailed error messages based on Firebase error codes
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access denied due to too many failed attempts. Try again later.');
      } else {
        setError('Authentication failed. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-dark">
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '400px', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <div className="bg-danger text-white rounded-circle d-inline-block p-3 mb-3 shadow">
            <Lock size={32}/>
          </div>
          <h4 className="fw-bold text-dark">AVA Admin Portal</h4>
          <p className="text-muted small">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small border-0 shadow-sm">
            <ShieldAlert size={16}/> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted mb-1">OFFICIAL EMAIL</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><User size={18}/></span>
              <input 
                type="email" 
                placeholder="admin@arewavacademy.edu.ng"
                className="form-control bg-light border-0 py-2" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted mb-1">PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><Lock size={18}/></span>
              <input 
                type="password" 
                placeholder="••••••••"
                className="form-control bg-light border-0 py-2" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow" disabled={loading}>
            {loading ? 'Authenticating...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;