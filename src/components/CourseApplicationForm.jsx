import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { ref, push, set, onValue } from "firebase/database"; // Mun kara onValue
import ApplyPayment from "./ApplyPayment";
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
  CreditCard,
  Wallet,
  CheckCircle,
  Lock, // Mun kara Lock icon
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
  const [isPortalOpen, setIsPortalOpen] = useState(true); // State na kulle portal
  const [loadingPortal, setLoadingPortal] = useState(true); // Loading status na portal

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

  // --- 1. DUBA STATUS DIN PORTAL DAGA FIREBASE ---
  useEffect(() => {
    const portalRef = ref(db, "settings/coursePortalStatus");
    const unsubscribe = onValue(portalRef, (snapshot) => {
      const data = snapshot.val();
      // Idan babu komai a database, mu bar shi a true (open)
      setIsPortalOpen(data === null ? true : data);
      setLoadingPortal(false);
    });

    return () => unsubscribe();
  }, []);

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
        alert("The image is too large! Please ensure it is not more than 2MB.");
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

  const handleSubmitApplication = async (formData) => {
    try {
      const timestamp = Date.now();
      const applicantName = formData.name.replace(/\s+/g, "_");

      const [photoUrl, passportUrl, resumeUrl, cvUrl] = await Promise.all([
        uploadFile(
          formData.photoFile,
          `applications/${timestamp}_${applicantName}/photo`,
        ),
        uploadFile(
          formData.passportFile,
          `applications/${timestamp}_${applicantName}/passport`,
        ),
        uploadFile(
          formData.resumeFile,
          `applications/${timestamp}_${applicantName}/resume`,
        ),
        uploadFile(
          formData.cvFile,
          `applications/${timestamp}_${applicantName}/cv`,
        ),
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
        admissionID: `AVA-${Math.floor(10000 + Math.random() * 90000)}`,
      });
    } catch (error) {
      console.error("Submission Error:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async () => {
    setIsSubmitting(true);
    const updatedData = {
      ...applicationData,
      amountPaid: 5000,
      paymentStatus: "Completed",
      type: "Course Application",
    };

    try {
      await handleSubmitApplication(updatedData);
      setIsSuccess(true);
      setShowPaymentStep(false);
      setTimeout(() => {
        window.print();
      }, 1000);
    } catch (error) {
      alert("Application failed. Please contact support.");
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
      <div
        className="card border-0 shadow-lg w-100 mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        {/* --- BUTTON NA RUFEWA --- */}
        <button
          onClick={() => setShowCourseForm(false)}
          className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm"
          style={{ zIndex: 11000 }}
        >
          <X size={20} />
        </button>

        {loadingPortal ? (
          <div className="text-center py-5 bg-white rounded-4">
            <Loader2 className="animate-spin mx-auto text-danger" size={40} />
            <p className="mt-2 fw-bold">Checking Portal Status...</p>
          </div>
        ) : !isPortalOpen ? (
          /* --- SAKON IDAN PORTAL A KULLE YAKE --- */
          <div className="text-center py-5 bg-white rounded-4 px-4">
            <div className="bg-danger bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
              <Lock size={60} className="text-danger" />
            </div>
            <h2 className="fw-bold text-dark">Portal Closed</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "500px" }}>
              Admission for the current session is currently closed. Please
              check back later or contact the Arewa Visa Academy support team
              for more information.
            </p>
            <button
              onClick={() => setShowCourseForm(false)}
              className="btn btn-danger px-5 py-2 rounded-pill mt-3 fw-bold"
            >
              Back to Home
            </button>
          </div>
        ) : isSuccess ? (
          /* --- SUCCESS SCREEN --- */
          <div className="text-center py-5 bg-white rounded-4">
            <CheckCircle size={60} className="text-success mb-4 mx-auto" />
            <h2 className="fw-bold">Success!</h2>
            <p>Your application and payment have been received.</p>
            <button
              onClick={() => {
                setShowCourseForm(false);
                setIsSuccess(false);
              }}
              className="btn btn-dark px-5 py-2 rounded-pill mt-3"
            >
              Close
            </button>
          </div>
        ) : !showPaymentStep ? (
          /* --- FORM SCREEN --- */
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
            <div className="col-md-9 p-4 p-md-5 bg-white">
              <form
                className="row g-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowPaymentStep(true);
                }}
              >
                <div className="col-12 mb-2 border-bottom pb-2">
                  <h6 className="fw-bold text-danger">Upload Documents</h6>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Passport Photo
                  </label>
                  <input
                    type="file"
                    name="photoFile"
                    className="form-control"
                    accept="image/*"
                    required
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Full Name</label>
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
                  <label className="form-label fw-bold small">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Select Course (12 Available)
                  </label>
                  <select
                    className="form-select"
                    name="selectedCourseTitle"
                    value={applicationData.selectedCourseTitle}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Course --</option>
                    {coursesData.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-bold small">
                    Passport Data Page
                  </label>
                  <input
                    type="file"
                    name="passportFile"
                    className="form-control"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Resume</label>
                  <input
                    type="file"
                    name="resumeFile"
                    className="form-control"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">CV</label>
                  <input
                    type="file"
                    name="cvFile"
                    className="form-control"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 fw-bold rounded-pill"
                  >
                    PROCEED TO PAYMENT <ArrowRight size={20} className="ms-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* --- PAYMENT SCREEN --- */
          <div className="p-4 p-md-5 text-center bg-white rounded-4">
            <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
              <Wallet size={45} className="text-danger" />
            </div>
            <h3 className="fw-bold mb-1">Payment Gateway</h3>
            <p className="text-muted">
              Pay for: <strong>{applicationData.selectedCourseTitle}</strong>
            </p>
            <div className="py-3 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5">
              <span className="text-muted small d-block">Application Fee</span>
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
              Back to Form Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseApplicationForm;
