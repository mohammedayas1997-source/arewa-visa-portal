import React, { useState } from "react";
import { auth, firestore } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldAlert, Loader2, X } from "lucide-react";

const AdminLogin = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const cleanEmail = username.trim().toLowerCase();

      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
      
      const user = userCredential.user;

      // 2. Search Firestore by Email
      const staffQuery = query(
        collection(firestore, "users"),
        where("email", "==", cleanEmail),
        limit(1)
      );

      const querySnapshot = await getDocs(staffQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        
        // AN KARA 'super-admin' A CIKIN ALLOWED ROLES
        const allowedRoles = [
          "super-admin", // Sabon role da aka kara
          "admin",
          "rector",
          "instructor",
          "admission-officer",
        ];

        if (allowedRoles.includes(userData.role?.toLowerCase())) {
          onLogin(true);
        } else {
          await signOut(auth);
          setError("ACCESS DENIED: You do not have administrative privileges.");
        }
      } else {
        const backupQuery = query(
          collection(firestore, "users"),
          where("uid", "==", user.uid),
          limit(1)
        );
        const backupSnapshot = await getDocs(backupQuery);
        
        if (!backupSnapshot.empty) {
            onLogin(true);
        } else {
            await signOut(auth);
            setError("PROFILE ERROR: No administrative record found.");
        }
      }
    } catch (err) {
      console.error("Auth Error:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid official email or password.");
      } else {
        setError("Connection error: Please check your internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-dark position-relative" style={{ backgroundColor: "#0a0a0a" }}>
      
      {/* CLOSE BUTTON */}
      <button 
        onClick={onClose} 
        className="btn btn-light rounded-circle position-absolute top-0 end-0 m-4 shadow-sm border-0 d-flex align-items-center justify-content-center"
        style={{ width: '45px', height: '45px', zIndex: 100, backgroundColor: "#fff" }}
      >
        <X size={24} className="text-dark" />
      </button>

      <div
        className="card border-0 shadow-lg p-4 p-md-5"
        style={{ maxWidth: "400px", borderRadius: "24px", width: "90%", backgroundColor: "#fff" }}
      >
        <div className="text-center mb-4">
          <div className="bg-danger text-white rounded-circle d-inline-block p-3 mb-3 shadow">
            <Lock size={32} />
          </div>
          <h4 className="fw-bold text-dark text-uppercase">AVA Admin Portal</h4>
          <p className="text-muted small uppercase fw-bold" style={{ fontSize: '10px' }}>Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small border-0 shadow-sm mb-4 text-start">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold text-muted mb-1 text-uppercase" style={{ fontSize: '10px' }}>
              Official Email
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <User size={18} className="text-danger" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 py-2 shadow-none"
                placeholder="name@arewavacademy.edu.ng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-4 text-start">
            <label className="form-label small fw-bold text-muted mb-1 text-uppercase" style={{ fontSize: '10px' }}>
              Security Password
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <Lock size={18} className="text-danger" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 py-2 shadow-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-lg text-uppercase tracking-widest border-0"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto text-white" size={20} />
            ) : (
              "SECURE SIGN IN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;