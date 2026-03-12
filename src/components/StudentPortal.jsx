import React, { useState, useEffect } from "react";
import { auth, db, firestore, storage } from "../firebase"; 
import {
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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
  BookOpen, GraduationCap, LayoutDashboard, MessageSquare, PlayCircle,
  CheckCircle, Clock, ChevronRight, Lock, Award, Send, ShieldCheck,
  LogOut, Moon, Sun, Menu, X, Layers, Users, Search, Bell, Cpu,
  FileText, Download, Calendar, User, Loader2, Trophy, AlertTriangle,
  Camera, RefreshCcw, Settings, UploadCloud, CheckCircle2, AlertCircle,
  Brush, Hotel, Wind, Plane, Briefcase, Headphones, Ship, Package, Globe2,
} from "lucide-react";

// --- UTILITIES ---
const formatDate = (timestamp) => {
  if (!timestamp) return "TBD";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const libraryLinks = [
  { name: "IATA International Standards", url: "https://www.iata.org/en/publications/manuals/", cat: "Aviation" },
  { name: "Global Visa Protocols", url: "https://www.unwto.org/", cat: "Legal" },
  { name: "Arewa Visa Case Studies", url: "https://scholar.google.com/", cat: "Research" },
  { name: "Consular Management Hub", url: "https://archive.org/", cat: "Consular" },
  { name: "Tourism Intelligence", url: "https://www.hospitalitynet.org/", cat: "Hospitality" },
  { name: "Digital Travel Systems", url: "https://www.amadeus.com/en", cat: "Tech" },
];

const StudentPortal = () => {
  const navigate = useNavigate();

  // --- ALL STATES RESTORED ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("stu-theme") === "dark");
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
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [settingsMessage, setSettingsMessage] = useState({ type: "", text: "" });
  const [examActive, setExamActive] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600);

  const availableCourses = [
    { id: "cleaning_course", name: "Cleaning Course", icon: <Brush size={24} /> },
    { id: "housekeeping_course", name: "Housekeeping Course", icon: <Hotel size={24} /> },
    { id: "laundry_service", name: "Laundry Service Course", icon: <Wind size={24} /> },
    { id: "visa_processing", name: "Visa Processing Course", icon: <FileText size={24} /> },
    { id: "ticketing_reservation", name: "Ticketing & Reservation", icon: <Plane size={24} /> },
    { id: "agency_management", name: "Agency Management", icon: <Briefcase size={24} /> },
    { id: "customer_service", name: "Customer Service Course", icon: <Headphones size={24} /> },
    { id: "aircraft_cleaner", name: "Aircraft Cleaner Course", icon: <Ship size={24} /> },
    { id: "security_training", name: "Security Training", icon: <ShieldCheck size={24} /> },
    { id: "caregiver_nanny", name: "Caregiver - Nanny Course", icon: <Users size={24} /> },
    { id: "cargo_logistics", name: "Cargo & Logistics Course", icon: <Package size={24} /> },
    { id: "travel_tourism", name: "Travels and Tourism", icon: <Globe2 size={24} /> },
  ];

  // --- CORE SYSTEM SYNC ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        navigate("/student-login");
        return;
      }
      try {
        // FIXED: Using 'firestore' instead of 'db' for Doc Reference
        const userRef = doc(firestore, "applications", user.email); 
        const unsubUser = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setStudentData({ id: user.uid, ...data });
            if (data.selectedCourseId) setSelectedCourseId(data.selectedCourseId);

            const courseStartDate = data.appliedAt ? new Date(data.appliedAt) : new Date();
            const diffTime = new Date() - courseStartDate;
            const weekCount = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
            setCurrentWeek(weekCount > 16 ? 16 : weekCount < 1 ? 1 : weekCount);
            
            // Check Midterm Status (Week 8)
            const midtermRef = doc(firestore, `students/${user.uid}/exams`, "week_8");
            const midtermSnap = await getDoc(midtermRef);
            if (midtermSnap.exists() && midtermSnap.data().passed) setHasPassedMidterm(true);

            setLoading(false);
          } else {
            setLoading(false);
          }
        });
        return () => unsubUser();
      } catch (error) {
        console.error("Portal Sync Failure:", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Sync Weeks Data
  useEffect(() => {
    if (!selectedCourseId) return;
    const unsubWeeks = onSnapshot(collection(firestore, "course_settings"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        if (doc.id.startsWith(selectedCourseId)) {
          const weekPart = doc.id.split("_week_")[1];
          data[weekPart] = doc.data();
        }
      });
      setWeeksData(data);
    });
    return () => unsubWeeks();
  }, [selectedCourseId]);

  // Private Messages Sync
  useEffect(() => {
    if (!studentData?.id) return;
    const q = query(collection(firestore, "private_chats"), where("studentId", "==", studentData.id), orderBy("createdAt", "asc"));
    const unsubChat = onSnapshot(q, (snap) => {
      setPrivateMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubChat();
  }, [studentData]);

  // --- ACTIONS ---
  const handleInitialCourseSelection = async (courseId) => {
    setLoading(true);
    try {
      const userRef = doc(firestore, "applications", auth.currentUser.email);
      await updateDoc(userRef, {
        selectedCourseId: courseId,
        courseSelectionDate: serverTimestamp(),
      });
      setSelectedCourseId(courseId);
    } catch (err) {
      alert("Selection Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !studentData) return;
    setLoading(true);
    try {
      const sRef = storageRef(storage, `profiles/${studentData.id}_${Date.now()}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      await updateDoc(doc(firestore, "applications", auth.currentUser.email), { photoURL: url });
      setSettingsMessage({ type: "success", text: "Identity image updated." });
    } catch (err) {
      setSettingsMessage({ type: "error", text: "Upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const isWeekLocked = (weekNumber) => {
    if (weekNumber === 1) return false;
    if (weekNumber > 8 && !hasPassedMidterm) return true;
    return false; 
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />
      <h2 className="text-white font-black uppercase tracking-widest italic">Syncing Academy Protocols...</h2>
    </div>
  );

  if (!selectedCourseId) return (
    <div className={`min-h-screen p-10 ${darkMode ? "bg-slate-950" : "bg-gray-100"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black italic text-center uppercase mb-16 dark:text-white">Choose Your <span className="text-blue-600">Specialization</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {availableCourses.map((c) => (
            <div key={c.id} onClick={() => handleInitialCourseSelection(c.id)} className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-transparent hover:border-blue-600 cursor-pointer transition-all hover:scale-105 group">
              <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {c.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic dark:text-white leading-tight">{c.name}</h3>
              <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enrollment Active</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const currentWeekInfo = weeksData[String(currentWeek)] || {};

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>
      {/* SIDEBAR */}
      <aside className={`w-80 border-r sticky top-0 h-screen flex flex-col ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
        <div className="p-10">
          <h1 className="text-2xl font-black italic text-blue-600">AREWA <span className={darkMode ? "text-white" : "text-slate-900"}>VISA ACADEMY</span></h1>
          <div className="mt-8 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-tighter text-blue-500 flex items-center gap-2"><Clock size={12}/> Terminal Clock</span>
            <h4 className="text-2xl font-black font-mono mt-1">{currentTime.toLocaleTimeString()}</h4>
          </div>
        </div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: "dashboard", name: "Main Hub", icon: <LayoutDashboard size={18} /> },
            { id: "courses", name: "Curriculum", icon: <BookOpen size={18} /> },
            { id: "library", name: "E-Library", icon: <Layers size={18} /> },
            { id: "discussions", name: "Discussions", icon: <MessageSquare size={18} /> },
            { id: "chat", name: "Faculty Chat", icon: <Headphones size={18} /> },
            { id: "settings", name: "Portal Settings", icon: <Settings size={18} /> },
          ].map((nav) => (
            <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === nav.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "opacity-40 hover:opacity-100"}`}>
              {nav.icon} {nav.name}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-2">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl text-[9px] font-black uppercase">{darkMode ? <Sun size={16}/> : <Moon size={16}/>} Interface Style</button>
          <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 p-4 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase"><LogOut size={16}/> End Session</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-14 overflow-y-auto">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-700 space-y-10">
            <div className="p-20 bg-blue-600 rounded-[5rem] text-white relative overflow-hidden shadow-2xl">
              <Award className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
              <div className="relative z-10">
                <span className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Specialization</span>
                <h2 className="text-7xl font-black italic uppercase tracking-tighter mt-4 mb-2">{selectedCourseId?.replace("_", " ")}</h2>
                <p className="text-lg opacity-80 font-bold max-w-xl">Portal Sync Confirmed. Accessing Week {currentWeek} academic nodes for {studentData?.name}.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <h6 className="text-[10px] font-black text-blue-600 uppercase mb-4">Academic Status</h6>
                <h4 className="text-3xl font-black italic uppercase">ACTIVE</h4>
              </div>
              <div className={`p-8 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <h6 className="text-[10px] font-black text-blue-600 uppercase mb-4">Module Progress</h6>
                <h4 className="text-3xl font-black italic uppercase">{Math.round((currentWeek/16)*100)}% Complete</h4>
              </div>
              <div className={`p-8 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <h6 className="text-[10px] font-black text-blue-600 uppercase mb-4">GPA Index</h6>
                <h4 className="text-3xl font-black italic uppercase">PENDING</h4>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM TAB (VIDEO PLAYER & PDFS) */}
        {activeTab === "courses" && (
           <div className="space-y-8 animate-in fade-in duration-500">
             <div className="bg-black aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white/5">
                {isWeekLocked(currentWeek) ? (
                   <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-center p-10">
                      <Lock size={64} className="text-red-600 mb-6 animate-pulse" />
                      <h3 className="text-3xl font-black uppercase italic">Module Temporarily Locked</h3>
                      <p className="font-bold opacity-60">Pass the Midterm Exam in Week 8 to unlock the advanced half of the course.</p>
                   </div>
                ) : (
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentWeekInfo.videoId || "dQw4w9WgXcQ"}`} frameBorder="0" allowFullScreen></iframe>
                )}
             </div>
             <div className={`p-10 rounded-[3rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white shadow-xl"}`}>
                <h3 className="text-3xl font-black uppercase italic mb-6">{currentWeekInfo.title || `Week ${currentWeek} Curriculum`}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white">
                      <h5 className="font-black text-[10px] uppercase mb-4 flex items-center gap-2"><FileText size={18} /> Module Handout</h5>
                      <a href={currentWeekInfo.pdfNode} target="_blank" className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-center text-[10px] uppercase">Download Resources</a>
                   </div>
                   <div className={`p-8 rounded-[2.5rem] border ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                      <h5 className="text-[10px] font-black text-blue-600 uppercase mb-4 flex items-center gap-2"><Clock size={18} /> Current Assignment</h5>
                      <p className="text-sm font-bold opacity-70 italic">{currentWeekInfo.assignment || "Watch the video and complete the PDF practical exercises."}</p>
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><ShieldCheck size={28} /></div>
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Account <span className="text-blue-600">& Security</span></h1>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Reference Email: {auth.currentUser.email}</p>
              </div>
            </div>

            {settingsMessage.text && (
              <div className={`p-5 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase border animate-in zoom-in ${settingsMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                {settingsMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {settingsMessage.text}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Identity Image</h3>
                <div className="relative">
                  <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800 flex items-center justify-center relative">
                    {studentData?.photoURL ? <img src={studentData.photoURL} className="w-full h-full object-cover" /> : <User size={60} className="text-slate-700" />}
                  </div>
                  <label className="absolute -bottom-4 -right-4 p-4 bg-blue-600 text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all">
                    <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Security Access</h3>
                <form className={`p-10 rounded-[2.5rem] border shadow-xl space-y-6 ${darkMode ? "bg-slate-900 border-white/5" : "bg-white border-gray-100"}`}>
                  <input type="password" placeholder="CURRENT KEY" className="s-input" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="password" placeholder="NEW KEY" className="s-input" />
                    <input type="password" placeholder="CONFIRM NEW" className="s-input" />
                  </div>
                  <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Update Credentials</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
        .s-input { width: 100%; padding: 1.25rem; background: ${darkMode ? "#1e293b" : "#f8fafc"}; border: 2px solid transparent; border-radius: 1.5rem; font-weight: 800; font-size: 0.8rem; outline: none; transition: 0.3s; color: inherit; }
        .s-input:focus { border-color: #2563eb; background: ${darkMode ? "#0f172a" : "white"}; }
      `}</style>
    </div>
  );
};

export default StudentPortal;