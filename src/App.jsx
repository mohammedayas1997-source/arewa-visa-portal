import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { auth, db } from './firebase'; 
import { ref, set } from 'firebase/database'; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
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
import StaffLogin from "./pages/StaffLogin";
import AdmissionOfficerDashboard from "./pages/AdmissionOfficerDashboard.jsx";
import RectorDashboard from "./pages/RectorDashboard.jsx";
// IMPORT THE FORM COMPONENT
import CourseApplicationForm from "./components/CourseApplicationForm"; 

import "./App.css";

// --- STATIC PAGES ---
const Library = () => (
  <div className="container mt-5 pt-5 text-center" style={{ minHeight: "80vh" }}>
    <h1 className="fw-black italic text-blue-600">AVA E-LIBRARY</h1>
    <p className="font-bold text-muted">Access our global travel and hospitality resources here.</p>
  </div>
);

const Gallery = () => (
  <div className="container mt-5 pt-5" style={{ minHeight: "80vh" }}>
    <h1 className="text-center mb-4 fw-black italic">AVA GALLERY</h1>
    <div className="row g-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-md-4">
          <img src={`https://via.placeholder.com/300?text=AVA+Event+${i}`} className="img-fluid rounded-4 shadow-sm" alt="Gallery" />
        </div>
      ))}
    </div>
  </div>
);

// --- WRAPPER FOR LOGIN PAGES TO HANDLE CLOSE BUTTON ---
const StudentLoginWithClose = () => {
  const navigate = useNavigate();
  return <StudentLogin onClose={() => navigate("/")} />;
};

const StaffLoginWithClose = () => {
  const navigate = useNavigate();
  return <StaffLogin onClose={() => navigate("/")} />;
};

// WRAPPER FOR THE APPLICATION FORM TO HANDLE CLOSE BUTTON
const ApplyFormWrapper = () => {
  const navigate = useNavigate();
  return <CourseApplicationForm showCourseForm={true} setShowCourseForm={() => navigate("/")} />;
};

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

  const approveAndSendCertificate = async (student) => {
    const completionDate = document.getElementById(`date-${student.id}`)?.value;
    const courseTitle = document.getElementById(`course-${student.id}`)?.value;
    if (!completionDate) {
      alert("ERROR: Please select a Completion Date!");
      return;
    }
    const certificateID = `AVA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    try {
      await setDoc(doc(db, "issuedCertificates", certificateID), {
        certificateID,
        studentId: student.id,
        studentName: student.fullName,
        courseTitle: courseTitle || student.selectedCourse,
        completionDate,
        issuedAt: serverTimestamp(),
        isValid: true,
      });
      const input = document.getElementById(`cert-pdf-${student.id}`);
      if (!input) { alert("CRITICAL ERROR: Certificate template not found!"); return; }
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "px", [1050, 750]);
      pdf.addImage(imgData, "PNG", 0, 0, 1050, 750);
      pdf.save(`AVA-${student.fullName}-Certificate.pdf`);
      alert(`SUCCESS: Certificate generated for ${student.fullName}.`);
    } catch (err) { alert("SYSTEM ERROR: Failed to generate certificate: " + err.message); }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-primary font-black uppercase tracking-widest small">AVA System Initializing...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* THE NEW APPLICATION LINK */}
          <Route path="/apply" element={<ApplyFormWrapper />} />
          
          <Route path="/login" element={<StudentLoginWithClose />} />
          <Route path="/student-login" element={<StudentLoginWithClose />} />
          <Route path="/admin-gateway" element={<StaffLoginWithClose />} />

          <Route path="/student-portal" element={<ProtectedRoute requiredRole="student"><StudentPortal /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><LMSDashboard /></ProtectedRoute>} />
          <Route path="/forum/:courseId/:weekId" element={<ProtectedRoute requiredRole="student"><WeeklyForumWrapper /></ProtectedRoute>} />
          <Route path="/forum-thread/:threadId" element={<ProtectedRoute requiredRole="student"><ForumDetails darkMode={true} /></ProtectedRoute>} />
          <Route path="/exam/:courseId/:weekId" element={<ProtectedRoute requiredRole="student"><AcademicExam /></ProtectedRoute>} />
          <Route path="/rankings/:courseId" element={<ProtectedRoute requiredRole="student"><LeaderboardWrapper /></ProtectedRoute>} />
          <Route path="/e-library" element={<ProtectedRoute requiredRole="student"><Library /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdmissionOfficerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdmissionOfficerDashboard /></ProtectedRoute>} />
          <Route path="/supervisor-dashboard" element={<ProtectedRoute requiredRole="supervisor"><SupervisorDashboard /></ProtectedRoute>} />
          <Route path="/rector-dashboard" element={<ProtectedRoute requiredRole="rector"><RectorDashboard /></ProtectedRoute>} />
          <Route path="/admin-manager" element={<ProtectedRoute requiredRole="admin"><AdminContentManager /></ProtectedRoute>} />
          <Route path="/admin/question-bank/:courseId" element={<ProtectedRoute requiredRole="admin"><AdminQuestionBank /></ProtectedRoute>} />
          <Route path="/admin/course-dashboard/:courseId" element={<ProtectedRoute requiredRole="admin"><AdminCourseDashboard /></ProtectedRoute>} />
          <Route path="/admin/grading/:courseId" element={<ProtectedRoute requiredRole="admin"><AdminGrading /></ProtectedRoute>} />
          <Route path="/admin-portal" element={<ProtectedRoute requiredRole="admin"><AdminDashboard approveAndSendCertificate={approveAndSendCertificate} QRCodeSVG={QRCodeSVG} /></ProtectedRoute>} />
          <Route path="/instructor-hub" element={<ProtectedRoute requiredRole="instructor"><InstructorHub isAdmin={false} /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

const WeeklyForumWrapper = () => {
  const { courseId, weekId } = useParams();
  return <WeeklyForum courseId={courseId} weekId={parseInt(weekId)} />;
};

const LeaderboardWrapper = () => {
  const { courseId } = useParams();
  return <div style={{ padding: "100px 20px", backgroundColor: "#f8fafc", minHeight: "100vh" }}><Leaderboard courseId={courseId} /></div>;
};

export default App;