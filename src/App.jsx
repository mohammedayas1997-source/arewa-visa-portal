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
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

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

// GYARA: Mun cire ./src/ domin imports suyi aiki madaidaici
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

  // --- CERTIFICATE GENERATION LOGIC (AREWA VISA ACADEMY OFFICIAL) ---
  const approveAndSendCertificate = async (student) => {
    const completionDate = document.getElementById(`date-${student.id}`)?.value;
    const courseTitle = document.getElementById(`course-${student.id}`)?.value;

    if (!completionDate) {
      alert("Error: Please select a Completion Date!");
      return;
    }

    const certificateID = `AVA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      // 1. Update Firestore
      await setDoc(doc(db, "issuedCertificates", certificateID), {
        certificateID,
        studentId: student.id,
        studentName: student.fullName,
        courseTitle: courseTitle || student.selectedCourse,
        completionDate,
        issuedAt: serverTimestamp(),
        isValid: true,
      });

      // 2. Generate PDF from DOM
      const input = document.getElementById(`cert-pdf-${student.id}`);
      if (!input) {
        alert("Certificate template not found!");
        return;
      }

      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("l", "px", [1050, 750]);
      pdf.addImage(imgData, "PNG", 0, 0, 1050, 750);

      // 3. Download PDF
      pdf.save(`AVA-${student.fullName}-Certificate.pdf`);

      alert(`Success! Certificate generated for ${student.fullName}.`);
    } catch (err) {
      alert("Error generating certificate: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-primary font-black uppercase tracking-widest small">
          AVA SYSTEM INITIALIZING...
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
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />

          {/* ADMIN GATEWAY */}
          <Route
            path="/admin-gateway"
            element={
              isAuthenticated ? (
                /* Idan mutum yana login, ProtectedRoute zai kula da redirection dinsa dashboard din da ya dace */
                <Navigate to="/rector-dashboard" replace />
              ) : (
                <AdminLogin onLogin={setIsAuthenticated} />
              )
            }
          />

          {/* STAFF & EXECUTIVE PROTECTED ROUTES */}
          <Route
            path="/rector-dashboard"
            element={
              <ProtectedRoute requiredRole="rector">
                <RectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rector"
            element={
              <ProtectedRoute requiredRole="rector">
                <RectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdmissionOfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
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

          {/* LEGACY & MANAGEMENT ROUTES */}
          <Route
            path="/admin-manager"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminContentManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/question-bank/:courseId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminQuestionBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/course-dashboard/:courseId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminCourseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/grading/:courseId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminGrading />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-portal"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard
                  approveAndSendCertificate={approveAndSendCertificate}
                  QRCodeSVG={QRCodeSVG}
                />
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

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- HELPER WRAPPERS ---
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

export default App;
