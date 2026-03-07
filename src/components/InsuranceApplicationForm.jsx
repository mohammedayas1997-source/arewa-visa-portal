import React from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  Wallet,
  User,
  Phone,
  FileText,
  MapPin,
  Globe,
  Camera,
} from "lucide-react";
import ApplyPayment from "./ApplyPayment";

const InsuranceApplicationForm = ({
  showInsuranceForm,
  setShowInsuranceForm,
  formData,
  setFormData,
  handleInsuranceApplication,
  uploading,
}) => {
  if (!showInsuranceForm) return null;

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const onPaymentSuccess = (reference) => {
    console.log("Payment Reference:", reference);
    handleInsuranceApplication();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 11000,
        padding: "10px", // Sarari don kada ya manne a gefen waya
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
        style={{
          maxWidth: "650px",
          maxHeight: "90vh", // Don ya bar sarari a sama da kasa a waya
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER SECTION - FIXED AT TOP */}
        <div className="p-3 p-md-4 bg-primary text-white d-flex justify-content-between align-items-center flex-shrink-0">
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <div className="bg-white p-2 rounded-circle shadow-sm">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h6
                className="fw-bold mb-0 text-uppercase tracking-wide"
                style={{ fontSize: "0.9rem" }}
              >
                Insurance & Clearance
              </h6>
              <small
                className="opacity-75 d-block"
                style={{ fontSize: "0.7rem" }}
              >
                Official Enrollment Portal
              </small>
            </div>
          </div>
          <button
            onClick={() => setShowInsuranceForm(false)}
            className="btn btn-link text-white p-0 shadow-none border-0"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORM BODY - SCROLLABLE */}
        <div className="p-3 p-md-5 bg-white text-dark text-start overflow-auto">
          <form onSubmit={(e) => e.preventDefault()} className="row g-3">
            {/* --- PERSONAL INFORMATION --- */}
            <div className="col-12 border-bottom pb-2 mb-2">
              <h6
                className="fw-bold text-primary d-flex align-items-center gap-2"
                style={{ fontSize: "0.85rem" }}
              >
                <User size={16} /> PERSONAL INFORMATION
              </h6>
            </div>

            <div className="col-12">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Full Names (As shown on Passport)
              </label>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-sm"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Email Address
              </label>
              <input
                type="email"
                className="form-control bg-light border-0 py-2 shadow-sm"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Phone (WhatsApp)
              </label>
              <input
                type="tel"
                className="form-control bg-light border-0 py-2 shadow-sm"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* --- ADDRESS & LOCATION --- */}
            <div className="col-12 border-bottom pb-2 mt-4 mb-2 text-uppercase">
              <h6
                className="fw-bold text-primary d-flex align-items-center gap-2"
                style={{ fontSize: "0.85rem" }}
              >
                <MapPin size={16} /> CONTACT & LOCATION
              </h6>
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                State of Origin
              </label>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-sm"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                LGA
              </label>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-sm"
                required
                value={formData.lga}
                onChange={(e) =>
                  setFormData({ ...formData, lga: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Full Residential Address
              </label>
              <textarea
                className="form-control bg-light border-0 shadow-sm"
                rows="2"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>

            {/* --- TRAVEL & INSURANCE DETAILS --- */}
            <div className="col-12 border-bottom pb-2 mt-4 mb-2">
              <h6
                className="fw-bold text-primary d-flex align-items-center gap-2"
                style={{ fontSize: "0.85rem" }}
              >
                <Globe size={16} /> TRAVEL & INSURANCE
              </h6>
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Passport Number
              </label>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 text-uppercase shadow-sm"
                required
                value={formData.passportNumber}
                onChange={(e) =>
                  setFormData({ ...formData, passportNumber: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Target Country
              </label>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-sm"
                placeholder="Country of travel"
                required
                value={formData.targetCountry}
                onChange={(e) =>
                  setFormData({ ...formData, targetCountry: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Insurance Type
              </label>
              <select
                className="form-select bg-light border-0 py-2 shadow-sm"
                required
                value={formData.insuranceType}
                onChange={(e) =>
                  setFormData({ ...formData, insuranceType: e.target.value })
                }
              >
                <option value="">Select Insurance Type</option>
                <option value="Work-Travel Insurance">
                  Work-Travel Insurance (Standard)
                </option>
                <option value="Health & Accident Premium">
                  Health & Accident Premium
                </option>
                <option value="Global Medical Clearance">
                  Global Medical Clearance
                </option>
              </select>
            </div>

            {/* --- UPLOADS --- */}
            <div className="col-12 border-bottom pb-2 mt-4 mb-2">
              <h6
                className="fw-bold text-primary d-flex align-items-center gap-2"
                style={{ fontSize: "0.85rem" }}
              >
                <Camera size={16} /> REQUIRED DOCUMENTS
              </h6>
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Passport Photo (Required)
              </label>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                className="form-control bg-light border-0 shadow-sm"
                required
                onChange={handleFileChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Int'l Passport Page (Optional)
              </label>
              <input
                type="file"
                name="passportFile"
                className="form-control bg-light border-0 shadow-sm"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-12">
              <label
                className="small fw-bold mb-1 text-muted text-uppercase"
                style={{ fontSize: "0.7rem" }}
              >
                Additional Information (Optional)
              </label>
              <textarea
                className="form-control bg-light border-0 shadow-sm"
                rows="2"
                placeholder="Any other details..."
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
              ></textarea>
            </div>

            {/* PAYMENT BOX */}
            <div className="col-12 mt-4">
              <div className="alert alert-primary d-flex align-items-center gap-3 py-3 rounded-4 border-0 shadow-sm mb-0">
                <div className="bg-white p-2 rounded-circle shadow-sm">
                  <Wallet className="text-primary" size={20} />
                </div>
                <div className="flex-grow-1">
                  <div
                    className="small opacity-75 text-uppercase fw-bold"
                    style={{ fontSize: "0.6rem" }}
                  >
                    Total Enrollment Fee
                  </div>
                  <div className="h4 fw-bold mb-0">₦300,000</div>
                </div>
              </div>
            </div>

            {/* PAYSTACK BUTTON CONTAINER */}
            <div className="col-12 mt-4 mb-3">
              <div className="p-1 p-md-2 border rounded-4 bg-light shadow-inner">
                <ApplyPayment
                  amount={300000}
                  email={formData.email || formData.phone + "@arewavisa.com"}
                  onSuccessAction={onPaymentSuccess}
                  isSubmitting={uploading}
                />
              </div>

              <div className="text-center mt-3 pb-3">
                <p
                  className="small text-muted mb-0 d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  <ShieldCheck size={14} className="text-success" />
                  Your payment is secured and encrypted.
                </p>
                {uploading && (
                  <div className="mt-2 text-primary small fw-bold animate-pulse">
                    <Loader2 size={14} className="me-1 d-inline animate-spin" />
                    Processing documents & syncing dashboard...
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsuranceApplicationForm;
