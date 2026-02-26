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
              setUser(null);
              setRole(null);
              setStatus("suspended");
            } else {
              setRole(userData.role);
              setStatus(userData.status || "active");
              setUser(currentUser);
            }
          } else {
            setUser(currentUser);
            setRole(null);
          }
        } else {
          setUser(null);
          setRole(null);
          setStatus(null);
        }
      } catch (error) {
        console.error("AVA Security Gateway Error:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6 text-white">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-blue-500">
            AVA SECURITY: Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  if (!user) {
    // Idan ba a yi login ba, duba ko shafin ma'aikata ne ko na dalibai
    const isStaffRoute =
      location.pathname.includes("admin") ||
      location.pathname.includes("rector") ||
      location.pathname.includes("supervisor");
    return (
      <Navigate
        to={isStaffRoute ? "/admin-gateway" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRole) {
    // Tabbatar muna duba roles din daidai
    const isAdmin =
      role === "admin" ||
      role === "admission-officer" ||
      role === "super-admin";
    const isRector = role === "rector" || role === "authority";
    const isSupervisor = role === "supervisor";
    const isStudent = role === "student";

    // 1. Master access ga Rector da Admin a wasu shafukan
    let hasAccess = role === requiredRole;

    if (requiredRole === "admin") {
      hasAccess = isAdmin || isRector || isSupervisor;
    }

    if (requiredRole === "student") {
      hasAccess = isStudent;
    }

    if (!hasAccess) {
      // Idan bashi da ikon shiga wannan shafin, kai shi dashboard dinsa na asali
      if (isStudent) return <Navigate to="/student-portal" replace />;
      if (isRector) return <Navigate to="/rector-dashboard" replace />;
      if (isAdmin) return <Navigate to="/admin-dashboard" replace />;
      if (isSupervisor) return <Navigate to="/supervisor-dashboard" replace />;

      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
