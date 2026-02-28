import React, { useState, useEffect } from "react";
// Muna amfani da 'db' wanda yake nuna Firestore a cikin firebase.js
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // MUN COGE WANCAN LAYIN 'userRef' DIN DA KE NAN DA YA KE KAWO ERROR

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          // Anan muna amfani da 'db' da aka yi import daga firebase.js
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (
              userData.status === "suspended" ||
              userData.status === "inactive"
            ) {
              await signOut(auth);
              setStatus("suspended");
              setUser(null);
            } else {
              setRole(userData.role);
              setStatus("active");
              setUser(currentUser);
            }
          } else {
            // Default role idan babu shi a Firestore
            setRole("student");
            setStatus("active");
            setUser(currentUser);
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("AREWA SECURITY ERROR:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #2563eb",
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "2px",
              color: "#3b82f6",
            }}
          >
            AREWA SECURITY: VERIFYING...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    const isStaffPath = ["admin", "rector", "supervisor"].some((path) =>
      location.pathname.includes(path),
    );
    return (
      <Navigate
        to={isStaffPath ? "/admin-gateway" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "admission-officer";

    let hasAccess = role === requiredRole || isSuperAdmin || isRector;
    if (requiredRole === "admin")
      hasAccess = isAdmin || isSuperAdmin || isRector;

    if (!hasAccess) {
      const fallback = role === "student" ? "/student-portal" : "/";
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
