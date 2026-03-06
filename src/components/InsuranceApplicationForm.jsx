import React from "react";
import { X, ShieldCheck, Loader2, Wallet } from "lucide-react";
import ApplyPayment from "./ApplyPayment"; // Shigo da payment component din

const InsuranceApplicationForm = ({
  showInsuranceForm,
  setShowInsuranceForm,
  formData,
  setFormData,
  handleInsuranceApplication, // Wannan zai adana data bayan biya
  uploading,
}) => {
  if (!showInsuranceForm) return null;

  // Wannan function din zai kira ainihin aikin adana data idan biya yayi nasara
  const onPaymentSuccess = (reference) => {
    console.log("Payment Reference:", reference);
    handleInsuranceApplication();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 11000,
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 p-4 w-100 m-3"
        style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-dark border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0 text-primary">Insurance & Clearance</h4>
            <small className="text-secondary fw-bold text-uppercase tracking-wider">
              Official Enrollment Portal
            </small>
          </div>
          <button
            onClick={() => setShowInsuranceForm(false)}
            className="btn-close shadow-none"
          ></button>
        </div>

        <div className="text-dark">
          {/* PERSONAL DETAILS */}
          <div className="mb-3 text-start">
            <label className="small fw-bold mb-1">
              Full Names (As shown on Passport)
            </label>
            <input
              type="text"
              className="form-control rounded-3 py-2"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="row mb-3 text-start">
            <div className="col-md-6">
              <label className="small fw-bold mb-1">Phone Number</label>
              <input
                type="tel"
                className="form-control rounded-3 py-2"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="small fw-bold mb-1">Passport Number</label>
              <input
                type="text"
                className="form-control rounded-3 text-uppercase py-2"
                required
                value={formData.passportNumber}
                onChange={(e) =>
                  setFormData({ ...formData, passportNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="small fw-bold mb-1">Insurance Type</label>
            <select
              className="form-select rounded-3 py-2"
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
            </select>
          </div>

          {/* PAYMENT BOX */}
          <div className="alert alert-primary d-flex align-items-center gap-2 py-3 rounded-4 shadow-sm border-0 mb-4">
            <div className="flex-grow-1">
              <div className="small opacity-75 text-uppercase">
                Total Enrollment Fee:
              </div>
              <div className="h4 fw-bold mb-0">₦300,000</div>
            </div>
            <ShieldCheck size={30} className="text-primary opacity-50" />
          </div>

          {/* PAYSTACK INTEGRATION */}
          <div className="p-2 border rounded-4 bg-light">
            <ApplyPayment
              amount={300000}
              email={formData.phone + "@arewavisa.com"} // Tunda baka sa email field ba, muna amfani da phone
              onSuccessAction={onPaymentSuccess}
              isSubmitting={uploading}
            />
          </div>

          <p className="text-center small text-muted mt-3">
            <Loader2 size={14} className="me-1 d-inline animate-spin" />
            Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceApplicationForm;
