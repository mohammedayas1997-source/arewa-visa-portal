import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  LayoutDashboard, GraduationCap, Briefcase, ShieldCheck, 
  Users, Globe, Plane, Search, Download, Eye, Trash2, 
  TrendingUp, Clock, CheckCircle
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    courses: [],
    jobs: [],
    insurance: [],
    manpower: [],
    cbi: [],
    flights: []
  });

  // --- SYNC DATA FROM FIREBASE ---
  useEffect(() => {
    const collections = ["applications", "jobApplications", "insuranceApps", "manpowerApps", "cbiApps", "flightBookings"];
    
    const unsubs = collections.map((colName) => {
      return onSnapshot(collection(firestore, colName), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const key = colName === "applications" ? "courses" : colName.replace("Apps", "").replace("Applications", "s").replace("Bookings", "s");
        setData(prev => ({ ...prev, [key]: list }));
      });
    });

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  // --- STATS CALCULATION ---
  const stats = [
    { title: "Course Apps", count: data.courses.length, icon: <GraduationCap />, color: "bg-primary", link: "courses" },
    { title: "Job Seekers", count: data.jobs.length, icon: <Briefcase />, color: "bg-danger", link: "jobs" },
    { title: "Insurance", count: data.insurance.length, icon: <ShieldCheck />, color: "bg-success", link: "insurance" },
    { title: "Manpower", count: data.manpower.length, icon: <Users />, color: "bg-purple", link: "manpower" },
    { title: "CBI Program", count: data.cbi.length, icon: <Globe />, color: "bg-warning", link: "cbi" },
    { title: "Flight Bookings", count: data.flights.length, icon: <Plane />, color: "bg-info", link: "flights" },
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* SIDEBAR */}
      <div className="bg-dark text-white p-4 d-none d-md-block" style={{ width: "280px" }}>
        <h4 className="fw-black italic text-danger mb-5">AVA SUPER ADMIN</h4>
        <div className="nav flex-column gap-2">
          <button onClick={() => setActiveTab("overview")} className={`nav-link text-start rounded-3 p-3 border-0 ${activeTab === "overview" ? "bg-danger text-white" : "text-white-50"}`}>
            <LayoutDashboard size={20} className="me-2"/> Overview
          </button>
          {stats.map(s => (
            <button key={s.link} onClick={() => setActiveTab(s.link)} className={`nav-link text-start rounded-3 p-3 border-0 ${activeTab === s.link ? "bg-danger text-white" : "text-white-50"}`}>
              {React.cloneElement(s.icon, { size: 20, className: "me-2" })} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-black text-uppercase">System Control <span className="text-danger">Panel</span></h2>
          <div className="bg-white p-2 rounded-circle shadow-sm"><Users size={24} /></div>
        </div>

        {activeTab === "overview" ? (
          <>
            {/* STATS GRID */}
            <div className="row g-4 mb-5">
              {stats.map((s, i) => (
                <div key={i} className="col-md-4 col-lg-2">
                  <div className={`${s.color} text-white p-4 rounded-[25px] shadow-lg border-0 h-100 transition-transform hover:-translate-y-2 cursor-pointer`} onClick={() => setActiveTab(s.link)}>
                    <div className="mb-3 bg-white bg-opacity-20 p-2 rounded-circle d-inline-block">{s.icon}</div>
                    <h6 className="small fw-bold uppercase opacity-75">{s.title}</h6>
                    <h3 className="fw-black mb-0 italic">{s.count}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* RECENT ACTIVITY TABLE (Example for Courses) */}
            <div className="card border-0 shadow-sm rounded-[30px] p-4">
              <h5 className="fw-black mb-4 uppercase italic">Recent Applications</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr className="small uppercase fw-black">
                      <th>Name</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.courses.slice(0, 5).map((app, i) => (
                      <tr key={i} className="small">
                        <td className="fw-bold">{app.name || app.fullName}</td>
                        <td><span className="badge bg-primary rounded-pill">Course</span></td>
                        <td><span className="badge bg-success-subtle text-success border border-success">Paid</span></td>
                        <td className="text-muted">{app.appliedAt?.toDate().toLocaleDateString() || "Recent"}</td>
                        <td><button className="btn btn-light btn-sm rounded-circle"><Eye size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card border-0 shadow-sm rounded-[30px] p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h4 className="fw-black text-uppercase italic">{activeTab} Management</h4>
               <button className="btn btn-danger rounded-pill px-4 fw-bold"><Download size={18} className="me-2"/> Export Data</button>
            </div>
            {/* Inda jerin kowane bayanan zai rinka fita */}
            <div className="text-muted text-center py-5">
               <Clock size={48} className="mb-3 opacity-25"/>
               <p className="fw-bold uppercase">Listing all records for {activeTab}...</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bg-purple { background-color: #6f42c1; }
        .fw-black { font-weight: 900; }
        .italic { font-style: italic; }
        .nav-link:hover { background-color: rgba(220, 53, 69, 0.1) !important; color: #dc3545 !important; }
        .rounded-[25px] { border-radius: 25px; }
        .rounded-[30px] { border-radius: 30px; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;