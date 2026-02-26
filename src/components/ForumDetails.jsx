import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Adjusted to your working path
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowLeft,
  Send,
  User,
  Clock,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const ForumDetails = ({ darkMode }) => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("student");

  // 1. Fetch Thread and User Authority Role
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Thread
      const docRef = doc(db, "forum_threads", threadId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setThread(docSnap.data());
      } else {
        navigate("/portal");
      }

      // Fetch Current User Role
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role || "student");
        }
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [threadId, navigate]);

  // 2. Sync Replies in Real-Time (WhatsApp Group Style)
  useEffect(() => {
    const q = query(
      collection(db, "forum_threads", threadId, "replies"),
      orderBy("createdAt", "asc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [threadId]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const isAdmin =
      userRole === "admin" ||
      userRole === "authority" ||
      userRole === "instructor" ||
      userRole === "SUPER_ADMIN";

    try {
      await addDoc(collection(db, "forum_threads", threadId, "replies"), {
        content: newReply,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isInstructor: isAdmin,
        role: userRole,
      });
      setNewReply("");
    } catch (error) {
      console.error("COMMUNICATION_ERROR: Thread injection failed.", error);
    }
  };

  if (loading)
    return (
      <div
        style={{
          padding: "80px",
          textAlign: "center",
          fontWeight: "900",
          letterSpacing: "0.2em",
          color: darkMode ? "white" : "#0f172a",
        }}
      >
        SYNCHRONIZING AREWA VISA TERMINAL...
      </div>
    );

  return (
    <div
      className="forum-details-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkMode ? "#020617" : "#e5ddd5",
        color: darkMode ? "white" : "#0f172a",
        fontFamily: "sans-serif",
      }}
    >
      {/* Thread Header (Arewa Visa Academy Branding) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "16px",
          borderBottom: "1px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: darkMode ? "#0f172a" : "#075e54",
          borderColor: darkMode ? "#1e293b" : "#075e54",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "900",
                textTransform: "uppercase",
                margin: 0,
                maxWidth: "250px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {thread.title}
            </h1>
            <p
              style={{
                fontSize: "10px",
                opacity: 0.7,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              Module Discussion by {thread.studentName}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <MessageSquare size={20} style={{ opacity: 0.6 }} />
        </div>
      </div>

      <div
        style={{
          maxWidth: "896px",
          margin: "0 auto",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          gap: "24px",
        }}
      >
        {/* The Original Root Post Card */}
        <div
          style={{
            padding: "32px",
            borderRadius: "2rem",
            border: "2px solid",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            backgroundColor: darkMode ? "#0f172a" : "white",
            borderColor: darkMode ? "#1e293b" : "#dbeafe",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: "900",
                color: "#2563eb",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
            >
              Academic Inquiry Point
            </span>
            <div
              style={{
                height: "1px",
                flex: 1,
                backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
              }}
            ></div>
          </div>
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              lineHeight: 1.6,
              opacity: 0.9,
              margin: 0,
            }}
          >
            {thread.content}
          </p>
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "9px",
              fontWeight: "900",
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            <Clock size={12} />
            {thread.createdAt?.toDate().toLocaleString() ||
              "Verifying timestamp..."}
          </div>
        </div>

        {/* Message Bubbles Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {replies.map((reply) => {
            const isMe = reply.authorId === auth.currentUser?.uid;
            const isAdmin =
              reply.isInstructor ||
              ["admin", "authority", "SUPER_ADMIN"].includes(reply.role);

            return (
              <div
                key={reply.id}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "20px",
                    borderRadius: "1.8rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    position: "relative",
                    borderTopRightRadius: isMe ? "0" : "1.8rem",
                    borderTopLeftRadius: isMe ? "1.8rem" : "0",
                    backgroundColor: isMe
                      ? darkMode
                        ? "#2563eb"
                        : "#dcf8c6"
                      : darkMode
                        ? "#1e293b"
                        : "white",
                    color:
                      isMe && darkMode
                        ? "white"
                        : isMe
                          ? "#1e293b"
                          : darkMode
                            ? "white"
                            : "#1e293b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        color: isAdmin
                          ? "#ef4444"
                          : isMe
                            ? darkMode
                              ? "#bfdbfe"
                              : "#15803d"
                            : "#2563eb",
                      }}
                    >
                      {reply.authorName}
                    </span>
                    {isAdmin && (
                      <span
                        style={{
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                          fontSize: "8px",
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
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {reply.content}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "4px",
                      opacity: 0.5,
                    }}
                  >
                    <span style={{ fontSize: "8px", fontWeight: "900" }}>
                      {reply.createdAt?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistent Reply Bar (WhatsApp Style) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "16px",
          borderTop: "1px solid",
          backgroundColor: darkMode ? "#0f172a" : "#f0f0f0",
          borderColor: darkMode ? "#1e293b" : "#e5e7eb",
        }}
      >
        <form
          onSubmit={handleReply}
          style={{
            maxWidth: "896px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Inject scholarly insight..."
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: "9999px",
                fontWeight: "bold",
                fontSize: "14px",
                border: "none",
                outline: "none",
                backgroundColor: darkMode ? "#1e293b" : "white",
                color: darkMode ? "white" : "#0f172a",
                boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "16px",
              backgroundColor: "#128c7e",
              color: "white",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForumDetails;
