import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { ref, push, set, onValue } from "firebase/database";
import ApplyPayment from "./ApplyPayment";
import { QRCodeSVG } from "qrcode.react";
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
    const portalRef = ref(db, "settings/coursePortalStatus");
    const timeoutFallback = setTimeout(() => {
      if (loadingPortal) {
        setLoadingPortal(false);
        setIsPortalOpen(true);
      }
    }, 2000);

    const unsubscribe = onValue(
      portalRef,
      (snapshot) => {
        clearTimeout(timeoutFallback);
        const data = snapshot.val();
        setIsPortalOpen(data === null ? true : data);
        setLoadingPortal(false);
      },
      (error) => {
        clearTimeout(timeoutFallback);
        setIsPortalOpen(true);
        setLoadingPortal(false);
      },
    );

    return () => {
      unsubscribe();
      clearTimeout(timeoutFallback);
    };
  }, [showCourseForm]);

  // --- FUNCTIONS ---
  const uploadFile = async (file, path) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("The image is too large! Max 2MB.");
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

  const handleSubmitApplication = async (formData, admissionID) => {
    try {
      const timestamp = Date.now();
      const applicantName = formData.name.replace(/\s+/g, "_");

      const [photoUrl, passportUrl, resumeUrl, cvUrl] = await Promise.all([
        formData.photoFile
          ? uploadFile(
              formData.photoFile,
              `applications/${timestamp}_${applicantName}/photo`,
            )
          : null,
        formData.passportFile
          ? uploadFile(
              formData.passportFile,
              `applications/${timestamp}_${applicantName}/passport`,
            )
          : null,
        formData.resumeFile
          ? uploadFile(
              formData.resumeFile,
              `applications/${timestamp}_${applicantName}/resume`,
            )
          : null,
        formData.cvFile
          ? uploadFile(
              formData.cvFile,
              `applications/${timestamp}_${applicantName}/cv`,
            )
          : null,
      ]);

      const newApplicationRef = push(ref(db, "applications"));
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
    } catch (error) {
      console.error("Submission Error:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (reference) => {
    setIsSubmitting(true);
    const admissionID = `AVA-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedID(admissionID);

    const updatedData = {
      ...applicationData,
      amountPaid: 5000,
      paymentStatus: "Completed",
      paymentRef: reference.reference,
      type: "Course Application",
    };

    try {
      await handleSubmitApplication(updatedData, admissionID);
      setIsSuccess(true);
      setShowPaymentStep(false);
    } catch (error) {
      alert("Sync Error. Contact support with Ref: " + reference.reference);
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
        backgroundColor: "rgba(0,0,0,0.85)",
        overflowY: "auto",
        display: "block",
      }}
    >
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-receipt, #printable-receipt * { visibility: visible; }
            #printable-receipt { 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100%; 
              height: auto;
              border: none !important; 
              background: white !important;
            }
            .d-print-none { display: none !important; }
          }
        `}
      </style>

      <div
        className="card border-0 shadow-lg w-100 mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "40px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => {
            setShowCourseForm(false);
            setIsSuccess(false);
          }}
          className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm d-print-none"
          style={{ zIndex: 11000 }}
        >
          <X size={20} />
        </button>

        {loadingPortal ? (
          <div className="text-center py-5 bg-white">
            <Loader2 className="animate-spin mx-auto text-danger" size={40} />
            <p className="mt-2 fw-bold">Checking Portal Status...</p>
          </div>
        ) : !isPortalOpen ? (
          <div className="text-center py-5 bg-white px-4">
            <Lock size={60} className="text-danger mb-4 mx-auto" />
            <h2 className="fw-bold">Portal Closed</h2>
            <p className="text-muted">Admission is currently closed.</p>
            <button
              onClick={() => setShowCourseForm(false)}
              className="btn btn-danger px-5 py-2 rounded-pill mt-3 fw-bold"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="card-body p-0 bg-white">
            {isSuccess ? (
              /* --- RECEIPT VIEW (FULL CARD Mamaye dashi) --- */
              <div
                id="printable-receipt"
                className="p-4 p-md-5 text-dark text-start animate__animated animate__fadeIn"
              >
                <div className="d-flex justify-content-between align-items-center border-bottom border-3 border-danger pb-3 mb-4">
                  <div>
                    <h2 className="fw-bold text-danger mb-0">
                      AREWA VISA ACADEMY
                    </h2>
                    <p className="small text-muted mb-0 uppercase tracking-widest">
                      Official Enrollment Receipt
                    </p>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold mb-0">ID: {generatedID}</h6>
                    <p className="small text-muted mb-0">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-3 text-center text-md-start">
                    <div className="border border-2 p-1 rounded-3 d-inline-block shadow-sm">
                      <img
                        src={photoPreview}
                        alt="Student"
                        style={{
                          width: "140px",
                          height: "170px",
                          objectFit: "cover",
                        }}
                        className="rounded-2"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless mt-2">
                      <tbody>
                        <tr>
                          <td className="text-muted small py-1">NAME:</td>
                          <td className="fw-bold py-1 uppercase">
                            {applicationData.name}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted small py-1">COURSE:</td>
                          <td className="fw-bold py-1 text-danger uppercase">
                            {applicationData.selectedCourseTitle}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted small py-1">EMAIL:</td>
                          <td className="fw-bold py-1">
                            {applicationData.email}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted small py-1">NIN:</td>
                          <td className="fw-bold py-1">
                            {applicationData.nin}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted small py-1">STATE:</td>
                          <td className="fw-bold py-1">
                            {applicationData.state}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted small py-1">LGA:</td>
                          <td className="fw-bold py-1">
                            {applicationData.lga}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-3 text-center d-flex flex-column align-items-center justify-content-center border-start">
                    <QRCodeSVG
                      value={`https://arewavisa.com/verify/${generatedID}`}
                      size={110}
                      includeMargin={true}
                    />
                    <p className="x-small text-muted mt-2 fw-bold tracking-tighter">
                      SCAN TO VERIFY
                    </p>
                  </div>
                </div>

                <div className="alert alert-success border-0 rounded-4 py-3 mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="small mb-0 uppercase fw-bold opacity-75">
                        Payment Status
                      </p>
                      <h4 className="fw-bold mb-0">SUCCESSFUL (₦5,000)</h4>
                    </div>
                    <CheckCircle size={35} />
                  </div>
                </div>

                <div className="mt-4 border-top pt-3 text-center">
                  <p className="small text-muted italic">
                    This document serves as proof of application and payment.
                    Please present this during physical screening.
                  </p>
                  <div className="d-flex gap-2 justify-content-center mt-4 d-print-none">
                    <button
                      onClick={() => window.print()}
                      className="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                    >
                      <Printer size={18} /> DOWNLOAD RECEIPT
                    </button>
                    <button
                      onClick={() => {
                        setShowCourseForm(false);
                        setIsSuccess(false);
                      }}
                      className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            ) : !showPaymentStep ? (
              /* --- FORM VIEW --- */
              <div className="row g-0">
                <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mx-auto mb-3 border border-3 border-white shadow"
                      style={{
                        width: "100px",
                        height: "130px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <GraduationCap size={60} className="mx-auto mb-3" />
                  )}
                  <h4 className="fw-bold text-uppercase">Course Admission</h4>
                </div>
                <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                  <form
                    className="row g-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowPaymentStep(true);
                    }}
                  >
                    {/* PERSONAL DETAILS */}
                    <div className="col-12 border-bottom pb-2">
                      <h6 className="fw-bold text-danger">
                        <User size={16} className="me-2" />
                        Personal Details
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

                    {/* IDENTITY & LOCATION */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger">
                        <FileText size={16} className="me-2" />
                        Identity & Location
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
                      <label className="form-label small fw-bold">State</label>
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
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Home Address
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

                    {/* COURSE SELECTION */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger">
                        <GraduationCap size={16} className="me-2" />
                        Course Selection
                      </h6>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Select Course
                      </label>
                      <select
                        className="form-select"
                        name="selectedCourseTitle"
                        value={applicationData.selectedCourseTitle}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Choose Course --</option>
                        {coursesData.map((course) => (
                          <option key={course.id} value={course.title}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* UPLOADS */}
                    <div className="col-12 border-bottom pb-2 mt-4">
                      <h6 className="fw-bold text-danger">
                        <MapPin size={16} className="me-2" />
                        Documents
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Passport Photo (Required)
                      </label>
                      <input
                        type="file"
                        name="photoFile"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        ID Page (Optional)
                      </label>
                      <input
                        type="file"
                        name="passportFile"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        High Qualifications (Optional)
                      </label>
                      <input
                        type="file"
                        name="resumeFile"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        CV (Optional)
                      </label>
                      <input
                        type="file"
                        name="cvFile"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow"
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
                <Wallet size={45} className="text-danger mb-3 mx-auto" />
                <h3 className="fw-bold mb-1">Tuition Payment</h3>
                <p className="text-muted">
                  You are applying for:{" "}
                  <strong>{applicationData.selectedCourseTitle}</strong>
                </p>
                <div className="py-3 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5 text-start">
                  <span className="text-muted small d-block">
                    Admission Processing Fee
                  </span>
                  <h2 className="display-4 fw-bold text-danger mb-0">₦5,000</h2>
                </div>
                <div className="payment-btn-container shadow-sm p-3 rounded-4 border">
                  <ApplyPayment
                    amount={5000}
                    email={applicationData.email}
                    onSuccessAction={handlePaymentSuccess}
                    isSubmitting={isSubmitting}
                  />
                </div>
                <button
                  onClick={() => setShowPaymentStep(false)}
                  className="btn btn-link text-muted mt-3"
                >
                  Back to Review Form
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
