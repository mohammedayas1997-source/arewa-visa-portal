import React, { useState, useEffect, useRef } from "react";
import { db, storage, firestore } from "../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  Upload,
  CreditCard,
  Loader2,
  User,
  School,
  BookOpen,
  Download,
  MapPin,
  GraduationCap,
  Lock,
  PlusCircle,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Wallet,
  FileText,
  FileUp,
  X as CloseIcon
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const CourseEnrollment = ({ showCourseForm, setShowCourseForm, coursesData }) => {
  // --- STATES ---
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  
  const [cvFile, setCvFile] = useState(null);
  const [otherDocFile, setOtherDocFile] = useState(null);

  const [portalSettings, setPortalSettings] = useState({ isOpen: true });
  const receiptRef = useRef(null);
  const modalRef = useRef(null); // Ref for scrolling to top

  const schoolLogo = "/logo.png";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    stateOrigin: "",
    lgaOrigin: "",
    stateResidence: "",
    lgaResidence: "",
    residentialAddress: "",
    selectedCourse: "",
  });

  const [qualifications, setQualifications] = useState([
    {
      id: Date.now(),
      type: "",
      institution: "",
      course: "",
      year: "",
    },
  ]);

  // --- AUTO-SCROLL TO TOP ON OPEN ---
  useEffect(() => {
    if (showCourseForm && modalRef.current) {
      modalRef.current.scrollTo(0, 0);
    }
  }, [showCourseForm, step]);

  // --- PORTAL STATUS REALTIME SYNC ---
  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "systemSettings", "admissionControl"),
      (snapshot) => {
        if (snapshot.exists()) {
          setPortalSettings(snapshot.data());
        }
      },
      (error) => {
        console.error("Portal Settings Error:", error);
      }
    );
    return () => unsub();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQualificationChange = (id, field, value) => {
    setQualifications((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      { id: Date.now(), type: "", institution: "", course: "", year: "" },
    ]);
  };

  const removeQualification = (id) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((q) => q.id !== id));
    }
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Image too large (Max 2MB)");
      setPassportFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPassportPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file, path) => {
    if (!file) return "";
    const fRef = ref(storage, path);
    const snapshot = await uploadBytes(fRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  // --- STEP 1: SUBMIT DATA ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("Portal is currently closed.");
    if (!passportFile) return alert("Please upload a passport photograph!");

    setLoading(true);
    try {
      const timestamp = Date.now();
      const photoUrl = await uploadFile(passportFile, `apps/${timestamp}/passport`);
      const cvUrl = cvFile ? await uploadFile(cvFile, `apps/${timestamp}/cv`) : "";
      const otherDocUrl = otherDocFile ? await uploadFile(otherDocFile, `apps/${timestamp}/others`) : "";

      const finalRecord = {
        fullName: formData.fullName,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        gender: formData.gender,
        stateOrigin: formData.stateOrigin,
        lgaOrigin: formData.lgaOrigin,
        stateResidence: formData.stateResidence,
        lgaResidence: formData.lgaResidence,
        residentialAddress: formData.residentialAddress,
        selectedCourse: formData.selectedCourse,
        qualifications: qualifications.map(q => ({
          type: q.type,
          institution: q.institution,
          course: q.course,
          year: q.year
        })),
        photoUrl: photoUrl,
        cvUrl: cvUrl,
        otherDocUrl: otherDocUrl,
        status: "Pending Payment",
        paymentStatus: "Unpaid",
        appliedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, "applications"), finalRecord);
      setApplicationId(docRef.id);
      setStep("payment");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY PAYMENT ---
  const triggerPaystack = () => {
    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0", 
      email: formData.email,
      amount: 5000 * 100,
      callback: (response) => handlePaymentSuccess(response.reference),
      onClose: () => {
        setLoading(false);
        alert("Payment cancelled.");
      },
    });
    handler.openIframe();
  };

  const handlePaymentSuccess = async (reference) => {
    setLoading(true);
    try {
      const admissionID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
      await updateDoc(doc(firestore, "applications", applicationId), {
        status: "Paid",
        paymentStatus: "Paid",
        admissionID: admissionID,
        paymentRef: reference || "PAY-" + Date.now(),
        paidAt: serverTimestamp(),
      });

      const adminWhatsApp = "2348165372359";
      const message = `*NEW ADMISSION PAID*%0A%0A*ID:* ${admissionID}%0A*Name:* ${formData.fullName}%0A*Program:* ${formData.selectedCourse}`;
      window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, "_blank");

      setStep("success");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Payment successful but record update failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    try {
      setLoading(true);
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`AVA-RECEIPT-${applicationId?.substr(0, 5)}.pdf`);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!showCourseForm) return null;

  if (!portalSettings.isOpen) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[10000] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] text-center shadow-2xl">
          <Lock size={80} className="mx-auto text-red-600 mb-6" />
          <h1 className="text-3xl font-black text-[#002147] uppercase">Portal Closed</h1>
          <p className="text-slate-500 mt-4 font-bold">Admission applications are currently disabled.</p>
          <button onClick={() => setShowCourseForm(false)} className="mt-8 bg-red-600 text-white px-8 py-3 rounded-full font-bold">Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-[#F0F4F8] z-[10000] overflow-y-auto pt-4 pb-20 px-4 md:px-20 animate-in fade-in duration-500"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100 relative mb-10">
        <button 
          onClick={() => setShowCourseForm(false)} 
          className="absolute top-6 right-6 z-50 bg-red-600 hover:bg-[#002147] p-2 rounded-full text-white shadow-lg transition-all"
        >
          <CloseIcon size={24} />
        </button>

        {step === "form" && (
          <>
            <div className="bg-gradient-to-r from-[#002147] to-[#003366] p-12 text-white flex justify-between items-center relative overflow-hidden border-b-8 border-red-600">
              <div className="z-10 flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center">
                  <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Admission Portal</h1>
                  <p className="text-emerald-400 font-black mt-2 uppercase text-[10px] tracking-[0.3em]">Arewa Visa Academy</p>
                </div>
              </div>
              <School size={150} className="opacity-10 absolute -right-10 -bottom-10" />
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 md:p-14 space-y-12 text-left bg-white">
              <section className="space-y-8 p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100">
                <div className="flex items-center gap-4 border-b-2 border-blue-200 pb-4">
                  <User className="text-red-600" />
                  <h2 className="text-[#002147] text-xl font-black uppercase italic">Personal Data</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-44 h-52 bg-white border-4 border-dashed border-blue-200 rounded-[2rem] relative flex items-center justify-center overflow-hidden hover:border-[#002147] transition-all shadow-inner">
                      {passportPreview ? (
                        <img src={passportPreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto text-blue-300 mb-2" />
                          <span className="text-[10px] font-black text-blue-400 uppercase">Passport</span>
                        </div>
                      )}
                      <input required type="file" accept="image/*" onChange={handlePassportUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group"><label className="label-style">Full Name</label><input required name="fullName" onChange={handleChange} placeholder="Surname First" className="sky-input" /></div>
                    <div className="group"><label className="label-style">Email Address</label><input required name="email" type="email" onChange={handleChange} placeholder="example@mail.com" className="sky-input" /></div>
                    <div className="group"><label className="label-style">Phone Number</label><input required name="phone" type="tel" onChange={handleChange} placeholder="WhatsApp Number" className="sky-input" /></div>
                    <div className="group"><label className="label-style">Gender</label><select required name="gender" onChange={handleChange} className="sky-input"><option value="">Select</option><option>Male</option><option>Female</option></select></div>
                    <div className="group"><label className="label-style">State of Origin</label><input required name="stateOrigin" onChange={handleChange} className="sky-input" /></div>
                    <div className="group"><label className="label-style">LGA of Origin</label><input required name="lgaOrigin" onChange={handleChange} className="sky-input" /></div>
                  </div>
                </div>
              </section>

              <section className="space-y-8 p-6 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100">
                <div className="flex items-center gap-4 border-b-2 border-emerald-200 pb-4">
                  <MapPin className="text-emerald-600" />
                  <h2 className="text-[#002147] text-xl font-black uppercase italic">Contact Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required name="stateResidence" onChange={handleChange} placeholder="State of Residence" className="sky-input" />
                  <input required name="lgaResidence" onChange={handleChange} placeholder="LGA of Residence" className="sky-input" />
                  <textarea required name="residentialAddress" onChange={handleChange} placeholder="Full Home Address" className="sky-input md:col-span-2" rows="2" />
                </div>
              </section>

              <section className="space-y-8 bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-200">
                <div className="flex items-center justify-between border-b-2 border-slate-300 pb-4">
                  <div className="flex items-center gap-4">
                    <GraduationCap className="text-blue-600" />
                    <h2 className="text-[#002147] text-xl font-black uppercase">Educational Background</h2>
                  </div>
                  <button type="button" onClick={addQualification} className="bg-[#002147] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-red-600 transition-all shadow-md">
                    <PlusCircle size={16} /> Add More
                  </button>
                </div>
                <div className="space-y-6">
                  {qualifications.map((qual) => (
                    <div key={qual.id} className="p-6 bg-white border border-slate-200 rounded-3xl relative animate-in fade-in zoom-in duration-300 shadow-sm">
                      {qualifications.length > 1 && (
                        <button type="button" onClick={() => removeQualification(qual.id)} className="absolute top-4 right-4 text-red-500 hover:scale-110">
                          <Trash2 size={20} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <select required value={qual.type} onChange={(e) => handleQualificationChange(qual.id, "type", e.target.value)} className="sky-input !py-3">
                          <option value="">Qualification</option>
                          <option>SSCE</option><option>ND</option><option>HND</option><option>Degree</option><option>NCE</option><option>Master</option>
                        </select>
                        <input required placeholder="Institution" value={qual.institution} onChange={(e) => handleQualificationChange(qual.id, "institution", e.target.value)} className="sky-input !py-3" />
                        <input required placeholder="Course" value={qual.course} onChange={(e) => handleQualificationChange(qual.id, "course", e.target.value)} className="sky-input !py-3" />
                        <input required placeholder="Year" value={qual.year} onChange={(e) => handleQualificationChange(qual.id, "year", e.target.value)} className="sky-input !py-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8 p-6 bg-red-50/30 rounded-[2.5rem] border border-red-100">
                <div className="flex items-center gap-4 border-b-2 border-red-200 pb-4">
                  <FileUp className="text-red-600" />
                  <h2 className="text-[#002147] text-xl font-black uppercase italic">Documents (Optional)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-red-200">
                      <label className="text-xs font-black text-[#002147] mb-3 block uppercase">Upload CV / Resume</label>
                      <input type="file" onChange={(e) => setCvFile(e.target.files[0])} className="text-xs font-bold text-slate-500 w-full" accept=".pdf,.doc,.docx" />
                   </div>
                   <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-red-200">
                      <label className="text-xs font-black text-[#002147] mb-3 block uppercase">Other Credentials</label>
                      <input type="file" onChange={(e) => setOtherDocFile(e.target.files[0])} className="text-xs font-bold text-slate-500 w-full" accept=".pdf,.jpg,.png" />
                   </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-[#002147] to-[#001a35] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><BookOpen size={100} /></div>
                <label className="text-xs font-black uppercase mb-6 block tracking-widest text-red-500">Course Specialization</label>
                <select required name="selectedCourse" onChange={handleChange} className="w-full p-5 rounded-2xl bg-white text-[#002147] font-black outline-none shadow-xl border-0">
                  <option value="">Choose your course...</option>
                  {coursesData?.map((c) => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </section>

              <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-black py-8 rounded-[2.5rem] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#002147] transition-all flex items-center justify-center gap-4 transform hover:scale-[1.02] active:scale-95">
                {loading ? <Loader2 className="animate-spin text-white" /> : <span className="text-white">Complete Enrollment <ArrowRight className="inline ml-2" /></span>}
              </button>
            </form>
          </>
        )}

        {step === "payment" && (
          <div className="p-10 md:p-20 text-center animate-in zoom-in duration-300 min-h-[600px] flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="bg-[#002147] p-10 rounded-t-[40px] text-white">
                <Wallet size={60} className="mx-auto mb-4 text-emerald-400" />
                <h2 className="text-2xl font-black uppercase text-white">Tuition Fee</h2>
              </div>
              <div className="p-10 bg-slate-50 border border-slate-100 rounded-b-[40px] shadow-xl">
                <p className="text-slate-500 font-bold mb-2 uppercase text-xs">Processing application for:</p>
                <p className="text-[#002147] font-black mb-6 truncate text-xl">{formData.fullName}</p>
                <span className="text-6xl font-black text-[#002147]">₦5,000</span>
                <button onClick={triggerPaystack} className="w-full mt-8 bg-emerald-600 text-white font-black py-5 rounded-2xl uppercase shadow-xl hover:bg-[#002147] transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto text-white" /> : <span className="text-white">Pay Now</span>}
                </button>
                <button onClick={() => setStep("form")} className="mt-4 text-slate-400 font-bold text-xs uppercase hover:text-red-600 transition-colors">Back to Edit</button>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-4 md:p-10 flex flex-col items-center bg-white animate-in slide-in-from-bottom duration-500">
            <div ref={receiptRef} className="w-full max-w-[800px] bg-white p-6 md:p-12 shadow-2xl border-[12px] border-[#002147] mb-10 relative">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4 text-left">
                  <img src={schoolLogo} alt="Logo" className="w-20 h-20 object-contain" />
                  <div>
                    <h1 className="text-2xl font-black text-[#002147]">AREWA VISA ACADEMY</h1>
                    <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em]">Excellence in Global Immigration</p>
                  </div>
                </div>
                <QRCodeSVG value={applicationId} size={80} />
              </div>
              <div className="flex flex-col md:flex-row gap-8 border-y-2 border-slate-100 py-8">
                <img src={passportPreview} className="w-32 h-40 object-cover rounded-xl border-4 border-slate-100 mx-auto md:mx-0 shadow-md" alt="Student" />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Student Name</p>
                    <p className="text-xl font-black text-[#002147] uppercase">{formData.fullName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Program</p>
                      <p className="text-sm font-bold text-slate-700">{formData.selectedCourse}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Status</p>
                      <p className="text-sm font-black text-emerald-600 uppercase">Paid - Success</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase">Official Receipt Generated: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex gap-4 mb-10">
              <button onClick={downloadReceipt} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                <Download size={20} className="text-white" /> <span className="text-white uppercase">PDF Receipt</span>
              </button>
              <button onClick={() => window.location.reload()} className="bg-[#002147] text-white px-8 py-4 rounded-xl font-black shadow-lg transition-all">
                <span className="text-white uppercase">Finish</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sky-input {
          width: 100%;
          padding: 1.2rem 1.5rem;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 1.2rem;
          font-weight: 700;
          font-size: 0.875rem;
          color: #002147;
          outline: none;
          transition: all 0.3s ease;
        }
        .sky-input:focus {
          border-color: #002147;
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 33, 71, 0.1);
        }
        .label-style {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 8px;
          display: block;
          margin-left: 5px;
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in { animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default CourseEnrollment;