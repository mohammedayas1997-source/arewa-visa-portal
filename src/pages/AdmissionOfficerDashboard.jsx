import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; 
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  limit,
  orderBy,
  writeBatch,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  LayoutDashboard, Users, Search, X, Loader2, GraduationCap,
  BookOpen, Eye, UserCheck, CheckSquare, Square, Trash2,
  Settings, LogOut, Phone, MapPin, Calendar, Mail, FileText,
  School, ShieldAlert, Globe, UserCircle2, ClipboardCheck,
  Printer, CheckCircle, Clock, RotateCcw, AlertTriangle,
  Briefcase, Award, CreditCard, Fingerprint,
} from "lucide-react";

const AdmissionOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [candidates, setCandidates] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [portalSettings, setPortalSettings] = useState({ isOpen: true });

  const courses = [
    "Cleaning Course", "Housekeeping Course", "Laundry Service Course",
    "Visa Processing Course", "Ticketing & Reservation", "Agency Management",
    "Customer Service Course", "Aircraft Cleaner Course", "Security Training",
    "Caregiver - Nanny Course", "Cargo & Logistics Course", "Travels and Tourism",
  ];

  useEffect(() => {
    const qAdmission = collection(db, "applications");
    const unsubAdmission = onSnapshot(qAdmission, (snapshot) => {
      const allData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCandidates(allData);
    });

    const qStaff = query(
      collection(db, "users"),
      where("role", "in", ["instructor", "supervisor"]),
    );
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubPortal = onSnapshot(
      doc(db, "settings", "coursePortalStatus"),
      (docSnap) => {
        if (docSnap.exists()) {
          setPortalSettings({ isOpen: docSnap.data().value });
        } else {
          setDoc(doc(db, "settings", "coursePortalStatus"), { value: true });
        }
      },
    );

    return () => {
      unsubAdmission();
      unsubStaff();
      unsubPortal();
    };
  }, []);

  const togglePortal = async () => {
    setLoadingId("portal");
    try {
      await setDoc(doc(db, "settings", "coursePortalStatus"), {
        value: !portalSettings.isOpen,
        lastUpdated: serverTimestamp(),
        updatedBy: auth.currentUser?.email || "Officer",
      });
    } catch (e) {
      alert("Error updating AVA Portal: " + e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await auth.signOut();
      navigate("/admin-login");
    }
  };

  const deleteRejected = async (id) => {
    if (window.confirm("Permanent Action: Delete candidate?")) {
      setLoadingId(id);
      try {
        await deleteDoc(doc(db, "applications", id));
      } catch (e) { alert(e.message); } finally { setLoadingId(null); }
    }
  };

  const handleSelectAll = () => {
    const pendingIds = candidates
      .filter((c) => c.status === "Paid" || c.status === "Verified" || c.paymentStatus === "Completed" || c.paymentStatus === "Paid")
      .map((c) => c.id);
    if (selectedItems.length === pendingIds.length) setSelectedItems([]);
    else setSelectedItems(pendingIds);
  };

  const sendBulkToRector = async () => {
    if (selectedItems.length === 0) return;
    setLoadingId("bulk");
    const batch = writeBatch(db);
    selectedItems.forEach((id) => {
      batch.update(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        sentToRectorAt: serverTimestamp(),
        vettedBy: auth.currentUser?.displayName || "Admission Officer",
      });
    });
    try {
      await batch.commit();
      setSelectedItems([]);
      alert("SUCCESS: Forwarded to Rector!");
    } catch (e) { alert(e.message); } finally { setLoadingId(null); }
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) return alert("Choose Course and Mentor!");
    setLoadingId(candidate.id);
    const idNumber = `AVA/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        studentId: idNumber,
        admissionDate: serverTimestamp(),
        finalizedBy: auth.currentUser?.displayName || "Admission Officer",
      });
      alert(`ADMISSION SUCCESSFUL! ID: ${idNumber}`);
      setSelectedCourse(""); setSelectedStaff("");
    } catch (e) { alert(e.message); } finally { setLoadingId(null); }
  };

  const filtered = candidates.filter((c) => {
    const nameToFilter = (c.fullName || c.name || "").toLowerCase();
    const matchesSearch = nameToFilter.includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "All" || c.selectedCourseTitle === filterCourse || c.selectedCourse === filterCourse || c.course === filterCourse;
    if (activeTab === "History") return matchesSearch && matchesCourse && c.status === "Approved";
    if (activeTab === "Vetting") return matchesSearch && matchesCourse && c.status === "Awaiting Rector Approval";
    return matchesSearch && matchesCourse && c.status !== "Approved";
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen print:hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <School size={24} />
          </div>
          <h2 className="font-black uppercase tracking-tighter text-2xl italic">Arewa Visa</h2>
        </div>
        <nav className="p-6 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={18} />} label="Officer Terminal" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<Clock size={18} />} label="Registry History" active={activeTab === "History"} onClick={() => setActiveTab("History")} />
          <NavItem icon={<ClipboardCheck size={18} />} label="Vetting Vault" active={activeTab === "Vetting"} onClick={() => setActiveTab("Vetting")} />
          <NavItem icon={<Users size={18} />} label="Mentor Directory" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
          <NavItem icon={<Settings size={18} />} label="Portal Control" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
        </nav>
        <div className="p-6 border-t border-white/5 bg-[#00101f]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase border border-red-500/10">
            <LogOut size={18} /> End Office Session
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12 print:p-0">
        {/* TOP STATUS BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 print:hidden">
          <div className="lg:col-span-2 bg-white p-7 rounded-[35px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${portalSettings.isOpen ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                <ShieldAlert size={30} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-sm italic">AVA Application Gateway</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Status: <span className={portalSettings.isOpen ? "text-emerald-500" : "text-red-500"}>{portalSettings.isOpen ? "AVA_GATEWAY_OPEN" : "GATEWAY_RESTRICTED"}</span></p>
              </div>
            </div>
            <button onClick={togglePortal} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl active:scale-95 ${portalSettings.isOpen ? "bg-red-600 text-white hover:bg-red-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
              {loadingId === "portal" ? <Loader2 className="animate-spin" size={16} /> : portalSettings.isOpen ? "Disable Entry" : "Enable Entry"}
            </button>
          </div>
          <div className="bg-blue-600 p-7 rounded-[35px] text-white flex flex-col justify-center shadow-2xl relative overflow-hidden group">
            <GraduationCap size={120} className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">AVA Registry Census</p>
            <h4 className="text-5xl font-black tabular-nums">{candidates.length}</h4>
          </div>
        </div>

        {/* SEARCH & GLOBAL FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 print:hidden">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input type="text" placeholder="Search candidate..." className="w-full pl-16 pr-6 py-5 rounded-[25px] shadow-sm font-bold text-sm bg-white outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="bg-white px-8 py-5 rounded-[25px] font-black text-[10px] uppercase shadow-sm outline-none" onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="All">All Academy Depts</option>
            {courses.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* BATCH ACTION CONTROLLER */}
        {selectedItems.length > 0 && activeTab === "Dashboard" && (
          <div className="mb-6 bg-[#001529] p-6 rounded-[30px] flex items-center justify-between shadow-2xl border-l-8 border-blue-600">
            <p className="text-white font-black text-[11px] uppercase ml-4">{selectedItems.length} Candidates Marked For Vetting</p>
            <button onClick={sendBulkToRector} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3">
              {loadingId === "bulk" ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />} Forward to Rectorate
            </button>
          </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden print:hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="font-black text-[11px] uppercase text-slate-500 tracking-[0.3em]">{activeTab} Interface</h3>
            {activeTab === "Dashboard" && (
              <button onClick={handleSelectAll} className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600">
                {selectedItems.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />} Mark Pending Pipeline
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <div key={c.id} className="p-7 flex flex-col lg:flex-row items-center gap-8 hover:bg-blue-50/20 group transition-all text-start">
                {activeTab === "Dashboard" && (c.status === "Paid" || c.paymentStatus === "Completed" || c.paymentStatus === "Paid" || c.status === "Pending Payment") && (
                  <input type="checkbox" checked={selectedItems.includes(c.id)} onChange={() => setSelectedItems(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" />
                )}
                <img src={c.photoUrl || c.passportUrl || "https://via.placeholder.com/150"} className="w-20 h-20 rounded-[30px] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-all" />
                <div className="flex-grow text-start">
                  <div className="flex gap-3 mb-2 justify-start">
                    <StatusTag status={c.status} />
                    <span className="text-[9px] font-black text-slate-500 uppercase bg-slate-100 px-4 py-1.5 rounded-full">{c.selectedCourseTitle || c.selectedCourse || c.course}</span>
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-xl italic text-start">{c.fullName || c.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setViewingStudent(c)} className="p-4 bg-slate-100 rounded-[22px] text-slate-500 hover:bg-blue-600 hover:text-white transition-all"><Eye size={20} /></button>
                  {c.status === "Rector Approved" && (
                    <div className="flex gap-3 bg-emerald-50/30 p-2 rounded-[30px] border border-emerald-100">
                      <select onChange={(e) => setSelectedCourse(e.target.value)} className="bg-white text-[10px] font-black uppercase p-3 rounded-2xl border-none outline-none shadow-sm cursor-pointer">
                        <option value="">Confirm Dept</option>
                        {courses.map(course => <option key={course} value={course}>{course}</option>)}
                      </select>
                      <select onChange={(e) => setSelectedStaff(e.target.value)} className="bg-white text-[10px] font-black uppercase p-3 rounded-2xl border-none outline-none shadow-sm cursor-pointer">
                        <option value="">Assign Mentor</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                      </select>
                      <button onClick={() => finalizeAdmission(c)} className="bg-emerald-600 text-white p-4 rounded-2xl">{loadingId === c.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}</button>
                    </div>
                  )}
                  {c.status === "Rejected by Rector" && <button onClick={() => deleteRejected(c.id)} className="p-4 bg-red-50 text-red-500 rounded-[22px]"><Trash2 size={20} /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- THE STUDENT DOSSIER (FULLY UPDATED TO MATCH FORM) --- */}
        {viewingStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001529]/95 backdrop-blur-xl p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-[60px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in">
              <button onClick={() => setViewingStudent(null)} className="absolute top-10 right-10 p-5 bg-red-50 text-red-500 rounded-full z-10 hover:bg-red-500 hover:text-white transition-all shadow-2xl print:hidden"><X size={28} /></button>

              <div className="md:w-1/3 bg-slate-50/80 p-12 border-r border-slate-100 flex flex-col justify-center text-center">
                <img src={viewingStudent.photoUrl || viewingStudent.passportUrl || "https://via.placeholder.com/150"} className="w-60 h-60 rounded-[60px] object-cover border-[12px] border-white shadow-2xl mx-auto mb-10" />
                <h3 className="font-black text-3xl text-slate-800 uppercase mb-4 italic">{viewingStudent.fullName || viewingStudent.name}</h3>
                <div className="flex justify-center mb-10"><StatusTag status={viewingStudent.status} /></div>
                
                {/* CORE BIOMETRICS - FULLY SYNCED WITH APPLICATION DATA */}
                <div className="space-y-6 text-left max-w-xs mx-auto">
                  <Detail icon={<Mail size={16} />} label="Email Address" value={viewingStudent.email} />
                  <Detail icon={<Phone size={16} />} label="WhatsApp Number" value={viewingStudent.whatsapp} />
                  <Detail icon={<Fingerprint size={16} />} label="NIN (National ID)" value={viewingStudent.nin} />
                  <Detail icon={<Calendar size={16} />} label="Age / Gender" value={`${viewingStudent.age} Years / ${viewingStudent.gender}`} />
                  <Detail icon={<MapPin size={16} />} label="State / LGA Origin" value={`${viewingStudent.stateOrigin || viewingStudent.state} / ${viewingStudent.lgaOrigin || viewingStudent.lga}`} />
                  <Detail icon={<Globe size={16} />} label="Residence" value={`${viewingStudent.stateResidence || "N/A"} (${viewingStudent.lgaResidence || "N/A"})`} />
                </div>
              </div>

              <div className="md:w-2/3 p-12 lg:p-20 overflow-y-auto custom-scrollbar text-start">
                <header className="flex justify-between items-end mb-12 border-b border-slate-100 pb-10 text-start">
                  <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-4 italic text-start"><ClipboardCheck className="text-blue-600" size={40} /> Admission Intelligence</h2>
                  <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-[10px] uppercase print:hidden hover:bg-blue-600 transition-all"><Printer size={18} /> Print Record</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-start">
                  <section className="space-y-8 text-start">
                    <h4 className="font-black uppercase text-blue-600 text-xs tracking-widest text-start">Education & Career</h4>
                    <Detail icon={<GraduationCap size={16} />} label="Program Selection" value={viewingStudent.selectedCourseTitle || viewingStudent.selectedCourse} />
                    <Detail icon={<Briefcase size={16} />} label="Occupation" value={viewingStudent.job} />
                    <Detail icon={<Globe size={16} />} label="Job Country" value={viewingStudent.jobCountry} />
                    <Detail icon={<MapPin size={16} />} label="Permanent Address" value={viewingStudent.address} />

                    {/* NEW SECTION: ACADEMIC QUALIFICATIONS */}
                    {viewingStudent.qualifications && viewingStudent.qualifications.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                         <h4 className="font-black uppercase text-blue-600 text-[10px] tracking-widest mb-4">Qualifications History</h4>
                         {viewingStudent.qualifications.map((q, idx) => (
                           <div key={idx} className="mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="font-black text-[11px] uppercase text-slate-700">{q.type} - {q.institution}</p>
                              <p className="text-[10px] font-bold text-slate-400">Class of {q.year}</p>
                           </div>
                         ))}
                      </div>
                    )}
                  </section>

                  <section className="space-y-8 text-start">
                    <h4 className="font-black uppercase text-emerald-600 text-xs tracking-widest text-start">Verification Details</h4>
                    <Detail icon={<Award size={16} />} label="Admission Status" value={viewingStudent.status} />
                    <Detail icon={<CreditCard size={16} />} label="Payment Ref" value={viewingStudent.paymentRef || "N/A"} />
                    <Detail icon={<FileText size={16} />} label="Official Student ID" value={viewingStudent.studentId || "PENDING_FINAL_APPROVAL"} />
                    
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl">
                      <h5 className="text-[9px] font-black uppercase text-blue-400 mb-6 flex items-center gap-2 tracking-[0.2em]"><Lock size={12}/> Document Repository</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {viewingStudent.photoUrl && <a href={viewingStudent.photoUrl} target="_blank" className="text-[10px] font-black uppercase p-4 border border-white/10 rounded-2xl text-center hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2"><UserCircle2 size={14}/> View Passport</a>}
                        {viewingStudent.resumeUrl && <a href={viewingStudent.resumeUrl} target="_blank" className="text-[10px] font-black uppercase p-4 border border-white/10 rounded-2xl text-center hover:bg-emerald-600 hover:border-emerald-600 transition-all flex items-center justify-center gap-2"><FileUp size={14}/> View Credentials</a>}
                        {viewingStudent.intlPassportNo && (
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Passport Number</p>
                            <p className="font-black text-sm uppercase">{viewingStudent.intlPassportNo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @media print {
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all mb-1 ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
    <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusTag = ({ status }) => {
  const styles = {
    Paid: "bg-blue-50 text-blue-600 border-blue-100",
    Verified: "bg-blue-50 text-blue-600 border-blue-100",
    "Pending Payment": "bg-slate-100 text-slate-500 border-slate-200",
    "Awaiting Rector Approval": "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    "Rector Approved": "bg-purple-50 text-purple-600 border-purple-100 shadow-sm",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm",
    "Rejected by Rector": "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-5 py-2.5 rounded-[15px] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${styles[status] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === "Approved" ? "bg-emerald-500" : "bg-current opacity-60"}`}></div>
      {status || "PENDING"}
    </span>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 text-start">
    {icon && <span className="text-blue-500 mt-1 bg-blue-50 p-2 rounded-xl border border-blue-100">{icon}</span>}
    <div className="text-start">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-start">{label}</p>
      <p className="font-black text-slate-800 text-[13px] uppercase italic leading-tight text-start">{value || "---"}</p>
    </div>
  </div>
);

export default AdmissionOfficerDashboard;