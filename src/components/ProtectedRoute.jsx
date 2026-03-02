import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Tabbatar 'db' ne ba 'firestore' ba
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

  if (loading)
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
        <div
          className="animate-spin"
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #2563eb",
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        ></div>
      </div>
    );

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

  if (status === "suspended")
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );

  if (requiredRole) {
    const isAdminGroup = [
      "admin",
      "super-admin",
      "rector",
      "admission-officer",
    ].includes(role);
    let hasAccess =
      role === requiredRole || role === "super-admin" || role === "rector";
    if (requiredRole === "admin") hasAccess = isAdminGroup;

    if (!hasAccess) {
      return (
        <Navigate to={role === "student" ? "/student-portal" : "/"} replace />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
