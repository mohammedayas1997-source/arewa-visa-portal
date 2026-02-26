import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Path ya koma daidai
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Award, CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";

const StudentGrades = ({ courseId }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!currentUser || !courseId) return;

      try {
        const q = query(
          collection(db, "submissions"),
          where("userId", "==", currentUser.uid),
          where("courseId", "==", courseId),
          orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(q);
        const fetchedGrades = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGrades(fetchedGrades);
      } catch (error) {
        console.error("🔥 Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchGrades();
    }
  }, [currentUser, courseId]);

  const gradedSubmissions = grades.filter((g) => g.graded);
  const average =
    gradedSubmissions.length > 0
      ? (
          gradedSubmissions.reduce((acc, curr) => acc + curr.grade, 0) /
          gradedSubmissions.length
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontWeight: "900",
            color: "#94a3b8",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          Fetching Arewa Visa Academic Records...
        </div>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER SECTION */}
      <header
        style={{
          marginBottom: "48px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
              margin: 0,
            }}
          >
            Academic Progress
          </h2>
          <p
            style={{
              color: "#64748b",
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontStyle: "italic",
            }}
          >
            Performance in:{" "}
            <span style={{ color: "#2563eb" }}>
              {courseId?.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#2563eb",
            padding: "32px",
            borderRadius: "2.5rem",
            color: "white",
            boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={28} />
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                opacity: 0.6,
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              Overall Average
            </p>
            <p style={{ fontSize: "2rem", fontWeight: "900", margin: 0 }}>
              {average}%
            </p>
          </div>
        </div>
      </header>

      {/* GRADES LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {grades.length === 0 ? (
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
              style={{ margin: "0 auto 16px", color: "#e2e8f0" }}
              size={48}
            />
            <p
              style={{
                color: "#94a3b8",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              No academy assignments submitted yet.
            </p>
          </div>
        ) : (
          grades.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "3rem",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "24px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "24px" }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: item.graded ? "#f0fdf4" : "#fff7ed",
                    color: item.graded ? "#16a34a" : "#ea580c",
                  }}
                >
                  {item.graded ? <Award size={32} /> : <Clock size={32} />}
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "900",
                      color: "#1e293b",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Week {item.weekId} Assignment
                  </h4>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginTop: "4px",
                    }}
                  >
                    Submitted:{" "}
                    {item.createdAt?.toDate().toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "32px" }}
              >
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "4px",
                    }}
                  >
                    Status
                  </p>
                  <span
                    style={{
                      padding: "6px 16px",
                      borderRadius: "99px",
                      fontSize: "10px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      backgroundColor: item.graded ? "#dcfce7" : "#ffedd5",
                      color: item.graded ? "#15803d" : "#9a3412",
                    }}
                  >
                    {item.graded ? "Graded" : "Pending Review"}
                  </span>
                </div>

                <div
                  style={{
                    width: "96px",
                    height: "96px",
                    backgroundColor: "#0f172a",
                    borderRadius: "1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      fontSize: "8px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      opacity: 0.4,
                      marginBottom: "4px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Score
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: "900", margin: 0 }}>
                    {item.graded ? `${item.grade}%` : "--"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentGrades;
