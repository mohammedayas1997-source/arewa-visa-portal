import React from "react";
import ApplyPayment from "./ApplyPayment"; // Shigo da payment component din
import {
  X,
  UserCheck,
  Loader2,
  CreditCard,
  Wallet,
  ArrowRight,
  CheckCircle,
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
  handleFinalPayment, // Wannan zai kira aikin Firebase bayan biya
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

  // Wannan zai kira aikin handleFinalPayment idan an biya 100k
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
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="card border-0 shadow-lg position-relative w-100"
        style={{ maxWidth: "1000px", borderRadius: "20px", overflow: "hidden" }}
      >
        <button
          onClick={() => {
            setShowForm(false);
            setIsSuccess(false);
            setShowPaymentStep(false);
            if (setPhotoPreview) setPhotoPreview(null);
          }}
          className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm"
          style={{ zIndex: 100 }}
        >
          <X size={20} />
        </button>

        <div className="row g-0">
          {/* SIDEBAR */}
          <div className="col-md-3 bg-danger p-4 text-white d-flex flex-column justify-content-center text-center">
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
              <UserCheck size={60} className="mx-auto mb-3" />
            )}
            <h4 className="fw-bold text-uppercase">
              {showPaymentStep ? "Fees Payment" : "Job Application"}
            </h4>
          </div>

          <div className="col-md-9 p-3 p-md-5 bg-white text-dark">
            {isSuccess ? (
              <div className="text-center py-5">
                <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                  <CheckCircle size={60} className="text-success" />
                </div>
                <h2 className="fw-bold">Application Received!</h2>
                <p>
                  Your job consultation request has been processed successfully.
                </p>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsSuccess(false);
                  }}
                  className="btn btn-dark px-5 py-2 rounded-pill mt-3"
                >
                  Close Portal
                </button>
              </div>
            ) : showPaymentStep ? (
              /* PAYMENT STEP */
              <div className="p-4 p-md-5 text-center">
                <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
                  <Wallet size={40} className="text-success" />
                </div>
                <h3 className="fw-bold mb-2 text-uppercase">
                  Consultation Fee
                </h3>
                <div className="py-3 px-4 bg-light rounded-4 mb-4 border-start border-success border-5">
                  <span className="text-muted small d-block">
                    Service Charge
                  </span>
                  <h2 className="display-6 fw-bold text-success mb-0">
                    ₦100,000
                  </h2>
                </div>

                <div className="alert alert-warning border-0 small text-start mb-4 shadow-sm">
                  <strong>Notice:</strong> This ₦100k covers your professional
                  job assessment and matching process.
                </div>

                {/* PAYSTACK API BUTTON */}
                <div className="p-2 border rounded-4 shadow-sm">
                  <ApplyPayment
                    amount={100000}
                    email={applicationData.email}
                    onSuccessAction={onPaymentSuccess}
                    isSubmitting={isSubmitting}
                  />
                </div>

                <button
                  onClick={() => setShowPaymentStep(false)}
                  className="btn btn-link text-muted fw-bold mt-3 text-decoration-none"
                >
                  Back to Form
                </button>
              </div>
            ) : (
              /* FORM STEP */
              <form
                className="row g-3 text-start"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowPaymentStep(true);
                }}
              >
                <div className="col-12 border-bottom pb-2 mb-2">
                  <h6 className="fw-bold text-danger">
                    Personal & Identity Details
                  </h6>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Passport Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={applicationData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="small fw-bold mb-1">Email Address</label>
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
                  <label className="small fw-bold mb-1">Target Country</label>
                  <select
                    name="country"
                    value={applicationData.country}
                    onChange={(e) => {
                      handleChange(e);
                      setIsOtherCountry(e.target.value === "Other");
                    }}
                    className="form-select"
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

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Job Category</label>
                  <select
                    name="job"
                    value={applicationData.job}
                    onChange={(e) => {
                      handleChange(e);
                      setIsOtherJob(e.target.value === "Other");
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {unskilledJobsList &&
                      unskilledJobsList.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    {skilledJobsList &&
                      skilledJobsList.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    <option value="Other">OTHER JOB</option>
                  </select>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow text-dark"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin d-inline me-2" />
                    ) : (
                      "PROCESS TO PAYMENT"
                    )}
                    <ArrowRight size={20} className="ms-2 d-inline" />
                  </button>
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
