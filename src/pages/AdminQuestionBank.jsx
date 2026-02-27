import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Path ya koma ../firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  PlusCircle,
  Save,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";

const AdminQuestionBank = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [weekId, setWeekId] = useState(12);
  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const toggleCorrect = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const saveQuestion = async () => {
    if (!questionText || options.some((opt) => opt.text === "")) {
      return alert("Kuskure: Shigar da tambaya da dukkan zaɓuɓɓuka guda 4.");
    }

    try {
      await addDoc(collection(db, "examQuestions"), {
        courseId: courseId,
        weekId: parseInt(weekId),
        text: questionText,
        options: options,
        createdAt: serverTimestamp(),
      });

      setQuestionText("");
      setOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      alert(
        `Academic Log: An yi nasarar ƙara tambaya a rumbun ${courseId.toUpperCase()}!`,
      );
    } catch (e) {
      console.error("Error adding question: ", e);
      alert("System Error: An samu matsala wurin adana tambayar.");
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
      <div style={{ maxWidth: "896px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#94a3b8",
            fontWeight: "bold",
            marginBottom: "32px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <ArrowLeft size={20} /> Back to Terminal
        </button>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "3rem",
            padding: "40px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #f1f5f9",
          }}
        >
          <header style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "1rem",
                }}
              >
                <HelpCircle size={24} />
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "900",
                  color: "#0f172a",
                  textTransform: "uppercase",
                  margin: 0,
                  letterSpacing: "-0.05em",
                }}
              >
                Question Bank
              </h2>
            </div>
            <p
              style={{
                color: "#94a3b8",
                fontWeight: "bold",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Managing Examination Content for:{" "}
              <span style={{ color: "#2563eb", textDecoration: "underline" }}>
                {courseId?.replace(/_/g, " ")}
              </span>
            </p>
          </header>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: "12px",
                  letterSpacing: "0.1em",
                }}
              >
                Select Milestone
              </label>
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "20px",
                  backgroundColor: "#f8fafc",
                  border: "2px solid transparent",
                  borderRadius: "1.25rem",
                  fontWeight: "bold",
                  color: "#334155",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value={12}>Week 12 Midterm Assessment</option>
                <option value={24}>Week 24 Final Certification Exam</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginBottom: "12px",
                  letterSpacing: "0.1em",
                }}
              >
                The Question
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter the official examination question here..."
                style={{
                  width: "100%",
                  padding: "24px",
                  backgroundColor: "#f8fafc",
                  border: "2px solid transparent",
                  borderRadius: "2rem",
                  fontWeight: "bold",
                  color: "#334155",
                  outline: "none",
                  height: "128px",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCorrect(idx)}
                  style={{
                    padding: "24px",
                    borderRadius: "1.5rem",
                    border: "2px solid",
                    transition: "0.3s",
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor: opt.isCorrect ? "#f0fdf4" : "#f8fafc",
                    borderColor: opt.isCorrect ? "#86efac" : "transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        color: "#94a3b8",
                      }}
                    >
                      Choice {String.fromCharCode(65 + idx)}
                    </label>
                    {opt.isCorrect ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "10px",
                          fontWeight: "900",
                          color: "#16a34a",
                          textTransform: "uppercase",
                        }}
                      >
                        <CheckCircle2 size={12} /> Correct Answer
                      </span>
                    ) : (
                      <Circle size={12} style={{ color: "#cbd5e1" }} />
                    )}
                  </div>
                  <input
                    type="text"
                    value={opt.text}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      fontWeight: "bold",
                      color: "#1e293b",
                      outline: "none",
                      fontSize: "14px",
                    }}
                    placeholder="Enter answer option..."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={saveQuestion}
              style={{
                width: "100%",
                padding: "24px",
                backgroundColor: "#0f172a",
                color: "white",
                borderRadius: "2rem",
                border: "none",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Save size={22} /> Add Question to Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionBank;
