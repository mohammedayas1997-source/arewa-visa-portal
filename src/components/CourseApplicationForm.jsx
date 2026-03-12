import React, { useState, useEffect, useRef } from "react";
import { db, storage, firestore } from "../firebase";
import { ref, push, set, onValue } from "firebase/database";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import ApplyPayment from "./ApplyPayment";
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
  CheckCircle,
  Lock,
  User,
  MapPin,
  FileText,
  Printer,
  Download,
  Briefcase,
  Globe,
  Calendar,
  ShieldCheck,
  Check,
} from "lucide-react";

const CourseApplicationForm = ({
  showCourseForm,
  setShowCourseForm,
  coursesData,
}) => {
  // --- STATES ---
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [generatedID, setGeneratedID] = useState("");
  const [applicationDocId, setApplicationDocId] = useState("");
  const receiptRef = useRef(null);

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    nin: "",
    passportNo: "",
    whatsapp: "",
    state: "",
    lga: "",
    residenceCountry: "Nigeria",
    address: "",
    job: "",
    jobCountry: "",
    selectedCourseTitle: "",
    photoFile: null,
    resumeFile: null,
  });

  // --- FUNCTIONS ---
  const uploadFile = async (file, path) => {
    const fRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      setApplicationData((prev) => ({ ...prev, photoFile: file }));
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

  // --- STEP 1: INITIAL SUBMISSION (PENDING PAYMENT) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!applicationData.photoFile)
      return alert("Please upload your passport photo.");

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();

      // Upload Photo
      const photoUrl = await uploadFile(
        applicationData.photoFile,
        `apps/${timestamp}/photo`
      );
      
      let resumeUrl = "";
      if (applicationData.resumeFile) {
        resumeUrl = await uploadFile(
          applicationData.resumeFile,
          `apps/${timestamp}/resume`
        );
      }

      // Removing file objects before Firestore storage
      const { photoFile, resumeFile, ...cleanData } = applicationData;

      const docRef = await addDoc(collection(firestore, "applications"), {
        ...cleanData,
        photoUrl,
        resumeUrl,
        status: "Pending Payment",
        paymentStatus: "Unpaid",
        appliedAt: serverTimestamp(),
      });

      setApplicationDocId(docRef.id);
      setShowPaymentStep(true);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Submission Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STEP 2: UPDATE AFTER PAYMENT SUCCESS ---
  const handlePaymentSuccess = async (reference) => {
    setIsSubmitting(true);
    try {
      const admissionID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedID(admissionID);

      const appRef = doc(firestore, "applications", applicationDocId);
      await updateDoc(appRef, {
        admissionID: admissionID,
        paymentRef: reference?.reference || reference,
        paymentStatus: "Paid",
        status: "Paid",
        paidAt: serverTimestamp(),
      });

      // Open WhatsApp
      const adminWhatsApp = "2348165372359";
      const message = `*NEW ADMISSION PAID*%0A%0A*ID:* ${admissionID}%0A*Name:* ${applicationData.name}%0A*Program:* ${applicationData.selectedCourseTitle}`;
      window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, "_blank");

      // CRITICAL: This line hides the payment button and shows the receipt
      setIsSuccess(true); 
      setShowPaymentStep(false);

    } catch (error) {
      alert("Database Update Failed but Payment was successful.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    try {
      setIsSubmitting(true);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`AVA-RECEIPT-${generatedID}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCourseForm) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 px-2 py-4 shadow-lg" style={{ zIndex: 10000, backgroundColor: "rgba(0,0,0,0.92)", overflowY: "auto", display: "block" }}>
      <div className="card border-0 w-100 mx-auto" style={{ maxWidth: "900px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
        <button onClick={() => { setShowCourseForm(false); setIsSuccess(false); }} className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm d-print-none" style={{ zIndex: 11000 }}><X size={20} /></button>

        <div className="card-body p-0 bg-white">
          {isSuccess ? (
            /* --- RECEIPT VIEW --- */
            <div ref={receiptRef} className="p-4 p-md-5 text-dark text-start bg-white" style={{ border: "15px solid #1a1a1a" }}>
              <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4 text-uppercase">
                <div className="d-flex align-items-center gap-3">
                  <img src="/logo.png" alt="Logo" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
                  <div>
                    <h2 className="fw-black text-danger mb-0 uppercase" style={{ fontSize: "1.8rem" }}>AREWA VISA ACADEMY</h2>
                    <p className="small text-muted mb-0 fw-bold uppercase" style={{ fontSize: "10px" }}>Excellence in Global Immigration & Education</p>
                  </div>
                </div>
                <div className="text-end">
                  <h6 className="fw-bold mb-0 text-uppercase">ADMISSION ID: {generatedID}</h6>
                  <p className="small text-muted mb-0 font-monospace">DATE: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="row g-4 mb-4 mt-2 bg-light p-4 rounded-4 mx-0 border">
                <div className="col-md-3"><img src={photoPreview} alt="Student" style={{ width: "150px", height: "185px", objectFit: "cover" }} className="rounded-3 shadow-lg" /></div>
                <div className="col-md-6">
                  <h5 className="fw-black border-bottom border-danger border-opacity-25 pb-2 mb-3 text-uppercase">Candidate Profile</h5>
                  <table className="table table-sm table-borderless uppercase small">
                    <tbody>
                      <tr><td className="fw-bold">Full Name:</td><td>{applicationData.name}</td></tr>
                      <tr><td className="fw-bold">Program:</td><td className="text-danger">{applicationData.selectedCourseTitle}</td></tr>
                      <tr><td className="fw-bold">NIN:</td><td>{applicationData.nin}</td></tr>
                      <tr><td className="fw-bold">WhatsApp:</td><td>{applicationData.whatsapp}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-3 text-center border-start">
                  <QRCodeSVG value={`https://arewavisa.com/verify/${generatedID}`} size={110} includeMargin={true} />
                  <p className="mt-2 fw-bold uppercase" style={{ fontSize: "8px" }}>Verify Authenticity</p>
                </div>
              </div>

              <div className="bg-dark p-4 rounded-4 text-white d-flex justify-content-between align-items-center mb-4 shadow-lg">
                <div><h3 className="fw-black mb-0">PAID: ₦5,000.00</h3><p className="small text-muted mb-0 uppercase tracking-widest">Status: Payment Verified Successful</p></div>
                <ShieldCheck size={45} className="text-success" />
              </div>

              <div className="mt-5 d-flex gap-3 justify-content-center d-print-none">
                <button onClick={downloadReceipt} disabled={isSubmitting} className="btn btn-danger px-5 py-3 rounded-pill fw-black d-flex align-items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} PDF DOWNLOAD
                </button>
                <button onClick={() => window.location.reload()} className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold">FINISH</button>
              </div>
            </div>
          ) : !showPaymentStep ? (
            /* --- FULL APPLICATION FORM --- */
            <div className="row g-0">
              <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                {photoPreview ? <img src={photoPreview} className="mx-auto mb-3 border border-3 border-white rounded-3 shadow-lg" style={{ width: "110px", height: "145px", objectFit: "cover" }} /> : <GraduationCap size={65} className="mx-auto mb-3 opacity-75" />}
                <h4 className="fw-black text-uppercase tracking-tighter">Admission Portal</h4>
              </div>
              <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                <form className="row g-3" onSubmit={handleFormSubmit}>
                  {/* PERSONAL */}
                  <div className="col-12 border-bottom pb-2"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><User size={16}/> Personal Information</h6></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Full Name</label><input type="text" name="name" value={applicationData.name} onChange={handleChange} className="form-control shadow-none" required /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Email</label><input type="email" name="email" value={applicationData.email} onChange={handleChange} className="form-control shadow-none" required /></div>
                  <div className="col-md-4"><label className="form-label small fw-bold">Gender</label><select name="gender" value={applicationData.gender} onChange={handleChange} className="form-select shadow-none" required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                  <div className="col-md-4"><label className="form-label small fw-bold">Age</label><input type="number" name="age" value={applicationData.age} onChange={handleChange} className="form-control shadow-none" required /></div>
                  <div className="col-md-4"><label className="form-label small fw-bold">WhatsApp</label><input type="tel" name="whatsapp" value={applicationData.whatsapp} onChange={handleChange} className="form-control shadow-none" required /></div>

                  {/* IDENTITY */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><FileText size={16}/> Identity & Origin</h6></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">NIN Number</label><input type="text" name="nin" value={applicationData.nin} onChange={handleChange} className="form-control shadow-none" required /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Passport No (Optional)</label><input type="text" name="passportNo" value={applicationData.passportNo} onChange={handleChange} className="form-control shadow-none" /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">State of Origin</label><input type="text" name="state" value={applicationData.state} onChange={handleChange} className="form-control shadow-none" required /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">LGA</label><input type="text" name="lga" value={applicationData.lga} onChange={handleChange} className="form-control shadow-none" required /></div>

                  {/* CAREER */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><Briefcase size={16}/> Career & Home</h6></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Occupation</label><input type="text" name="job" value={applicationData.job} onChange={handleChange} className="form-control shadow-none" /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Job Country</label><input type="text" name="jobCountry" value={applicationData.jobCountry} onChange={handleChange} className="form-control shadow-none" /></div>
                  <div className="col-12"><label className="form-label small fw-bold">Full Address</label><textarea name="address" value={applicationData.address} onChange={handleChange} className="form-control shadow-none" rows="2" required></textarea></div>

                  {/* SELECTION */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2"><GraduationCap size={16}/> Program Selection</h6></div>
                  <div className="col-12"><select className="form-select py-2 shadow-none" name="selectedCourseTitle" value={applicationData.selectedCourseTitle} onChange={handleChange} required><option value="">-- Choose Course --</option>{coursesData?.map((c) => (<option key={c.id} value={c.title}>{c.title}</option>))}</select></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Passport Photo</label><input type="file" className="form-control shadow-none" accept="image/*" onChange={handlePhotoChange} required /></div>
                  <div className="col-md-6"><label className="form-label small fw-bold">Credentials (Optional)</label><input type="file" name="resumeFile" className="form-control shadow-none" onChange={handleFileChange} /></div>

                  <div className="col-12 mt-4">
                    <button type="submit" disabled={isSubmitting} className="btn btn-warning w-100 py-3 fw-black rounded-pill shadow-lg text-uppercase tracking-widest border-0">
                      {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : <>PROCEED TO PAYMENT <ArrowRight size={20} className="ms-2" /></>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* --- PAYMENT STEP --- */
            <div className="p-4 p-md-5 text-center bg-white text-dark animate__animated animate__zoomIn">
              <Wallet size={55} className="text-danger mb-3 mx-auto" />
              <h3 className="fw-black mb-1 uppercase tracking-tighter">Tuition Payment</h3>
              <p className="text-muted">Enrollment for: <strong className="text-danger">{applicationData.name}</strong></p>
              <div className="py-4 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5 text-start shadow-sm">
                <span className="text-muted small d-block fw-bold opacity-75 uppercase">Processing Fee</span>
                <h2 className="display-4 fw-black text-danger mb-0">₦5,000</h2>
              </div>
              <div className="payment-btn-container shadow-lg p-4 rounded-4 border bg-white mb-3">
                <ApplyPayment amount={5000} email={applicationData.email} onSuccessAction={handlePaymentSuccess} isSubmitting={isSubmitting} />
              </div>
              {!isSubmitting && <button onClick={() => setShowPaymentStep(false)} className="btn btn-link text-muted mt-3 fw-bold text-decoration-none uppercase small">Back to Review</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseApplicationForm;