import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, rtdb, storage } from "../firebase"; // An gyara daga ../../firebase zuwa ../firebase
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import {
  LayoutDashboard,
  Users,
  Search,
  X,
  Loader2,
  GraduationCap,
  BookOpen,
  Eye,
  UserCheck,
  LogOut,
  Phone,
  MapPin,
  Calendar,
  Mail,
  FileText,
  School,
  ShieldAlert,
  ClipboardCheck,
  Printer,
  CheckCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  Briefcase,
  Award,
  MessageSquare,
  Moon,
  Sun,
  Menu,
  Layout,
  PieChart,
  Send,
  Megaphone,
  Fingerprint,
  Activity,
  CheckCircle2,
} from "lucide-react";

const RectorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [supervisorChats, setSupervisorChats] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin-login");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- DATA FETCHING (REAL-TIME AVA PIPELINE) ---
  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Staff Tracking
    const unsubStaff = onSnapshot(
      query(
        collection(db, "users"),
        where("role", "in", ["admin", "instructor", "supervisor", "authority"]),
      ),
      (snap) => setStaffList(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    // 2. Student Census
    const unsubStudents = onSnapshot(
      query(collection(db, "users"), where("role", "==", "student")),
      (snap) =>
        setStudentList(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    // 3. Admission Vetting (Awaiting Rector)
    const unsubAdmission = onSnapshot(
      query(
        collection(db, "applications"),
        where("status", "==", "Awaiting Rector Approval"),
      ),
      (snap) =>
        setPendingAdmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    // 4. Financial Audit & History
    const unsubHistory = onSnapshot(
      query(
        collection(db, "paymentRequests"),
        where("status", "in", ["approved", "rejected"]),
      ),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setApprovalHistory(
          data.sort(
            (a, b) =>
              (b.processedAt?.seconds || 0) - (a.processedAt?.seconds || 0),
          ),
        );

        const currentMonth = new Date().getMonth();
        const total = data.reduce((acc, curr) => {
          const reqDate = curr.processedAt?.toDate();
          return curr.status === "approved" &&
            reqDate?.getMonth() === currentMonth
            ? acc + Number(curr.amount || 0)
            : acc;
        }, 0);
        setMonthlyTotal(total);
      },
    );

    return () => {
      unsubStaff();
      unsubStudents();
      unsubAdmission();
      unsubHistory();
    };
  }, []);

  // --- CORE SYSTEM ACTIONS ---
  const sendGlobalBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    setSendingBroadcast(true);
    try {
      await addDoc(collection(db, "system_announcements"), {
        message: broadcastMsg,
        sender: "Rector's Office",
        academy: "Arewa Visa Academy",
        timestamp: serverTimestamp(),
        type: "urgent",
      });
      setBroadcastMsg("");
      alert("EXECUTIVE BROADCAST: Transmitted successfully.");
    } catch (e) {
      alert(e.message);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleBulkAction = async (collectionName, decision) => {
    if (selectedItems.length === 0) return;
    if (
      !window.confirm(
        `PROTOCOL: Execute ${decision} on ${selectedItems.length} nodes?`,
      )
    )
      return;
    setLoadingId("bulk");
    const batch = writeBatch(db);
    selectedItems.forEach((id) => {
      batch.update(doc(db, collectionName, id), {
        status:
          decision === "approve" ? "Rector Approved" : "Rejected by Rector",
        rectorActionDate: serverTimestamp(),
        processedAt: serverTimestamp(),
      });
    });
    try {
      await batch.commit();
      setSelectedItems([]);
      alert("AVA CORE: Bulk operation executed successfully.");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* SIDEBAR */}
      <aside
        className={`transition-all duration-300 border-r ${isSidebarOpen ? "w-80" : "w-24"} ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} p-6 flex flex-col h-screen sticky top-0 z-50 print:hidden`}
      >
        <div className="flex items-center gap-4 mb-10 shrink-0">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <ShieldAlert size={24} className="text-white" />
          </div>
          {isSidebarOpen && (
            <h2 className="font-black text-xl uppercase italic tracking-tighter">
              Arewa Visa
            </h2>
          )}
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          <SidebarLink
            icon={<Layout size={20} />}
            label="Rector's Overview"
            active={activeTab === "Overview"}
            onClick={() => setActiveTab("Overview")}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
          />
          <SidebarLink
            icon={<GraduationCap size={20} />}
            label="Admission Vetting"
            active={activeTab === "Admissions"}
            onClick={() => setActiveTab("Admissions")}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
          />
          <SidebarLink
            icon={<Users size={20} />}
            label="Staff Governance"
            active={activeTab === "Personnel"}
            onClick={() => setActiveTab("Personnel")}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
          />
          <SidebarLink
            icon={<Megaphone size={20} />}
            label="Executive Broadcast"
            active={activeTab === "Broadcast"}
            onClick={() => setActiveTab("Broadcast")}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
          />
          <SidebarLink
            icon={<History size={20} />}
            label="Strategic Audit"
            active={activeTab === "History"}
            onClick={() => setActiveTab("History")}
            isSidebarOpen={isSidebarOpen}
            darkMode={darkMode}
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800 space-y-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full p-4 rounded-2xl flex items-center justify-center gap-3 ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-blue-50 text-blue-600"}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}{" "}
            {isSidebarOpen && "Spectrum Shift"}
          </button>
          <button
            onClick={() => signOut(auth)}
            className="w-full p-4 bg-red-600/10 text-red-500 rounded-2xl font-black text-[10px] uppercase border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={18} /> {isSidebarOpen && "Terminate Session"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header
          className={`p-6 border-b flex items-center justify-between ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} backdrop-blur-md print:hidden`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-700/20 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-black uppercase text-sm opacity-60 tracking-widest">
              AVA Rectorate | {activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black opacity-40 uppercase">
                Monthly Approved Yield
              </p>
              <p className="font-black text-emerald-500">
                ₦{monthlyTotal.toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg">
              R
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {activeTab === "Overview" && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBox
                  icon={<Users className="text-blue-500" />}
                  label="Enrolled Students"
                  value={studentList.length}
                  dark={darkMode}
                />
                <StatBox
                  icon={<UserCheck className="text-emerald-500" />}
                  label="Staff Strength"
                  value={staffList.length}
                  dark={darkMode}
                />
                <StatBox
                  icon={<Clock className="text-amber-500" />}
                  label="Vetting Queue"
                  value={pendingAdmissions.length}
                  dark={darkMode}
                />
                <StatBox
                  icon={<PieChart className="text-purple-500" />}
                  label="Monthly Rev"
                  value={`₦${monthlyTotal.toLocaleString()}`}
                  dark={darkMode}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <Section
                  dark={darkMode}
                  title="Priority Vetting"
                  icon={<ClipboardCheck />}
                >
                  {pendingAdmissions.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      className={`p-5 rounded-3xl border mb-4 flex items-center justify-between ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={s.passportUrl}
                          className="w-12 h-12 rounded-xl object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-xs uppercase">
                            {s.studentName || s.fullName}
                          </p>
                          <p className="text-[10px] opacity-50 uppercase tracking-widest italic">
                            {s.course || s.selectedCourse}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingStudent(s)}
                          className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            updateDoc(doc(db, "applications", s.id), {
                              status: "Rector Approved",
                              rectorActionDate: serverTimestamp(),
                            })
                          }
                          className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition-all"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingAdmissions.length === 0 && (
                    <p className="text-center opacity-30 py-10 uppercase text-xs font-black">
                      All Pipeline Clear
                    </p>
                  )}
                </Section>

                <Section
                  dark={darkMode}
                  title="Strategic Audit"
                  icon={<History />}
                >
                  <div className="space-y-4">
                    {approvalHistory.slice(0, 6).map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-2xl flex items-center justify-between ${darkMode ? "bg-slate-900/50" : "bg-slate-50"}`}
                      >
                        <div>
                          <p className="font-black text-[10px] uppercase">
                            {log.studentName || "Finance Node"}
                          </p>
                          <p
                            className={`text-[9px] font-bold uppercase ${log.status === "approved" ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {log.status}
                          </p>
                        </div>
                        <p className="font-black text-xs text-blue-500">
                          ₦{Number(log.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          )}

          {activeTab === "Admissions" && (
            <div
              className={`p-10 rounded-[50px] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-xl"} animate-in slide-in-from-bottom-10 duration-500`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h3 className="font-black uppercase text-sm tracking-widest flex items-center gap-4 text-blue-600 italic">
                  <ClipboardCheck size={24} /> Rectorate Approval Pool
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setSelectedItems(pendingAdmissions.map((p) => p.id))
                    }
                    className="px-6 py-3 bg-blue-600/10 text-blue-600 rounded-2xl font-black text-[10px] uppercase"
                  >
                    Tag All
                  </button>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() =>
                        handleBulkAction("applications", "approve")
                      }
                      className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-500 transition-all"
                    >
                      Mass Authorize ({selectedItems.length})
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {pendingAdmissions.map((student) => (
                  <div
                    key={student.id}
                    className={`p-8 rounded-[40px] border transition-all relative group ${selectedItems.includes(student.id) ? "bg-blue-600 text-white" : darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(student.id)}
                      onChange={() =>
                        setSelectedItems((prev) =>
                          prev.includes(student.id)
                            ? prev.filter((i) => i !== student.id)
                            : [...prev, student.id],
                        )
                      }
                      className="absolute top-6 right-6 w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={student.passportUrl}
                        className="h-24 w-24 rounded-[35px] object-cover mb-6 shadow-2xl border-4 border-white/20 group-hover:scale-105 transition-transform"
                      />
                      <h4 className="font-black text-lg uppercase mb-2">
                        {student.studentName || student.fullName}
                      </h4>
                      <p
                        className={`text-[9px] font-black uppercase px-4 py-1 rounded-full mb-8 ${selectedItems.includes(student.id) ? "bg-white/20" : "bg-blue-100 text-blue-600"}`}
                      >
                        {student.course || student.selectedCourse}
                      </p>
                      <div className="w-full flex gap-3">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase ${selectedItems.includes(student.id) ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}
                        >
                          Census
                        </button>
                        <button
                          onClick={() =>
                            updateDoc(doc(db, "applications", student.id), {
                              status: "Rector Approved",
                              rectorActionDate: serverTimestamp(),
                            })
                          }
                          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase ${selectedItems.includes(student.id) ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Broadcast" && (
            <div className="max-w-4xl mx-auto animate-in zoom-in duration-500">
              <Section
                dark={darkMode}
                title="Rectorate Megaphone"
                icon={<Megaphone />}
              >
                <div className="space-y-6 text-center">
                  <textarea
                    className={`w-full h-64 p-10 rounded-[50px] border-2 outline-none font-bold text-xl italic ${darkMode ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-700" : "bg-slate-50 border-slate-100 text-slate-900"}`}
                    placeholder="Rubuta sakon Rector a nan..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                  />
                  <button
                    onClick={sendGlobalBroadcast}
                    disabled={sendingBroadcast || !broadcastMsg.trim()}
                    className="px-12 py-6 bg-blue-600 text-white rounded-full font-black uppercase text-xs flex items-center justify-center gap-4 shadow-2xl hover:scale-105 active:scale-95 transition-all mx-auto"
                  >
                    {sendingBroadcast ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    Deploy Strategic Broadcast
                  </button>
                </div>
              </Section>
            </div>
          )}
        </main>
      </div>

      {/* STUDENT CENSUS MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div
            className={`w-full max-w-6xl rounded-[60px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500 ${darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute top-10 right-10 p-5 bg-red-600 text-white rounded-full hover:rotate-90 transition-all shadow-xl"
            >
              <X size={24} />
            </button>
            <div
              className={`md:w-1/3 p-12 text-center border-r ${darkMode ? "border-slate-800" : "border-slate-100"}`}
            >
              <img
                src={viewingStudent.passportUrl}
                className="w-60 h-60 rounded-[60px] object-cover border-[12px] border-white shadow-2xl mx-auto mb-8"
                alt=""
              />
              <h3 className="font-black text-3xl uppercase italic tracking-tighter mb-6">
                {viewingStudent.studentName || viewingStudent.fullName}
              </h3>
              <div className="space-y-8 text-left max-w-xs mx-auto">
                <Detail
                  label="Registry ID"
                  value={viewingStudent.id}
                  dark={darkMode}
                />
                <Detail
                  label="Mobile Node"
                  value={viewingStudent.studentPhone || viewingStudent.phone}
                  dark={darkMode}
                />
                <Detail
                  label="Academic Track"
                  value={viewingStudent.course || viewingStudent.selectedCourse}
                  dark={darkMode}
                />
              </div>
            </div>
            <div className="md:w-2/3 p-12 lg:p-24 overflow-y-auto max-h-[90vh]">
              <header className="flex justify-between items-end border-b pb-12 mb-16">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-5 italic">
                    <Fingerprint className="text-blue-500" size={50} />{" "}
                    Strategic Census
                  </h2>
                  <p className="text-[12px] font-black opacity-40 uppercase tracking-[0.6em] mt-4">
                    Arewa Visa Academy Rectorate
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="p-5 bg-slate-800 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
                >
                  <Printer size={24} />
                </button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <section className="space-y-10">
                  <h4 className="text-sm font-black uppercase text-blue-500 border-l-4 border-blue-500 pl-4 tracking-widest italic">
                    Core Credentials
                  </h4>
                  <Detail
                    label="Institution"
                    value={viewingStudent.institutionName}
                    dark={darkMode}
                  />
                  <Detail
                    label="Qualification"
                    value={viewingStudent.highestQualification}
                    dark={darkMode}
                  />
                  <Detail
                    label="Origin"
                    value={viewingStudent.stateOrigin}
                    dark={darkMode}
                  />
                </section>
                <section className="space-y-10">
                  <h4 className="text-sm font-black uppercase text-blue-500 border-l-4 border-blue-500 pl-4 tracking-widest italic">
                    O-Level Registry
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingStudent.oLevelResults?.map((res, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                      >
                        <p className="text-[10px] font-black opacity-40 uppercase mb-1">
                          {res.subject}
                        </p>
                        <p className="font-black text-blue-500 text-lg">
                          {res.grade}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <button
                onClick={() => {
                  updateDoc(doc(db, "applications", viewingStudent.id), {
                    status: "Rector Approved",
                  });
                  setViewingStudent(null);
                }}
                className="w-full mt-20 py-8 bg-emerald-600 text-white rounded-[40px] font-black uppercase text-lg shadow-2xl hover:bg-emerald-500 transition-all"
              >
                Authorize Final Admission
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const SidebarLink = ({
  icon,
  label,
  active,
  onClick,
  isSidebarOpen,
  darkMode,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-5 p-5 rounded-[25px] transition-all duration-300 group ${active ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-105" : darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
  >
    <span
      className={`${active ? "text-white" : "group-hover:text-blue-500"} transition-colors`}
    >
      {icon}
    </span>
    {isSidebarOpen && (
      <span className="text-[11px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
    )}
  </button>
);

const StatBox = ({ icon, label, value, dark }) => (
  <div
    className={`p-10 rounded-[50px] border flex flex-col items-center text-center transition-all hover:scale-105 ${dark ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/50" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"}`}
  >
    <div className="h-16 w-16 rounded-[25px] bg-blue-600/10 flex items-center justify-center mb-6 shadow-inner">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase opacity-40 mb-2 tracking-[0.3em]">
      {label}
    </p>
    <p className="text-3xl font-black italic">{value}</p>
  </div>
);

const Section = ({ title, icon, children, dark }) => (
  <div
    className={`p-12 rounded-[60px] border h-full transition-all ${dark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-xl"}`}
  >
    <div className="flex items-center gap-5 mb-12">
      <div className="p-4 bg-blue-600 text-white rounded-[20px] shadow-xl shadow-blue-500/30">
        {icon}
      </div>
      <h3 className="font-black uppercase text-sm tracking-[0.3em] italic">
        {title} Analysis
      </h3>
    </div>
    {children}
  </div>
);

const Detail = ({ label, value, dark }) => (
  <div className="group">
    <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] mb-2 group-hover:text-blue-500 transition-colors">
      {label}
    </p>
    <p
      className={`text-sm font-black uppercase italic ${dark ? "text-white" : "text-slate-800"}`}
    >
      {value || "No Registry Node"}
    </p>
  </div>
);

export default RectorDashboard;
