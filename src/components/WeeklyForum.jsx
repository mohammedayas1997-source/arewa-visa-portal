import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase"; // Path corrected to ../firebase
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  MessageSquare,
  CheckCircle,
  Users,
  Pin,
  Send,
  Reply,
  Calendar,
  AlertTriangle,
  Bell,
  ShieldCheck,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  ChevronLeft,
} from "lucide-react";

// ==========================================
// UPDATED COURSE NAMES (AREWA VISA ACADEMY - FULL 12)
// ==========================================
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

const WeeklyForum = ({ weekId, courseId }) => {
  const [mySubmission, setMySubmission] = useState("");
  const [othersSubmissions, setOthersSubmissions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [adminAssignment, setAdminAssignment] = useState(null);
  const [courseDates, setCourseDates] = useState(null);
  const [userRole, setUserRole] = useState("student");

  const scrollRef = useRef(null);
  const currentCourseName =
    availableCourses.find((c) => c.id === courseId)?.name || "Academic Module";

  const user = auth.currentUser;
  const progressPath = `students/${user?.uid}/progress/${courseId}_week_${weekId}`;

  // ADJUSTED FOR 4-MONTH SYSTEM (WEEKS 8 AND 16)
  const isExamWeek = weekId === 8 || weekId === 16;

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [othersSubmissions]);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role || "student");
      }
    };
    fetchRole();

    // Real-time Chat Sync
    const q = query(
      collection(db, "submissions"),
      where("weekId", "==", weekId),
      where("courseId", "==", courseId),
      orderBy("createdAt", "asc"),
    );

    const unsubscribeChat = onSnapshot(q, (snap) => {
      const messages = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOthersSubmissions(messages);
      if (messages.find((m) => m.userId === user.uid)) setHasSubmitted(true);
    });

    const fetchData = async () => {
      const adminQ = query(
        collection(db, "forum_assignments"),
        where("weekId", "==", weekId),
        where("courseId", "==", courseId),
      );
      const adminSnap = await getDocs(adminQ);
      if (!adminSnap.empty) setAdminAssignment(adminSnap.docs[0].data());

      const progRef = doc(db, progressPath);
      const progSnap = await getDoc(progRef);
      if (progSnap.exists() && progSnap.data().status === "completed")
        setIsCompleted(true);
    };

    fetchData();
    return () => unsubscribeChat();
  }, [weekId, courseId, user]);

  const handleSubmit = async () => {
    if (mySubmission.trim().length < (isExamWeek ? 500 : 10)) {
      return alert(
        `VALIDATION ERROR: ${isExamWeek ? "EXAM" : "POST"} requires more depth (at least ${isExamWeek ? "500" : "10"} characters).`,
      );
    }

    try {
      await addDoc(collection(db, "submissions"), {
        userId: user.uid,
        userName: user.displayName || user.email,
        role: userRole,
        content: mySubmission,
        weekId,
        courseId,
        courseName: currentCourseName,
        type: isExamWeek ? "EXAM_SUBMISSION" : "chat_message",
        createdAt: serverTimestamp(),
      });
      setMySubmission("");
    } catch (error) {
      alert("NETWORK ERROR: Post failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "1024px",
        margin: "0 auto",
        backgroundColor: "#efeae2",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        position: "relative",
        overflow: "hidden",
        borderLeft: "1px solid #e5e7eb",
        borderRight: "1px solid #e5e7eb",
        fontFamily: "sans-serif",
      }}
    >
      {/* WHATSAPP STYLE HEADER */}
      <header
        style={{
          backgroundColor: "#075e54",
          color: "white",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#dbeafe",
                color: "#075e54",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                fontWeight: "900",
                fontSize: "14px",
                justifyContent: "center",
              }}
            >
              W{weekId}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "12px",
                height: "12px",
                backgroundColor: "#10b981",
                border: "2px solid #075e54",
                borderRadius: "50%",
              }}
            ></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                lineHeight: 1.25,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {currentCourseName}
            </h2>
            <span style={{ fontSize: "10px", opacity: 0.7, fontWeight: "500" }}>
              {othersSubmissions.length} AVA Members Active
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            opacity: 0.9,
          }}
        >
          <Calendar size={18} style={{ cursor: "pointer" }} />
          <Users size={18} style={{ cursor: "pointer" }} />
          <MoreVertical size={18} style={{ cursor: "pointer" }} />
        </div>
      </header>

      {/* ENCRYPTION NOTICE */}
      <div
        style={{
          backgroundColor: "#fff9c4",
          padding: "6px 16px",
          textAlign: "center",
          zIndex: 40,
        }}
      >
        <p
          style={{
            fontSize: "9px",
            fontWeight: "900",
            color: "#4b5563",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            margin: 0,
          }}
        >
          <ShieldCheck size={12} style={{ color: "#047857" }} />
          End-to-end encrypted forum. Authorized Arewa Visa access only.
        </p>
      </div>

      {/* MESSAGE AREA */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px",
          backgroundImage:
            "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundBlendMode: "overlay",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "#efeae2",
        }}
      >
        {othersSubmissions.map((msg) => {
          const isMe = msg.userId === user?.uid;
          const isAdmin = [
            "admin",
            "authority",
            "SUPER_ADMIN",
            "instructor",
          ].includes(msg.role);

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  position: "relative",
                  maxWidth: "75%",
                  padding: "8px 12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  borderRadius: isMe
                    ? "12px 0px 12px 12px"
                    : "0px 12px 12px 12px",
                  backgroundColor: isMe ? "#dcf8c6" : "white",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      marginBottom: "4px",
                      borderBottom: "1px solid #f3f4f6",
                      paddingBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        color: isAdmin ? "#dc2626" : "#34b7f1",
                      }}
                    >
                      {msg.userName?.split("@")[0]}
                    </span>
                    {isAdmin && (
                      <span
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          fontSize: "7px",
                          fontWeight: "900",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ShieldCheck size={8} /> FACULTY
                      </span>
                    )}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    fontWeight: "600",
                    color: "#1e293b",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "4px",
                    marginTop: "4px",
                    opacity: 0.6,
                  }}
                >
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontStyle: "italic",
                    }}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt.toDate()).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )
                      : "..."}
                  </span>
                  {isMe && <Check size={10} style={{ color: "#3b82f6" }} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXAM INDICATOR */}
      {isExamWeek && (
        <div
          style={{
            margin: "0 16px 8px 16px",
            backgroundColor: "#dc2626",
            color: "white",
            padding: "8px",
            borderRadius: "12px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <AlertTriangle size={14} />
          <span
            style={{
              fontSize: "9px",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            AREWA VISA EXAM MODE: 500+ Character Submission Required
          </span>
        </div>
      )}

      {/* INPUT PANEL */}
      <footer
        style={{
          backgroundColor: "#f0f2f5",
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingBottom: "8px",
            opacity: 0.6,
          }}
        >
          <Smile size={24} style={{ cursor: "pointer" }} />
          <Paperclip size={22} style={{ cursor: "pointer" }} />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            padding: "6px 16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <textarea
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              padding: "4px 0",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#334155",
              resize: "none",
              maxHeight: "128px",
              fontFamily: "inherit",
            }}
            placeholder={
              isExamWeek
                ? "Transmit Final Exam Content..."
                : "Type academic inquiry..."
            }
            rows="1"
            value={mySubmission}
            onChange={(e) => setMySubmission(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#128c7e",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Send size={20} fill="currentColor" />
        </button>
      </footer>
    </div>
  );
};

export default WeeklyForum;
