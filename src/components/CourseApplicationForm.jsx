import React, { useState, useEffect, useRef } from "react";
import { db, storage, firestore } from "../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot
} from "firebase/firestore";
import {
  Upload, CreditCard, Loader2, User, School, BookOpen, Download,
  MapPin, GraduationCap, Lock, PlusCircle, Trash2, ArrowRight,
  ShieldCheck, Wallet, FileUp, X as CloseIcon
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const CourseEnrollment = ({ showCourseForm, setShowCourseForm, coursesData }) => {
  const [step, setStep] = useState("form"); // "form", "payment", "success"
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [otherDocFile, setOtherDocFile] = useState(null);
  const [portalSettings, setPortalSettings] = useState({ isOpen: true });
  const [admissionID, setAdmissionID] = useState("");
  const receiptRef = useRef(null);
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", gender: "",
    stateOrigin: "", lgaOrigin: "", stateResidence: "",
    lgaResidence: "", residentialAddress: "", selectedCourse: "",
  });

  const [qualifications, setQualifications] = useState([
    { id: Date.now(), type: "", institution: "", course: "", year: "" },
  ]);

  // AUTO-SCROLL TO TOP ON STEP CHANGE
  useEffect(() => {
    if (showCourseForm && modalRef.current) {
      modalRef.current.scrollTo(0, 0);
    }
  }, [showCourseForm, step]);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "systemSettings", "admissionControl"), (snapshot) => {
      if (snapshot.exists()) setPortalSettings(snapshot.data());
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Max 2MB!");
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
    return getDownloadURL(snapshot.ref);
  };

  // STEP 1: UPLOAD AND CREATE PENDING RECORD
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!passportFile) return alert("Please upload your passport!");
    setLoading(true);

    try {
      const ts = Date.now();
      const photoUrl = await uploadFile(passportFile, `apps/${ts}/passport`);
      const cvUrl = cvFile ? await uploadFile(cvFile, `apps/${ts}/cv`) : "";
      
      const finalRecord = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        qualifications,
        photoUrl,
        cvUrl,
        status: "Pending Payment",
        paymentStatus: "Unpaid",
        appliedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, "applications"), finalRecord);
      setApplicationId(docRef.id);
      setStep("payment"); // MOVE TO PAYMENT SCREEN
    } catch (error) {
      alert("Submission Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: AUTOMATIC UPDATE AFTER PAYMENT
  const triggerPaystack = () => {
    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0", 
      email: formData.email,
      amount: 5000 * 100,
      callback: (response) => {
        // THIS CALLS AUTOMATICALLY ON SUCCESS
        handlePaymentSuccess(response.reference);
      },
      onClose: () => setLoading(false),
    });
    handler.openIframe();
  };

  const handlePaymentSuccess = async (reference) => {
    setLoading(true);
    try {
      const newID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
      setAdmissionID(newID);

      const appRef = doc(firestore, "applications", applicationId);
      await updateDoc(appRef, {
        status: "Paid",
        paymentStatus: "Paid",
        admissionID: newID,
        paymentRef: reference,
        paidAt: serverTimestamp(),
      });

      // NO REFRESH NEEDED - JUST CHANGE STATE
      setStep("success"); 
      
      // Notify Admin
      const msg = `*NEW ADMISSION PAID*%0A%0AID: ${newID}%0AName: ${formData.fullName}`;
      window.open(`https://wa.me/2348165372359?text=${msg}`, "_blank");

    } catch (error) {
      alert("Payment Successful! But we couldn't update the database. Please screenshot this!");
      setStep("success"); // Still show success so they can screenshot
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    setLoading(true);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`RECEIPT-${admissionID}.pdf`);
    } finally {
      setLoading(false);
    }
  };
    
  if (!showCourseForm) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 px-2 py-4 shadow-lg"
      style={{
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.92)",
        overflowY: "auto",
        display: "block",
      }}
    >
      <div
        className="card border-0 w-100 mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={() => {
            setShowCourseForm(false);
            setIsSuccess(false);
          }}
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm d-print-none"
          style={{ zIndex: 11000 }}
        >
          <X size={20} />
        </button>

        <div className="card-body p-0 bg-white">
          {isSuccess ? (
            /* --- RECEIPT VIEW --- */
            <div
              ref={receiptRef}
              className="p-4 p-md-5 text-dark text-start bg-white"
              style={{ border: "15px solid #1a1a1a" }}
            >
              <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4 text-uppercase">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <h2
                      className="fw-black text-danger mb-0 uppercase"
                      style={{ fontSize: "1.8rem" }}
                    >
                      AREWA VISA ACADEMY
                    </h2>
                    <p
                      className="small text-muted mb-0 fw-bold uppercase"
                      style={{ fontSize: "10px" }}
                    >
                      Excellence in Global Immigration & Education
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <h6 className="fw-bold mb-0 text-uppercase">
                    ADMISSION ID: {generatedID}
                  </h6>
                  <p className="small text-muted mb-0 font-monospace">
                    DATE: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="row g-4 mb-4 mt-2 bg-light p-4 rounded-4 mx-0 border">
                <div className="col-md-3">
                  <img
                    src={photoPreview}
                    alt="Student"
                    style={{
                      width: "150px",
                      height: "185px",
                      objectFit: "cover",
                    }}
                    className="rounded-3 shadow-lg"
                  />
                </div>
                <div className="col-md-6">
                  <h5 className="fw-black border-bottom border-danger border-opacity-25 pb-2 mb-3 text-uppercase">
                    Candidate Profile
                  </h5>
                  <table className="table table-sm table-borderless uppercase small">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Full Name:</td>
                        <td>{applicationData.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Program:</td>
                        <td className="text-danger">
                          {applicationData.selectedCourseTitle}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">NIN:</td>
                        <td>{applicationData.nin}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">WhatsApp:</td>
                        <td>{applicationData.whatsapp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-3 text-center border-start">
                  <QRCodeSVG
                    value={`https://arewavisa.com/verify/${generatedID}`}
                    size={110}
                    includeMargin={true}
                  />
                  <p
                    className="mt-2 fw-bold uppercase"
                    style={{ fontSize: "8px" }}
                  >
                    Verify Authenticity
                  </p>
                </div>
              </div>

              <div className="bg-dark p-4 rounded-4 text-white d-flex justify-content-between align-items-center mb-4 shadow-lg">
                <div>
                  <h3 className="fw-black mb-0">PAID: ₦5,000.00</h3>
                  <p className="small text-muted mb-0 uppercase tracking-widest">
                    Status: Payment Verified Successful
                  </p>
                </div>
                <ShieldCheck size={45} className="text-success" />
              </div>

              <div className="mt-5 d-flex gap-3 justify-content-center d-print-none">
                <button
                  onClick={downloadReceipt}
                  disabled={isSubmitting}
                  className="btn btn-danger px-5 py-3 rounded-pill fw-black d-flex align-items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Download size={20} />
                  )}{" "}
                  PDF DOWNLOAD
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold"
                >
                  FINISH
                </button>
              </div>
            </div>
          ) : !showPaymentStep ? (
            /* --- FULL APPLICATION FORM --- */
            <div className="row g-0">
              <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    className="mx-auto mb-3 border border-3 border-white rounded-3 shadow-lg"
                    style={{
                      width: "110px",
                      height: "145px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <GraduationCap
                    size={65}
                    className="mx-auto mb-3 opacity-75"
                  />
                )}
                <h4 className="fw-black text-uppercase tracking-tighter">
                  Admission Portal
                </h4>
              </div>
              <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                <form className="row g-3" onSubmit={handleFormSubmit}>
                  {/* PERSONAL */}
                  <div className="col-12 border-bottom pb-2">
                    <h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2">
                      <User size={16} /> Personal Information
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={applicationData.name}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={applicationData.email}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Gender</label>
                    <select
                      name="gender"
                      value={applicationData.gender}
                      onChange={handleChange}
                      className="form-select shadow-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={applicationData.age}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={applicationData.whatsapp}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>

                  {/* IDENTITY */}
                  <div className="col-12 border-bottom pb-2 mt-4">
                    <h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2">
                      <FileText size={16} /> Identity & Origin
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      NIN Number
                    </label>
                    <input
                      type="text"
                      name="nin"
                      value={applicationData.nin}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Passport No (Optional)
                    </label>
                    <input
                      type="text"
                      name="passportNo"
                      value={applicationData.passportNo}
                      onChange={handleChange}
                      className="form-control shadow-none"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      State of Origin
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={applicationData.state}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">LGA</label>
                    <input
                      type="text"
                      name="lga"
                      value={applicationData.lga}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      required
                    />
                  </div>

                  {/* CAREER */}
                  <div className="col-12 border-bottom pb-2 mt-4">
                    <h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2">
                      <Briefcase size={16} /> Career & Home
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="job"
                      value={applicationData.job}
                      onChange={handleChange}
                      className="form-control shadow-none"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Job Country
                    </label>
                    <input
                      type="text"
                      name="jobCountry"
                      value={applicationData.jobCountry}
                      onChange={handleChange}
                      className="form-control shadow-none"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={applicationData.address}
                      onChange={handleChange}
                      className="form-control shadow-none"
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  {/* SELECTION */}
                  <div className="col-12 border-bottom pb-2 mt-4">
                    <h6 className="fw-bold text-danger uppercase small d-flex align-items-center gap-2">
                      <GraduationCap size={16} /> Program Selection
                    </h6>
                  </div>
                  <div className="col-12">
                    <select
                      className="form-select py-2 shadow-none"
                      name="selectedCourseTitle"
                      value={applicationData.selectedCourseTitle}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Choose Course --</option>
                      {coursesData?.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Passport Photo
                    </label>
                    <input
                      type="file"
                      className="form-control shadow-none"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Credentials (Optional)
                    </label>
                    <input
                      type="file"
                      name="resumeFile"
                      className="form-control shadow-none"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-warning w-100 py-3 fw-black rounded-pill shadow-lg text-uppercase tracking-widest border-0"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin mx-auto" size={24} />
                      ) : (
                        <>
                          PROCEED TO PAYMENT{" "}
                          <ArrowRight size={20} className="ms-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* --- PAYMENT STEP --- */
            <div className="p-4 p-md-5 text-center bg-white text-dark animate__animated animate__zoomIn">
              <Wallet size={55} className="text-danger mb-3 mx-auto" />
              <h3 className="fw-black mb-1 uppercase tracking-tighter">
                Tuition Payment
              </h3>
              <p className="text-muted">
                Enrollment for:{" "}
                <strong className="text-danger">{applicationData.name}</strong>
              </p>
              <div className="py-4 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5 text-start shadow-sm">
                <span className="text-muted small d-block fw-bold opacity-75 uppercase">
                  Processing Fee
                </span>
                <h2 className="display-4 fw-black text-danger mb-0">₦5,000</h2>
              </div>
              <div className="payment-btn-container shadow-lg p-4 rounded-4 border bg-white mb-3">
                <ApplyPayment
                  amount={5000}
                  email={applicationData.email}
                  onSuccessAction={handlePaymentSuccess}
                  isSubmitting={isSubmitting}
                />
              </div>
              {!isSubmitting && (
                <button
                  onClick={() => setShowPaymentStep(false)}
                  className="btn btn-link text-muted mt-3 fw-bold text-decoration-none uppercase small"
                >
                  Back to Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseApplicationForm;
