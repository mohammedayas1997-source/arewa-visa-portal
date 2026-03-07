import React from "react";
import ApplyPayment from "./ApplyPayment";
import {
  X,
  UserCheck,
  Loader2,
  Wallet,
  ArrowRight,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileText,
} from "lucide-react";

const JobApplicationForm = ({
  showForm,
  setShowForm,
  showPaymentStep,
  setShowPaymentStep,
  isSuccess,
  setIsSuccess,
  photoPreview,
  setPhotoPreview,
  applicationData,
  handleChange,
  handlePhotoChange,
  handleFileChange,
  handleFinalPayment,
  isSubmitting,
  countriesList,
  unskilledJobsList,
  skilledJobsList,
  isOtherCountry,
  setIsOtherCountry,
  isOtherJob,
  setIsOtherJob,
}) => {
  if (!showForm) return null;

  const onPaymentSuccess = (reference) => {
    console.log("Job Consultation Payment Success:", reference);
    handleFinalPayment();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.85)",
        overflowY: "auto",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="card border-0 shadow-lg position-relative w-100"
        style={{ maxWidth: "900px", borderRadius: "24px", overflow: "hidden" }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            setShowForm(false);
            setIsSuccess(false);
            setShowPaymentStep(false);
            if (setPhotoPreview) setPhotoPreview(null);
          }}
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm d-print-none"
          style={{ zIndex: 100 }}
        >
          <X size={20} />
        </button>

        <div className="row g-0">
          {/* SIDEBAR - Optimized for Mobile */}
          <div className="col-md-3 bg-danger p-4 text-white d-flex flex-column justify-content-center text-center">
            <div className="mb-3">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mx-auto border border-3 border-white shadow-sm"
                  style={{
                    width: "110px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              ) : (
                <div className="bg-white bg-opacity-20 p-4 rounded-circle d-inline-block">
                  <UserCheck size={50} className="text-white" />
                </div>
              )}
            </div>
            <h5 className="fw-bold text-uppercase mb-0 tracking-wider">
              {showPaymentStep ? "Fee Payment" : "Job Portal"}
            </h5>
            <small className="opacity-75">Arewa Visa Academy</small>
          </div>

          {/* MAIN CONTENT AREA */}
          <div
            className="col-md-9 p-3 p-md-5 bg-white text-dark overflow-auto"
            style={{ maxHeight: "85vh" }}
          >
            {isSuccess ? (
              <div className="text-center py-5 animate__animated animate__fadeIn">
                <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                  <CheckCircle size={60} className="text-success" />
                </div>
                <h2 className="fw-bold">Application Received!</h2>
                <p className="text-muted">
                  Your job consultation request has been processed successfully.
                  Our team will contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsSuccess(false);
                  }}
                  className="btn btn-dark px-5 py-2 rounded-pill mt-3 shadow"
                >
                  Close Portal
                </button>
              </div>
            ) : showPaymentStep ? (
              /* PAYMENT STEP */
              <div className="p-2 p-md-4 text-center animate__animated animate__fadeIn">
                <div className="bg-light p-3 rounded-circle d-inline-block mb-3 text-success">
                  <Wallet size={45} />
                </div>
                <h3 className="fw-bold mb-1">CONSULTATION FEE</h3>
                <p className="text-muted small">
                  Professional Job Assessment & Match
                </p>

                <div className="py-4 px-4 bg-light rounded-4 mb-4 border-start border-success border-5 text-start shadow-sm">
                  <span className="text-muted small d-block fw-bold opacity-75">
                    TOTAL SERVICE CHARGE:
                  </span>
                  <h2 className="display-5 fw-bold text-success mb-0">
                    ₦100,000
                  </h2>
                </div>

                <div className="alert alert-warning border-0 small text-start mb-4 rounded-4 shadow-sm">
                  <strong>Notice:</strong> This fee covers your documentation,
                  professional profile assessment, and direct employer matching
                  process.
                </div>

                <div className="p-2 border rounded-4 shadow-sm bg-white">
                  <ApplyPayment
                    amount={100000}
                    email={applicationData.email}
                    onSuccessAction={onPaymentSuccess}
                    isSubmitting={isSubmitting}
                  />
                </div>

                <button
                  onClick={() => setShowPaymentStep(false)}
                  className="btn btn-link text-muted fw-bold mt-4 text-decoration-none"
                >
                  <ArrowRight size={16} className="rotate-180 me-1" /> Back to
                  Application Form
                </button>
              </div>
            ) : (
              /* FULL FORM STEP */
              <form
                className="row g-3 text-start"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowPaymentStep(true);
                }}
              >
                {/* PERSONAL SECTION */}
                <div className="col-12 border-bottom pb-2 mb-2 mt-2">
                  <h6 className="fw-bold text-danger d-flex align-items-center gap-2">
                    <User size={18} /> PERSONAL & IDENTITY
                  </h6>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Passport Photo (Required)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={applicationData.name}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    placeholder="As shown on ID"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={applicationData.whatsapp}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    placeholder="+234..."
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">NIN Number</label>
                  <input
                    type="text"
                    name="nin"
                    value={applicationData.nin}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Gender</label>
                  <select
                    name="gender"
                    value={applicationData.gender}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* LOCATION SECTION */}
                <div className="col-12 border-bottom pb-2 mt-4 mb-2">
                  <h6 className="fw-bold text-danger d-flex align-items-center gap-2">
                    <MapPin size={18} /> ADDRESS & ORIGIN
                  </h6>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">State of Origin</label>
                  <input
                    type="text"
                    name="state"
                    value={applicationData.state}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">LGA</label>
                  <input
                    type="text"
                    name="lga"
                    value={applicationData.lga}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="small fw-bold mb-1">Home Address</label>
                  <textarea
                    name="address"
                    value={applicationData.address}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    rows="2"
                    required
                  ></textarea>
                </div>

                {/* JOB SECTION */}
                <div className="col-12 border-bottom pb-2 mt-4 mb-2">
                  <h6 className="fw-bold text-danger d-flex align-items-center gap-2">
                    <Briefcase size={18} /> JOB PREFERENCE
                  </h6>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Target Country</label>
                  <select
                    name="country"
                    value={applicationData.country}
                    onChange={(e) => {
                      handleChange(e);
                      setIsOtherCountry(e.target.value === "Other");
                    }}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">-- Select Country --</option>
                    {countriesList &&
                      countriesList.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    <option value="Other">OTHER COUNTRY</option>
                  </select>
                </div>

                {isOtherCountry && (
                  <div className="col-md-6">
                    <label className="small fw-bold mb-1 text-danger">
                      Specify Country
                    </label>
                    <input
                      type="text"
                      name="otherCountry"
                      onChange={handleChange}
                      className="form-control border-danger py-2"
                      required
                    />
                  </div>
                )}

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Job Category</label>
                  <select
                    name="job"
                    value={applicationData.job}
                    onChange={(e) => {
                      handleChange(e);
                      setIsOtherJob(e.target.value === "Other");
                    }}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {unskilledJobsList &&
                      unskilledJobsList.map((j) => (
                        <option key={j} value={j}>
                          {j} (Unskilled)
                        </option>
                      ))}
                    {skilledJobsList &&
                      skilledJobsList.map((j) => (
                        <option key={j} value={j}>
                          {j} (Skilled)
                        </option>
                      ))}
                    <option value="Other">OTHER JOB</option>
                  </select>
                </div>

                {isOtherJob && (
                  <div className="col-md-12">
                    <label className="small fw-bold mb-1 text-danger">
                      Specify Job Type
                    </label>
                    <input
                      type="text"
                      name="otherJob"
                      onChange={handleChange}
                      className="form-control border-danger py-2"
                      required
                    />
                  </div>
                )}

                {/* UPLOAD SECTION */}
                <div className="col-12 border-bottom pb-2 mt-4 mb-2">
                  <h6 className="fw-bold text-danger d-flex align-items-center gap-2">
                    <FileText size={18} /> DOCUMENTS
                  </h6>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Passport ID Page (Optional)
                  </label>
                  <input
                    type="file"
                    name="passportFile"
                    onChange={handleFileChange}
                    className="form-control bg-light border-0"
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    CV / Resume (Optional)
                  </label>
                  <input
                    type="file"
                    name="cvFile"
                    onChange={handleFileChange}
                    className="form-control bg-light border-0"
                  />
                </div>

                <div className="col-12 mt-4 mb-2">
                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow shadow-warning text-dark border-0"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin d-inline me-2" />
                    ) : (
                      "PROCEED TO PAYMENT"
                    )}
                    <ArrowRight size={20} className="ms-2 d-inline" />
                  </button>
                  <p className="text-center x-small text-muted mt-3">
                    By clicking, you agree to our professional consultation
                    terms.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
