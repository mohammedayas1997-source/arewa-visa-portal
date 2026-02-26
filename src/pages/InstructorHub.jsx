import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Path corrected to ../firebase
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Send,
  LayoutDashboard,
  Users,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

const InstructorHub = ({ isAdmin = false }) => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    deadline: "",
    points: "",
  });
  const [loading, setLoading] = useState(false);

  // Sync Assignments
  useEffect(() => {
    const q = isAdmin
      ? query(collection(db, "assignments"), orderBy("createdAt", "desc"))
      : query(
          collection(db, "assignments"),
          where("instructorId", "==", auth.currentUser?.uid || ""),
        );

    const unsub = onSnapshot(q, (snap) => {
      setAssignments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [isAdmin]);

  const handlePostAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "assignments"), {
        ...newAssignment,
        instructorId: auth.currentUser.uid,
        instructorName: auth.currentUser.displayName || "Academy Instructor",
        createdAt: serverTimestamp(),
        status: "active",
      });
      alert("ACADEMIC_LOG: Arewa Visa Assignment Published Successfully.");
      setNewAssignment({ title: "", course: "", deadline: "", points: "" });
    } catch (err) {
      alert("SYSTEM_ERROR: Could not publish assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fcfcfd",
        padding: "40px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          marginBottom: "48px",
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
              letterSpacing: "-0.05em",
              fontStyle: "italic",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {isAdmin ? "Global Academic Oversight" : "Instructor Command Hub"}
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontWeight: "900",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              marginTop: "8px",
            }}
          >
            Arewa Visa Academy | Status:{" "}
            <span style={{ color: "#2563eb" }}>
              {isAdmin ? "Full Authority Mode" : "Instructional Access"}
            </span>
          </p>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "40px",
        }}
      >
        {/* LEFT: Assignment Creator */}
        {!isAdmin && (
          <div style={{ flex: 1 }}>
            <div
              style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "3rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
                border: "1px solid #f1f5f9",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "900",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  marginBottom: "32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#0f172a",
                }}
              >
                <UploadCloud style={{ color: "#2563eb" }} /> New Tasking
              </h3>
              <form
                onSubmit={handlePostAssignment}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <input
                  required
                  style={inputStyle}
                  placeholder="ASSIGNMENT TITLE"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                />
                <select
                  required
                  style={inputStyle}
                  value={newAssignment.course}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      course: e.target.value,
                    })
                  }
                >
                  <option value="">SELECT COURSE</option>
                  <option value="Visa Consultancy">VISA CONSULTANCY</option>
                  <option value="Travel Management">TRAVEL MANAGEMENT</option>
                  <option value="Hospitality & Tourism">
                    HOSPITALITY & TOURISM
                  </option>
                  <option value="International Law">INTERNATIONAL LAW</option>
                  <option value="Professional Ethics">
                    PROFESSIONAL ETHICS
                  </option>
                </select>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <input
                    required
                    type="date"
                    style={inputStyle}
                    value={newAssignment.deadline}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        deadline: e.target.value,
                      })
                    }
                  />
                  <input
                    required
                    type="number"
                    style={inputStyle}
                    placeholder="POINTS"
                    value={newAssignment.points}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        points: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "20px",
                    backgroundColor: "#0f172a",
                    color: "white",
                    borderRadius: "1.5rem",
                    border: "none",
                    fontWeight: "900",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    cursor: "pointer",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {loading ? "PROVISIONING..." : "DISPATCH ASSIGNMENT"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* RIGHT: Assignment Monitoring Feed */}
        <div
          style={{
            flex: isAdmin ? "1" : "2",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              marginBottom: "16px",
            }}
          >
            Academic Dispatch Feed
          </h3>
          {assignments.length === 0 && (
            <p
              style={{
                color: "#94a3b8",
                fontWeight: "bold",
                textAlign: "center",
                padding: "40px",
              }}
            >
              No active assignments found.
            </p>
          )}
          {assignments.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "2.5rem",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                transition: "0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "1.25rem",
                      color: "#0f172a",
                    }}
                  >
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "900",
                        color: "#0f172a",
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        color: "#2563eb",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: "4px",
                        margin: 0,
                      }}
                    >
                      {task.course}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#fffbeb",
                    color: "#b45309",
                    fontSize: "9px",
                    fontWeight: "900",
                    borderRadius: "99px",
                    textTransform: "uppercase",
                    border: "1px solid #fef3c7",
                  }}
                >
                  Due: {task.deadline}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "24px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "24px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#64748b",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    <Users size={14} /> 0 Active Submissions
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#64748b",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    <CheckCircle size={14} /> {task.points} Academic Points
                  </div>
                </div>
                {isAdmin && (
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      color: "#cbd5e1",
                      textTransform: "uppercase",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    Instructor: {task.instructorName}
                  </p>
                )}
                <button
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    fontWeight: "900",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Review Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "20px",
  backgroundColor: "#f8fafc",
  border: "2px solid transparent",
  borderRadius: "1.5rem",
  fontWeight: "700",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export default InstructorHub;
