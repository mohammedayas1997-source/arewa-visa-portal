import React, { useState, useEffect, useRef } from "react";
import { db, storage, firestore } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  X,
  GraduationCap,
  ArrowRight,
  Loader2,
  Wallet,
  Lock,
  User,
  MapPin,
  FileText,
  Download,
  Briefcase,
  ShieldCheck,
  School,
  PlusCircle,
  Trash2,
  BookOpen,
  FileUp,
  Globe
} from "lucide-react";

const CourseApplicationForm = ({
  showCourseForm,
  setShowCourseForm,
  coursesData,
}) => {
  // --- STATES ---
  const [step, setStep] = useState("form"); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [generatedID, setGeneratedID] = useState("");
  const [applicationDocId, setApplicationDocId] = useState("");
  const [portalSettings, setPortalSettings] = useState({ isOpen: true });
  const receiptRef = useRef(null);
  const schoolLogo = "/logo.png";

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    nin: "",
    intlPassportNo: "", 
    whatsapp: "",
    stateOrigin: "", 
    lgaOrigin: "",   
    stateResidence: "", 
    lgaResidence: "",   
    address: "",
    job: "",
    jobCountry: "",
    selectedCourseTitle: "",
    photoFile: null,
    resumeFile: null, 
  });

  const [qualifications, setQualifications] = useState([
    { id: Date.now(), type: "", institution: "", course: "", year: "", examNo: "", centerNo: "" },
  ]);

  // --- PORTAL SYNC ---
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "systemSettings", "admissionControl"), (snapshot) => {
      if (snapshot.exists()) setPortalSettings(snapshot.data());
    });
    return () => unsub();
  }, []);

  // --- FUNCTIONS ---
  const uploadFile = async (file, path) => {
    const fRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Image too large! Max 2MB.");
      setApplicationData(prev => ({ ...prev, photoFile: file }));
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleQualificationChange = (id, field, value) => {
    setQualifications((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const addQualification = () => {
    setQualifications([...qualifications, { id: Date.now(), type: "", institution: "", course: "", year: "", examNo: "", centerNo: "" }]);
  };

  const removeQualification = (id) => {
    if (qualifications.length > 1) setQualifications(qualifications.filter((q) => q.id !== id));
  };

  // --- STEP 1: SUBMISSION ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("Portal is Closed.");
    if (!applicationData.photoFile) return alert("Upload passport photo.");

    setIsSubmitting(true);
    try {
      const ts = Date.now();
      const photoUrl = await uploadFile(applicationData.photoFile, `apps/${ts}/photo`);
      let resumeUrl = "";
      if (applicationData.resumeFile) {
        resumeUrl = await uploadFile(applicationData.resumeFile, `apps/${ts}/credentials`);
      }

      const { photoFile, resumeFile, ...cleanData } = applicationData;

      const docRef = await addDoc(collection(firestore, "applications"), {
        ...cleanData,
        qualifications,
        photoUrl,
        resumeUrl,
        status: "Pending Payment",
        appliedAt: serverTimestamp(),
      });

      setApplicationDocId(docRef.id);
      setStep("payment");
      window.scrollTo(0, 0);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STEP 2: PAYSTACK INTEGRATION FIX ---
  const triggerPaystack = () => {
    if (!window.PaystackPop) {
      return alert("The payment gateway is still loading. Please wait 3 seconds and try again.");
    }
    
    setIsSubmitting(true);

    const handler = window.PaystackPop.setup({
      key: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0", 
      email: applicationData.email,
      amount: 5000 * 100, // 5000 Naira in Kobo
      currency: "NGN",
      // Generate a clean reference string
      ref: "AVA-" + Math.floor((Math.random() * 1000000000) + 1),
      callback: (response) => {
        handlePaymentSuccess(response.reference);
      },
      onClose: () => {
        setIsSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handlePaymentSuccess = async (reference) => {
    setIsSubmitting(true);
    try {
      const admissionID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedID(admissionID);

      await updateDoc(doc(firestore, "applications", applicationDocId), {
        admissionID,
        paymentRef: reference,
        paymentStatus: "Paid",
        status: "Paid",
        paidAt: serverTimestamp(),
      });

      const adminWA = "2348165372359";
      const msg = `*NEW ADMISSION PAID*%0A%0AID: ${admissionID}%0AName: ${applicationData.name}`;
      window.open(`https://wa.me/${adminWA}?text=${msg}`, "_blank");

      setStep("success");
      window.scrollTo(0, 0);
    } catch (error) {
      alert("Payment successful but database update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    setIsSubmitting(true);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`AVA-RECEIPT-${generatedID}.pdf`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCourseForm) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 px-2 py-4 shadow-lg" style={{ zIndex: 10000, backgroundColor: "rgba(0,0,0,0.92)", overflowY: "auto", display: "block" }}>
      <div className="card border-0 w-100 mx-auto" style={{ maxWidth: "1000px", borderRadius: "24px", overflow: "hidden" }}>
        <button onClick={() => { setShowCourseForm(false); setStep("form"); }} className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm" style={{ zIndex: 11000 }}><X size={20} /></button>

        <div className="card-body p-0 bg-white text-start">
          {step === "success" ? (
            <div ref={receiptRef} className="p-4 p-md-5 text-dark text-start bg-white" style={{ border: "15px solid #1a1a1a" }}>
              <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4 text-uppercase">
                <div className="d-flex align-items-center gap-3 text-start">
                  <img src={schoolLogo} alt="Logo" style={{ width: "80px" }} />
                  <div className="text-start">
                    <h2 className="fw-black text-danger mb-0 uppercase">AREWA VISA ACADEMY</h2>
                    <p className="small text-muted mb-0 fw-bold uppercase">Digital Solutions Academy</p>
                  </div>
                </div>
                <div className="text-end">
                  <h6 className="fw-bold mb-0 uppercase text-end">ADMISSION ID: {generatedID}</h6>
                  <p className="small text-muted mb-0 font-monospace text-end text-uppercase">DATE: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="row g-4 mb-4 bg-light p-4 rounded-4 mx-0 border">
                <div className="col-md-3"><img src={photoPreview} style={{ width: "150px", height: "185px", objectFit: "cover" }} className="rounded-3 shadow-lg" alt="Student" /></div>
                <div className="col-md-6">
                   <h5 className="fw-black border-bottom border-danger pb-2 mb-3 uppercase text-start">Candidate Profile</h5>
                   <table className="table table-sm table-borderless uppercase small">
                      <tbody>
                        <tr><td className="fw-bold">Full Name:</td><td>{applicationData.name}</td></tr>
                        <tr><td className="fw-bold">Program:</td><td className="text-danger">{applicationData.selectedCourseTitle}</td></tr>
                        <tr><td className="fw-bold">NIN:</td><td>{applicationData.nin}</td></tr>
                        <tr><td className="fw-bold">WhatsApp:</td><td>{applicationData.whatsapp}</td></tr>
                      </tbody>
                   </table>
                </div>
                <div className="col-md-3 text-center border-start"><QRCodeSVG value={generatedID} size={110} /><p className="mt-2 fw-bold uppercase" style={{fontSize: '8px'}}>Verify Authenticity</p></div>
              </div>
              <div className="bg-dark p-4 rounded-4 text-white d-flex justify-content-between align-items-center shadow-lg mb-4">
                <div className="text-start"><h3 className="fw-black mb-0">PAID: ₦5,000.00</h3><p className="small text-muted mb-0 uppercase tracking-widest">Status: Payment Verified Successful</p></div>
                <ShieldCheck size={45} className="text-success" />
              </div>
              <div className="mt-5 d-flex gap-3 justify-content-center">
                <button onClick={downloadReceipt} className="btn btn-danger px-5 py-3 rounded-pill fw-black d-flex align-items-center gap-2">{isSubmitting ? <Loader2 className="animate-spin" /> : <Download size={20} />} PDF DOWNLOAD</button>
                <button onClick={() => window.location.reload()} className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold">FINISH</button>
              </div>
            </div>
          ) : step === "payment" ? (
            <div className="p-5 text-center bg-white min-h-[500px] flex flex-col justify-center items-center">
               <Wallet size={80} className="text-danger mb-4 animate-bounce" />
               <h2 className="fw-black text-danger uppercase display-5">Application Fee</h2>
               <p className="text-muted fw-bold">ENROLLMENT FOR: {applicationData.name}</p>
               <div className="bg-light p-4 rounded-4 my-4 border-start border-danger border-5">
                  <h1 className="display-3 fw-black text-dark mb-0">₦5,000</h1>
               </div>
               <button onClick={triggerPaystack} disabled={isSubmitting} className="btn btn-danger btn-lg px-5 py-4 rounded-pill fw-black uppercase tracking-widest shadow-lg">
                  {isSubmitting ? <div className="d-flex align-items-center gap-2"><Loader2 className="animate-spin" /> <span>Connecting Paystack...</span></div> : "Verify & Pay Now"}
               </button>
            </div>
          ) : (
            <div className="row g-0">
               <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                 {photoPreview ? <img src={photoPreview} className="mx-auto mb-3 border border-3 border-white rounded-3 shadow-lg" style={{width: '110px', height: '145px', objectFit: 'cover'}} alt="Passport" /> : <School size={65} className="mx-auto mb-3 opacity-75" />}
                 <h4 className="fw-black text-uppercase">Admission Portal</h4>
                 <p className="small opacity-75 fw-bold mt-2">Arewa Visa Academy</p>
               </div>
               <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                  <form className="row g-4 text-start" onSubmit={handleFormSubmit}>
                     <div className="col-12 border-bottom pb-2 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><User size={18} /> Personal Profile</h6></div>
                     <div className="col-md-6 text-start"><label className="label-style">Full Name</label><input required name="name" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-md-6 text-start"><label className="label-style">Email Address</label><input required type="email" name="email" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-md-4 text-start"><label className="label-style">Gender</label><select required name="gender" onChange={handleChange} className="sky-input"><option value="">Select</option><option>Male</option><option>Female</option></select></div>
                     <div className="col-md-4 text-start"><label className="label-style">WhatsApp</label><input required name="whatsapp" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-md-4 text-start"><label className="label-style">NIN Number</label><input required name="nin" onChange={handleChange} className="sky-input" /></div>
                     
                     {/* Identity and Origin Section */}
                     <div className="col-12 border-bottom pb-2 mt-4 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><Globe size={18} /> Identity & Origin</h6></div>
                     <div className="col-md-4 text-start"><label className="label-style">Intl. Passport No (Optional)</label><input name="intlPassportNo" onChange={handleChange} className="sky-input" placeholder="A00000000" /></div>
                     <div className="col-md-4 text-start"><label className="label-style">State of Origin</label><input required name="stateOrigin" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-md-4 text-start"><label className="label-style">LGA of Origin</label><input required name="lgaOrigin" onChange={handleChange} className="sky-input" /></div>

                     {/* Residential Section */}
                     <div className="col-12 border-bottom pb-2 mt-4 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><MapPin size={18} /> Residential Address</h6></div>
                     <div className="col-md-6 text-start"><label className="label-style">State of Residence</label><input required name="stateResidence" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-md-6 text-start"><label className="label-style">LGA of Residence</label><input required name="lgaResidence" onChange={handleChange} className="sky-input" /></div>
                     <div className="col-12 text-start"><label className="label-style">Full Home Address</label><textarea required name="address" onChange={handleChange} className="sky-input" rows="2"></textarea></div>

                     <div className="col-12 border-bottom pb-2 mt-4 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><GraduationCap size={18} /> Education History</h6></div>
                     {qualifications.map((qual) => (
                       <div key={qual.id} className="col-12 p-4 bg-light rounded-4 border position-relative mb-2 text-start">
                          {qualifications.length > 1 && <button type="button" onClick={() => removeQualification(qual.id)} className="btn btn-link text-danger position-absolute top-0 end-0 p-2"><Trash2 size={18} /></button>}
                          <div className="row g-3">
                             <div className="col-md-4 text-start"><select required value={qual.type} onChange={(e) => handleQualificationChange(qual.id, "type", e.target.value)} className="sky-input"><option value="">Qualification</option><option>SSCE</option><option>ND</option><option>Degree</option><option>Master</option></select></div>
                             <div className="col-md-4 text-start"><input required placeholder="Institution" value={qual.institution} onChange={(e) => handleQualificationChange(qual.id, "institution", e.target.value)} className="sky-input" /></div>
                             <div className="col-md-4 text-start"><input required placeholder="Year" value={qual.year} onChange={(e) => handleQualificationChange(qual.id, "year", e.target.value)} className="sky-input" /></div>
                          </div>
                       </div>
                     ))}
                     <button type="button" onClick={addQualification} className="btn btn-outline-danger btn-sm rounded-pill w-auto ms-3 mt-2 font-black uppercase"><PlusCircle size={14} className="me-1"/> Add More</button>

                     <div className="col-12 border-bottom pb-2 mt-4 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><FileUp size={18} /> Upload Credentials (Optional)</h6></div>
                     <div className="col-md-12 text-start"><label className="label-style">CV / Academic Documents (PDF/JPG)</label><input type="file" name="resumeFile" onChange={handleFileChange} className="sky-input" accept=".pdf,.jpg,.jpeg,.png" /></div>

                     <div className="col-12 border-bottom pb-2 mt-4 text-start"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><ArrowRight size={18} /> Final Selection</h6></div>
                     <div className="col-md-12 text-start"><select required name="selectedCourseTitle" onChange={handleChange} className="sky-input font-black uppercase text-start"><option value="">-- Choose Course --</option>{coursesData?.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}</select></div>
                     <div className="col-md-6 text-start"><label className="label-style">Passport Photo</label><input required type="file" accept="image/*" onChange={handlePassportUpload} className="sky-input" /></div>
                     
                     <div className="col-12 mt-5 text-start">
                        <button type="submit" disabled={isSubmitting} className="btn btn-danger w-100 py-4 fw-black rounded-pill shadow-lg uppercase tracking-widest border-0">
                           {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Proceed to Payment"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .sky-input { width: 100%; padding: 0.9rem 1.2rem; background: #ffffff; border: 2px solid #eee; border-radius: 1rem; font-weight: 700; font-size: 0.8rem; outline: none; transition: all 0.3s; }
        .sky-input:focus { border-color: #dc3545; box-shadow: 0 10px 20px -10px rgba(220, 53, 69, 0.2); }
        .label-style { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999; margin-bottom: 5px; display: block; margin-left: 5px; }
        .fw-black { font-weight: 900; }
        .uppercase { text-transform: uppercase; }
      `}</style>
    </div>
  );
};

export default CourseApplicationForm;