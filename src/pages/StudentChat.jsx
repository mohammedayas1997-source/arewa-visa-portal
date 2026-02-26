import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase"; // Path ya koma ../firebase
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Send, User, ShieldCheck, MessageSquare } from "lucide-react";

const StudentChat = ({ courseId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser;
  const scrollRef = useRef();

  // --- AUTO REPLY LOGIC (AREWA VISA BOT) ---
  const triggerAutoReply = async (studentId, studentName, courseId) => {
    try {
      await addDoc(collection(db, "chats"), {
        studentId: studentId,
        studentName: studentName,
        courseId: courseId,
        text: `Sannu ${studentName}, mun gode da tuntuɓar Arewa Visa Academy Support. Malaminka ya sami sanarwa kuma zai amsa maka nan ba da jimawa ba. Da fatan za ka kasance a kan layi.`,
        sender: "admin",
        unreadByStudent: true,
        unreadByAdmin: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Auto-reply Error:", error);
    }
  };

  // 1. Listen for Messages
  useEffect(() => {
    if (!user || !courseId) return;

    const q = query(
      collection(db, "chats"),
      where("studentId", "==", user.uid),
      where("courseId", "==", courseId),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    });

    return () => unsubscribe();
  }, [user, courseId]);

  // 2. Mark Messages as Read
  useEffect(() => {
    const markAsRead = async () => {
      if (user && messages.length > 0) {
        const unreadMessages = messages.filter(
          (m) => m.sender === "admin" && m.unreadByStudent === true,
        );

        await Promise.all(
          unreadMessages.map(async (msg) => {
            const msgRef = doc(db, "chats", msg.id);
            return updateDoc(msgRef, { unreadByStudent: false });
          }),
        );
      }
    };

    markAsRead();
  }, [messages, user]);

  // 3. Send Message Function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const studentId = user.uid;
    const studentName = user.displayName || "Elite Student";

    try {
      await addDoc(collection(db, "chats"), {
        studentId: studentId,
        studentName: studentName,
        courseId: courseId,
        text: newMessage,
        sender: "student",
        unreadByAdmin: true,
        unreadByStudent: false,
        createdAt: serverTimestamp(),
      });

      setNewMessage("");

      setTimeout(() => {
        triggerAutoReply(studentId, studentName, courseId);
      }, 2000);
    } catch (err) {
      console.error("Chat Error:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "3rem",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#2563eb",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <p
              style={{
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "0.1em",
                opacity: 0.6,
                margin: 0,
              }}
            >
              Official Support Channel
            </p>
            <h3
              style={{
                fontWeight: "900",
                fontSize: "14px",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              AVA Instructor
            </h3>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flexGrow: 1,
          padding: "24px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "#f8fafc",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "student" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "16px 20px",
                borderRadius: "1.8rem",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                borderTopRightRadius: msg.sender === "student" ? "0" : "1.8rem",
                borderTopLeftRadius: msg.sender === "student" ? "1.8rem" : "0",
                backgroundColor: msg.sender === "student" ? "#2563eb" : "white",
                color: msg.sender === "student" ? "white" : "#1e293b",
                border: msg.sender === "student" ? "none" : "1px solid #f1f5f9",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        style={{
          padding: "24px",
          backgroundColor: "white",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          gap: "12px",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask your instructor a question..."
          style={{
            flexGrow: 1,
            backgroundColor: "#f8fafc",
            padding: "16px",
            borderRadius: "1.25rem",
            border: "none",
            outline: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "#0f172a",
            color: "white",
            borderRadius: "1.25rem",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default StudentChat;
