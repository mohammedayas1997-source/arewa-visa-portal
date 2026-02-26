import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Adjusted to your standard path
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

            // SECURITY CHECK: Suspension Protocols
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
            // No profile found in Firestore
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

  // Handle Suspended Accounts
  if (status === "suspended") {
    return (
      <Navigate
        to="/login"
        state={{ error: "Account Suspended by AVA Authority" }}
        replace
      />
    );
  }

  // Handle Unauthenticated Users
  if (!user) {
    const isStaffRoute =
      location.pathname.includes("admin") ||
      location.pathname.includes("super") ||
      location.pathname.includes("supervisor") ||
      location.pathname.includes("rector");

    const loginPath = isStaffRoute ? "/admin-login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // --- ROLE BASED ACCESS CONTROL (RBAC) ---
  if (requiredRole) {
    const isSuperAdmin = role === "SUPER_ADMIN" || role === "super-admin";
    const isRector = role === "rector" || role === "authority";
    const isSupervisor = role === "supervisor";
    const isAdmissionOfficer = role === "admission-officer";
    const isAdminGeneral = role === "admin" || role === "instructor";

    // Access Logic: SuperAdmin and Rector have master keys
    const hasAccess =
      isSuperAdmin ||
      isRector ||
      role === requiredRole ||
      (requiredRole === "admin" &&
        (isAdminGeneral || isAdmissionOfficer || isSupervisor));

    if (!hasAccess) {
      // Dynamic Redirection based on actual role if user hits a wrong wall
      let redirectPath = "/student-portal";

      if (isSuperAdmin) redirectPath = "/super-admin-dashboard";
      else if (isRector) redirectPath = "/rector-dashboard";
      else if (isSupervisor) redirectPath = "/supervisor-dashboard";
      else if (isAdmissionOfficer) redirectPath = "/admin-dashboard";
      else if (isAdminGeneral) redirectPath = "/admin-dashboard";

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
