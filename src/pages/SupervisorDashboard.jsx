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

    // FIX: Removed orderBy from students query to prevent index-related blank screen
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
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase tracking-[0.3em] text-xs">
          Authenticating Node Access...
        </p>
      </div>
    );

  if (!selectedCourse)
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}
      >
        <div className="max-w-6xl w-full">
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-black italic tracking-tighter text-blue-600 mb-2">
              AVA.TERMINAL
            </h1>
            <p
              className={`font-black uppercase tracking-widest text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Operational Command Terminal
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableCourses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`p-10 rounded-[2.5rem] text-left transition-all border group relative overflow-hidden ${isDarkMode ? "bg-slate-900 border-white/5 hover:border-blue-600" : "bg-white border-slate-200 shadow-sm hover:border-blue-600"}`}
              >
                <ShieldCheck
                  size={20}
                  className="mb-4 text-blue-600 opacity-40 group-hover:opacity-100 transition-opacity"
                />
                <span
                  className={`font-black text-sm uppercase tracking-tight block ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {course}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${isDarkMode ? "bg-slate-950 text-white" : "bg-[#f8fafc] text-slate-900"}`}
    >
      <aside
        className={`fixed lg:sticky top-0 h-screen w-80 p-8 flex flex-col border-r z-[100] transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}
      >
        <div
          className="flex items-center gap-3 mb-12 cursor-pointer"
          onClick={() => setSelectedCourse(null)}
        >
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-black italic text-blue-600 tracking-tighter">
            AVA CENTRAL
          </h2>
        </div>
        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
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
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-1 opacity-60">
            <Wallet size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Active Credit
            </span>
          </div>
          <div className="text-2xl font-black italic">
            ₦{supervisorData?.salary?.toLocaleString()}
          </div>
        </div>
        <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center gap-3 p-4 bg-slate-800/40 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600/20 transition-all"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} SPECTRUM
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            <LogOut size={18} /> ABORT SESSION
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-blue-600">
              {activeTab} Node
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-1">
              Operational Environment: {selectedCourse}
            </p>
          </div>
        </header>

        {activeTab === "settings" && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative group">
                <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-blue-600/20 bg-slate-800 flex items-center justify-center relative shadow-2xl">
                  {supervisorData?.photoURL ? (
                    <img
                      src={supervisorData.photoURL}
                      className="w-full h-full object-cover"
                      alt="Identity"
                    />
                  ) : (
                    <Users size={64} className="opacity-20" />
                  )}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <RefreshCcw className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-4 -right-4 p-5 bg-blue-600 text-white rounded-3xl shadow-2xl cursor-pointer hover:scale-110 transition-all">
                  <Camera size={20} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="md:col-span-2 space-y-6">
                {settingsMsg.text && (
                  <div
                    className={`p-5 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase border ${settingsMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
                  >
                    {settingsMsg.type === "success" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}{" "}
                    {settingsMsg.text}
                  </div>
                )}
                <form
                  onSubmit={handlePasswordUpdate}
                  className={`p-10 rounded-[3rem] border space-y-6 ${isDarkMode ? "bg-slate-900 border-white/5 shadow-2xl" : "bg-white shadow-xl border-slate-100"}`}
                >
                  <input
                    type="password"
                    placeholder="Current Authorization Key"
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
                      placeholder="New Secure Key"
                      required
                      className="s-input"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Confirm Key"
                      required
                      className="s-input"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                    />
                  </div>
                  <button
                    disabled={isUpdating}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30"
                  >
                    {isUpdating ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <>
                        <UploadCloud size={18} /> Update Security Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "forum" && (
          <div className="flex gap-8 h-[70vh] animate-in fade-in duration-500">
            <div
              className={`w-1/3 rounded-[3rem] border overflow-hidden flex flex-col ${isDarkMode ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}
            >
              <div className="p-8 border-b border-slate-800 font-black uppercase text-[10px] opacity-40 tracking-widest">
                Active Dispatch Threads
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {forumThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThread(thread)}
                    className={`p-8 border-b border-white/5 cursor-pointer transition-all ${activeThread?.id === thread.id ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-600/10"}`}
                  >
                    <p className="font-black text-sm uppercase italic line-clamp-1 mb-2">
                      "{thread.title}"
                    </p>
                    <div className="flex items-center gap-2 opacity-50 text-[10px] font-bold">
                      <Users size={12} />
                      <span>Cadet {thread.studentName?.split(" ")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`flex-1 rounded-[3.5rem] border flex flex-col overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-2xl"}`}
            >
              {activeThread ? (
                <>
                  <div
                    className={`p-10 border-b ${isDarkMode ? "bg-blue-600/5 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                  >
                    <h3 className="font-black text-3xl italic uppercase text-blue-600 tracking-tighter">
                      {activeThread.title}
                    </h3>
                    <p className="opacity-50 text-sm mt-4 leading-relaxed font-medium">
                      "{activeThread.content}"
                    </p>
                  </div>
                  <div className="flex-1 p-10 overflow-y-auto space-y-6 flex flex-col custom-scrollbar">
                    {replies.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[75%] p-6 rounded-[2rem] shadow-sm ${msg.role === "supervisor" ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                      >
                        <p className="text-[9px] font-black uppercase mb-2 opacity-60 tracking-widest">
                          {msg.sender}
                        </p>
                        <p className="text-sm font-bold italic leading-relaxed">
                          "{msg.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleReply}
                    className="p-8 border-t border-white/5 flex gap-4 bg-slate-900/20"
                  >
                    <input
                      className="flex-1 bg-transparent outline-none font-black text-sm px-4 text-inherit"
                      placeholder="Transmit response to thread..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="p-5 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-8">
                  <MessageSquare size={80} />
                  <p className="font-black uppercase text-xs mt-6 tracking-widest">
                    Select an active thread to monitor communications
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "dm" && (
          <div className="flex gap-8 h-[70vh] animate-in zoom-in duration-500">
            <div
              className={`w-1/3 rounded-[3rem] border flex flex-col ${isDarkMode ? "bg-slate-900 border-white/5 shadow-2xl" : "bg-white shadow-2xl"}`}
            >
              <div className="p-8 font-black uppercase text-[10px] opacity-40 border-b border-white/5 tracking-widest">
                Target Cadets
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {students.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentForDM(s)}
                    className={`p-8 border-b border-white/5 cursor-pointer transition-all ${selectedStudentForDM?.id === s.id ? "bg-blue-600 text-white" : "hover:bg-blue-600/5"}`}
                  >
                    <p className="font-black uppercase text-sm tracking-tight">
                      {s.studentName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`flex-1 rounded-[3.5rem] border flex flex-col overflow-hidden ${isDarkMode ? "bg-slate-900 border-white/5 shadow-2xl" : "bg-white shadow-2xl"}`}
            >
              {selectedStudentForDM ? (
                <>
                  <div className="p-8 border-b border-white/5 bg-blue-600/5 flex items-center justify-between">
                    <h3 className="font-black italic uppercase text-blue-600 tracking-tighter text-lg">
                      Secure Protocol: {selectedStudentForDM.studentName}
                    </h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-glow"></div>
                  </div>
                  <div className="flex-1 p-10 overflow-y-auto flex flex-col space-y-6 custom-scrollbar">
                    {privateMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[70%] p-6 rounded-[2rem] font-bold text-sm shadow-sm ${m.senderRole === "supervisor" ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-slate-800 text-white self-start rounded-tl-none border border-white/5"}`}
                      >
                        {m.text}
                        <div className="text-[8px] opacity-40 mt-3 uppercase tracking-tighter">
                          {m.sender}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleSendDM}
                    className="p-8 border-t border-white/5 flex gap-4"
                  >
                    <input
                      value={dmText}
                      onChange={(e) => setDmText(e.target.value)}
                      placeholder="Type classified message..."
                      className="flex-1 bg-transparent outline-none font-black text-sm px-4 text-inherit"
                    />
                    <button
                      type="submit"
                      className="p-5 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-8">
                  <Lock size={80} />
                  <p className="font-black uppercase text-xs mt-6 tracking-widest">
                    Select a cadet to establish encrypted link
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div
            className={`rounded-[3rem] border overflow-hidden animate-in fade-in duration-700 ${isDarkMode ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-2xl"}`}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest border-b border-white/5 bg-blue-600/5 text-slate-500">
                  <th className="p-10">Cadet Identity</th>
                  <th className="p-10">Specialization Assignment</th>
                  <th className="p-10 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std) => (
                  <tr
                    key={std.id}
                    className="border-b border-white/5 hover:bg-blue-600/5 transition-all group"
                  >
                    <td className="p-10 flex items-center gap-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:rotate-6 transition-all">
                        {std.studentName?.charAt(0)}
                      </div>
                      <p className="font-black text-base uppercase tracking-tighter">
                        {std.studentName}
                      </p>
                    </td>
                    <td className="p-10 text-xs font-black text-blue-500 italic tracking-widest">
                      {std.selectedCourseId?.replace(/_/g, " ").toUpperCase()}
                    </td>
                    <td className="p-10 text-center">
                      <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded-full border border-emerald-500/20">
                        Active Node
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
            className={`rounded-[3rem] border overflow-hidden animate-in slide-in-from-bottom-10 duration-500 ${isDarkMode ? "bg-slate-900 border-white/5 shadow-2xl" : "bg-white shadow-2xl"}`}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5 bg-blue-600/5">
                  <th className="p-8">Protocol Action</th>
                  <th className="p-8">Operational Details</th>
                  <th className="p-8 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/5 transition-all hover:bg-white/5"
                  >
                    <td className="p-8 text-blue-600 font-black uppercase text-[10px] tracking-widest">
                      {log.action}
                    </td>
                    <td className="p-8 font-bold text-xs uppercase opacity-80">
                      {log.details}
                    </td>
                    <td className="p-8 text-[10px] font-black opacity-30 text-right uppercase">
                      {log.timestamp?.toDate().toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "library" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in zoom-in duration-500">
            {libraryLinks.map((lib, i) => (
              <a
                key={i}
                href={lib.url}
                target="_blank"
                rel="noreferrer"
                className={`group p-10 rounded-[3rem] border transition-all hover:-translate-y-3 ${isDarkMode ? "bg-slate-900 border-white/5 hover:border-blue-600 shadow-2xl" : "bg-white border-slate-200 shadow-xl hover:border-blue-600"}`}
              >
                <div className="text-[10px] font-black text-blue-600 uppercase mb-4 bg-blue-600/10 px-3 py-1 rounded-lg inline-block tracking-widest">
                  {lib.cat}
                </div>
                <h3 className="font-black text-2xl mb-6 uppercase italic tracking-tighter leading-tight group-hover:text-blue-600 transition-all">
                  {lib.name}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Access Node{" "}
                  <ExternalLink
                    size={14}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .t-nav { width: 100%; display: flex; align-items: center; gap: 15px; padding: 20px 25px; border-radius: 25px; font-weight: 900; font-size: 11px; text-transform: uppercase; color: #64748b; transition: 0.4s; border:none; background:none; cursor:pointer; tracking: 0.1em; }
        .t-active { background: #2563eb !important; color: white !important; box-shadow: 0 15px 30px -10px rgba(37, 99, 235, 0.6); transform: translateX(10px); }
        .s-input { width: 100%; padding: 1.5rem; background: ${isDarkMode ? "#0f172a" : "#f8fafc"}; border: 2px solid transparent; border-radius: 2rem; font-weight: 800; font-size: 0.85rem; outline: none; transition: 0.4s; color: inherit; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; }
        .s-input:focus { border-color: #2563eb; background: ${isDarkMode ? "#020617" : "white"}; box-shadow: 0 0 0 10px rgba(37,99,235,0.05); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 20px; }
        .shadow-glow { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
      `}</style>
    </div>
  );
};

export default SupervisorDashboard;
