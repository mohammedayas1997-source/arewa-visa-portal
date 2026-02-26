import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Path corrected to your standard ../firebase
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ShieldCheck,
  Award,
  FileText,
  ChevronRight,
  Loader2,
  AlertCircle,
  Cpu,
} from "lucide-react";

const Rector = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [stats, setStats] = useState({ total: 0, approved: 0 });

  useEffect(() => {
    // Pipeline: Karbo duk daliban da Admission Office suka tura vetting (Arewa Visa Academy)
    const q = query(
      collection(db, "applications"),
      where("status", "==", "Awaiting Rector Approval"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPendingApplications(apps);
      setStats((prev) => ({ ...prev, total: apps.length }));
    });

    return () => unsub();
  }, []);

  const handleApprove = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Rector Approved",
        rectorApprovalDate: serverTimestamp(),
        remarks: "Final Vetting Completed by Rector's Office (AVA)",
      });
      alert("SUCCESS: Dalibin Arewa Visa Academy ya sami amincewar Rector!");
    } catch (error) {
      alert("Kuskure: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    if (
      !window.confirm(
        "SURE_PROTOCOL: Shin ka tabbata kana so ka dakatar da wannan takardar shiga makarantar?",
      )
    )
      return;
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Rejected by Rector",
        rectorRemarks: "Document Discrepancy or Security Vetting Failure",
        updatedAt: serverTimestamp(),
      });
      alert("Takardar shiga an dakatar da ita.");
    } catch (error) {
      alert("Kuskure: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20 text-left font-sans transition-all duration-500">
      {/* Executive Header (AVA BRANDING) */}
      <div className="w-full bg-[#001529] py-16 px-6 md:px-20 text-white relative overflow-hidden border-b-8 border-red-600">
        <div className="relative z-10">
          <p className="text-red-500 font-black text-xs uppercase tracking-[0.4em] mb-2 animate-pulse">
            Arewa Visa Academy
          </p>
          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tight italic">
            Office of the Rector
          </h1>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-12 h-1 bg-red-600"></span>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Strategic Vetting & Academy Governance
            </p>
          </div>
        </div>
        <Cpu
          className="absolute right-10 top-1/2 -translate-y-1/2 text-white/5"
          size={250}
        />
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-6 flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
        {/* Rector's Profile & Quick Insights */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-3 shadow-2xl border-b-4 border-red-600 rounded-2xl overflow-hidden">
            <img
              src="/rector.jpg"
              alt="Rector Arewa Visa"
              className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-xl"
            />
            <div className="py-8 text-center bg-slate-50 mt-2 rounded-xl">
              <h2 className="text-[#001529] font-black text-2xl uppercase tracking-tighter italic">
                The Rector
              </h2>
              <p className="text-red-600 font-black text-[10px] uppercase tracking-widest mt-2 border-t border-slate-200 pt-2 mx-6">
                Arewa Visa Academy Executive Authority
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#001529] p-8 rounded-[30px] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                <Clock size={40} />
              </div>
              <h4 className="text-4xl font-black">{stats.total}</h4>
              <p className="text-[9px] uppercase font-black text-red-500 mt-1 tracking-widest">
                Pending Vetting
              </p>
            </div>
            <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Award size={40} />
              </div>
              <h4 className="text-4xl font-black text-[#001529]">2026</h4>
              <p className="text-[9px] uppercase font-black text-slate-400 mt-1 tracking-widest">
                Academy Session
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Dashboard */}
        <div className="w-full lg:w-2/3 space-y-10">
          {/* Executive Welcome */}
          <div className="bg-white p-10 md:p-16 shadow-sm border border-slate-200 rounded-[50px] relative">
            <h3 className="text-3xl font-black text-[#001529] mb-8 uppercase italic flex items-center gap-3">
              <span className="w-3 h-10 bg-red-600 rounded-full"></span>{" "}
              Rector's Directive
            </h3>
            <div className="text-slate-700 leading-relaxed space-y-6 text-xl italic font-serif">
              <p>
                "At Arewa Visa Academy, we are training the next generation of
                Travel, Hospitality, and Security Professionals. Our vetting
                process ensures that only the most dedicated and disciplined
                candidates gain access to our prestigious specialized programs."
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl not-italic font-sans text-base text-slate-500 border-l-4 border-slate-200">
                Wannan ofishin shine ke tabbatar da cewa dukkan daliban da za mu
                dauka sun cika sharuddan mu na kwarewa kafin su shiga sashin
                karatun su na wata hudu.
              </div>
            </div>
          </div>

          {/* Vetting Pipeline UI */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#001529] uppercase tracking-tighter">
                    AVA Vetting Pipeline
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Admission Requests Awaiting Shugaban Makaranta
                  </p>
                </div>
              </div>
            </div>

            {pendingApplications.length > 0 ? (
              <div className="grid gap-6">
                {pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-8 rounded-[40px] border-l-[12px] border-red-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-8 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-100 rounded-[25px] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ring-2 ring-[#001529]/5">
                        {app.passportUrl ? (
                          <img
                            src={app.passportUrl}
                            alt="Passport"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-[#001529] uppercase text-xl tracking-tight">
                          {app.studentName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">
                            {app.course}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            AVA_ID: {app.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        disabled={loadingId === app.id}
                        onClick={() => handleReject(app.id)}
                        className="p-5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all active:scale-90"
                        title="Reject Application"
                      >
                        <XCircle size={30} />
                      </button>
                      <button
                        disabled={loadingId === app.id}
                        onClick={() => handleApprove(app.id)}
                        className="bg-[#001529] hover:bg-red-600 text-white px-10 py-5 rounded-[25px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all active:scale-95"
                      >
                        {loadingId === app.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                        Grant Final Admission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-[50px] text-center shadow-inner">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="text-slate-300" size={48} />
                </div>
                <p className="text-slate-400 font-black uppercase text-sm tracking-[0.2em]">
                  Academy Pipeline Clear. Ba a tura sabon vetting ba tukuna.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rector;
