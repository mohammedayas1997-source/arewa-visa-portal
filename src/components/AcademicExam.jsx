import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Adjusted path to your standard config
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Timer, CheckCircle2, AlertCircle, Award, Home } from "lucide-react";

const AcademicExam = ({ questions = [] }) => {
  const { weekId: urlWeekId, courseId: urlCourseId } = useParams();
  const navigate = useNavigate();

  const weekId = parseInt(urlWeekId);
  const courseId = urlCourseId || "general-visa-course";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 Minutes
  const [generatedCertId, setGeneratedCertId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      submitExam();
    }
  }, [timeLeft, showResult]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      submitExam();
    }
  };

  const submitExam = async () => {
    if (!user) return;

    const finalPercentage = (score / questions.length) * 100;
    // AVA SYSTEM: Midterm at Week 8, Final at Week 16
    const examType = weekId === 8 ? "midterm" : "final";

    try {
      // 1. Save result to Firestore
      await setDoc(
        doc(db, `students/${user.uid}/exams/${courseId}_${examType}`),
        {
          score: finalPercentage,
          status: finalPercentage >= 50 ? "passed" : "failed",
          completedAt: serverTimestamp(),
          courseId: courseId,
          week: weekId,
          academy: "Arewa Visa Academy",
        },
      );

      // 2. AVA CERTIFICATION LOGIC: Final Exam (Week 16) + 70% Score
      if (weekId === 16 && finalPercentage >= 70) {
        const certId =
          `AVA-${user.uid.substring(0, 5)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

        await setDoc(doc(db, "issuedCertificates", certId), {
          certificateId: certId,
          studentId: user.uid,
          studentName: user.displayName || "AVA Student",
          courseId: courseId,
          courseName: courseId.replace(/-/g, " ").toUpperCase(),
          dateCompleted: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          issuedAt: serverTimestamp(),
          isValid: true,
          institution: "Arewa Visa Academy",
        });

        setGeneratedCertId(certId);
      }
    } catch (error) {
      console.error("AVA_EXAM_ERROR:", error);
    }

    setShowResult(true);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">
          Loading AVA Exam Portal...
        </p>
      </div>
    );
  }

  if (showResult) {
    const finalScore = (score / questions.length) * 100;
    const passed = finalScore >= 50;
    const gotCertificate = weekId === 16 && finalScore >= 70;

    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl text-center border border-gray-100 animate-in fade-in duration-700">
        {passed ? (
          <>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Award size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 italic">
              AVA Result: Passed!
            </h2>
            <p className="text-blue-600 font-black mt-2 text-4xl">
              {finalScore.toFixed(0)}%
            </p>

            {gotCertificate ? (
              <div className="mt-8 p-8 bg-blue-50 rounded-[2.5rem] border-2 border-blue-100 shadow-sm">
                <p className="text-blue-700 font-black uppercase text-xs tracking-[0.2em]">
                  Honor Graduate
                </p>
                <p className="text-gray-600 font-bold mt-2">
                  Masha Allah! You have successfully earned your Professional
                  Certification from Arewa Visa Academy.
                </p>
                <button
                  onClick={() => navigate(`/certificate/${generatedCertId}`)}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  View Digital Certificate
                </button>
              </div>
            ) : (
              <p className="text-gray-400 font-bold mt-4 uppercase text-xs tracking-widest">
                You have unlocked the next stage of your professional training.
              </p>
            )}

            <button
              onClick={() => navigate("/student-portal")}
              className="mt-8 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl"
            >
              Return to Portal
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900">
              Result: Unsuccessful
            </h2>
            <p className="text-gray-400 font-bold mt-4 leading-relaxed">
              Your score of {finalScore.toFixed(0)}% is below the required 50%
              pass mark. <br />
              Please review your modules and attempt the exam again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-red-700 shadow-lg shadow-red-200"
            >
              Retake Exam
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-10 bg-white rounded-[3.5rem] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-10 pb-8 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
            {weekId === 8 ? "Midterm Examination" : "Final Examination"}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-tighter">
              AVA SESSION
            </span>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black shadow-sm">
          <Timer size={20} />
          <span className="font-mono text-xl">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-black text-gray-800 leading-tight italic">
          "{questions[currentQuestion].text}"
        </h3>
      </div>

      <div className="grid gap-5">
        {questions[currentQuestion].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt.isCorrect)}
            className="w-full p-6 bg-gray-50 hover:bg-blue-600 hover:text-white text-left rounded-[2rem] font-bold transition-all border border-gray-100 group flex items-center shadow-sm"
          >
            <span className="inline-block w-10 h-10 rounded-xl bg-white text-blue-600 text-center leading-10 font-black mr-5 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-lg">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AcademicExam;
