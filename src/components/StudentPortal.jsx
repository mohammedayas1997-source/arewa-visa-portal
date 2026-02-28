import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Path corrected for your project
import {
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  addDoc,
  onSnapshot,
  where,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  PlayCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Lock,
  Award,
  Send,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Layers,
  Users,
  Search,
  Bell,
  Cpu,
  FileText,
  Download,
  Calendar,
  User,
  Loader2,
  Trophy,
  AlertTriangle,
  Camera,
  RefreshCcw,
  Settings,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Brush,
  Hotel,
  Wind,
  Plane,
  Briefcase,
  Headphones,
  Ship,
  Package,
  Globe2,
} from "lucide-react";

// ==========================================
// 1. HELPERS & CONFIGURATION
// ==========================================
const formatDate = (timestamp) => {
  if (!timestamp) return "TBD";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const libraryLinks = [
  {
    name: "IATA International Standards",
    url: "https://www.iata.org/en/publications/manuals/",
    cat: "Aviation",
  },
  {
    name: "Global Visa Protocols",
    url: "https://www.unwto.org/",
    cat: "Legal",
  },
  {
    name: "Arewa Visa Case Studies",
    url: "https://scholar.google.com/",
    cat: "Research",
  },
  {
    name: "Consular Management Hub",
    url: "https://archive.org/",
    cat: "Consular",
  },
  {
    name: "Tourism Intelligence",
    url: "https://www.hospitalitynet.org/",
    cat: "Hospitality",
  },
  {
    name: "Digital Travel Systems",
    url: "https://www.amadeus.com/en",
    cat: "Tech",
  },
];

const StudentPortal = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("stu-theme") === "dark",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [studentData, setStudentData] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [hasPassedMidterm, setHasPassedMidterm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [weeksData, setWeeksData] = useState({});
  const [viewState, setViewState] = useState("list");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [forumThreads, setForumThreads] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const [privateMessages, setPrivateMessages] = useState([]);
  const [newPrivateMsg, setNewPrivateMsg] = useState("");

  // Settings States
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [settingsMessage, setSettingsMessage] = useState({
    type: "",
    text: "",
  });

  // Exam States
  const [examActive, setExamActive] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600);

  // UPDATED COURSES DATA FOR AREWA VISA ACADEMY (TOTAL: 12)
  const availableCourses = [
    {
      id: "cleaning_course",
      name: "Cleaning Course",
      icon: <Brush size={20} />,
    },
    {
      id: "housekeeping_course",
      name: "Housekeeping Course",
      icon: <Hotel size={20} />,
    },
    {
      id: "laundry_service",
      name: "Laundry Service Course",
      icon: <Wind size={20} />,
    },
    {
      id: "visa_processing",
      name: "Visa Processing Course",
      icon: <FileText size={20} />,
    },
    {
      id: "ticketing_reservation",
      name: "Ticketing & Reservation",
      icon: <Plane size={20} />,
    },
    {
      id: "agency_management",
      name: "Agency Management",
      icon: <Briefcase size={20} />,
    },
    {
      id: "customer_service",
      name: "Customer Service Course",
      icon: <Headphones size={20} />,
    },
    {
      id: "aircraft_cleaner",
      name: "Aircraft Cleaner Course",
      icon: <Ship size={20} />,
    },
    {
      id: "security_training",
      name: "Security Training",
      icon: <ShieldCheck size={20} />,
    },
    {
      id: "caregiver_nanny",
      name: "Caregiver - Nanny Course",
      icon: <Users size={20} />,
    },
    {
      id: "cargo_logistics",
      name: "Cargo & Logistics Course",
      icon: <Package size={20} />,
    },
    {
      id: "travel_tourism",
      name: "Travels and Tourism",
      icon: <Globe2 size={20} />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Weeks Data
  useEffect(() => {
    if (!selectedCourseId) return;
    const unsubWeeks = onSnapshot(
      collection(db, "course_settings"),
      (snapshot) => {
        const data = {};
        snapshot.forEach((doc) => {
          if (doc.id.startsWith(selectedCourseId)) {
            const weekPart = doc.id.split("_week_")[1];
            data[weekPart] = doc.data();
          }
        });
        setWeeksData(data);
      },
    );
    return () => unsubWeeks();
  }, [selectedCourseId]);

  // Exam Timer Logic
  useEffect(() => {
    let timer;
    if (examActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examActive) {
      handleExamSubmit();
    }
    return () => clearInterval(timer);
  }, [examActive, timeLeft]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false); // Dole ne ka kashe loading idan babu user
        navigate("/student-login");
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);

        // Gyara 1: Tabbatar onSnapshot yana kashe loading bayan ya samu data
        const unsubUser = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setStudentData({ id: user.uid, ...data });
            if (data.selectedCourseId)
              setSelectedCourseId(data.selectedCourseId);

            const courseStartDate =
              data.courseSelectionDate?.toDate() || new Date("2026-01-01");
            const diffTime = new Date() - courseStartDate;
            const weekCount =
              Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
            setCurrentWeek(weekCount > 16 ? 16 : weekCount < 1 ? 1 : weekCount);

            // Gyara 2: Saka Exam check a cikin snapshot din don komai ya zo lokaci daya
            const examRef = doc(db, `students/${user.uid}/exams/week_8`);
            const examSnap = await getDoc(examRef);
            if (examSnap.exists() && examSnap.data().passed) {
              setHasPassedMidterm(true);
            }

            setLoading(false); // Yanzu portal din zai bude domin an samu duka data
          } else {
            setLoading(false); // Ko da babu doc, a bar shi ya wuce don ya zabi kwas
          }
        });

        return () => unsubUser();
      } catch (error) {
        console.error("Portal Sync Error:", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!studentData?.id) return;
    const q = query(
      collection(db, "private_chats"),
      where("studentId", "==", studentData.id),
      orderBy("createdAt", "asc"),
    );
    const unsubChat = onSnapshot(q, (snap) => {
      setPrivateMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubChat();
  }, [studentData]);

  useEffect(() => {
    if (
      activeTab === "discussions" &&
      viewState === "forum" &&
      selectedCourse &&
      selectedPath
    ) {
      const q = query(
        collection(db, "forum_threads"),
        where("courseId", "==", selectedCourse.id),
        where("studentType", "==", selectedPath),
        orderBy("createdAt", "desc"),
      );
      const unsub = onSnapshot(q, (snap) => {
        setForumThreads(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      });
      return () => unsub();
    }
  }, [activeTab, viewState, selectedCourse, selectedPath]);

  // --- SETTINGS PROTOCOLS ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSettingsMessage({
        type: "error",
        text: "File size exceeds 2MB limit.",
      });
      return;
    }

    setLoading(true);
    try {
      const storageRef = ref(
        storage,
        `profiles/${studentData.id}_${Date.now()}`,
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", studentData.id), {
        photoURL: downloadURL,
        lastUpdated: serverTimestamp(),
      });

      setSettingsMessage({
        type: "success",
        text: "Profile identity updated.",
      });
    } catch (err) {
      setSettingsMessage({ type: "error", text: "Identity upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setSettingsMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwords.current,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwords.new);

      setSettingsMessage({
        type: "success",
        text: "Security credentials updated.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setSettingsMessage({
        type: "error",
        text: "Security re-auth failed. Check current password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitialCourseSelection = async (courseId) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const selectionData = {
        selectedCourseId: courseId,
        courseSelectionDate: serverTimestamp(),
        fullName: auth.currentUser.displayName || "Student",
        email: auth.currentUser.email,
      };
      await setDoc(userRef, selectionData, { merge: true });
      setSelectedCourseId(courseId);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isWeekLocked = (weekNumber) => {
    const weekSettings = weeksData[String(weekNumber)];
    if (!weekSettings || !weekSettings.startDate) return true;
    const releaseDate = weekSettings.startDate.toDate
      ? weekSettings.startDate.toDate()
      : new Date(weekSettings.startDate);
    // ADJUSTED MIDTERM LOCK AT WEEK 8
    const isMidtermLocked = weekNumber > 8 && !hasPassedMidterm;
    return new Date() < releaseDate || isMidtermLocked;
  };

  const handleExamSubmit = async () => {
    setExamActive(false);
    const questions = weeksData[String(currentWeek)]?.exams || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });
    const finalScore = Math.round((correctCount / questions.length) * 100);

    const resultData = {
      score: finalScore,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      passed: finalScore >= 50,
      timeCompleted: serverTimestamp(),
      courseId: selectedCourseId,
      week: currentWeek,
    };

    await setDoc(
      doc(db, `students/${studentData.id}/exams/week_${currentWeek}`),
      resultData,
    );
    setExamScore(resultData);
    // ADJUSTED MIDTERM PASS TRIGGER AT WEEK 8
    if (finalScore >= 50 && currentWeek === 8) setHasPassedMidterm(true);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black text-blue-600 bg-slate-950">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="tracking-widest animate-pulse uppercase">
          AREWA VISA ACADEMY | SYNCING PROTOCOLS...
        </p>
      </div>
    );

  if (!selectedCourseId)
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? "bg-slate-950" : "bg-gray-100"}`}
      >
        <div className="max-w-6xl w-full">
          <h2
            className={`text-5xl font-black italic uppercase text-center mb-12 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Select Specialization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => handleInitialCourseSelection(c.id)}
                className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all hover:scale-105 group ${darkMode ? "bg-slate-900 border-slate-800 hover:border-blue-600" : "bg-white border-white hover:border-blue-600 shadow-xl"}`}
              >
                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {c.icon}
                </div>
                <h3
                  className={`text-2xl font-black uppercase italic ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {c.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const currentWeekInfo = weeksData[String(currentWeek)] || {};

  return (
    <div
      className={`min-h-screen flex font-sans ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"} transition-colors duration-300`}
    >
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-80 border-r flex flex-col transition-transform ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-10 flex flex-col gap-4">
          <h1 className="text-2xl font-black text-blue-600 italic">
            AREWA{" "}
            <span className={darkMode ? "text-white" : "text-gray-900"}>
              VISA ACADEMY
            </span>
          </h1>
          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-600/20">
            <div className="flex items-center gap-3 text-blue-500 mb-1">
              <Clock size={14} className="animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Terminal Time
              </span>
            </div>
            <h4 className="text-xl font-black font-mono tracking-tighter">
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </h4>
          </div>
        </div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            {
              id: "dashboard",
              name: "Dashboard",
              icon: <LayoutDashboard size={18} />,
            },
            { id: "courses", name: "Curriculum", icon: <BookOpen size={18} /> },
            {
              id: "discussions",
              name: "Academy Forum",
              icon: <MessageSquare size={18} />,
            },
            { id: "library", name: "E-Library", icon: <BookOpen size={18} /> },
            { id: "chat", name: "Faculty Direct", icon: <User size={18} /> },
            {
              id: "settings",
              name: "Settings",
              icon: <Settings size={18} />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setViewState("list");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-blue-50/10"}`}
            >
              {item.icon} {item.name}
            </button>
          ))}
          <div className="pt-8 pb-4 text-[8px] font-black text-gray-500 uppercase tracking-widest px-2">
            Curriculum Progress (4 Months)
          </div>
          <div className="space-y-1 pb-10 px-2">
            {/* ADJUSTED LOOP FOR 16 WEEKS */}
            {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => {
              const weekInfo = weeksData[String(w)];
              return (
                <div
                  key={w}
                  onClick={() => !isWeekLocked(w) && setCurrentWeek(w)}
                  className={`px-4 py-3 rounded-xl flex flex-col transition-all ${isWeekLocked(w) ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-50/10 cursor-pointer"} ${currentWeek === w ? "bg-blue-600/10 border border-blue-600/20" : ""}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-2 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${w === 8 || w === 16 ? "bg-red-600 text-white min-w-[70px]" : isWeekLocked(w) ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                      >
                        {w === 8 ? "MIDTERM" : w === 16 ? "FINAL EXAM" : w}
                      </div>
                      <span className="text-[10px] font-black uppercase">
                        Week {w}
                      </span>
                    </div>
                    {isWeekLocked(w) ? (
                      <Lock size={10} className="text-red-500" />
                    ) : (
                      <CheckCircle size={10} className="text-emerald-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest bg-slate-800/50`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />} Visual Shift
          </button>
          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[9px] uppercase bg-red-600 text-white shadow-lg"
          >
            <LogOut size={16} /> Logout Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-14 overflow-y-auto">
        <header className="lg:hidden flex justify-between items-center mb-10">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-3 bg-blue-600 text-white rounded-xl"
          >
            <Menu />
          </button>
          <h2 className="font-black italic uppercase text-blue-600">
            AVA PORTAL
          </h2>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="bg-blue-600 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
              <Award className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
              <div className="relative z-10">
                <h2 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">
                  {selectedCourseId?.replace("_", " ")}
                </h2>
                <p className="text-lg font-bold opacity-80 max-w-xl">
                  Welcome, {studentData?.fullName}. Accessing Academic Node for
                  Week {currentWeek}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB UI --- */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                  Account <span className="text-blue-600">& Security</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Student UID: {studentData?.id}
                </p>
              </div>
            </div>

            {settingsMessage.text && (
              <div
                className={`p-5 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase border animate-in zoom-in ${settingsMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
              >
                {settingsMessage.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {settingsMessage.text}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Identity Image
                </h3>
                <div className="relative">
                  <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800 flex items-center justify-center relative">
                    {studentData?.photoURL ? (
                      <img
                        src={studentData.photoURL}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <User size={60} className="text-slate-700" />
                    )}
                  </div>
                  <label className="absolute -bottom-4 -right-4 p-4 bg-blue-600 text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all">
                    <Camera size={20} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Security Access
                </h3>
                <form
                  onSubmit={handlePasswordUpdate}
                  className={`p-10 rounded-[2.5rem] border shadow-xl space-y-6 ${darkMode ? "bg-slate-900 border-white/5" : "bg-white border-gray-100"}`}
                >
                  <input
                    type="password"
                    placeholder="CURRENT ACCESS KEY"
                    required
                    className="s-input"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="NEW ACCESS KEY"
                      required
                      className="s-input"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="CONFIRM NEW KEY"
                      required
                      className="s-input"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                  >
                    {loading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <UploadCloud size={16} />
                    )}{" "}
                    Commit Updates
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* ADJUSTED EXAM CHECK FOR WEEK 8 AND 16 */}
            {currentWeek === 8 || currentWeek === 16 ? (
              <div
                className={`p-10 rounded-[3rem] border-4 ${darkMode ? "bg-slate-900 border-red-500/20" : "bg-white border-red-500/20 shadow-2xl"}`}
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="text-red-600" size={48} />
                    <div>
                      <h2 className="text-4xl font-black italic uppercase">
                        Week {currentWeek} Exam Mode
                      </h2>
                      <p className="font-black text-xs text-red-500 uppercase tracking-widest">
                        Timed Assessment: 60 Minutes
                      </p>
                    </div>
                  </div>
                  {examActive && (
                    <div className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-2xl font-mono shadow-xl animate-pulse">
                      {formatTimer(timeLeft)}
                    </div>
                  )}
                </div>
                {!examActive && !examScore ? (
                  <div className="p-10 bg-black/5 rounded-[2rem] border border-white/5">
                    <h4 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                      <AlertTriangle className="text-orange-500" /> Examination
                      Protocol
                    </h4>
                    <div className="space-y-4 opacity-80 font-bold mb-10 whitespace-pre-wrap">
                      {currentWeekInfo.examRules ||
                        "Standard examination protocols apply. You have one attempt."}
                    </div>
                    <button
                      onClick={() => setExamActive(true)}
                      className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase italic text-xl shadow-2xl"
                    >
                      Initiate Final Assessment
                    </button>
                  </div>
                ) : examScore !== null ? (
                  <div className="text-center py-16 animate-in zoom-in">
                    <Trophy
                      className="mx-auto mb-8 text-yellow-500"
                      size={100}
                    />
                    <h2 className="text-3xl font-black uppercase italic mb-12">
                      Performance Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 mb-12">
                      <div className="p-8 bg-blue-600 rounded-[2rem] text-white">
                        <p className="text-[10px] font-black uppercase mb-2">
                          Score
                        </p>
                        <h4 className="text-6xl font-black italic">
                          {examScore.score}%
                        </h4>
                      </div>
                      <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                          Results
                        </p>
                        <h4 className="text-5xl font-black text-emerald-500">
                          {examScore.correctAnswers}/{examScore.totalQuestions}
                        </h4>
                      </div>
                      <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                          Authorization
                        </p>
                        <h4
                          className={`text-3xl font-black uppercase ${examScore.passed ? "text-blue-600" : "text-red-600"}`}
                        >
                          {examScore.passed ? "PASSED" : "FAILED"}
                        </h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12 h-[600px] overflow-y-auto px-4 custom-scrollbar">
                    {currentWeekInfo.exams?.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-8 bg-black/5 rounded-[2rem] border border-white/5"
                      >
                        <p className="text-xl font-black mb-6">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {["A", "B", "C"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() =>
                                setAnswers({ ...answers, [idx]: opt })
                              }
                              className={`p-5 rounded-xl font-black border-2 transition-all ${answers[idx] === opt ? "bg-blue-600 border-blue-600 text-white" : "border-transparent bg-black/10"}`}
                            >
                              {opt}: {q[`option${opt}`]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleExamSubmit}
                      className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xl sticky bottom-0"
                    >
                      Verify & Submit Exam
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-black aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white/5">
                  {isWeekLocked(currentWeek) ? (
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-center p-10">
                      <Lock
                        size={64}
                        className="text-red-600 mb-6 animate-pulse"
                      />
                      <h3 className="text-3xl font-black uppercase italic">
                        Node Temporarily Locked
                      </h3>
                      <p className="font-bold opacity-60">
                        Complete previous modules or await release date.
                      </p>
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentWeekInfo.videoId}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div
                  className={`p-10 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white shadow-xl"}`}
                >
                  <h3 className="text-3xl font-black uppercase italic mb-6">
                    {currentWeekInfo.title || "Module Curriculum"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                      <h5 className="font-black text-[10px] uppercase mb-4 flex items-center gap-2">
                        <FileText size={18} /> Course PDF
                      </h5>
                      <a
                        href={currentWeekInfo.pdfNode}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-center text-[10px] uppercase shadow-lg"
                      >
                        Download Resources
                      </a>
                    </div>
                    <div
                      className={`p-8 rounded-[2.5rem] border ${darkMode ? "bg-white/5" : "bg-gray-50"}`}
                    >
                      <h5 className="text-[10px] font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                        <Clock size={18} /> Assignment
                      </h5>
                      <p className="text-sm font-bold opacity-70 italic">
                        {currentWeekInfo.assignment ||
                          "Complete weekly module exercise."}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- LIBRARY TAB --- */}
        {activeTab === "library" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6">
            {libraryLinks.map((lib, i) => (
              <a
                key={i}
                href={lib.url}
                target="_blank"
                rel="noreferrer"
                className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-105 group ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-white shadow-xl"}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-600/10 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                    {lib.cat}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase italic mb-4">
                  {lib.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 group-hover:text-blue-600">
                  Access Portal <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* --- DISCUSSIONS TAB --- */}
        {activeTab === "discussions" && (
          <div className="animate-in fade-in duration-500">
            {viewState === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {availableCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setViewState("selection");
                    }}
                    className={`p-10 rounded-[2.5rem] border cursor-pointer hover:border-blue-600 transition-all ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-xl"}`}
                  >
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                      {c.icon}
                    </div>
                    <h4 className="text-2xl font-black italic uppercase">
                      {c.name}
                    </h4>
                  </div>
                ))}
              </div>
            )}
            {viewState === "selection" && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-10 min-h-[50vh]">
                <button
                  onClick={() => {
                    setSelectedPath("General Thread");
                    setViewState("forum");
                  }}
                  className="p-16 bg-blue-600 text-white rounded-[4rem] font-black italic text-5xl uppercase shadow-2xl hover:scale-105 transition-all"
                >
                  General
                </button>
                <button
                  onClick={() => {
                    setSelectedPath("Advanced Discussion");
                    setViewState("forum");
                  }}
                  className="p-16 bg-slate-900 text-white rounded-[4rem] font-black italic text-5xl uppercase shadow-2xl hover:scale-105 transition-all"
                >
                  Advanced
                </button>
              </div>
            )}
            {viewState === "forum" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div
                  className={`p-10 rounded-[3rem] border sticky top-0 h-fit ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-xl"}`}
                >
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newPost.title || !newPost.content) return;
                      await addDoc(collection(db, "forum_threads"), {
                        ...newPost,
                        studentName: studentData?.fullName || "Student",
                        studentId: auth.currentUser.uid,
                        courseId: selectedCourse.id,
                        studentType: selectedPath,
                        createdAt: serverTimestamp(),
                      });
                      setNewPost({ title: "", content: "" });
                    }}
                    className="space-y-4"
                  >
                    <input
                      className="s-input"
                      placeholder="POST TITLE"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                    />
                    <textarea
                      className="s-input h-40 pt-4"
                      placeholder="COMMUNITY DETAILS..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                    />
                    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                      Publish Post
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  {forumThreads.map((t) => (
                    <div
                      key={t.id}
                      className={`p-10 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-sm"}`}
                    >
                      <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">
                        "{t.title}"
                      </h3>
                      <p className="opacity-60 text-sm leading-relaxed mb-8">
                        {t.content}
                      </p>
                      <span className="text-[10px] font-black text-blue-600 uppercase">
                        By Student: {t.studentName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- CHAT TAB --- */}
        {activeTab === "chat" && (
          <div
            className={`h-[80vh] flex flex-col rounded-[3.5rem] border overflow-hidden ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-2xl"}`}
          >
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center shadow-lg">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                Faculty Encryption Link
              </h3>
              <ShieldCheck size={30} />
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-4 flex flex-col custom-scrollbar">
              {privateMessages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[75%] p-5 rounded-[2rem] text-sm font-bold shadow-sm ${m.senderRole === "student" ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                >
                  {m.text}
                  <div className="text-[8px] opacity-40 mt-2 uppercase">
                    {m.sender} •{" "}
                    {m.createdAt ? formatDate(m.createdAt) : "Transmitting..."}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newPrivateMsg.trim()) return;
                await addDoc(collection(db, "private_chats"), {
                  text: newPrivateMsg,
                  sender: studentData?.fullName || "Student",
                  senderRole: "student",
                  studentId: studentData?.id,
                  createdAt: serverTimestamp(),
                });
                setNewPrivateMsg("");
              }}
              className="p-6 border-t border-white/5 flex gap-4 bg-slate-900/10"
            >
              <input
                value={newPrivateMsg}
                onChange={(e) => setNewPrivateMsg(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-black text-sm"
                placeholder="Secure message..."
              />
              <button className="p-5 bg-blue-600 text-white rounded-2xl shadow-xl">
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </main>

      <style>{`
        .s-input { width: 100%; padding: 1.25rem; background: ${darkMode ? "#1e293b" : "#f8fafc"}; border: 2px solid transparent; border-radius: 1.5rem; font-weight: 800; font-size: 0.8rem; outline: none; transition: 0.3s; color: inherit; }
        .s-input:focus { border-color: #2563eb; background: ${darkMode ? "#0f172a" : "white"}; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudentPortal;
