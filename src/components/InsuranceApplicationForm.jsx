import React from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  Wallet,
  User,
  Phone,
  FileText,
  CheckCircle,
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

  // Function da zai kira ainihin aikin adana data idan biya yayi nasara
  const onPaymentSuccess = (reference) => {
    console.log("Payment Reference:", reference);
    handleInsuranceApplication(); // Wannan zai tura data zuwa Firebase
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 11000,
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 m-3"
        style={{ maxWidth: "550px", maxHeight: "95vh", overflowY: "auto" }}
      >
        {/* HEADER SECTION */}
        <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white p-2 rounded-circle shadow-sm">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-uppercase tracking-wide">
                Insurance & Clearance
              </h5>
              <small className="opacity-75 fw-bold">
                Official Enrollment Portal
              </small>
            </div>
          </div>
          <button
            onClick={() => setShowInsuranceForm(false)}
            className="btn btn-link text-white p-0 shadow-none border-0"
            type="button"
          >
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="p-4 p-md-5 bg-white text-dark">
          <div className="row g-3">
            {/* FULL NAME */}
            <div className="col-12 text-start">
              <label className="small fw-bold mb-1 text-muted uppercase">
                Full Names (As shown on Passport)
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  placeholder="Enter full legal name"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* EMAIL ADDRESS - Wannan yana da mahimmanci ga Paystack */}
            <div className="col-12 text-start">
              <label className="small fw-bold mb-1 text-muted uppercase">
                Email Address
              </label>
              <input
                type="email"
                className="form-control bg-light border-0 py-2"
                placeholder="example@mail.com"
                required
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="col-md-6 text-start">
              <label className="small fw-bold mb-1 text-muted uppercase">
                Phone Number
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  className="form-control bg-light border-0 py-2"
                  placeholder="+234..."
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PASSPORT NUMBER */}
            <div className="col-md-6 text-start">
              <label className="small fw-bold mb-1 text-muted uppercase">
                Passport Number
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FileText size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2 text-uppercase"
                  placeholder="A00000000"
                  required
                  value={formData.passportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, passportNumber: e.target.value })
                  }
                />
              </div>
            </div>

            {/* INSURANCE TYPE */}
            <div className="col-12 text-start mb-2">
              <label className="small fw-bold mb-1 text-muted uppercase">
                Insurance Category
              </label>
              <select
                className="form-select bg-light border-0 py-2"
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

            {/* PAYMENT BOX */}
            <div className="col-12">
              <div className="alert alert-primary d-flex align-items-center gap-3 py-3 rounded-4 border-0 shadow-sm mb-0">
                <div className="bg-white p-2 rounded-circle">
                  <Wallet className="text-primary" size={24} />
                </div>
                <div className="flex-grow-1">
                  <div
                    className="small opacity-75 text-uppercase fw-bold"
                    style={{ fontSize: "10px" }}
                  >
                    Total Enrollment Fee
                  </div>
                  <div className="h3 fw-bold mb-0">₦300,000</div>
                </div>
              </div>
            </div>

            {/* PAYSTACK BUTTON CONTAINER */}
            <div className="col-12 mt-4">
              <div className="p-2 border rounded-4 bg-light shadow-inner">
                <ApplyPayment
                  amount={300000}
                  email={formData.email || formData.phone + "@arewavisa.com"}
                  onSuccessAction={onPaymentSuccess}
                  isSubmitting={uploading}
                />
              </div>

              <div className="text-center mt-3">
                <p className="small text-muted mb-0 d-flex align-items-center justify-content-center gap-2">
                  <ShieldCheck size={16} className="text-success" />
                  Your payment is secured and encrypted.
                </p>
                {uploading && (
                  <div className="mt-2 text-primary small fw-bold animate-pulse">
                    <Loader2 size={16} className="me-1 d-inline animate-spin" />
                    Processing your clearance documents...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceApplicationForm;
