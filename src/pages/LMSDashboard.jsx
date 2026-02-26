import React from "react";
import { BookOpen, Trophy, Clock, CheckCircle } from "lucide-react";

const LMSDashboard = () => {
  // Jerin sunayen courses na Arewa Visa Academy
  const myCourses = [
    { title: "Visa Consultancy", progress: 45, status: "In Progress" },
    { title: "Travel Management", progress: 30, status: "In Progress" },
    { title: "Hospitality & Tourism", progress: 65, status: "In Progress" },
    { title: "International Law", progress: 10, status: "In Progress" },
    { title: "Customer Relations", progress: 20, status: "In Progress" },
    { title: "Digital Literacy", progress: 85, status: "In Progress" },
    { title: "Professional Ethics", progress: 100, status: "Completed" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "80px 20px 40px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0",
            }}
          >
            Welcome Back, Student! 👋
          </h1>
          <p style={{ color: "#64748b", fontWeight: "bold", marginTop: "5px" }}>
            Arewa Visa Academy | Continue your professional journey today.
          </p>
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              backgroundColor: "#2563eb",
              padding: "30px",
              borderRadius: "2rem",
              color: "white",
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
            }}
          >
            <BookOpen style={{ marginBottom: "16px", opacity: 0.8 }} />
            <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0" }}>
              {myCourses.length}
            </p>
            <p
              style={{
                opacity: 0.8,
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              Courses Enrolled
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#4f46e5",
              padding: "30px",
              borderRadius: "2rem",
              color: "white",
              boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
            }}
          >
            <Trophy style={{ marginBottom: "16px", opacity: 0.8 }} />
            <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0" }}>
              1
            </p>
            <p
              style={{
                opacity: 0.8,
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              Certificates Earned
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#059669",
              padding: "30px",
              borderRadius: "2rem",
              color: "white",
              boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.3)",
            }}
          >
            <CheckCircle style={{ marginBottom: "16px", opacity: 0.8 }} />
            <p style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0" }}>
              85%
            </p>
            <p
              style={{
                opacity: 0.8,
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              Average Score
            </p>
          </div>
        </div>

        {/* My Courses Section */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            marginBottom: "24px",
            color: "#0f172a",
            textTransform: "uppercase",
          }}
        >
          My Curriculum
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {myCourses.map((course, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "24px 32px",
                borderRadius: "1.5rem",
                border: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontWeight: "900",
                    fontSize: "1.1rem",
                    marginBottom: "12px",
                    color: "#1e293b",
                  }}
                >
                  {course.title}
                </h4>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#f1f5f9",
                    height: "8px",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        course.progress === 100 ? "#10b981" : "#2563eb",
                      height: "100%",
                      width: `${course.progress}%`,
                      transition: "width 1s ease-in-out",
                    }}
                  ></div>
                </div>
              </div>

              <div
                style={{
                  marginLeft: "40px",
                  textAlign: "right",
                  minWidth: "120px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "900",
                    color: course.progress === 100 ? "#059669" : "#2563eb",
                    textTransform: "uppercase",
                  }}
                >
                  {course.progress}% Complete
                </span>
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px 20px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    fontWeight: "900",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "0.2s",
                    textTransform: "uppercase",
                  }}
                >
                  {course.progress === 100 ? "Review" : "Resume"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LMSDashboard;
