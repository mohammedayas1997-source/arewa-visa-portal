import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
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

            // SMART DETECTION: Check for 'role' or 'Role' and 'status' or 'Status'
            const userRole = userData.role || userData.Role;
            const userStatus = userData.status || userData.Status || "active";

            if (userStatus === "suspended" || userStatus === "inactive") {
              await signOut(auth);
              setUser(null);
              setRole(null);
              setStatus("suspended");
            } else {
              setRole(userRole);
              setStatus(userStatus);
              setUser(currentUser);
            }
          } else {
            // User authenticated but no profile found in Firestore
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

  // 1. LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(220, 38, 38, 0.2)",
              borderTopColor: "#dc2626",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p
            style={{
              color: "#475569",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "3px",
            }}
          >
            Verifying <span style={{ color: "#dc2626" }}>Security</span>...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    // Determine if the user was trying to access a staff area
    const isStaffPath = ["/admin", "/super", "/rector", "/staff"].some((path) =>
      location.pathname.includes(path),
    );
    const loginPath = isStaffPath ? "/admin-gateway" : "/login";

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 4. ROLE BASED ACCESS CONTROL (RBAC)
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "AdminContentManager";
    const isAdmissionOfficer = role === "admission-officer";
    const isStaff = role === "staff" || role === "instructor";

    let hasAccess = false;

    if (isSuperAdmin || isRector) {
      hasAccess = true;
    } else if (requiredRole === "admin") {
      hasAccess = isAdmin || isAdmissionOfficer;
    } else if (requiredRole === "student") {
      hasAccess = role === "student";
    } else {
      hasAccess = role === requiredRole;
    }

    if (!hasAccess) {
      // Redirect based on the role they actually have
      let redirectPath = "/login";
      if (role === "student") redirectPath = "/student-portal";
      else if (isSuperAdmin) redirectPath = "/super-admin";
      else if (isRector) redirectPath = "/rector";
      else if (isAdmissionOfficer || isAdmin) redirectPath = "/admin";
      else if (isStaff) redirectPath = "/staff-dashboard";

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
