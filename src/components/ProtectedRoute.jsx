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

            // Tabbatar idan account din a raye yake
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
            // Idan babu shi a Firestore, to bashi da role
            setUser(currentUser);
            setRole(null);
          }
        } else {
          setUser(null);
          setRole(null);
          setStatus(null);
        }
      } catch (error) {
        console.error("Security Gateway Error:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 1. LOADING SCREEN (AREWA THEMED)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-emerald-600 rounded-full animate-reverse-spin"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">
            Verifying <span className="text-red-600">Arewa</span> Security...
          </p>
        </div>
      </div>
    );
  }

  // 2. SUSPENDED REDIRECTION
  if (status === "suspended") {
    return (
      <Navigate to="/login" state={{ error: "Account Suspended" }} replace />
    );
  }

  // 3. UNAUTHENTICATED REDIRECTION
  if (!user) {
    const isAuthorityRoute =
      location.pathname.includes("admin") ||
      location.pathname.includes("super") ||
      location.pathname.includes("supervisor") ||
      location.pathname.includes("rector") ||
      location.pathname.includes("staff");

    const loginPath = isAuthorityRoute ? "/admin-gateway" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 4. ROLE BASED ACCESS CONTROL (RBAC)
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "AdminContentManager";
    const isAdmissionOfficer = role === "admission-officer";
    const isStaff = role === "staff" || role === "instructor";

    // Ikon shiga (Access Logic)
    let hasAccess = false;

    if (isSuperAdmin || isRector) {
      hasAccess = true; // Wadannan suna shiga ko ina
    } else if (requiredRole === "admin") {
      // Idan ana neman admin, super admin/rector/admin/admission officer duk zasu iya shiga
      hasAccess = isAdmin || isAdmissionOfficer;
    } else if (requiredRole === "student") {
      hasAccess = role === "student";
    } else {
      hasAccess = role === requiredRole;
    }

    if (!hasAccess) {
      // Dynamic Redirection idan baka da dama
      let redirectPath = "/login";

      if (role === "student") redirectPath = "/student-portal";
      else if (isSuperAdmin) redirectPath = "/super-admin";
      else if (isRector) redirectPath = "/rector";
      else if (isAdmissionOfficer) redirectPath = "/admin";
      else if (isAdmin) redirectPath = "/admin-dashboard";
      else if (isStaff) redirectPath = "/staff-dashboard";

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
