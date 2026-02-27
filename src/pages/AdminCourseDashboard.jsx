import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Path corrected to ../firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  Users,
  HelpCircle,
  FileText,
  ChevronLeft,
  Bell,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import AdminChatNotification from "../components/AdminChatNotification";

const AdminCourseDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, pendingExams: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    // 1. Live Listener for Enrollments (Student users who selected this course)
    const enrollQuery = query(
      collection(db, "users"),
      where("selectedCourseId", "==", courseId),
      where("role", "==", "student"),
    );
    const unsubEnroll = onSnapshot(
      enrollQuery,
      (snap) => {
        setStats((prev) => ({ ...prev, students: snap.size }));
        setLoading(false);
      },
      (error) => console.error("Enrollment Listener Error:", error),
    );

    // 2. Live Listener for Pending Submissions
    const examQuery = query(
      collection(db, "submissions"),
      where("courseId", "==", courseId),
      where("graded", "==", false),
    );
    const unsubExams = onSnapshot(
      examQuery,
      (snap) => {
        setStats((prev) => ({ ...prev, pendingExams: snap.size }));
      },
      (error) => console.error("Exam Listener Error:", error),
    );

    return () => {
      unsubEnroll();
      unsubExams();
    };
  }, [courseId]);

  const menuItems = [
    {
      name: "Questions Bank",
      icon: <HelpCircle size={20} />,
      path: `/admin/question-bank/${courseId}`,
    },
    {
      name: "Student Grading",
      icon: <FileText size={20} />,
      path: `/admin/grading/${courseId}`,
    },
    {
      name: "Enrolled Students",
      icon: <Users size={20} />,
      path: `/admin/students/${courseId}`,
    },
    {
      name: "Forum Patrol",
      icon: <MessageSquare size={20} />,
      path: `/forum/${courseId}/1`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "320px",
          backgroundColor: "white",
          borderRight: "1px solid #f1f5f9",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "40px",
            cursor: "pointer",
            color: "#94a3b8",
            fontWeight: "900",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
          onClick={() => navigate("/supervisor-node")}
        >
          <ChevronLeft size={16} /> Back to Node
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            color: "#0f172a",
            marginBottom: "40px",
            fontStyle: "italic",
            letterSpacing: "-0.05em",
          }}
        >
          AVA <span style={{ color: "#2563eb" }}>ADMIN</span>
        </h1>

        <nav
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                borderRadius: "1.25rem",
                border: "none",
                backgroundColor: "transparent",
                color: "#64748b",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <div
          style={{
            padding: "24px",
            backgroundColor: "#f8fafc",
            borderRadius: "2rem",
            border: "1px solid #f1f5f9",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: "900",
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Active Context
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "900",
              color: "#1e293b",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {courseId?.replace(/_/g, " ")}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "40px 60px" }}>
        <header
          style={{
            marginBottom: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <p
              style={{
                color: "#2563eb",
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "0.4em",
                marginBottom: "8px",
              }}
            >
              Management Suite
            </p>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                color: "#0f172a",
                textTransform: "capitalize",
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              {courseId?.replace(/_/g, " ")}
            </h2>
          </div>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            <Bell size={20} />
          </div>
        </header>
        <AdminChatNotification courseId={courseId} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Stats Card 1: Students */}
          <div
            style={{
              backgroundColor: "#2563eb",
              padding: "40px",
              borderRadius: "3.5rem",
              color: "white",
              boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Users
              style={{
                position: "absolute",
                right: "-16px",
                bottom: "-16px",
                width: "160px",
                height: "160px",
                opacity: 0.1,
              }}
            />
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                opacity: 0.8,
                margin: "0 0 4px 0",
              }}
            >
              Enrolled Students
            </h3>
            <p
              style={{
                fontSize: "5rem",
                fontWeight: "900",
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              {loading ? "---" : stats.students}
            </p>
            <button
              onClick={() => navigate(`/admin/students/${courseId}`)}
              style={{
                marginTop: "32px",
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              View Roster
            </button>
          </div>

          {/* Stats Card 2: Exams */}
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "3.5rem",
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <FileText
              style={{
                position: "absolute",
                right: "-16px",
                bottom: "-16px",
                width: "160px",
                height: "160px",
                color: "#f8fafc",
              }}
            />
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "900",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              Grading Queue
            </h3>
            <p
              style={{
                fontSize: "5rem",
                fontWeight: "900",
                color: "#2563eb",
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              {loading ? "---" : stats.pendingExams}
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "0.1em",
                marginTop: "8px",
              }}
            >
              Unmarked Submissions
            </p>
            <button
              onClick={() => navigate(`/admin/grading/${courseId}`)}
              style={{
                marginTop: "32px",
                backgroundColor: "#0f172a",
                color: "white",
                border: "none",
                padding: "12px 32px",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              Start Grading
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "48px" }}>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              marginBottom: "24px",
            }}
          >
            Quick Actions
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                style={{
                  backgroundColor: "white",
                  padding: "24px",
                  borderRadius: "2rem",
                  border: "1px solid #f1f5f9",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "center",
                  transition: "0.3s",
                }}
              >
                <div
                  style={{
                    color: "#2563eb",
                    backgroundColor: "#eff6ff",
                    padding: "12px",
                    borderRadius: "1rem",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    color: "#334155",
                  }}
                >
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCourseDashboard;
