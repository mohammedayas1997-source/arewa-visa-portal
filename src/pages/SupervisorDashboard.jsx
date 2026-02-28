import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
  doc,
  orderBy,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  MessageSquare,
  Loader2,
  Sun,
  Moon,
  ShieldCheck,
  Send,
  BookOpen,
  History,
  Lock,
  ExternalLink,
  Wallet,
  Settings,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  UploadCloud,
  X,
  Database,
  Terminal,
  Activity,
  Cpu,
} from "lucide-react";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forum");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [forumThreads, setForumThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  const [selectedStudentForDM, setSelectedStudentForDM] = useState(null);
  const [dmText, setDmText] = useState("");
  const [systemLogs, setSystemLogs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("super-theme") === "dark",
  );
  const [supervisorData, setSupervisorData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [settingsMsg, setSettingsMsg] = useState({ type: "", text: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const availableCourses = [
    "Cleaning Course",
    "Housekeeping Course",
    "Laundry Service Course",
    "Visa Processing Course",
    "Ticketing & Reservation",
    "Agency Management",
    "Customer Service Course",
    "Aircraft Cleaner Course",
    "Security Training",
    "Caregiver - Nanny Course",
    "Cargo & Logistics Course",
    "Travels and Tourism",
  ];

  const libraryLinks = [
    {
      name: "IATA Travel Standards",
      url: "https://www.iata.org/en/publications/manuals/",
      cat: "Aviation",
    },
    {
      name: "UNWTO Tourism Hub",
      url: "https://www.unwto.org/",
      cat: "Tourism",
    },
    {
      name: "Global Visa Protocols",
      url: "https://scholar.google.com/",
      cat: "Legal",
    },
    {
      name: "Hospitality Management",
      url: "https://www.hospitalitynet.org/",
      cat: "Hospitality",
    },
    {
      name: "Consular Management Hub",
      url: "https://archive.org/",
      cat: "Consular",
    },
    {
      name: "Digital Travel Systems",
      url: "https://www.amadeus.com/en",
      cat: "Tech",
    },
    {
      name: "Freight Forwarding Laws",
      url: "https://www.fiata.org/",
      cat: "Logistics",
    },
    {
      name: "Childcare Standards",
      url: "https://www.unicef.org/",
      cat: "Caregiver",
    },
    {
      name: "Security Protocols",
      url: "https://www.asisonline.org/",
      cat: "Security",
    },
    {
      name: "Arewa Case Studies",
      url: "https://scholar.google.com/",
      cat: "Research",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setSupervisorData({ id: user.uid, ...snap.data() });
          }
        } catch (error) {
          console.error("Auth Error:", error);
        } finally {
          setAuthLoading(false);
        }
      } else {
        navigate("/admin-login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("super-theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (!selectedCourse) return;
    const courseId = selectedCourse.toLowerCase().replace(/ /g, "_");

    const unsubStudents = onSnapshot(
      query(
        collection(db, "users"),
        where("role", "==", "student"),
        where("selectedCourseId", "==", courseId),
      ),
      (snap) =>
        setStudents(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            studentName: doc.data().fullName,
          })),
        ),
    );

    const unsubForum = onSnapshot(
      query(
        collection(db, "forum_threads"),
        where("courseId", "==", courseId),
        orderBy("createdAt", "desc"),
      ),
      (snap) =>
        setForumThreads(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ),
    );

    const unsubLogs = onSnapshot(
      query(collection(db, "deployment_logs"), orderBy("timestamp", "desc")),
      (snap) =>
        setSystemLogs(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            action: d.data().action,
            details: d.data().title,
          })),
        ),
    );

    return () => {
      unsubStudents();
      unsubForum();
      unsubLogs();
    };
  }, [selectedCourse]);

  useEffect(() => {
    if (!activeThread) return;
    const unsubReplies = onSnapshot(
      query(
        collection(db, `forum_threads/${activeThread.id}/replies`),
        orderBy("createdAt", "asc"),
      ),
      (snap) => setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => unsubReplies();
  }, [activeThread]);

  useEffect(() => {
    if (!selectedStudentForDM) return;
    const q = query(
      collection(db, "private_chats"),
      where("studentId", "==", selectedStudentForDM.id),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap) =>
      setPrivateMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => unsub();
  }, [selectedStudentForDM]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUpdating(true);
    try {
      const storageRef = ref(
        storage,
        `supervisors/${supervisorData.id}_${Date.now()}`,
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", supervisorData.id), { photoURL: url });
      setSupervisorData((prev) => ({ ...prev, photoURL: url }));
      setSettingsMsg({ type: "success", text: "Identity profile updated." });
    } catch (err) {
      setSettingsMsg({
        type: "error",
        text: "System failed to process image.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm)
      return setSettingsMsg({
        type: "error",
        text: "Password confirmation mismatch.",
      });
    setIsUpdating(true);
    try {
      const cred = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwords.current,
      );
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, passwords.new);
      setSettingsMsg({
        type: "success",
        text: "Security credentials synchronized.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setSettingsMsg({
        type: "error",
        text: "Invalid current authorization key.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    await addDoc(collection(db, "private_chats"), {
      text: dmText,
      sender: supervisorData.fullName || "Supervisor",
      senderRole: "supervisor",
      studentId: selectedStudentForDM.id,
      createdAt: serverTimestamp(),
    });
    setDmText("");
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await addDoc(collection(db, `forum_threads/${activeThread.id}/replies`), {
      text: reply,
      sender: supervisorData.fullName || "Supervisor",
      role: "supervisor",
      createdAt: serverTimestamp(),
    });
    setReply("");
  };

  const handleLogout = async () => {
    if (window.confirm("CRITICAL: Terminate Session?")) {
      await signOut(auth);
      navigate("/admin-login");
    }
  };

  if (authLoading)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-slate-950 text-blue-500" : "bg-white text-blue-600"}`}
      >
        <Loader2 className="animate-spin mb-4" size={56} />
        <p className="font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
          Authenticating Neural Access...
        </p>
      </div>
    );

  if (!selectedCourse)
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-8 ${isDarkMode ? "bg-[#020617]" : "bg-[#f8fafc]"}`}
      >
        <div className="max-w-7xl w-full">
          <div className="mb-20 text-center animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] mb-6">
              <Terminal size={12} /> System Status: Online
            </div>
            <h1 className="text-8xl font-black italic tracking-tighter text-blue-600 mb-4 drop-shadow-2xl">
              AVA.<span className="text-inherit opacity-40">CORE</span>
            </h1>
            <p
              className={`font-black uppercase tracking-[0.5em] text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Global Operational Command Terminal
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-700 delay-300">
            {availableCourses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`group p-8 rounded-[2.5rem] text-left transition-all border relative overflow-hidden h-48 flex flex-col justify-between ${isDarkMode ? "bg-slate-900 border-white/5 hover:border-blue-500 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]" : "bg-white border-slate-200 shadow-sm hover:border-blue-600 hover:shadow-2xl"}`}
              >
                <ShieldCheck
                  size={28}
                  className="text-blue-600 opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500"
                />
                <span
                  className={`font-black text-xs uppercase tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {course}
                </span>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity size={14} className="text-blue-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${isDarkMode ? "bg-slate-950 text-white" : "bg-[#f8fafc] text-slate-900"} font-sans`}
    >
      <aside
        className={`fixed lg:sticky top-0 h-screen w-80 p-8 flex flex-col border-r z-[100] transition-all duration-500 ${isDarkMode ? "bg-[#0a0f1e] border-white/5" : "bg-white border-slate-200 shadow-2xl"}`}
      >
        <div
          className="flex items-center gap-4 mb-14 cursor-pointer group"
          onClick={() => setSelectedCourse(null)}
        >
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] group-hover:rotate-6 transition-transform">
            <Cpu size={22} />
          </div>
          <h2 className="text-xl font-black italic text-blue-600 tracking-tighter">
            AVA CENTRAL
          </h2>
        </div>

        <nav className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
          {[
            {
              id: "forum",
              icon: <MessageSquare size={18} />,
              label: "Dispatch Forum",
            },
            { id: "dm", icon: <Lock size={18} />, label: "Secure Comms" },
            {
              id: "students",
              icon: <Users size={18} />,
              label: "Cadet Roster",
            },
            {
              id: "library",
              icon: <BookOpen size={18} />,
              label: "Resource Vault",
            },
            {
              id: "history",
              icon: <History size={18} />,
              label: "Incident Logs",
            },
            { id: "settings", icon: <Settings size={18} />, label: "Config" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`t-nav ${activeTab === tab.id ? "t-active" : ""}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[2rem] text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Database size={100} />
          </div>
          <div className="flex items-center gap-2 mb-1 opacity-50 relative z-10">
            <Wallet size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Active Credit
            </span>
          </div>
          <div className="text-3xl font-black italic relative z-10 tracking-tighter">
            ₦{supervisorData?.salary?.toLocaleString()}
          </div>
        </div>

        <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] hover:bg-blue-600/10 transition-all border border-white/5"
          >
            <span className="flex items-center gap-3">
              {" "}
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}{" "}
              Spectrum{" "}
            </span>
            <div
              className={`w-8 h-4 rounded-full relative ${isDarkMode ? "bg-blue-600" : "bg-slate-600"}`}
            >
              <div
                className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${isDarkMode ? "right-1" : "left-1"}`}
              ></div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] transition-all"
          >
            <LogOut size={16} /> Abort Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-16 relative overflow-x-hidden">
        <header className="flex justify-between items-start mb-20 animate-in fade-in duration-1000">
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-full"></div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-blue-600">
              {activeTab} Node
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-2 flex items-center gap-2">
              <Activity size={10} className="text-emerald-500" /> System Env:{" "}
              {selectedCourse}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div
                className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
              >
                Authenticated as
              </div>
              <div className="font-black text-sm uppercase italic">
                {supervisorData?.fullName || "Supervisor"}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl border-2 border-blue-600/20 overflow-hidden shadow-xl">
              {supervisorData?.photoURL ? (
                <img
                  src={supervisorData.photoURL}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-blue-600 font-black">
                  S
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === "settings" && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="relative group">
                <div className="w-full aspect-square rounded-[3.5rem] overflow-hidden border-8 border-blue-600/10 bg-slate-800 flex items-center justify-center relative shadow-3xl">
                  {supervisorData?.photoURL ? (
                    <img
                      src={supervisorData.photoURL}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Identity"
                    />
                  ) : (
                    <Users size={80} className="opacity-10" />
                  )}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
                      {" "}
                      <RefreshCcw
                        className="animate-spin text-blue-500"
                        size={32}
                      />{" "}
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-6 -right-6 p-6 bg-blue-600 text-white rounded-[2rem] shadow-[0_20px_40px_rgba(37,99,235,0.4)] cursor-pointer hover:scale-110 transition-all border-4 border-slate-950">
                  <Camera size={24} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="md:col-span-2 space-y-8">
                {settingsMsg.text && (
                  <div
                    className={`p-6 rounded-3xl flex items-center gap-4 font-black text-[10px] uppercase border animate-in zoom-in ${settingsMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
                  >
                    {settingsMsg.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}{" "}
                    {settingsMsg.text}
                  </div>
                )}
                <form
                  onSubmit={handlePasswordUpdate}
                  className={`p-12 rounded-[3.5rem] border space-y-8 ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-2xl" : "bg-white shadow-2xl border-slate-100"}`}
                >
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">
                      Current Authorization
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">
                        New Key
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
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">
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
                    disabled={isUpdating}
                    className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
                  >
                    {isUpdating ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <>
                        {" "}
                        <UploadCloud size={20} /> Synchronize Access{" "}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "forum" && (
          <div className="flex gap-10 h-[75vh] animate-in fade-in slide-in-from-right-10 duration-700">
            <div
              className={`w-1/3 rounded-[3.5rem] border overflow-hidden flex flex-col ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}
            >
              <div className="p-10 border-b border-white/5 font-black uppercase text-[10px] opacity-40 tracking-[0.2em] flex items-center gap-3">
                <Database size={14} className="text-blue-600" /> Active Dispatch
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {forumThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread)}
                    className={`p-10 border-b border-white/5 cursor-pointer transition-all relative group ${activeThread?.id === thread.id ? "bg-blue-600 text-white" : "hover:bg-blue-600/5"}`}
                  >
                    {activeThread?.id === thread.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-white rounded-r-full"></div>
                    )}
                    <p
                      className={`font-black text-sm uppercase italic line-clamp-2 mb-3 tracking-tight ${activeThread?.id === thread.id ? "text-white" : "text-inherit"}`}
                    >
                      "{thread.title}"
                    </p>
                    <div className="flex items-center gap-3 opacity-50 text-[10px] font-bold">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                        <Users size={12} />
                      </div>
                      <span className="uppercase tracking-widest">
                        Cadet {thread.studentName?.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`flex-1 rounded-[4rem] border flex flex-col overflow-hidden ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-3xl" : "bg-white border-slate-200 shadow-2xl"}`}
            >
              {activeThread ? (
                <>
                  <div
                    className={`p-12 border-b ${isDarkMode ? "bg-blue-600/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                        Subject Line
                      </span>
                    </div>
                    <h3 className="font-black text-4xl italic uppercase text-blue-600 tracking-tighter leading-none mb-6">
                      {activeThread.title}
                    </h3>
                    <div
                      className={`p-6 rounded-3xl border ${isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-white border-slate-200"} text-sm leading-relaxed font-medium opacity-80 italic`}
                    >
                      "{activeThread.content}"
                    </div>
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto space-y-8 flex flex-col custom-scrollbar bg-transparent">
                    {replies.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[75%] p-8 rounded-[2.5rem] relative ${msg.role === "supervisor" ? "bg-blue-600 text-white self-end rounded-tr-none shadow-[0_15px_30px_rgba(37,99,235,0.3)]" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${msg.role === "supervisor" ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}
                          >
                            {msg.sender?.charAt(0)}
                          </div>
                          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">
                            {msg.sender}
                          </span>
                        </div>
                        <p className="text-sm font-bold italic leading-relaxed">
                          "{msg.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleReply}
                    className="p-10 border-t border-white/5 flex gap-6 bg-slate-950/20 backdrop-blur-md"
                  >
                    <input
                      className="flex-1 bg-transparent outline-none font-black text-sm px-6 text-inherit placeholder:opacity-20"
                      placeholder="Transmit secure response..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="p-6 bg-blue-600 text-white rounded-3xl hover:scale-110 transition-all shadow-[0_15px_30px_rgba(37,99,235,0.4)]"
                    >
                      <Send size={24} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                  <div className="w-32 h-32 rounded-full bg-blue-600/5 flex items-center justify-center mb-10 border border-blue-600/10 animate-pulse">
                    <MessageSquare
                      size={50}
                      className="text-blue-600 opacity-20"
                    />
                  </div>
                  <h2 className="font-black uppercase text-xl tracking-tighter opacity-20 italic">
                    Awaiting Thread Selection
                  </h2>
                  <p className="font-black uppercase text-[10px] mt-4 tracking-[0.3em] opacity-10">
                    Select an operational dispatch thread to begin monitoring
                    communications
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "dm" && (
          <div className="flex gap-10 h-[75vh] animate-in zoom-in duration-700">
            <div
              className={`w-1/3 rounded-[3.5rem] border flex flex-col ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-2xl" : "bg-white shadow-2xl"}`}
            >
              <div className="p-10 font-black uppercase text-[10px] opacity-40 border-b border-white/5 tracking-[0.2em] flex items-center gap-3">
                <Target size={14} className="text-blue-600" /> Secure Directory
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {students.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentForDM(s)}
                    className={`p-10 border-b border-white/5 cursor-pointer transition-all flex items-center gap-6 ${selectedStudentForDM?.id === s.id ? "bg-blue-600 text-white" : "hover:bg-blue-600/5"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${selectedStudentForDM?.id === s.id ? "bg-white text-blue-600" : "bg-slate-800 text-blue-500"}`}
                    >
                      {s.studentName?.charAt(0)}
                    </div>
                    <p className="font-black uppercase text-sm tracking-tight">
                      {s.studentName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`flex-1 rounded-[4rem] border flex flex-col overflow-hidden ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-3xl" : "bg-white shadow-2xl"}`}
            >
              {selectedStudentForDM ? (
                <>
                  <div className="p-10 border-b border-white/5 bg-blue-600/5 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase text-blue-600 tracking-[0.4em] mb-1">
                        Encrypted Link Established
                      </div>
                      <h3 className="font-black italic uppercase text-inherit tracking-tighter text-2xl">
                        Cadet {selectedStudentForDM.studentName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[8px] font-black uppercase opacity-40">
                          Status
                        </div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase">
                          Synchronized
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-glow"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto flex flex-col space-y-8 custom-scrollbar">
                    {privateMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[70%] p-8 rounded-[2.5rem] font-bold text-sm shadow-xl ${m.senderRole === "supervisor" ? "bg-blue-600 text-white self-end rounded-tr-none shadow-[0_15px_40px_rgba(37,99,235,0.2)]" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                      >
                        <div className="opacity-80 leading-relaxed italic">
                          "{m.text}"
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                            {m.sender}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleSendDM}
                    className="p-10 border-t border-white/5 flex gap-6 bg-slate-950/30 backdrop-blur-md"
                  >
                    <input
                      value={dmText}
                      onChange={(e) => setDmText(e.target.value)}
                      placeholder="Type classified transmission..."
                      className="flex-1 bg-transparent outline-none font-black text-sm px-6 text-inherit placeholder:opacity-20"
                    />
                    <button
                      type="submit"
                      className="p-6 bg-blue-600 text-white rounded-3xl hover:scale-110 transition-all shadow-[0_15px_30px_rgba(37,99,235,0.4)]"
                    >
                      <Send size={24} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 opacity-20 text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-blue-600 flex items-center justify-center mb-10">
                    <Lock size={60} />
                  </div>
                  <h2 className="font-black uppercase text-xl tracking-tighter italic">
                    Security Clearance Required
                  </h2>
                  <p className="font-black uppercase text-[10px] mt-4 tracking-[0.3em]">
                    Select a cadet to establish high-level encrypted link
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div
            className={`rounded-[4rem] border overflow-hidden animate-in slide-in-from-bottom-20 duration-1000 ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-3xl" : "bg-white border-slate-100 shadow-3xl"}`}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 bg-blue-600 text-white">
                  <th className="p-12">Cadet Identity & Rank</th>
                  <th className="p-12">Module Assignment</th>
                  <th className="p-12 text-center">Node Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std) => (
                  <tr
                    key={std.id}
                    className="border-b border-white/5 hover:bg-blue-600/5 transition-all group cursor-default"
                  >
                    <td className="p-12 flex items-center gap-8">
                      <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-blue-600 font-black text-xl shadow-2xl group-hover:rotate-12 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-white/5">
                        {std.studentName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-xl uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                          {std.studentName}
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mt-1">
                          ID: {std.id.substring(0, 12).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="p-12">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/5 rounded-xl border border-blue-600/10">
                        <Database size={12} className="text-blue-600" />
                        <span className="text-xs font-black text-blue-600 italic tracking-widest">
                          {std.selectedCourseId
                            ?.replace(/_/g, " ")
                            .toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-12 text-center">
                      <span className="px-6 py-3 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-2xl border border-emerald-500/20 shadow-[0_10px_20px_rgba(16,185,129,0.1)]">
                        Synchronized
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "history" && (
          <div
            className={`rounded-[4rem] border overflow-hidden animate-in fade-in duration-1000 ${isDarkMode ? "bg-[#0c1222] border-white/5 shadow-3xl" : "bg-white shadow-3xl"}`}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-white border-b border-white/5 bg-slate-800 tracking-[0.3em]">
                  <th className="p-10">Protocol Action</th>
                  <th className="p-10">Operational Details</th>
                  <th className="p-10 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/5 transition-all hover:bg-blue-600/5"
                  >
                    <td className="p-10">
                      <span className="px-4 py-2 bg-blue-600/10 text-blue-600 font-black uppercase text-[10px] tracking-widest rounded-xl border border-blue-600/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-10 font-bold text-sm uppercase italic opacity-80 tracking-tight">
                      "{log.details}"
                    </td>
                    <td className="p-10 text-[10px] font-black opacity-30 text-right uppercase tracking-widest">
                      {log.timestamp?.toDate().toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "library" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in zoom-in duration-700">
            {libraryLinks.map((lib, i) => (
              <a
                key={i}
                href={lib.url}
                target="_blank"
                rel="noreferrer"
                className={`group p-12 rounded-[4rem] border transition-all hover:-translate-y-4 ${isDarkMode ? "bg-[#0c1222] border-white/5 hover:border-blue-600 shadow-3xl" : "bg-white border-slate-200 shadow-2xl hover:border-blue-600"}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="text-[10px] font-black text-blue-600 uppercase bg-blue-600/10 px-5 py-2 rounded-2xl inline-block tracking-[0.2em]">
                    {" "}
                    {lib.cat}{" "}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                    <ExternalLink size={20} />
                  </div>
                </div>
                <h3 className="font-black text-3xl mb-8 uppercase italic tracking-tighter leading-none group-hover:text-blue-600 transition-all">
                  {" "}
                  {lib.name}{" "}
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] opacity-40">
                  Secure Access Point Established
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        
        .t-nav { width: 100%; display: flex; align-items: center; gap: 20px; padding: 22px 30px; border-radius: 30px; font-weight: 900; font-size: 11px; text-transform: uppercase; color: #64748b; transition: 0.5s; border:none; background:none; cursor:pointer; tracking: 0.2em; }
        .t-active { background: #2563eb !important; color: white !important; box-shadow: 0 25px 50px -15px rgba(37, 99, 235, 0.7); transform: translateX(15px); }
        .t-nav:hover:not(.t-active) { background: rgba(37, 99, 235, 0.1); color: #2563eb; transform: translateX(5px); }
        
        .s-input { width: 100%; padding: 1.8rem; background: ${isDarkMode ? "#050a18" : "#f8fafc"}; border: 2px solid transparent; border-radius: 2.5rem; font-weight: 900; font-size: 0.9rem; outline: none; transition: 0.5s; color: inherit; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; letter-spacing: 1px; }
        .s-input:focus { border-color: #2563eb; background: ${isDarkMode ? "#0c1222" : "white"}; box-shadow: 0 0 0 15px rgba(37,99,235,0.07); transform: scale(1.01); }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 100px; }
        .shadow-glow { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
        .shadow-3xl { box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.5); }
        
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
      `}</style>
    </div>
  );
};

export default SupervisorDashboard;
