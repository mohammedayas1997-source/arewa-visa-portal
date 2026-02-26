import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase"; // Adjusted to standard firebase path
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
  CheckSquare,
  Square,
  Trash2,
  Settings,
  LogOut,
  Phone,
  MapPin,
  Calendar,
  Mail,
  FileText,
  School,
  ShieldAlert,
  Globe,
  UserCircle2,
  ClipboardCheck,
  Printer,
  CheckCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  Briefcase,
  Award,
} from "lucide-react";

const AdmissionOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  // --- STATES ---
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

  // AREWA VISA ACADEMY OFFICIAL PROGRAMS
  const courses = [
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

  // --- DATA FETCHING (REAL-TIME AREWA PIPELINE) ---
  useEffect(() => {
    // 1. Fetch Candidates (AVA Applications)
    const qAdmission = collection(db, "applications");
    const unsubAdmission = onSnapshot(qAdmission, (snapshot) => {
      const allData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCandidates(allData);
    });

    // 2. Fetch Staff (Supervisors/Instructors for assignment)
    const qStaff = query(
      collection(db, "users"),
      where("role", "in", ["instructor", "supervisor"]),
    );
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // 3. Fetch Portal Settings
    const unsubPortal = onSnapshot(
      doc(db, "systemSettings", "admissionControl"),
      (docSnap) => {
        if (docSnap.exists()) setPortalSettings(docSnap.data());
      },
    );

    return () => {
      unsubAdmission();
      unsubStaff();
      unsubPortal();
    };
  }, []);

  // --- CORE SYSTEM ACTIONS (AVA PROTOCOLS) ---

  const togglePortal = async () => {
    setLoadingId("portal");
    try {
      await updateDoc(doc(db, "systemSettings", "admissionControl"), {
        isOpen: !portalSettings.isOpen,
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
    if (
      window.confirm(
        "Are you sure you want to log out from the AVA administrative panel?",
      )
    ) {
      await auth.signOut();
      navigate("/admin-login");
    }
  };

  const deleteRejected = async (id) => {
    if (
      window.confirm(
        "Permanent Action: Are you sure you want to delete this candidate from AVA Records?",
      )
    ) {
      setLoadingId(id);
      try {
        await deleteDoc(doc(db, "applications", id));
      } catch (e) {
        alert(e.message);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleSelectAll = () => {
    const pendingIds = candidates
      .filter((c) => c.status === "Paid" || c.status === "Verified")
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
      alert(
        "SUCCESS: Vetted candidates forwarded to Rector for AVA final review!",
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff)
      return alert("Validation Error: Choose Course and Mentor!");
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
      alert(`ADMISSION SUCCESSFUL! AVA Student ID: ${idNumber}`);
      setSelectedCourse("");
      setSelectedStaff("");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handlePrint = () => window.print();

  // --- FILTERING LOGIC ---
  const filtered = candidates.filter((c) => {
    const nameToFilter = (c.fullName || c.name || "").toLowerCase();
    const matchesSearch = nameToFilter.includes(searchTerm.toLowerCase());
    const matchesCourse =
      filterCourse === "All" ||
      c.selectedCourse === filterCourse ||
      c.course === filterCourse;

    if (activeTab === "History")
      return matchesSearch && matchesCourse && c.status === "Approved";
    if (activeTab === "Vetting")
      return (
        matchesSearch &&
        matchesCourse &&
        c.status === "Awaiting Rector Approval"
      );
    return matchesSearch && matchesCourse && c.status !== "Approved";
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans">
      {/* SIDEBAR - AREWA VISA ACADEMY CORE */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen print:hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <School size={24} />
          </div>
          <h2 className="font-black uppercase tracking-tighter text-2xl italic">
            Arewa Visa
          </h2>
        </div>

        <nav className="p-6 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Officer Terminal"
            active={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
          />
          <NavItem
            icon={<Clock size={18} />}
            label="Registry History"
            active={activeTab === "History"}
            onClick={() => setActiveTab("History")}
          />
          <NavItem
            icon={<ClipboardCheck size={18} />}
            label="Vetting Vault"
            active={activeTab === "Vetting"}
            onClick={() => setActiveTab("Vetting")}
          />
          <NavItem
            icon={<Users size={18} />}
            label="Mentor Directory"
            active={activeTab === "Staff"}
            onClick={() => setActiveTab("Staff")}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="Portal Control"
            active={activeTab === "Settings"}
            onClick={() => setActiveTab("Settings")}
          />
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#00101f]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase border border-red-500/10"
          >
            <LogOut size={18} /> End Office Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-6 lg:p-12 print:p-0">
        {/* TOP STATUS BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 print:hidden">
          <div className="lg:col-span-2 bg-white p-7 rounded-[35px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className={`p-4 rounded-2xl ${portalSettings.isOpen ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"} transition-colors`}
              >
                <ShieldAlert size={30} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-sm italic">
                  AVA Application Gateway
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Status:{" "}
                  <span
                    className={
                      portalSettings.isOpen
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {portalSettings.isOpen
                      ? "AVA_GATEWAY_OPEN"
                      : "GATEWAY_RESTRICTED"}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={togglePortal}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl active:scale-95 ${portalSettings.isOpen ? "bg-red-600 text-white hover:bg-red-700 shadow-red-200" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"}`}
            >
              {loadingId === "portal" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : portalSettings.isOpen ? (
                "Disable Entry"
              ) : (
                "Enable Entry"
              )}
            </button>
          </div>

          <div className="bg-blue-600 p-7 rounded-[35px] text-white flex flex-col justify-center shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <GraduationCap size={120} />
            </div>
            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">
              AVA Registry Census
            </p>
            <h4 className="text-5xl font-black tabular-nums">
              {candidates.length}
            </h4>
          </div>
        </div>

        {/* SEARCH & GLOBAL FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 print:hidden">
          <div className="relative flex-grow">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search candidate node by name, ID or credentials..."
              className="w-full pl-16 pr-6 py-5 rounded-[25px] border-none shadow-sm focus:ring-4 ring-blue-500/10 font-bold text-sm bg-white outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-white px-8 py-5 rounded-[25px] font-black text-[10px] uppercase shadow-sm outline-none border-none cursor-pointer hover:bg-slate-50 transition-colors"
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="All">All Academy Depts</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* BATCH ACTION CONTROLLER */}
        {selectedItems.length > 0 && activeTab === "Dashboard" && (
          <div className="mb-6 bg-[#001529] p-6 rounded-[30px] flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-500 border-l-8 border-blue-600">
            <div className="flex items-center gap-4 ml-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <UserCheck className="text-blue-400" size={20} />
              </div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest italic">
                {selectedItems.length} Candidates Marked For Strategic Vetting
              </p>
            </div>
            <button
              onClick={sendBulkToRector}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl flex items-center gap-3"
            >
              {loadingId === "bulk" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <RotateCcw size={16} />
              )}{" "}
              Forward to Rectorate
            </button>
          </div>
        )}

        {/* DYNAMIC DATA TABLE */}
        <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden print:hidden transition-all duration-500">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></div>
              <h3 className="font-black text-[11px] uppercase text-slate-500 tracking-[0.3em]">
                {activeTab} Interface
              </h3>
            </div>
            {activeTab === "Dashboard" && (
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
              >
                {selectedItems.length > 0 ? (
                  <CheckSquare size={20} className="text-blue-600" />
                ) : (
                  <Square size={20} className="text-slate-300" />
                )}{" "}
                Mark Pending Pipeline
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className="p-7 flex flex-col lg:flex-row items-center gap-8 hover:bg-blue-50/20 transition-all group"
                >
                  {(c.status === "Paid" || c.status === "Verified") &&
                    activeTab === "Dashboard" && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(c.id)}
                        onChange={() =>
                          setSelectedItems((prev) =>
                            prev.includes(c.id)
                              ? prev.filter((i) => i !== c.id)
                              : [...prev, c.id],
                          )
                        }
                        className="w-6 h-6 accent-blue-600 cursor-pointer rounded-lg"
                      />
                    )}

                  <div className="relative shrink-0">
                    <img
                      src={
                        c.passport ||
                        c.passportUrl ||
                        "https://via.placeholder.com/150"
                      }
                      className="w-20 h-20 rounded-[30px] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500"
                      alt="Candidate"
                    />
                    {c.status === "Approved" && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <StatusTag status={c.status} />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                        {c.selectedCourse || c.course}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-800 uppercase text-xl leading-tight italic">
                      {c.fullName || c.name}
                    </h3>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                        <Mail size={12} className="text-blue-500" /> {c.email}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                        <Phone size={12} className="text-blue-500" /> {c.phone}
                      </p>
                    </div>
                  </div>

                  {/* CONTEXTUAL ACTIONS */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setViewingStudent(c)}
                      className="p-4 bg-slate-100 rounded-[22px] text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90 border border-slate-200"
                      title="Open Strategic Dossier"
                    >
                      <Eye size={20} />
                    </button>

                    {/* FINAL ADMISSION FINALIZATION (AVA LOGIC) */}
                    {c.status === "Rector Approved" && (
                      <div className="flex gap-3 items-center bg-emerald-50/30 p-2.5 rounded-[30px] border border-emerald-100 shadow-sm animate-in fade-in zoom-in">
                        <select
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className="bg-white text-[10px] font-black uppercase p-3 rounded-2xl outline-none shadow-sm border border-emerald-100 min-w-[150px] cursor-pointer"
                        >
                          <option value="">Confirm Dept</option>
                          {courses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                        <select
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          className="bg-white text-[10px] font-black uppercase p-3 rounded-2xl outline-none shadow-sm border border-emerald-100 min-w-[150px] cursor-pointer"
                        >
                          <option value="">Assign Mentor</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.fullName}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => finalizeAdmission(c)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                        >
                          {loadingId === c.id ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <CheckCircle size={20} />
                          )}
                        </button>
                      </div>
                    )}

                    {c.status === "Rejected by Rector" && (
                      <button
                        onClick={() => deleteRejected(c.id)}
                        className="p-4 bg-red-50 text-red-500 rounded-[22px] hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                      >
                        {loadingId === c.id ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="text-slate-300" size={36} />
                </div>
                <p className="font-black text-slate-400 uppercase text-xs tracking-[0.4em]">
                  No Strategic Records Located
                </p>
              </div>
            )}
          </div>
        </div>

        {/* THE STUDENT DOSSIER - AREWA VISA ACADEMY CENSUS 100% */}
        {viewingStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001529]/95 backdrop-blur-xl p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-[60px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in duration-500">
              <button
                onClick={() => setViewingStudent(null)}
                className="absolute top-10 right-10 p-5 bg-red-50 text-red-500 rounded-full z-10 hover:bg-red-500 hover:text-white transition-all shadow-2xl print:hidden hover:rotate-90"
              >
                <X size={28} />
              </button>

              {/* SIDE PROFILE / BIOMETRICS */}
              <div className="md:w-1/3 bg-slate-50/80 p-12 border-r border-slate-100 text-center flex flex-col justify-center">
                <div className="relative inline-block mb-10">
                  <img
                    src={viewingStudent.passport || viewingStudent.passportUrl}
                    className="w-60 h-60 rounded-[60px] object-cover border-[12px] border-white shadow-2xl mx-auto ring-1 ring-slate-200"
                    alt="AVA Passport"
                  />
                  <div className="absolute -bottom-4 right-4 bg-blue-600 p-5 rounded-[30px] shadow-2xl border-4 border-white print:hidden">
                    <Award className="text-white" size={32} />
                  </div>
                </div>
                <h3 className="font-black text-3xl text-slate-800 uppercase mb-4 tracking-tighter italic">
                  {viewingStudent.fullName || viewingStudent.name}
                </h3>
                <div className="flex justify-center mb-10">
                  <StatusTag status={viewingStudent.status} />
                </div>

                <div className="space-y-8 text-left max-w-xs mx-auto">
                  <Detail
                    icon={<Mail size={16} />}
                    label="Official Correspondence"
                    value={viewingStudent.email}
                  />
                  <Detail
                    icon={<Phone size={16} />}
                    label="Registry Mobile"
                    value={viewingStudent.phone}
                  />
                  <Detail
                    icon={<MapPin size={16} />}
                    label="Hometown / Origin"
                    value={`${viewingStudent.state || viewingStudent.stateOrigin} / ${viewingStudent.lga || viewingStudent.lgaOrigin || "N/A"}`}
                  />
                  <Detail
                    icon={<Calendar size={16} />}
                    label="Birth Protocol"
                    value={viewingStudent.dob || "N/A"}
                  />
                </div>
              </div>

              {/* MAIN DOSSIER DETAILS - ACADEMIC INTELLIGENCE */}
              <div className="md:w-2/3 p-12 lg:p-24 max-h-[95vh] overflow-y-auto custom-scrollbar">
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-100 pb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-5 italic">
                      <ClipboardCheck className="text-blue-600" size={50} /> AVA
                      Strategic Dossier
                    </h2>
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em] mt-4">
                      Census Index:{" "}
                      {viewingStudent.id?.toUpperCase() || "PENDING"}
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[25px] font-black text-[11px] uppercase hover:bg-blue-600 transition-all shadow-2xl print:hidden shadow-slate-300"
                  >
                    <Printer size={22} /> Print Dossier
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  {/* O-LEVEL SECTION */}
                  <section className="space-y-10">
                    <div className="flex items-center gap-4 border-l-8 border-blue-600 pl-6">
                      <h4 className="text-[15px] font-black uppercase text-slate-800 tracking-wider">
                        O-Level Vetting Node
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <Detail
                        label="Examination ID"
                        value={viewingStudent.examNumber}
                      />
                      <Detail
                        label="Center Protocol"
                        value={viewingStudent.centerNumber}
                      />
                      <div className="p-10 bg-blue-50/50 rounded-[45px] border-4 border-dashed border-blue-100 relative group shadow-inner">
                        <div className="absolute -top-4 left-8 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                          SSCE TRANSCRIPT
                        </div>
                        <div className="grid grid-cols-1 gap-3 mt-4">
                          {viewingStudent.oLevelResults ? (
                            viewingStudent.oLevelResults.map((res, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center border-b border-blue-100 pb-2"
                              >
                                <span className="text-sm font-black text-slate-600 uppercase italic">
                                  {res.subject}
                                </span>
                                <span className="text-lg font-black text-blue-600">
                                  {res.grade}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-400 text-center">
                              No grades in database
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* HIGHER EDUCATION SECTION */}
                  <section className="space-y-10">
                    <div className="flex items-center gap-4 border-l-8 border-emerald-500 pl-6">
                      <h4 className="text-[15px] font-black uppercase text-slate-800 tracking-wider">
                        Higher Academic History
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <Detail
                        label="Prior Academy"
                        value={
                          viewingStudent.institutionName ||
                          viewingStudent.lastSchool
                        }
                      />
                      <Detail
                        label="Strategic Qualification"
                        value={
                          viewingStudent.highestQualification ||
                          viewingStudent.qualification
                        }
                      />
                      <Detail
                        label="Major / Discipline"
                        value={
                          viewingStudent.courseStudied ||
                          viewingStudent.prevCourse
                        }
                      />
                      <Detail
                        label="Registry Year"
                        value={
                          viewingStudent.yearOfGraduation ||
                          viewingStudent.gradYear
                        }
                      />
                    </div>
                  </section>

                  {/* WORKFLOW TRACKING */}
                  <section className="md:col-span-2 bg-slate-900 p-12 rounded-[60px] text-white shadow-3xl relative overflow-hidden mt-10">
                    <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 scale-150">
                      <Briefcase size={150} />
                    </div>
                    <h4 className="text-[12px] font-black uppercase text-blue-400 mb-10 tracking-[0.4em] flex items-center gap-4">
                      <FileText size={22} /> AVA Admission Lifecycle Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                          Selected Track
                        </p>
                        <p className="text-sm font-black uppercase text-white italic">
                          {viewingStudent.selectedCourse ||
                            viewingStudent.course}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                          Vetting Status
                        </p>
                        <p className="text-sm font-black text-emerald-400 uppercase italic">
                          PAID & CLEARED
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                          Entry Protocol
                        </p>
                        <p className="text-sm font-black text-white">
                          {viewingStudent.appliedAt
                            ?.toDate()
                            .toLocaleDateString() ||
                            viewingStudent.createdAt
                              ?.toDate()
                              .toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                          System Flow
                        </p>
                        <p className="text-sm font-black text-blue-400 uppercase italic animate-pulse">
                          {viewingStudent.status}
                        </p>
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
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
};

// --- SYSTEM COMPONENTS ---

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-5 p-6 rounded-[25px] transition-all group mb-1 ${active ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/40" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
  >
    <span
      className={`${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}
    >
      {icon}
    </span>
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
      {label}
    </span>
  </button>
);

const StatusTag = ({ status }) => {
  const styles = {
    Paid: "bg-blue-50 text-blue-600 border border-blue-100",
    Verified: "bg-blue-50 text-blue-600 border border-blue-100",
    "Awaiting Rector Approval":
      "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse shadow-sm",
    "Rector Approved":
      "bg-purple-50 text-purple-600 border border-purple-100 shadow-md",
    Approved:
      "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm",
    "Rejected by Rector":
      "bg-red-50 text-red-600 border border-red-100 shadow-sm",
  };
  return (
    <span
      className={`px-6 py-2.5 rounded-[15px] text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2.5 italic ${styles[status] || "bg-slate-50 text-slate-400"}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${status === "Approved" ? "bg-emerald-500 shadow-lg" : "bg-current opacity-60"}`}
      ></div>
      {status}
    </span>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-5">
    {icon && (
      <span className="text-blue-500 mt-1 bg-blue-50 p-2.5 rounded-2xl border border-blue-100 shadow-sm">
        {icon}
      </span>
    )}
    <div className="overflow-hidden">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">
        {label}
      </p>
      <p className="font-black text-slate-800 text-[15px] uppercase truncate whitespace-pre-wrap italic">
        {value || "RECORD_NOT_FOUND"}
      </p>
    </div>
  </div>
);

export default AdmissionOfficerDashboard;
