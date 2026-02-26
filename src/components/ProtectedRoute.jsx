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

            // SECURITY: Idan an dakatar da ma'aikaci ko dalibi
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
            // Idan babu record a Firestore
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

  // Idan an dakatar da account din
  if (status === "suspended") {
    return (
      <Navigate
        to="/login"
        state={{ error: "Account Suspended by Authority" }}
        replace
      />
    );
  }

  // Idan ba'a yi login ba
  if (!user) {
    const isStaffRoute =
      location.pathname.includes("admin") ||
      location.pathname.includes("rector") ||
      location.pathname.includes("supervisor");

    // Idan ma'aikaci ne ka kai shi gateway, idan dalibi ne ka kai shi login na dalibai
    return (
      <Navigate
        to={isStaffRoute ? "/admin-gateway" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // --- ROLE BASED ACCESS CONTROL (RBAC) ---
  if (requiredRole) {
    // Tace dukkan roles din da suka dace
    const isSuperAdmin = role === "SUPER_ADMIN" || role === "super-admin";
    const isRector = role === "rector" || role === "authority";
    const isSupervisor = role === "supervisor";
    const isAdmin =
      role === "admin" || role === "admission-officer" || isSuperAdmin;
    const isStudent = role === "student";

    let hasAccess = false;

    // 1. Logic na bangaren Admin
    if (requiredRole === "admin") {
      hasAccess = isAdmin || isRector || isSupervisor;
    }
    // 2. Logic na bangaren Student
    else if (requiredRole === "student") {
      hasAccess = isStudent;
    }
    // 3. Logic na wasu shafukan (Rector ko Supervisor kawai)
    else {
      hasAccess = role === requiredRole || isRector || isSuperAdmin;
    }

    if (!hasAccess) {
      // Idan bashi da izini, kai kowa inda ya dace da matsayinsa
      if (isStudent) return <Navigate to="/student-portal" replace />;
      if (isRector || isSuperAdmin)
        return <Navigate to="/rector-dashboard" replace />;
      if (isSupervisor) return <Navigate to="/supervisor-dashboard" replace />;
      if (isAdmin) return <Navigate to="/admin-dashboard" replace />;

      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
