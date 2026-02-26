import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Path corrected to ../firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { BellRing } from "lucide-react";

const AdminChatNotification = ({ courseId }) => {
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);

  useEffect(() => {
    if (!courseId) return;

    // Nemo dukkan saƙonni daga ɗalibai na wannan kwas ɗin da Admin bai gani ba
    const q = query(
      collection(db, "chats"),
      where("courseId", "==", courseId),
      where("sender", "==", "student"),
      where("unreadByAdmin", "==", true),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Wannan zai sabunta count din duk lokacin da sako ya shigo ko aka karanta shi
        setAdminUnreadCount(snapshot.docs.length);
      },
      (error) => {
        console.error("Arewa Visa Academy Notification Error:", error);
      },
    );

    return () => unsubscribe();
  }, [courseId]);

  // Idan babu sako, kar a nuna komai
  if (adminUnreadCount === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#fff7ed",
        color: "#ea580c",
        padding: "8px 16px",
        borderRadius: "1rem",
        border: "1px solid #ffedd5",
        cursor: "pointer",
        transition: "0.3s",
        fontFamily: "sans-serif",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <BellRing size={18} style={{ animation: "bounce 2s infinite" }} />
        {/* Jan digo na alamar sabon sako */}
        <span
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            backgroundColor: "#ef4444",
            borderRadius: "50%",
            border: "2px solid white",
          }}
        ></span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            lineHeight: "1",
          }}
        >
          Attention Required
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: "bold",
            opacity: 0.7,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: "4px",
          }}
        >
          {adminUnreadCount}{" "}
          {adminUnreadCount === 1 ? "Message" : "New Messages"}
        </span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default AdminChatNotification;
