import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Path ya koma ../firebase
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import {
  CheckCircle,
  Clock,
  User,
  ArrowLeft,
  FileText,
  AlertCircle,
} from "lucide-react";

const AdminGrading = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeInput, setGradeInput] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "submissions"),
          where("courseId", "==", courseId),
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(0),
        }));

        setSubmissions(data.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("🔥 Arewa Visa Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchSubmissions();
  }, [courseId]);

  const handleGrade = async (subId) => {
    const grade = gradeInput[subId];

    if (grade === undefined || grade === "" || grade < 0 || grade > 100) {
      return alert("Kuskure: Shigar da maki tsakanin 0 zuwa 100.");
    }

    setUpdatingId(subId);
    try {
      const subRef = doc(db, "submissions", subId);
      const finalGrade = Number(grade);

      await updateDoc(subRef, {
        grade: finalGrade,
        graded: true,
        gradedAt: new Date(),
        status: finalGrade >= 50 ? "passed" : "failed",
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === subId ? { ...s, grade: finalGrade, graded: true } : s,
        ),
      );

      alert("Academic Record: Maki ya hau daram!");
    } catch (error) {
      console.error("🔥 Grading Error:", error);
      alert("An samu matsala wurin tura makin.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#64748b",
            fontWeight: "900",
            marginBottom: "32px",
            cursor: "pointer",
            textTransform: "uppercase",
            fontSize: "10px",
            letterSpacing: "0.1em",
          }}
        >
          <ArrowLeft size={16} /> Back to Terminal
        </button>

        <header
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "900",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              Grading Center
            </h1>
            <p
              style={{
                color: "#2563eb",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "10px",
                marginTop: "8px",
              }}
            >
              Arewa Visa Academy | Course: {courseId?.replace(/_/g, " ")}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "16px 32px",
              borderRadius: "2rem",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Pending Review
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#f97316",
                  margin: 0,
                }}
              >
                {submissions.filter((s) => !s.graded).length}
              </p>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fff7ed",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f97316",
              }}
            >
              <Clock size={24} />
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <p
              style={{
                fontWeight: "900",
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                fontSize: "12px",
              }}
            >
              Synchronizing Records...
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {submissions.length === 0 ? (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "80px",
                  borderRadius: "3rem",
                  textAlign: "center",
                  border: "2px dashed #e2e8f0",
                }}
              >
                <FileText
                  size={48}
                  style={{ margin: "0 auto 16px", color: "#e2e8f0" }}
                />
                <p
                  style={{
                    fontWeight: "900",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  No student submissions found.
                </p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "3rem",
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    flexWrap: "wrap",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{ flex: "1", padding: "40px", minWidth: "300px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "24px",
                      }}
                    >
                      <span
                        style={{
                          padding: "8px 16px",
                          borderRadius: "12px",
                          fontSize: "10px",
                          fontWeight: "900",
                          textTransform: "uppercase",
                          backgroundColor: sub.graded ? "#f0fdf4" : "#eff6ff",
                          color: sub.graded ? "#16a34a" : "#2563eb",
                        }}
                      >
                        {sub.weekId ? `Week ${sub.weekId}` : "Special Project"}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "900",
                          fontSize: "12px",
                          color: "#1e293b",
                          textTransform: "uppercase",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94a3b8",
                          }}
                        >
                          <User size={14} />
                        </div>
                        {sub.userName || "Elite Student"}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "32px",
                        borderRadius: "2rem",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <p
                        style={{
                          color: "#475569",
                          fontWeight: "600",
                          lineHeight: "1.7",
                          margin: 0,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {sub.content}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "320px",
                      padding: "40px",
                      backgroundColor: sub.graded ? "#16a34a" : "#0f172a",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      transition: "0.5s",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: "24px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Module Grading
                    </p>

                    {sub.graded ? (
                      <div style={{ textAlign: "center", color: "white" }}>
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                          }}
                        >
                          <CheckCircle size={32} />
                        </div>
                        <p
                          style={{
                            fontSize: "4rem",
                            fontWeight: "900",
                            margin: 0,
                            letterSpacing: "-0.05em",
                          }}
                        >
                          {sub.grade}%
                        </p>
                        <p
                          style={{
                            fontSize: "9px",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            marginTop: "12px",
                            opacity: 0.6,
                          }}
                        >
                          Verified & Published
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <input
                            type="number"
                            placeholder="00"
                            value={gradeInput[sub.id] || ""}
                            onChange={(e) =>
                              setGradeInput({
                                ...gradeInput,
                                [sub.id]: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              backgroundColor: "rgba(255,255,255,0.1)",
                              border: "2px solid rgba(255,255,255,0.1)",
                              borderRadius: "1.25rem",
                              padding: "24px",
                              textAlign: "center",
                              fontSize: "32px",
                              fontWeight: "900",
                              color: "white",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "24px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "rgba(255,255,255,0.2)",
                              fontWeight: "900",
                              fontSize: "20px",
                            }}
                          >
                            %
                          </span>
                        </div>
                        <button
                          disabled={updatingId === sub.id}
                          onClick={() => handleGrade(sub.id)}
                          style={{
                            width: "100%",
                            padding: "20px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            borderRadius: "1.25rem",
                            border: "none",
                            fontWeight: "900",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "0.3s",
                          }}
                        >
                          {updatingId === sub.id
                            ? "Processing..."
                            : "Commit Grade"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGrading;
