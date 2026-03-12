import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  LayoutDashboard, GraduationCap, Briefcase, ShieldCheck, 
  Users, Globe, Plane, Search, Download, Eye, 
  Filter, Bell, UserCircle
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({
    courses: [], jobs: [], insurance: [], manpower: [], cbi: [], flights: []
  });

  useEffect(() => {
    const collections = [
      { col: "applications", key: "courses" },
      { col: "jobApplications", key: "jobs" },
      { col: "insuranceApps", key: "insurance" },
      { col: "manpowerApps", key: "manpower" },
      { col: "cbiApps", key: "cbi" },
      { col: "flightBookings", key: "flights" }
    ];
    
    const unsubs = collections.map(({ col, key }) => {
      return onSnapshot(collection(firestore, col), (snapshot) => {
        setData(prev => ({ 
          ...prev, 
          [key]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
        }));
      });
    });
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  // --- SEARCH LOGIC (Neman suna, NIN ko ID a dukkan bayanan) ---
  const getAllData = () => [...data.courses, ...data.jobs, ...data.insurance, ...data.manpower, ...data.cbi, ...data.flights];
  
  const filteredData = getAllData().filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchStr) ||
      item.fullName?.toLowerCase().includes(searchStr) ||
      item.nin?.includes(searchStr) ||
      item.admissionID?.toLowerCase().includes(searchStr) ||
      item.passportNo?.toLowerCase().includes(searchStr)
    );
  });

  const stats = [
    { title: "Courses", count: data.courses.length, icon: <GraduationCap />, color: "bg-blue-600", link: "courses" },
    { title: "Job Portal", count: data.jobs.length, icon: <Briefcase />, color: "bg-red-600", link: "jobs" },
    { title: "Insurance", count: data.insurance.length, icon: <ShieldCheck />, color: "bg-green-600", link: "insurance" },
    { title: "Manpower", count: data.manpower.length, icon: <Users />, color: "bg-purple-600", link: "manpower" },
    { title: "CBI", count: data.cbi.length, icon: <Globe />, color: "bg-orange-500", link: "cbi" },
    { title: "Flights", count: data.flights.length, icon: <Plane />, color: "bg-cyan-500", link: "flights" },
  ];

  return (
    <div className="flex bg-[#f4f7fe] min-h-screen font-sans">
      {/* SIDEBAR */}
      <div className="w-[300px] bg-white border-e h-screen sticky top-0 p-5 hidden md:block shadow-sm">
        <div className="flex items-center gap-3 mb-10 px-2">
           <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-200">
             <ShieldCheck size={24} />
           </div>
           <h4 className="font-black text-slate-800 tracking-tighter italic text-xl">AVA PANEL</h4>
        </div>
        
        <div className="space-y-1">
          <button onClick={() => {setActiveTab("overview"); setSearchTerm("")}} className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <hr className="my-4 opacity-50" />
          {stats.map(s => (
            <button key={s.link} onClick={() => {setActiveTab(s.link); setSearchTerm("")}} className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold transition-all ${activeTab === s.link ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              {React.cloneElement(s.icon, { size: 20 })} {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-5 md:p-10 overflow-auto">
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
           <div>
             <h2 className="text-3xl font-black text-slate-800 italic uppercase">Dashboard</h2>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Main System Intelligence / {activeTab}</p>
           </div>

           <div className="relative w-full md:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Name, NIN, Passport or ID..." 
                className="w-full bg-white border-0 shadow-sm rounded-full py-3 ps-12 pe-4 font-bold text-slate-700 outline-none focus:ring-2 ring-red-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-3">
              <button className="bg-white p-3 rounded-full shadow-sm text-slate-500"><Bell size={20}/></button>
              <div className="flex items-center gap-2 bg-white p-2 pe-4 rounded-full shadow-sm">
                 <div className="bg-slate-100 p-2 rounded-full text-slate-600"><UserCircle size={22}/></div>
                 <span className="font-black text-xs text-slate-800">SUPER ADMIN</span>
              </div>
           </div>
        </div>

        {searchTerm ? (
          /* SEARCH RESULTS VIEW */
          <div className="bg-white p-6 rounded-[35px] shadow-sm border animate-in fade-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-black italic text-slate-800 uppercase">Search Results ({filteredData.length})</h4>
                <button onClick={() => setSearchTerm("")} className="text-red-500 font-black text-xs">CLEAR SEARCH</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((item, i) => (
                   <div key={i} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm"><User size={24} className="text-slate-400"/></div>
                      <div>
                         <h6 className="font-black text-slate-800 mb-0">{item.name || item.fullName}</h6>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-0">{item.admissionID || item.passportNo || 'No ID'}</p>
                         <span className="badge bg-red-100 text-red-600 text-[9px] px-2 py-1 rounded-pill mt-2">APPLICATION</span>
                      </div>
                   </div>
                ))}
                {filteredData.length === 0 && <div className="col-12 py-10 text-center font-bold text-slate-400 italic">No record found matching "{searchTerm}"</div>}
             </div>
          </div>
        ) : activeTab === "overview" ? (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
              {stats.map((s, i) => (
                <div key={i} onClick={() => setActiveTab(s.link)} className={`${s.color} p-5 rounded-[30px] text-white shadow-xl shadow-slate-200 cursor-pointer transition-transform hover:-translate-y-2`}>
                   <div className="bg-white/20 p-2 rounded-2xl w-fit mb-4">{s.icon}</div>
                   <h6 className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.title}</h6>
                   <h2 className="text-2xl font-black italic">{s.count}</h2>
                </div>
              ))}
            </div>

            {/* RECENT RECORDS */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="font-black italic text-slate-800 uppercase tracking-tighter">Recent Activities</h4>
                  <Filter size={20} className="text-slate-300" />
               </div>
               <div className="space-y-4">
                  {data.courses.slice(0, 5).map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl transition-hover hover:bg-slate-100">
                       <div className="flex items-center gap-4 text-start">
                          <div className="bg-blue-600 p-2 rounded-xl text-white"><GraduationCap size={18}/></div>
                          <div>
                             <h6 className="font-black text-slate-800 mb-0">{app.name}</h6>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-0">{app.selectedCourseTitle}</p>
                          </div>
                       </div>
                       <div className="text-end">
                          <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase">Paid</span>
                          <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase italic">{app.admissionID}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </>
        ) : (
          /* DATA LISTING VIEW */
          <div className="bg-white p-8 rounded-[40px] shadow-sm border animate-in slide-in-from-bottom-5 duration-500">
             <div className="flex justify-between items-center mb-8">
                <h4 className="font-black italic text-slate-800 uppercase italic">Manage {activeTab} Records</h4>
                <button className="bg-slate-800 text-white px-5 py-2 rounded-full font-black text-xs flex items-center gap-2 tracking-widest">
                  <Download size={16}/> EXPORT CSV
                </button>
             </div>
             <div className="table-responsive">
                <table className="table table-borderless align-middle text-start">
                   <thead>
                      <tr className="text-slate-300 font-black uppercase text-[10px] border-bottom">
                         <th className="pb-3">Applicant Name</th>
                         <th className="pb-3">Reference/ID</th>
                         <th className="pb-3">Status</th>
                         <th className="pb-3">Action</th>
                      </tr>
                   </thead>
                   <tbody>
                      {data[activeTab]?.map((row, idx) => (
                        <tr key={idx} className="border-bottom">
                           <td className="py-4 font-black text-slate-700">{row.name || row.fullName}</td>
                           <td className="font-bold text-slate-400 uppercase">{row.admissionID || row.passportNo || 'N/A'}</td>
                           <td><span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-black text-[9px] uppercase border border-green-200">Success</span></td>
                           <td><button className="bg-slate-100 p-2 rounded-xl text-slate-500"><Eye size={16}/></button></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;