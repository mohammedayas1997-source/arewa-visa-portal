import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Adjusted to match your firebase.js exports
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          // Accessing the 'users' collection using the provided Firestore instance
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check for Account Status Restrictions
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
            // Default role assignment if no Firestore record exists
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

  // LOADING TERMINAL UI
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
            className="animate-spin"
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #2563eb",
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 20px",
            }}
          ></div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "2px",
              color: "#3b82f6",
              textTransform: "uppercase",
            }}
          >
            AREWA SECURITY: VERIFYING NODE...
          </p>
        </div>
      </div>
    );
  }

  // 1. UNAUTHORIZED REDIRECT
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

  // 2. SUSPENSION ENFORCEMENT
  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  // 3. HIERARCHICAL ROLE VALIDATION
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "admission-officer";

    let hasAccess = role === requiredRole || isSuperAdmin || isRector;

    // Admin Group Privilege Check
    if (requiredRole === "admin") {
      hasAccess = isAdmin || isSuperAdmin || isRector;
    }

    if (!hasAccess) {
      const fallback = role === "student" ? "/student-portal" : "/";
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
