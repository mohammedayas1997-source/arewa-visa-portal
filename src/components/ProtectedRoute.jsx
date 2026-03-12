import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase"; 
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
          // Duba cikin 'users' collection
          const userRef = doc(firestore, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // SMART DETECTION: Karatun Role da Status koda da manyan haruffa aka rubuta
            const userRole = (userData.role || userData.Role || "").toLowerCase();
            const userStatus = (userData.status || userData.Status || "active").toLowerCase();

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
            // Idan ba a samu a 'users' ba, duba 'applications' (na dalibai)
            const appRef = doc(firestore, "applications", currentUser.uid);
            const appDoc = await getDoc(appRef);
            
            if (appDoc.exists()) {
                setRole("student");
                setStatus("active");
                setUser(currentUser);
            } else {
                setUser(currentUser);
                setRole(null);
            }
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
    // Tabbatar idan staff ne a tura shi Admin Gateway
    const isStaffPath = ["/admin", "/super", "/rector", "/staff"].some((path) =>
      location.pathname.includes(path),
    );
    const loginPath = isStaffPath ? "/admin-gateway" : "/login";

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 4. ROLE BASED ACCESS CONTROL (RBAC) - GYARARRE
  if (requiredRole) {
    const isSuperAdmin = role === "super-admin";
    const isRector = role === "rector";
    const isAdmin = role === "admin" || role === "instructor";
    const isAdmissionOfficer = role === "admission-officer";

    let hasAccess = false;

    // Super Admin da Rector suna iya shiga ko'ina
    if (isSuperAdmin || isRector) {
      hasAccess = true;
    } 
    // Idan shafin na admin ne gaba daya (General Admin area)
    else if (requiredRole === "admin") {
      hasAccess = isAdmin || isAdmissionOfficer;
    } 
    // Idan shafin na dalibai ne kawai
    else if (requiredRole === "student") {
      hasAccess = role === "student";
    } 
    // Idan takamaiman role aka nema (misali instructor kawai)
    else {
      hasAccess = role === requiredRole;
    }

    if (!hasAccess) {
      let redirectPath = "/login";
      if (role === "student") redirectPath = "/student-portal";
      else if (isSuperAdmin || isRector || isAdmin || isAdmissionOfficer) redirectPath = "/admin";

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;