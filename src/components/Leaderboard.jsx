import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Path corrected to ../firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { Trophy, Medal, Star, Target } from "lucide-react";

const Leaderboard = ({ courseId }) => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!courseId) return;

      try {
        const q = query(
          collection(db, "submissions"),
          where("courseId", "==", courseId),
          where("graded", "==", true),
        );

        const querySnapshot = await getDocs(q);
        const allGrades = querySnapshot.docs.map((doc) => doc.data());

        const studentScores = {};
        allGrades.forEach((sub) => {
          const name = sub.userName || "Elite Student";
          const grade = sub.grade || 0;

          if (!studentScores[name]) {
            studentScores[name] = { total: 0, count: 0 };
          }
          studentScores[name].total += grade;
          studentScores[name].count += 1;
        });

        const ranked = Object.keys(studentScores)
          .map((name) => ({
            name,
            average: (
              studentScores[name].total / studentScores[name].count
            ).toFixed(1),
          }))
          .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
          .slice(0, 10);

        setTopStudents(ranked);
      } catch (error) {
        console.error("🔥 Arewa Visa Leaderboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [courseId]);

  if (loading)
    return (
      <div
        style={{ padding: "80px", textAlign: "center", fontStyle: "italic" }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#dbeafe",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Trophy style={{ color: "#2563eb" }} size={24} />
        </div>
        <p
          style={{
            fontWeight: "900",
            color: "#94a3b8",
            textTransform: "uppercase",
            fontSize: "10px",
            letterSpacing: "0.2em",
          }}
        >
          Computing Academy Rankings...
        </p>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "3rem",
        padding: "40px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#fef3c7",
            color: "#d97706",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trophy size={24} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "900",
              color: "#0f172a",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Top Performers
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            Global Rankings for {courseId?.replace(/_/g, " ")}
          </p>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {topStudents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Target
              style={{ margin: "0 auto 8px", color: "#e2e8f0" }}
              size={40}
            />
            <p style={{ color: "#94a3b8", fontWeight: "bold" }}>
              No rankings available yet for this course.
            </p>
          </div>
        ) : (
          topStudents.map((student, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px",
                borderRadius: "2rem",
                border: "1px solid",
                transition: "0.3s",
                backgroundColor: index === 0 ? "#2563eb" : "#f8fafc",
                borderColor: index === 0 ? "#2563eb" : "transparent",
                color: index === 0 ? "white" : "#1e293b",
                boxShadow:
                  index === 0
                    ? "0 20px 25px -5px rgba(37, 99, 235, 0.2)"
                    : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    fontSize: "14px",
                    backgroundColor: index === 0 ? "white" : "#e2e8f0",
                    color: index === 0 ? "#2563eb" : "#64748b",
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: "900",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {student.name}
                  </p>
                  {index === 0 && (
                    <p
                      style={{
                        fontSize: "8px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        opacity: 0.7,
                        margin: 0,
                      }}
                    >
                      Academy Champion
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "900",
                      margin: 0,
                      color: index === 0 ? "white" : "#2563eb",
                    }}
                  >
                    {student.average}%
                  </p>
                  <p
                    style={{
                      fontSize: "8px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      opacity: index === 0 ? 0.7 : 0.4,
                      margin: 0,
                    }}
                  >
                    GPA
                  </p>
                </div>
                {index < 3 && (
                  <Medal
                    size={20}
                    style={{ color: index === 0 ? "#fde047" : "#94a3b8" }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "24px",
          backgroundColor: "#0f172a",
          borderRadius: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ color: "#eab308" }}>
          <Star size={20} fill="currentColor" />
        </div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Rankings are updated in real-time based on Arewa Visa Academy
          assignment performance and scholarly engagement.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
