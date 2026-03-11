import React, { useState } from "react";
// UPDATED: Using 'firestore' as the variable name for Firestore services
import { auth, firestore } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Terminal, ShieldCheck } from "lucide-react";

const Register = () => {
  const [msg, setMsg] = useState("System ready for @arewavacademy.edu.ng deployment.");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // UPDATED: All institutional emails now use the .edu.ng domain
  const usersToCreate = [
    { email: "student@arewavacademy.edu.ng", role: "student", name: "AVA Student" },
    { email: "admin@arewavacademy.edu.ng", role: "admin", name: "System Admin" },
    { email: "rector@arewavacademy.edu.ng", role: "rector", name: "Academy Rector" },
    { email: "admin-content@arewavacademy.edu.ng", role: "instructor", name: "Content Manager" },
    { email: "admission@arewavacademy.edu.ng", role: "admission-officer", name: "Admission Officer" },
  ];

  const handleSetup = async () => {
    if (loading) return;

    // Safety check for Firebase Initialization
    if (!auth || !firestore) {
      setMsg("CRITICAL: Firebase SDK (Auth or Firestore) failed to initialize.");
      return;
    }

    setLoading(true);
    setMsg("Deploying Core Infrastructure to .edu.ng...");
    setResults([]);

    for (const user of usersToCreate) {
      try {
        // 1. Create Authentication Account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          "Arewa@2026"
        );

        const uid = userCredential.user.uid;

        // 2. Create Firestore Profile 
        // We use 'firestore' instance here instead of 'db' to match your config
        const userDocRef = doc(firestore, "users", uid);

        await setDoc(userDocRef, {
          uid: uid,
          email: user.email,
          fullName: user.name,
          role: user.role,
          status: "active",
          createdAt: serverTimestamp(),
        });

        setResults((prev) => [
          ...prev,
          { email: user.email, status: "success" },
        ]);
      } catch (err) {
        setResults((prev) => [
          ...prev,
          { email: user.email, status: "error", message: err.message },
        ]);
      }
    }

    setLoading(false);
    setMsg("Deployment Finished for @arewavacademy.edu.ng");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#141414",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "30px",
          padding: "40px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: "1px solid #dc2626",
            }}
          >
            <Terminal size={30} color="#dc2626" />
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            AVA User <span style={{ color: "#dc2626" }}>Terminal</span>
          </h2>
          <p
            style={{
              color: loading ? "#dc2626" : "#475569",
              fontSize: "11px",
              marginTop: "10px",
            }}
          >
            {msg}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#000",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #1e293b",
            minHeight: "150px",
            overflowY: "auto"
          }}
        >
          {results.length === 0 && !loading && (
            <div style={{ color: "#334155", fontSize: "12px" }}>
              {">"} Awaiting @arewavacademy.edu.ng initialization...
            </div>
          )}
          {results.map((res, i) => (
            <div
              key={i}
              style={{
                color: res.status === "success" ? "#10b981" : "#ef4444",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              {res.status === "success" ? "✔ DEPLOYED:" : "✖ ERROR:"}{" "}
              {res.email}
            </div>
          ))}
          {loading && (
            <div style={{ color: "#dc2626", fontSize: "12px" }}>
              {">"} Initializing Secure Handshake...
            </div>
          )}
        </div>

        <button
          onClick={handleSetup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "20px",
            backgroundColor: loading ? "#1e293b" : "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "20px",
            fontWeight: "900",
            textTransform: "uppercase",
            fontSize: "13px",
            letterSpacing: "2px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" style={{ margin: "0 auto" }} />
          ) : (
            "Initialize Institutional Accounts"
          )}
        </button>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p
            style={{
              color: "#334155",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            <ShieldCheck
              size={12}
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            />{" "}
            Secure Deployment Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;