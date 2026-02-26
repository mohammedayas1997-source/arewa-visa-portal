import React, { useState, useEffect } from "react";
// GYARA: Mun maida import din zuwa "./firebase" maimakon "../firebase"
// domin Vercel ya daina bada kuskuren 'Module not found'
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
      try {
        if (currentUser) {
          // Idan akwai matsala wajen kiran Firestore (db), kada mu bar loading ya tsaya
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
            } else {
              setRole(userData.role);
              setStatus("active");
              setUser(currentUser);
            }
          } else {
            // Idan babu shi a Firestore, bar shi ya wuce amma ba shi role na student
            setUser(currentUser);
            setRole("student");
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("AREWA SECURITY ERROR:", error);
        // Idan error ya faru, karya loading screen din ko ta halin kaka
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6 text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            AREWA SECURITY: VERIFYING...
          </p>
        </div>
      </div>
    );
  }

  // 1. Redirect idan ba'a yi login ba
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

  // 2. Redirect idan an dakatar
  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  // 3. Role-Based Access
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "admission-officer";

    let hasAccess = role === requiredRole || isSuperAdmin || isRector;

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
