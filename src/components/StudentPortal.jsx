import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
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
  Activity,
  Zap,
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
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [settingsMessage, setSettingsMessage] = useState({
    type: "",
    text: "",
  });
  const [examActive, setExamActive] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600);

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
        setLoading(false);
        navigate("/student-login");
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
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

            const examRef = doc(db, `students/${user.uid}/exams/week_8`);
            const examSnap = await getDoc(examRef);
            if (examSnap.exists() && examSnap.data().passed)
              setHasPassedMidterm(true);
            setLoading(false);
          } else {
            setLoading(false);
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
    if (finalScore >= 50 && currentWeek === 8) setHasPassedMidterm(true);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black text-blue-600 bg-[#020617]">
        <Loader2 className="animate-spin mb-6" size={64} />
        <p className="tracking-[0.4em] animate-pulse uppercase text-[10px]">
          AVA.CORE | Neural Syncing Protocols Active
        </p>
      </div>
    );

  if (!selectedCourseId)
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? "bg-[#020617]" : "bg-gray-100"}`}
      >
        <div className="max-w-7xl w-full">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] mb-6">
              <Zap size={12} /> Specialization Protocol Required
            </div>
            <h2
              className={`text-7xl font-black italic uppercase tracking-tighter mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Select <span className="text-blue-600">Specialization</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-700">
            {availableCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => handleInitialCourseSelection(c.id)}
                className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all hover:scale-105 group relative overflow-hidden h-64 flex flex-col justify-between ${darkMode ? "bg-slate-900 border-slate-800 hover:border-blue-600 shadow-2xl" : "bg-white border-white hover:border-blue-600 shadow-xl"}`}
              >
                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {c.icon}
                </div>
                <h3
                  className={`text-xl font-black uppercase italic leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {c.name}
                </h3>
                <Activity
                  size={20}
                  className="absolute top-8 right-8 text-blue-600 opacity-20"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const currentWeekInfo = weeksData[String(currentWeek)] || {};

  return (
    <div
      className={`min-h-screen flex font-sans ${darkMode ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-900"} transition-colors duration-500`}
    >
      <aside
        className={`fixed lg:sticky top-0 z-[100] h-screen w-80 border-r flex flex-col transition-all duration-500 ${darkMode ? "bg-[#0a0f1e] border-white/5" : "bg-white border-gray-200 shadow-2xl"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-10 flex flex-col gap-6">
          <h1 className="text-3xl font-black text-blue-600 italic tracking-tighter">
            AVA.
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>
              TERMINAL
            </span>
          </h1>
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-900 text-white shadow-xl shadow-blue-500/30">
            <div className="flex items-center gap-3 opacity-60 mb-2">
              <Clock size={12} className="animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                Operational Time
              </span>
            </div>
            <h4 className="text-2xl font-black font-mono tracking-tighter">
              {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
            </h4>
          </div>
        </div>
        <nav className="flex-1 px-8 space-y-3 overflow-y-auto custom-scrollbar">
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
            { id: "library", name: "E-Library", icon: <Layers size={18} /> },
            { id: "chat", name: "Faculty Direct", icon: <User size={18} /> },
            { id: "settings", name: "Config", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setViewState("list");
                setMobileMenuOpen(false);
              }}
              className={`t-nav ${activeTab === item.id ? "t-active" : ""}`}
            >
              {item.icon} {item.name}
            </button>
          ))}
          <div className="pt-10 pb-4 text-[9px] font-black text-blue-600/40 uppercase tracking-[0.3em] px-4">
            Deployment Progress
          </div>
          <div className="space-y-2 pb-12 px-2">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
              <div
                key={w}
                onClick={() => !isWeekLocked(w) && setCurrentWeek(w)}
                className={`px-5 py-3.5 rounded-2xl flex items-center justify-between transition-all ${isWeekLocked(w) ? "opacity-20 cursor-not-allowed" : "hover:bg-blue-600/5 cursor-pointer"} ${currentWeek === w ? "bg-blue-600/10 border border-blue-600/20" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${w === 8 || w === 16 ? "bg-red-600 text-white" : isWeekLocked(w) ? "bg-slate-800" : "bg-blue-600 text-white"}`}
                  >
                    {w}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Node {w}
                  </span>
                </div>
                {isWeekLocked(w) ? (
                  <Lock size={12} className="text-red-500" />
                ) : (
                  <ShieldCheck size={12} className="text-emerald-500" />
                )}
              </div>
            ))}
          </div>
        </nav>
        <div className="p-8 border-t border-white/5 space-y-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600/10"
          >
            <span className="flex items-center gap-3">
              {" "}
              {darkMode ? <Sun size={16} /> : <Moon size={16} />} Visual
              Shift{" "}
            </span>
          </button>
          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-600/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={16} /> Terminate
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        <header className="lg:hidden flex justify-between items-center mb-12">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30"
          >
            {" "}
            <Menu size={24} />{" "}
          </button>
          <h2 className="font-black italic uppercase text-blue-600 tracking-tighter text-2xl">
            AVA
          </h2>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-20 rounded-[4rem] text-white shadow-3xl relative overflow-hidden group">
              <Award className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 rotate-12 transition-transform duration-1000 group-hover:scale-110" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <Activity size={14} /> Academic Node Authorized
                </div>
                <h2 className="text-7xl font-black italic tracking-tighter mb-6 uppercase leading-none">
                  {selectedCourseId?.replace("_", " ")}
                </h2>
                <p className="text-xl font-medium opacity-70 max-w-2xl leading-relaxed">
                  Active Session: Module {currentWeek}. Global standard
                  curriculum initiated for Cadet {studentData?.fullName}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`p-10 rounded-[3.5rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-xl"}`}
              >
                <Trophy className="text-yellow-500 mb-6" size={40} />
                <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">
                  Academic Rank
                </h4>
                <div className="text-3xl font-black uppercase italic tracking-tighter">
                  Elite Cadet
                </div>
              </div>
              <div
                className={`p-10 rounded-[3.5rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-xl"}`}
              >
                <Cpu className="text-blue-600 mb-6" size={40} />
                <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">
                  Module Status
                </h4>
                <div className="text-3xl font-black uppercase italic tracking-tighter">
                  Synchronized
                </div>
              </div>
              <div
                className={`p-10 rounded-[3.5rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-xl"}`}
              >
                <ShieldCheck className="text-emerald-500 mb-6" size={40} />
                <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">
                  Certification
                </h4>
                <div className="text-3xl font-black uppercase italic tracking-tighter">
                  Verified
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-5xl mx-auto space-y-16 animate-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 border-b border-white/5 pb-10">
              <div className="p-5 bg-blue-600 text-white rounded-3xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                <ShieldCheck size={36} />
              </div>
              <div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                  Account <span className="text-blue-600">Config</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-3">
                  Node Identity Verification Mode
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="space-y-8">
                <div className="relative group">
                  <div className="w-full aspect-square rounded-[4rem] overflow-hidden border-8 border-blue-600/10 shadow-3xl bg-slate-800 flex items-center justify-center relative">
                    {studentData?.photoURL ? (
                      <img
                        src={studentData.photoURL}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Profile"
                      />
                    ) : (
                      <User size={80} className="text-slate-700" />
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-md">
                        {" "}
                        <RefreshCcw
                          className="animate-spin text-blue-500"
                          size={32}
                        />{" "}
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-6 -right-6 p-6 bg-blue-600 text-white rounded-[2rem] shadow-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all border-8 border-[#020617]">
                    <Camera size={24} />
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

              <div className="lg:col-span-2 space-y-10">
                <form
                  onSubmit={handlePasswordUpdate}
                  className={`p-14 rounded-[4rem] border space-y-8 ${darkMode ? "bg-[#0a0f1e] border-white/5 shadow-3xl" : "bg-white border-gray-100 shadow-2xl"}`}
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-6">
                      Primary Authentication Key
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      required
                      className="s-input"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-6">
                        New Secure Key
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="s-input"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-6">
                        Confirm Key
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="s-input"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 shadow-3xl hover:translate-y-[-2px] transition-all active:translate-y-[1px]"
                  >
                    {loading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <UploadCloud size={20} />
                    )}{" "}
                    Update Security Layer
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-12 animate-in zoom-in duration-700">
            {currentWeek === 8 || currentWeek === 16 ? (
              <div
                className={`p-16 rounded-[4.5rem] border-8 ${darkMode ? "bg-[#0a0f1e] border-red-500/10 shadow-3xl" : "bg-white border-red-500/10 shadow-3xl"}`}
              >
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center border-4 border-red-500/20">
                      {" "}
                      <ShieldCheck className="text-red-600" size={56} />{" "}
                    </div>
                    <div>
                      <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-3">
                        Module {currentWeek}{" "}
                        <span className="text-red-600">Assesment</span>
                      </h2>
                      <p className="font-black text-[10px] text-red-500 uppercase tracking-[0.4em]">
                        Timed Protocol Status: Restricted
                      </p>
                    </div>
                  </div>
                  {examActive && (
                    <div className="px-12 py-6 bg-red-600 text-white rounded-[2rem] font-black text-4xl font-mono shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-pulse">
                      {" "}
                      {formatTimer(timeLeft)}{" "}
                    </div>
                  )}
                </div>

                {!examActive && !examScore ? (
                  <div className="p-16 bg-slate-950/40 rounded-[3.5rem] border border-white/5 text-center">
                    <div className="inline-flex items-center gap-4 text-orange-500 font-black uppercase text-xs tracking-[0.3em] mb-8">
                      {" "}
                      <AlertTriangle /> Critical Warning: Single Attempt
                      Mode{" "}
                    </div>
                    <div className="text-lg font-medium opacity-60 mb-12 max-w-2xl mx-auto leading-relaxed italic">
                      {" "}
                      "
                      {currentWeekInfo.examRules ||
                        "Standard examination protocols apply. Secure connection required for duration of assessment."}
                      "{" "}
                    </div>
                    <button
                      onClick={() => setExamActive(true)}
                      className="px-20 py-8 bg-red-600 text-white rounded-[2.5rem] font-black uppercase italic text-2xl shadow-3xl hover:scale-105 transition-all"
                    >
                      {" "}
                      Initiate Assessment Protocol{" "}
                    </button>
                  </div>
                ) : examScore !== null ? (
                  <div className="text-center py-20 animate-in zoom-in">
                    <Trophy
                      className="mx-auto mb-10 text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                      size={120}
                    />
                    <h2 className="text-5xl font-black uppercase italic mb-16 tracking-tighter">
                      Performance Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto px-10 mb-16">
                      <div className="p-12 bg-blue-600 rounded-[3.5rem] text-white shadow-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">
                          Neural Score
                        </p>
                        <h4 className="text-7xl font-black italic">
                          {examScore.score}%
                        </h4>
                      </div>
                      <div
                        className={`p-12 rounded-[3.5rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-2xl"}`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">
                          Verification
                        </p>
                        <h4 className="text-6xl font-black text-emerald-500">
                          {examScore.correctAnswers}/{examScore.totalQuestions}
                        </h4>
                      </div>
                      <div
                        className={`p-12 rounded-[3.5rem] border ${darkMode ? "bg-slate-900 border-white/5" : "bg-white shadow-2xl"}`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">
                          Clearance
                        </p>
                        <h4
                          className={`text-4xl font-black uppercase italic ${examScore.passed ? "text-blue-600" : "text-red-600"}`}
                        >
                          {" "}
                          {examScore.passed ? "AUTHORIZED" : "FAILED"}{" "}
                        </h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12 h-[650px] overflow-y-auto px-6 custom-scrollbar">
                    {currentWeekInfo.exams?.map((q, idx) => (
                      <div
                        key={idx}
                        className={`p-12 rounded-[3.5rem] border transition-all ${answers[idx] ? "border-blue-600/40 bg-blue-600/5" : "border-white/5 bg-slate-950/20"}`}
                      >
                        <p className="text-2xl font-black mb-10 tracking-tight leading-tight">
                          {" "}
                          {idx + 1}. {q.question}{" "}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {["A", "B", "C"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() =>
                                setAnswers({ ...answers, [idx]: opt })
                              }
                              className={`p-8 rounded-3xl font-black border-2 transition-all text-sm uppercase italic tracking-widest ${answers[idx] === opt ? "bg-blue-600 border-blue-600 text-white shadow-3xl" : "border-transparent bg-slate-800 hover:bg-slate-700"}`}
                            >
                              {" "}
                              {opt}: {q[`option${opt}`]}{" "}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleExamSubmit}
                      className="w-full py-8 bg-emerald-600 text-white rounded-[3rem] font-black uppercase text-2xl sticky bottom-0 shadow-3xl hover:bg-emerald-500 transition-all"
                    >
                      {" "}
                      Transmit Assessment Data{" "}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-black aspect-video rounded-[4.5rem] overflow-hidden shadow-3xl relative border-8 border-white/5">
                  {isWeekLocked(currentWeek) ? (
                    <div className="absolute inset-0 bg-slate-950/98 flex flex-col items-center justify-center text-center p-16">
                      <Lock
                        size={80}
                        className="text-red-600 mb-8 animate-pulse"
                      />
                      <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-6">
                        Neural Link Restricted
                      </h3>
                      <p className="font-bold opacity-30 text-lg uppercase tracking-[0.2em] max-w-xl">
                        Complete previous module assessments or await global
                        deployment release date.
                      </p>
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentWeekInfo.videoId}`}
                      frameBorder="0"
                      allowFullScreen
                      className="opacity-90"
                    ></iframe>
                  )}
                </div>
                <div
                  className={`p-16 rounded-[4.5rem] border ${darkMode ? "bg-[#0a0f1e] border-white/5 shadow-3xl" : "bg-white shadow-3xl border-gray-100"}`}
                >
                  <h3 className="text-5xl font-black uppercase italic mb-10 tracking-tighter leading-none">
                    {currentWeekInfo.title || "Curriculum Node"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="p-12 bg-blue-600 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group">
                      <Download className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                      <h5 className="font-black text-[10px] uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                        {" "}
                        <FileText size={20} /> Academic Node PDF{" "}
                      </h5>
                      <a
                        href={currentWeekInfo.pdfNode}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-6 bg-white text-blue-600 rounded-[1.5rem] font-black text-center text-[10px] uppercase shadow-2xl hover:scale-105 transition-all active:scale-95"
                      >
                        {" "}
                        Initialize Download{" "}
                      </a>
                    </div>
                    <div
                      className={`p-12 rounded-[3.5rem] border ${darkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-200"}`}
                    >
                      <h5 className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                        {" "}
                        <Clock size={20} /> Field Assignment{" "}
                      </h5>
                      <p className="text-lg font-bold opacity-80 italic leading-relaxed leading-tight uppercase">
                        {" "}
                        "
                        {currentWeekInfo.assignment ||
                          "Operational exercise: Apply weekly module protocols in field environment."}
                        "{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "library" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-20 duration-1000">
            {libraryLinks.map((lib, i) => (
              <a
                key={i}
                href={lib.url}
                target="_blank"
                rel="noreferrer"
                className={`group p-12 rounded-[3.5rem] border-2 transition-all hover:-translate-y-4 ${darkMode ? "bg-[#0a0f1e] border-white/5 hover:border-blue-600 shadow-3xl" : "bg-white border-white shadow-2xl hover:border-blue-600"}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                    {" "}
                    <Layers size={28} />{" "}
                  </div>
                  <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-5 py-2 rounded-2xl tracking-widest border border-blue-600/10">
                    {" "}
                    {lib.cat}{" "}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-8 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                  {" "}
                  {lib.name}{" "}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 group-hover:text-blue-600 tracking-[0.2em]">
                  {" "}
                  Establish Node Access{" "}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform"
                  />{" "}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* --- DISCUSSIONS UI (Maintaining all original logic) --- */}
        {activeTab === "discussions" && (
          <div className="animate-in fade-in duration-700">
            {viewState === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {availableCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setViewState("selection");
                    }}
                    className={`p-12 rounded-[3.5rem] border-2 cursor-pointer transition-all hover:scale-105 hover:border-blue-600 group ${darkMode ? "bg-[#0a0f1e] border-white/5" : "bg-white border-white shadow-2xl"}`}
                  >
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-3xl group-hover:rotate-6 transition-all">
                      {" "}
                      {c.icon}{" "}
                    </div>
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                      {c.name}
                    </h4>
                  </div>
                ))}
              </div>
            )}
            {viewState === "selection" && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 min-h-[60vh]">
                <button
                  onClick={() => {
                    setSelectedPath("General Thread");
                    setViewState("forum");
                  }}
                  className="group relative p-20 bg-blue-600 text-white rounded-[4.5rem] font-black italic text-6xl uppercase shadow-3xl hover:scale-110 transition-all active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">General</span>
                  <Activity className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setSelectedPath("Advanced Discussion");
                    setViewState("forum");
                  }}
                  className="group relative p-20 bg-slate-900 text-white rounded-[4.5rem] font-black italic text-6xl uppercase shadow-3xl hover:scale-110 transition-all active:scale-95 border-4 border-white/5 overflow-hidden"
                >
                  <span className="relative z-10">Advanced</span>
                  <Cpu className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 group-hover:-rotate-12 transition-transform" />
                </button>
              </div>
            )}
            {viewState === "forum" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div
                  className={`p-12 rounded-[4rem] border sticky top-10 h-fit ${darkMode ? "bg-[#0a0f1e] border-white/5 shadow-3xl" : "bg-white border-gray-100 shadow-2xl"}`}
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
                    className="space-y-6"
                  >
                    <div className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mb-6 px-4">
                      Initialize Dispatch Thread
                    </div>
                    <input
                      className="s-input"
                      placeholder="THREAD TITLE"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                    />
                    <textarea
                      className="s-input h-52 pt-6"
                      placeholder="TRANSMIT DETAILS..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                    />
                    <button className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl hover:translate-y-[-2px] transition-all active:translate-y-[1px]">
                      {" "}
                      Broadcast to Node{" "}
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-2 space-y-8">
                  {forumThreads.map((t) => (
                    <div
                      key={t.id}
                      className={`p-14 rounded-[4rem] border transition-all hover:border-blue-600/30 ${darkMode ? "bg-[#0a0f1e] border-white/5 shadow-3xl" : "bg-white border-white shadow-2xl"}`}
                    >
                      <h3 className="text-3xl font-black italic uppercase mb-6 tracking-tighter leading-tight italic">
                        {" "}
                        "{t.title}"{" "}
                      </h3>
                      <p className="opacity-60 text-lg leading-relaxed mb-10 font-medium">
                        {" "}
                        {t.content}{" "}
                      </p>
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          Authorized Student: {t.studentName}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500">
                          {" "}
                          <Clock size={12} />{" "}
                          <span className="text-[8px] font-black">
                            {t.createdAt
                              ? formatDate(t.createdAt)
                              : "Syncing..."}
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- CHAT UI --- */}
        {activeTab === "chat" && (
          <div
            className={`h-[85vh] flex flex-col rounded-[4.5rem] border overflow-hidden animate-in zoom-in duration-700 ${darkMode ? "bg-[#0a0f1e] border-white/5 shadow-3xl" : "bg-white border-gray-100 shadow-3xl"}`}
          >
            <div className="p-12 bg-gradient-to-r from-blue-600 to-indigo-900 text-white flex justify-between items-center shadow-3xl relative overflow-hidden">
              <Activity className="absolute -right-4 top-0 w-40 h-40 opacity-10" />
              <div className="relative z-10">
                <div className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 mb-2">
                  Classified Encryption Protocol
                </div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                  Faculty{" "}
                  <span className="text-inherit opacity-40">Direct</span>
                </h3>
              </div>
              <div className="p-4 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md relative z-10">
                {" "}
                <ShieldCheck size={32} />{" "}
              </div>
            </div>
            <div className="flex-1 p-12 overflow-y-auto space-y-8 flex flex-col custom-scrollbar bg-transparent">
              {privateMessages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[70%] p-8 rounded-[2.5rem] text-sm font-bold shadow-2xl ${m.senderRole === "student" ? "bg-blue-600 text-white self-end rounded-tr-none shadow-[0_20px_40px_rgba(37,99,235,0.3)]" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                >
                  <div className="leading-relaxed mb-6 italic">"{m.text}"</div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[9px] font-black uppercase tracking-widest opacity-40">
                    <span>{m.sender}</span>
                    <span>
                      {m.createdAt
                        ? formatDate(m.createdAt)
                        : "Transmitting..."}
                    </span>
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
              className="p-10 border-t border-white/5 flex gap-6 bg-slate-950/20 backdrop-blur-md"
            >
              <input
                value={newPrivateMsg}
                onChange={(e) => setNewPrivateMsg(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-black text-sm px-6 text-inherit placeholder:opacity-20"
                placeholder="Type classified transmission..."
              />
              <button className="p-6 bg-blue-600 text-white rounded-3xl shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all">
                {" "}
                <Send size={24} />{" "}
              </button>
            </form>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .t-nav { width: 100%; display: flex; align-items: center; gap: 20px; padding: 22px 30px; border-radius: 30px; font-weight: 900; font-size: 11px; text-transform: uppercase; color: #64748b; transition: 0.5s; border:none; background:none; cursor:pointer; tracking: 0.2em; }
        .t-active { background: #2563eb !important; color: white !important; box-shadow: 0 25px 50px -15px rgba(37, 99, 235, 0.7); transform: translateX(15px); }
        .t-nav:hover:not(.t-active) { background: rgba(37, 99, 235, 0.1); color: #2563eb; transform: translateX(10px); }
        .s-input { width: 100%; padding: 1.8rem; background: ${darkMode ? "#050a18" : "#f8fafc"}; border: 2px solid transparent; border-radius: 2.5rem; font-weight: 900; font-size: 0.9rem; outline: none; transition: 0.5s; color: inherit; border: 1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; }
        .s-input:focus { border-color: #2563eb; background: ${darkMode ? "#0c1222" : "white"}; box-shadow: 0 0 0 15px rgba(37,99,235,0.07); transform: scale(1.01); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 100px; }
        .shadow-glow { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
        .shadow-3xl { box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.5); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudentPortal;
