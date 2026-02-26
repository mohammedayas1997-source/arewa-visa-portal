import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Adjusted to your standard path
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FileVideo,
  FileText,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Menu,
  X,
  Save,
  RefreshCcw,
  BookOpen,
  Calendar,
  Globe,
  Clock,
  ExternalLink,
  Zap,
  Timer,
  Trash2,
  History,
  Link as LinkIcon,
  AlertOctagon,
} from "lucide-react";

// 1. STYLING COMPONENTS (HOISTED)
const modeBtnStyle = (active, color) => ({
  padding: "12px 24px",
  borderRadius: "15px",
  border: active ? `2px solid ${color}` : "2px solid transparent",
  backgroundColor: active ? `${color}10` : "#f1f5f9",
  color: active ? color : "#64748b",
  fontWeight: 900,
  fontSize: "10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  transition: "0.3s",
});

const AdminContentManager = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("admin-theme") === "dark",
  );
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [deploymentMode, setDeploymentMode] = useState("scheduled");

  // Default course for Arewa Visa Academy
  const [selectedCourse, setSelectedCourse] = useState("visa_processing");
  const [weekNum, setWeekNum] = useState(1);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [updateHistory, setUpdateHistory] = useState([]);

  const [content, setContent] = useState({
    title: "",
    videoUrl: "",
    pdfNode: "",
    assignment: "",
    startDate: "",
    examRules:
      "1. No external resources.\n2. 60 Minutes duration.\n3. One attempt only.",
  });

  const [examData, setExamData] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      correctAnswer: "A",
    })),
  );

  // AREWA VISA ACADEMY OFFICIAL COURSES (TOTAL: 12)
  const availableCourses = [
    { id: "cleaning_course", name: "Cleaning Course" },
    { id: "housekeeping_course", name: "Housekeeping Course" },
    { id: "laundry_service", name: "Laundry Service Course" },
    { id: "visa_processing", name: "Visa Processing Course" },
    { id: "ticketing_reservation", name: "Ticketing & Reservation" },
    { id: "agency_management", name: "Agency Management" },
    { id: "customer_service", name: "Customer Service Course" },
    { id: "aircraft_cleaner", name: "Aircraft Cleaner Course" },
    { id: "security_training", name: "Security Training" },
    { id: "caregiver_nanny", name: "Caregiver - Nanny Course" },
    { id: "cargo_logistics", name: "Cargo & Logistics Course" },
    { id: "travel_tourism", name: "Travels and Tourism" },
  ];

  const libraryLinks = [
    {
      name: "IATA Publications",
      url: "https://www.iata.org/en/publications/manuals/",
      cat: "Aviation",
    },
    {
      name: "World Tourism Org",
      url: "https://www.unwto.org/",
      cat: "Tourism",
    },
    {
      name: "Global Visa Protocols",
      url: "https://scholar.google.com/",
      cat: "Legal",
    },
    {
      name: "Hospitality Standards",
      url: "https://www.hospitalitynet.org/",
      cat: "Hospitality",
    },
  ];

  const extractVideoID = (url) => {
    if (!url) return "";
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[7].length === 11) return match[7];
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    return shortsMatch ? shortsMatch[1] : url;
  };

  const getDocRef = () =>
    doc(db, "course_settings", `${selectedCourse}_week_${weekNum}`);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const q = query(
      collection(db, "deployment_logs"),
      orderBy("timestamp", "desc"),
      limit(10),
    );
    const unsub = onSnapshot(q, (snap) => {
      setUpdateHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      // ADJUSTED FOR 4 MONTHS SYSTEM (WEEK 8 & 16)
      const isExamWeek = weekNum === 8 || weekNum === 16;
      const payload = {
        title:
          content.title ||
          (isExamWeek
            ? weekNum === 8
              ? "Midterm Examination"
              : "Final Examination"
            : ""),
        startDate: new Date(content.startDate),
        updatedAt: serverTimestamp(),
        videoId: isExamWeek ? null : extractVideoID(content.videoUrl),
        pdfNode: isExamWeek ? null : content.pdfNode,
        assignment: isExamWeek ? null : content.assignment,
        exams: isExamWeek ? examData.filter((q) => q.question !== "") : null,
        examRules: isExamWeek ? content.examRules : null,
        durationMinutes: isExamWeek ? 60 : null,
      };
      await setDoc(getDocRef(), payload, { merge: true });
      await addDoc(collection(db, "deployment_logs"), {
        week: weekNum,
        course: selectedCourse,
        title: content.title || (isExamWeek ? "EXAM" : "SYNC"),
        mode: "scheduled",
        timestamp: serverTimestamp(),
        action: isExamWeek ? "EXAM_DEPLOY" : "SYNC_COMPLETE",
      });
      setLoading(false);
      alert(
        isExamWeek
          ? "EXAM SCHEDULED: Access will open at set time."
          : "CONTENT SCHEDULED: Success.",
      );
    } catch (err) {
      setLoading(false);
      alert("SYNC_FAILURE: " + err.message);
    }
  };

  const handleDeleteContent = async () => {
    const confirmDelete = window.confirm(
      `SURE_PROTOCOL: Shin ka tabbata kana so ka goge dukkan karatun ${selectedCourse.replace("_", " ").toUpperCase()} Week ${weekNum}?`,
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteDoc(getDocRef());
      await addDoc(collection(db, "deployment_logs"), {
        week: weekNum,
        course: selectedCourse,
        title: "Content Deleted",
        mode: "manual",
        timestamp: serverTimestamp(),
        action: "NODE_DELETED",
      });

      setContent({
        title: "",
        videoUrl: "",
        pdfNode: "",
        assignment: "",
        startDate: "",
        examRules:
          "1. No external resources.\n2. 60 Minutes duration.\n3. One attempt only.",
      });
      setExamData(
        Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          correctAnswer: "A",
        })),
      );

      setLoading(false);
      alert("SUCCESS: An goge bayanan wannan satin gaba daya.");
    } catch (err) {
      setLoading(false);
      alert("DELETE_FAILURE: " + err.message);
    }
  };

  const updateExamQuestion = (index, field, value) => {
    const newData = [...examData];
    newData[index][field] = value;
    setExamData(newData);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCurrentContent = async () => {
      try {
        const snap = await getDoc(getDocRef());
        if (isMounted && snap.exists()) {
          const data = snap.data();
          setContent({
            ...data,
            startDate: data.startDate?.toDate
              ? data.startDate.toDate().toISOString().slice(0, 16)
              : data.startDate || "",
            examRules:
              data.examRules ||
              "1. No external resources.\n2. 60 Minutes duration.\n3. One attempt only.",
          });
          if (data.exams) {
            const loadedExams = [...data.exams];
            while (loadedExams.length < 50) {
              loadedExams.push({
                id: loadedExams.length + 1,
                question: "",
                optionA: "",
                optionB: "",
                optionC: "",
                correctAnswer: "A",
              });
            }
            setExamData(loadedExams);
          }
        } else {
          setContent({
            title: "",
            videoUrl: "",
            pdfNode: "",
            assignment: "",
            startDate: "",
            examRules:
              "1. No external resources.\n2. 60 Minutes duration.\n3. One attempt only.",
          });
          setExamData(
            Array.from({ length: 50 }, (_, i) => ({
              id: i + 1,
              question: "",
              optionA: "",
              optionB: "",
              optionC: "",
              correctAnswer: "A",
            })),
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCurrentContent();
    return () => {
      isMounted = false;
    };
  }, [weekNum, selectedCourse]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#020617" : "#f8fafc",
        color: isDarkMode ? "white" : "#0f172a",
        transition: "0.3s",
        fontFamily: "sans-serif",
      }}
    >
      <aside
        style={{
          width: "300px",
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderRight: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`,
          display: "flex",
          flexDirection: "column",
          padding: "40px 30px",
          position: "fixed",
          height: "100vh",
          zIndex: 100,
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                padding: "10px",
                backgroundColor: "#2563eb",
                borderRadius: "15px",
                color: "white",
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h1
              style={{
                fontWeight: 900,
                fontSize: "18px",
                letterSpacing: "-0.5px",
              }}
            >
              AVA <span style={{ color: "#2563eb" }}>ADMIN</span>
            </h1>
          </div>
          <div
            style={{
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#2563eb",
                marginBottom: "5px",
              }}
            >
              <Clock size={14} />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                }}
              >
                TERMINAL CLOCK
              </span>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                fontFamily: "monospace",
              }}
            >
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </div>
          </div>
        </div>
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setActiveTab("curriculum")}
            style={navStyle(activeTab === "curriculum", isDarkMode)}
          >
            <BookOpen size={18} /> Lesson Manager
          </button>
          <button
            onClick={() => setActiveTab("history")}
            style={navStyle(activeTab === "history", isDarkMode)}
          >
            <History size={18} /> Deploy History
          </button>
        </nav>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={bottomBtnStyle(isDarkMode)}
          >
            {isDarkMode ? (
              <Sun size={18} color="#eab308" />
            ) : (
              <Moon size={18} color="#2563eb" />
            )}{" "}
            {isDarkMode ? "SPECTRUM: LIGHT" : "SPECTRUM: DARK"}
          </button>
          <button
            onClick={() => signOut(auth).then(() => navigate("/admin-login"))}
            style={{
              ...bottomBtnStyle(false),
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
            }}
          >
            <LogOut size={18} /> EXIT PORTAL
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: "300px", padding: "60px" }}>
        {activeTab === "curriculum" && (
          <div className="animate-in fade-in duration-700">
            <header
              style={{
                marginBottom: "50px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: 900,
                  fontStyle: "italic",
                }}
              >
                {weekNum === 8 || weekNum === 16 ? "EXAM" : "CURRICULUM"}{" "}
                <span style={{ color: "#2563eb" }}>NODE</span>
              </h1>
            </header>

            <div
              style={{
                maxWidth: "900px",
                backgroundColor: isDarkMode ? "#0f172a" : "white",
                padding: "50px",
                borderRadius: "40px",
                border: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`,
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  marginBottom: "40px",
                  padding: "25px",
                  borderRadius: "25px",
                  backgroundColor: "#2563eb10",
                  border: "2px solid #2563eb20",
                }}
              >
                <label style={labelStyle}>
                  <Calendar
                    size={14}
                    style={{ display: "inline", marginRight: "8px" }}
                  />{" "}
                  Release Schedule (Unlock Date)
                </label>
                <input
                  type="datetime-local"
                  value={content.startDate}
                  onChange={(e) =>
                    setContent({ ...content, startDate: e.target.value })
                  }
                  style={inputStyle(isDarkMode)}
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "25px",
                  marginBottom: "40px",
                }}
              >
                <div>
                  <label style={labelStyle}>Target Specialization</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={inputStyle(isDarkMode)}
                  >
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Target Week (1-16)</label>
                  <select
                    value={weekNum}
                    onChange={(e) => setWeekNum(Number(e.target.value))}
                    style={inputStyle(isDarkMode)}
                  >
                    {[...Array(16)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        WEEK {i + 1}{" "}
                        {i + 1 === 8
                          ? "(MIDTERM)"
                          : i + 1 === 16
                            ? "(FINAL)"
                            : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form
                onSubmit={handleUpdate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "25px",
                }}
              >
                {weekNum === 8 || weekNum === 16 ? (
                  <div
                    style={{
                      padding: "30px",
                      borderRadius: "25px",
                      backgroundColor: "#dc262605",
                      border: "2px solid #dc262620",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <AlertOctagon color="#dc2626" />
                      <h3
                        style={{
                          ...labelStyle,
                          color: "#dc2626",
                          marginBottom: 0,
                        }}
                      >
                        AVA SECURE EXAM ENGINE (W{weekNum})
                      </h3>
                    </div>
                    <textarea
                      value={content.examRules}
                      onChange={(e) =>
                        setContent({ ...content, examRules: e.target.value })
                      }
                      style={{
                        ...inputStyle(isDarkMode),
                        height: "100px",
                        marginBottom: "20px",
                        border: "1px dashed #dc262640",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                        maxHeight: "600px",
                        overflowY: "auto",
                        paddingRight: "10px",
                      }}
                    >
                      {examData.map((ex, index) => (
                        <div
                          key={ex.id}
                          style={{
                            borderBottom: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`,
                            paddingBottom: "20px",
                          }}
                        >
                          <label style={labelStyle}>Question {ex.id}</label>
                          <input
                            value={ex.question}
                            onChange={(e) =>
                              updateExamQuestion(
                                index,
                                "question",
                                e.target.value,
                              )
                            }
                            style={{
                              ...inputStyle(isDarkMode),
                              marginBottom: "10px",
                            }}
                          />
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr",
                              gap: "10px",
                            }}
                          >
                            <input
                              value={ex.optionA}
                              onChange={(e) =>
                                updateExamQuestion(
                                  index,
                                  "optionA",
                                  e.target.value,
                                )
                              }
                              placeholder="A"
                              style={inputStyle(isDarkMode)}
                            />
                            <input
                              value={ex.optionB}
                              onChange={(e) =>
                                updateExamQuestion(
                                  index,
                                  "optionB",
                                  e.target.value,
                                )
                              }
                              placeholder="B"
                              style={inputStyle(isDarkMode)}
                            />
                            <input
                              value={ex.optionC}
                              onChange={(e) =>
                                updateExamQuestion(
                                  index,
                                  "optionC",
                                  e.target.value,
                                )
                              }
                              placeholder="C"
                              style={inputStyle(isDarkMode)}
                            />
                          </div>
                          <select
                            value={ex.correctAnswer}
                            onChange={(e) =>
                              updateExamQuestion(
                                index,
                                "correctAnswer",
                                e.target.value,
                              )
                            }
                            style={{
                              ...inputStyle(isDarkMode),
                              marginTop: "10px",
                              color: "#2563eb",
                            }}
                          >
                            <option value="A">Correct: Option A</option>
                            <option value="B">Correct: Option B</option>
                            <option value="C">Correct: Option C</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "25px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Lesson Title</label>
                        <input
                          value={content.title}
                          onChange={(e) =>
                            setContent({ ...content, title: e.target.value })
                          }
                          style={inputStyle(isDarkMode)}
                          required
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>YouTube URL</label>
                        <input
                          value={content.videoUrl}
                          onChange={(e) =>
                            setContent({ ...content, videoUrl: e.target.value })
                          }
                          style={inputStyle(isDarkMode)}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>PDF Study Resource Node</label>
                      <div style={{ position: "relative" }}>
                        <input
                          value={content.pdfNode}
                          onChange={(e) =>
                            setContent({ ...content, pdfNode: e.target.value })
                          }
                          placeholder="Resource Link"
                          style={{
                            ...inputStyle(isDarkMode),
                            paddingLeft: "50px",
                          }}
                        />
                        <LinkIcon
                          size={18}
                          style={{
                            position: "absolute",
                            left: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            opacity: 0.5,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Assignment Guidelines</label>
                      <textarea
                        value={content.assignment}
                        onChange={(e) =>
                          setContent({ ...content, assignment: e.target.value })
                        }
                        style={{ ...inputStyle(isDarkMode), height: "120px" }}
                      />
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...submitBtnStyle,
                      backgroundColor:
                        weekNum === 8 || weekNum === 16 ? "#dc2626" : "#2563eb",
                    }}
                  >
                    {loading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      "DEPLOY TO ACADEMY"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteContent}
                    disabled={loading}
                    style={{
                      ...submitBtnStyle,
                      backgroundColor: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0",
                    }}
                    title="Delete this Week"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 900,
                marginBottom: "40px",
              }}
            >
              ACADEMY <span style={{ color: "#2563eb" }}>LOGS</span>
            </h2>
            {updateHistory.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "25px",
                  borderRadius: "25px",
                  backgroundColor: isDarkMode ? "#0f172a" : "white",
                  border: `1px solid ${isDarkMode ? "#1e293b" : "#e2e8f0"}`,
                  marginBottom: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: 900,
                      fontSize: "14px",
                      color:
                        log.action === "NODE_DELETED" ? "#ef4444" : "#2563eb",
                    }}
                  >
                    {log.action}
                  </h4>
                  <p style={{ fontSize: "12px", fontWeight: 700 }}>
                    {log.course?.toUpperCase()} | Week {log.week} - {log.title}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{ fontSize: "10px", fontWeight: 900, opacity: 0.5 }}
                  >
                    {log.timestamp?.toDate().toLocaleString() || "..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// PRESERVED STYLES
const navStyle = (active, dark) => ({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "20px",
  borderRadius: "22px",
  fontWeight: 900,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  backgroundColor: active ? "#2563eb" : "transparent",
  color: active ? "white" : dark ? "#64748b" : "#94a3b8",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  transition: "0.3s",
});
const inputStyle = (dark) => ({
  width: "100%",
  padding: "20px",
  borderRadius: "20px",
  border: `2px solid ${dark ? "#1e293b" : "#f1f5f9"}`,
  backgroundColor: dark ? "#020617" : "#f8fafc",
  color: "inherit",
  fontWeight: "bold",
  outline: "none",
  transition: "0.3s",
});
const labelStyle = {
  fontSize: "11px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: "10px",
  display: "block",
  color: "#2563eb",
};
const submitBtnStyle = {
  width: "100%",
  padding: "25px",
  borderRadius: "25px",
  border: "none",
  color: "white",
  backgroundColor: "#2563eb",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "2px",
  cursor: "pointer",
  boxShadow: "0 15px 30px -10px rgba(0,0,0,0.4)",
};
const bottomBtnStyle = (dark) => ({
  padding: "18px",
  borderRadius: "18px",
  border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontWeight: 900,
  fontSize: "11px",
  backgroundColor: dark ? "#0f172a" : "white",
  color: dark ? "white" : "#475569",
});

export default AdminContentManager;
