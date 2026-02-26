import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// --- EXTERNAL LIBRARIES ---
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

// --- COMPONENTS & PAGES ---
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import StudentPortal from "./components/StudentPortal";
import StudentLogin from "./pages/StudentLogin";
import WeeklyForum from "./components/WeeklyForum";
import ForumDetails from "./components/ForumDetails";
import LMSDashboard from "./pages/LMSDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import Leaderboard from "./components/Leaderboard";
import InstructorHub from "./pages/InstructorHub";
import AdminGrading from "./pages/AdminGrading";
import AdminQuestionBank from "./pages/AdminQuestionBank";
import AdminCourseDashboard from "./pages/AdminCourseDashboard";
import AdminContentManager from "./components/AdminContentManager";
import ProtectedRoute from "./components/ProtectedRoute";
import AcademicExam from "./components/AcademicExam";
import AdmissionOfficerDashboard from "./pages/AdmissionOfficerDashboard";
import RectorDashboard from "./pages/RectorDashboard";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-primary font-black uppercase tracking-widest small">
          AVA System Initializing...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />

          {/* ADMIN GATEWAY */}
          <Route
            path="/admin-gateway"
            element={
              isAuthenticated ? (
                <Navigate to="/rector-dashboard" />
              ) : (
                <AdminLogin onLogin={setIsAuthenticated} />
              )
            }
          />

          {/* STUDENT PROTECTED ROUTES */}
          <Route
            path="/student-portal"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <LMSDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/:courseId/:weekId"
            element={
              <ProtectedRoute requiredRole="student">
                <WeeklyForumWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum-thread/:threadId"
            element={
              <ProtectedRoute requiredRole="student">
                <ForumDetails darkMode={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:courseId/:weekId"
            element={
              <ProtectedRoute requiredRole="student">
                <AcademicExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rankings/:courseId"
            element={
              <ProtectedRoute requiredRole="student">
                <LeaderboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e-library"
            element={
              <ProtectedRoute requiredRole="student">
                <Library />
              </ProtectedRoute>
            }
          />

          {/* STAFF & EXECUTIVE ROUTES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdmissionOfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor-dashboard"
            element={
              <ProtectedRoute requiredRole="supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rector-dashboard"
            element={
              <ProtectedRoute requiredRole="rector">
                <RectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor-hub"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorHub isAdmin={false} />
              </ProtectedRoute>
            }
          />

          {/* LEGACY ADMIN TOOLS */}
          <Route
            path="/admin-manager"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminContentManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-portal"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard QRCodeSVG={QRCodeSVG} />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- HELPERS & STATIC PAGES (Suna nan kamar yadda ka kawo su) ---
const WeeklyForumWrapper = () => {
  const { courseId, weekId } = useParams();
  return <WeeklyForum courseId={courseId} weekId={parseInt(weekId)} />;
};

const LeaderboardWrapper = () => {
  const { courseId } = useParams();
  return (
    <div
      style={{
        padding: "100px 20px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Leaderboard courseId={courseId} />
    </div>
  );
};

const Library = () => (
  <div
    className="container mt-5 pt-5 text-center"
    style={{ minHeight: "80vh" }}
  >
    <h1 className="fw-black italic text-blue-600">AVA E-LIBRARY</h1>
    <p className="font-bold text-muted">
      Access our global travel and hospitality resources here.
    </p>
  </div>
);

const Gallery = () => (
  <div className="container mt-5 pt-5" style={{ minHeight: "80vh" }}>
    <h1 className="text-center mb-4 fw-black italic">AVA GALLERY</h1>
    <div className="row g-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-md-4">
          <img
            src={`https://via.placeholder.com/300?text=AVA+Event+${i}`}
            className="img-fluid rounded-4 shadow-sm"
            alt="Gallery"
          />
        </div>
      ))}
    </div>
  </div>
);

export default App;
