import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (
              userData.status === "suspended" ||
              userData.status === "inactive"
            ) {
              await signOut(auth);
              setUser(null);
              setRole(null);
              setStatus("suspended");
            } else {
              setUser(currentUser);
              setRole(userData.role);
              setStatus("active");
            }
          } else {
            // Idan babu shi a Firestore amma yana Auth
            setUser(currentUser);
            setRole(null);
          }
        } catch (error) {
          console.error("Security Error:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Dole a kashe loading anan
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6 text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            AREWA SECURITY: AUTHENTICATING...
          </p>
        </div>
      </div>
    );
  }

  // 1. Idan ba'a yi login ba
  if (!user) {
    const isStaffPath =
      location.pathname.includes("admin") ||
      location.pathname.includes("rector") ||
      location.pathname.includes("supervisor");
    return (
      <Navigate
        to={isStaffPath ? "/admin-gateway" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // 2. Idan an dakatar da account
  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  // 3. Duba Role (RBAC)
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin" || role === "SUPER_ADMIN";
    const isRector = role === "rector" || role === "authority";
    const isAdmin = role === "admin" || role === "admission-officer";

    let hasAccess = role === requiredRole || isSuperAdmin || isRector;

    // Admin Access Logic
    if (requiredRole === "admin") {
      hasAccess = isAdmin || isSuperAdmin || isRector;
    }

    if (!hasAccess) {
      // Tura mutum gidan da ya dace da shi idan ya bata hanya
      if (role === "student") return <Navigate to="/student-portal" replace />;
      if (isRector) return <Navigate to="/rector" replace />;
      if (isAdmin) return <Navigate to="/admin-dashboard" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
