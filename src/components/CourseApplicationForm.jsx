import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase";
import { ref as dbRef, push, set, onValue } from "firebase/database";
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
  const [isPortalOpen, setIsPortalOpen] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(true);
  const [generatedID, setGeneratedID] = useState("");
  const receiptRef = useRef(null);

  // --- DUKKAN FIELDS DINKA GUDA 14 SUNADAWO ---
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
    country: "",
    job: "",
    jobCountry: "",
    selectedCourseTitle: "",
    photoFile: null,
    passportFile: null,
    resumeFile: null,
    cvFile: null,
  });

  // --- PORTAL STATUS CHECK ---
  useEffect(() => {
    if (!showCourseForm) return;
    const portalStatusRef = dbRef(db, "settings/coursePortalStatus");
    const unsubscribe = onValue(
      portalStatusRef,
      (snapshot) => {
        const data = snapshot.val();
        setIsPortalOpen(data === null ? true : data);
        setLoadingPortal(false);
      },
      (error) => {
        setIsPortalOpen(true);
        setLoadingPortal(false);
      },
    );
    return () => unsubscribe();
  }, [showCourseForm]);

  // --- FILE UPLOAD LOGIC ---
  const uploadFile = async (file, path) => {
    const fileReference = storageRef(storage, path);
    await uploadBytes(fileReference, file);
    return getDownloadURL(fileReference);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      setApplicationData((prev) => ({ ...prev, photoFile: file }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // --- SUBMISSION LOGIC ---
  const handleSubmitApplication = async (formData, admissionID) => {
    try {
      const timestamp = Date.now();
      const applicantName = formData.name.replace(/\s+/g, "_");

      const [photoUrl, passportUrl, resumeUrl, cvUrl] = await Promise.all([
        formData.photoFile
          ? uploadFile(formData.photoFile, `apps/${timestamp}/photo`)
          : null,
        formData.passportFile
          ? uploadFile(formData.passportFile, `apps/${timestamp}/passport`)
          : null,
        formData.resumeFile
          ? uploadFile(formData.resumeFile, `apps/${timestamp}/resume`)
          : null,
        formData.cvFile
          ? uploadFile(formData.cvFile, `apps/${timestamp}/cv`)
          : null,
      ]);

      const newApplicationRef = push(dbRef(db, "applications"));
      await set(newApplicationRef, {
        ...formData,
        photoUrl,
        passportUrl,
        resumeUrl,
        cvUrl,
        status: "Pending Review",
        paymentStatus: "Paid",
        createdAt: new Date().toISOString(),
        admissionID: admissionID,
      });

      // WhatsApp Automation
      const adminNumber = "2347087244444";
      const message = `*NEW ADMISSION ALERT!*%0A%0A*Name:* ${formData.name}%0A*ID:* ${admissionID}%0A*Course:* ${formData.selectedCourseTitle}%0A*WhatsApp:* ${formData.whatsapp}%0A*Status:* PAID (₦5,000)`;
      window.open(
        `https://api.whatsapp.com/send?phone=${adminNumber}&text=${message}`,
        "_blank",
      );
    } catch (error) {
      console.error("Critical Submission Error:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (reference) => {
    setIsSubmitting(true);
    const admissionID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedID(admissionID);

    try {
      await handleSubmitApplication(
        {
          ...applicationData,
          amountPaid: 5000,
          paymentStatus: "Completed",
          paymentRef: reference.reference,
        },
        admissionID,
      );
      setIsSuccess(true);
      setShowPaymentStep(false);
    } catch (error) {
      alert("Submission Failed! Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PDF RECEIPT DOWNLOAD ---
  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    try {
      setIsSubmitting(true);
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        210,
        (canvas.height * 210) / canvas.width,
      );
      pdf.save(`AVA-RECEIPT-${generatedID}.pdf`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCourseForm) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 px-2 py-4"
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
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm"
          style={{ zIndex: 11000 }}
        >
          <X size={20} />
        </button>

        {loadingPortal ? (
          <div className="text-center py-5 bg-white">
            <Loader2 className="animate-spin mx-auto text-danger" size={40} />
            <p className="mt-2 fw-bold uppercase">Verifying Portal...</p>
          </div>
        ) : (
          <div className="card-body p-0 bg-white">
            {isSuccess ? (
              /* --- MODERN RECEIPT VIEW --- */
              <div
                ref={receiptRef}
                className="p-4 p-md-5 text-dark bg-white"
                style={{ border: "15px solid #1a1a1a" }}
              >
                <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <img src="/logo.png" alt="Logo" style={{ width: "60px" }} />
                    <div>
                      <h2 className="fw-black text-danger mb-0">
                        AREWA VISA ACADEMY
                      </h2>
                      <p className="small text-muted mb-0 fw-bold uppercase">
                        Admission Receipt
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold mb-0">ID: {generatedID}</h6>
                    <p className="small text-muted mb-0">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="row g-4 mb-4 mt-2 bg-light p-4 rounded-4 mx-0 border">
                  <div className="col-md-3 text-center">
                    <img
                      src={photoPreview}
                      alt="Student"
                      style={{
                        width: "140px",
                        height: "175px",
                        objectFit: "cover",
                      }}
                      className="rounded-3 border-4 border-white shadow"
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-black border-bottom border-danger border-opacity-25 pb-2 mb-3 uppercase tracking-tighter">
                      Candidate Profile
                    </h5>
                    <div className="small space-y-1 uppercase fw-bold text-dark">
                      <p className="mb-1">Name: {applicationData.name}</p>
                      <p className="mb-1">
                        Course: {applicationData.selectedCourseTitle}
                      </p>
                      <p className="mb-1 text-danger">
                        NIN: {applicationData.nin}
                      </p>
                      <p className="mb-1">
                        State/LGA: {applicationData.state},{" "}
                        {applicationData.lga}
                      </p>
                      <p className="mb-1">
                        Job: {applicationData.job || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-3 text-center border-start d-flex flex-column align-items-center justify-content-center">
                    <QRCodeSVG
                      value={`https://arewavisa.com/verify/${generatedID}`}
                      size={110}
                    />
                    <p className="x-small text-muted mt-2 fw-black">
                      VERIFY AUTHENTICITY
                    </p>
                  </div>
                </div>

                <div className="bg-dark p-4 rounded-4 text-white mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small mb-0 uppercase fw-bold text-emerald-400">
                      Payment Status
                    </p>
                    <h3 className="fw-black mb-0 text-white">
                      SUCCESSFUL (₦5,000)
                    </h3>
                  </div>
                  <ShieldCheck size={45} className="text-emerald-400" />
                </div>

                <div className="mt-5 text-center">
                  <button
                    onClick={downloadReceipt}
                    disabled={isSubmitting}
                    className="btn btn-danger px-5 py-3 rounded-pill fw-black shadow-lg d-flex align-items-center gap-2 mx-auto"
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
                    className="btn btn-link text-muted mt-3 fw-bold text-decoration-none"
                  >
                    FINISH
                  </button>
                </div>
              </div>
            ) : !showPaymentStep ? (
              /* --- FULL FORM VIEW (ALL FIELDS RESTORED) --- */
              <div className="row g-0">
                <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      style={{
                        width: "110px",
                        height: "145px",
                        objectFit: "cover",
                      }}
                      className="mx-auto rounded-3 border-3 border-white shadow-lg"
                    />
                  ) : (
                    <GraduationCap size={65} className="mx-auto opacity-75" />
                  )}
                  <h4 className="fw-black text-uppercase mt-3">
                    Admission Portal
                  </h4>
                </div>
                <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                  <form
                    className="row g-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowPaymentStep(true);
                    }}
                  >
                    {/* SECTION 1 */}
                    <div className="col-12 border-bottom pb-2">
                      <h6 className="fw-bold text-danger uppercase">
                        <User size={16} className="me-2" />
                        Personal Information
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
                        className="form-control"
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
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Gender</label>
                      <select
                        name="gender"
                        value={applicationData.gender}
                        onChange={handleChange}
                        className="form-select"
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
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={applicationData.whatsapp}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* SECTION 2 */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger uppercase">
                        <FileText size={16} className="me-2" />
                        Identity & Origin
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
                        className="form-control"
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
                        className="form-control"
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
                        className="form-control"
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
                        className="form-control"
                        required
                      />
                    </div>

                    {/* SECTION 3 */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger uppercase">
                        <Briefcase size={16} className="me-2" />
                        Career & Home
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
                        className="form-control"
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
                        className="form-control"
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
                        className="form-control"
                        rows="2"
                        required
                      ></textarea>
                    </div>

                    {/* SECTION 4 */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger uppercase">
                        <GraduationCap size={16} className="me-2" />
                        Course Selection
                      </h6>
                    </div>
                    <div className="col-12 mb-2">
                      <select
                        className="form-select py-2 fw-bold"
                        name="selectedCourseTitle"
                        value={applicationData.selectedCourseTitle}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Choose Course --</option>
                        {coursesData.map((c) => (
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
                        Other Credentials (Opt)
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
                        className="btn btn-warning w-100 py-3 fw-black rounded-pill shadow-lg text-uppercase tracking-widest border-0"
                      >
                        PROCEED TO PAYMENT{" "}
                        <ArrowRight size={20} className="ms-2" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* --- PAYMENT VIEW --- */
              <div className="p-4 p-md-5 text-center bg-white text-dark">
                <Wallet
                  size={55}
                  className="text-danger mb-3 mx-auto shadow-sm"
                />
                <h3 className="fw-black mb-1 uppercase tracking-tighter italic">
                  Tuition Payment
                </h3>
                <div className="py-4 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5 text-start shadow-sm">
                  <span className="text-muted small d-block fw-bold opacity-75 uppercase">
                    Processing Fee
                  </span>
                  <h2 className="display-4 fw-black text-danger mb-0">
                    ₦5,000
                  </h2>
                </div>
                <div className="payment-btn-container shadow-lg p-4 rounded-4 border bg-white mb-3">
                  <ApplyPayment
                    amount={5000}
                    email={applicationData.email}
                    onSuccessAction={handlePaymentSuccess}
                    isSubmitting={isSubmitting}
                  />
                </div>
                <button
                  onClick={() => setShowPaymentStep(false)}
                  className="btn btn-link text-muted mt-3 fw-bold text-decoration-none"
                >
                  Back to Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseApplicationForm;
