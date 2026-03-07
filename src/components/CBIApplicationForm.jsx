import React, { useState } from "react";
import {
  X,
  Globe,
  Send,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Wallet,
  Printer,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import ApplyPayment from "./ApplyPayment";
import { QRCodeSVG } from "qrcode.react";

const CBIApplicationForm = ({
  showCBIForm,
  setShowCBIForm,
  handleCBISubmit, // Wannan function din dake Home.jsx zai tura data zuwa Firebase
}) => {
  // --- STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [generatedID, setGeneratedID] = useState("");

  const [cbiData, setCbiData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    targetCountry: "",
    programCategory: "",
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCbiData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Bayan an gama biya lafiya
  const handlePaymentSuccess = async (reference) => {
    setIsSubmitting(true);
    const applicationID = `CBI-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedID(applicationID);

    const finalData = {
      ...cbiData,
      applicationID: applicationID,
      paymentRef: reference.reference,
      amountPaid: 10000,
      status: "Processing",
      createdAt: new Date().toISOString(),
      type: "CBI Application",
    };

    try {
      // Tura bayanan zuwa Firebase (Admin Dashboard)
      await handleCBISubmit(finalData);
      setIsSuccess(true);
      setShowPaymentStep(false);
    } catch (error) {
      alert(
        "Submission failed. Contact support with Ref: " + reference.reference,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCBIForm) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(5px)",
      }}
    >
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cbi-receipt, #cbi-receipt * { visibility: visible; }
          #cbi-receipt { position: absolute; left: 0; top: 0; width: 100%; }
          .d-print-none { display: none !important; }
        }
      `}</style>

      <div
        className="modal-content border-0 shadow-lg bg-white overflow-hidden"
        style={{
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          borderRadius: "24px",
        }}
      >
        {/* HEADER */}
        <div className="p-4 bg-dark text-white d-flex justify-content-between align-items-center d-print-none">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-warning p-2 rounded-circle">
              <Globe size={24} className="text-dark" />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-uppercase">
                Global Citizenship
              </h5>
              <small className="opacity-75">
                Residency by Investment Portal
              </small>
            </div>
          </div>
          <button
            onClick={() => setShowCBIForm(false)}
            className="btn btn-link text-white p-0 border-0 shadow-none"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-4 p-md-5">
          {isSuccess ? (
            /* --- PROFESSIONAL RECEIPT --- */
            <div id="cbi-receipt" className="text-dark">
              <div className="text-center border-bottom pb-4 mb-4">
                <Globe size={50} className="text-warning mb-2" />
                <h3 className="fw-bold">AREWA VISA ACADEMY</h3>
                <p className="small text-muted mb-0">
                  Citizenship & Investment Division
                </p>
                <div className="mt-2">
                  <span className="badge bg-success px-3 py-2 rounded-pill">
                    OFFICIAL CONSULTATION RECEIPT
                  </span>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-8">
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-muted small">APPLICANT:</td>
                        <td className="fw-bold">
                          {cbiData.name.toUpperCase()}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted small">PROGRAM:</td>
                        <td className="fw-bold">{cbiData.programCategory}</td>
                      </tr>
                      <tr>
                        <td className="text-muted small">TARGET:</td>
                        <td className="fw-bold text-danger">
                          {cbiData.targetCountry}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted small">REF ID:</td>
                        <td className="fw-bold">{generatedID}</td>
                      </tr>
                      <tr>
                        <td className="text-muted small">PAYMENT:</td>
                        <td className="fw-bold text-success">PAID (₦10,000)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-4 text-center border-start">
                  <QRCodeSVG
                    value={`https://arewavisa.online/verify/${generatedID}`}
                    size={100}
                  />
                  <p className="x-small text-muted mt-2 fw-bold">
                    SCAN TO VERIFY
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded-3">
                <p className="x-small mb-0 text-center italic">
                  This receipt confirms your initial consultation fee. Our
                  advisory team will contact you on WhatsApp ({cbiData.whatsapp}
                  ) within 24 hours.
                </p>
              </div>

              <div className="mt-5 text-center d-print-none d-flex gap-2 justify-content-center">
                <button
                  onClick={() => window.print()}
                  className="btn btn-dark px-4 py-2 rounded-pill d-flex align-items-center gap-2"
                >
                  <Printer size={18} /> Print Receipt
                </button>
                <button
                  onClick={() => setShowCBIForm(false)}
                  className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !showPaymentStep ? (
            /* --- FORM SECTION --- */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowPaymentStep(true);
              }}
            >
              <div className="row g-4">
                <div className="col-12 text-dark">
                  <label className="small fw-bold mb-1">Full Legal Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={cbiData.name}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="As seen on passport"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6 text-dark">
                  <label className="small fw-bold mb-1">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={cbiData.email}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6 text-dark">
                  <label className="small fw-bold mb-1">WhatsApp Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={cbiData.whatsapp}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 text-dark">
                  <label className="small fw-bold mb-1">Target Country</label>
                  <select
                    name="targetCountry"
                    value={cbiData.targetCountry}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">Choose Country...</option>
                    {[
                      "Antigua & Barbuda",
                      "Dominica",
                      "Grenada",
                      "St Kitts & Nevis",
                      "St. Lucia",
                      "Türkiye",
                      "Vanuatu",
                      "Malta",
                      "Portugal",
                      "Canada",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 text-dark">
                  <label className="small fw-bold mb-1">Program Category</label>
                  <select
                    name="programCategory"
                    value={cbiData.programCategory}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">Select Program...</option>
                    <option value="Global Citizenship">
                      Global Citizenship
                    </option>
                    <option value="Second Citizenship">
                      Second Citizenship
                    </option>
                    <option value="Foreign Residency">Foreign Residency</option>
                    <option value="Golden Visas">Golden Visas</option>
                  </select>
                </div>

                <div className="col-12 text-dark">
                  <label className="small fw-bold mb-1">
                    Additional Info (Optional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={cbiData.additionalInfo}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    rows="3"
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow d-flex align-items-center justify-content-center gap-2"
                  >
                    PROCEED TO CONSULTATION <Send size={20} />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* --- PAYMENT SECTION --- */
            <div className="text-center py-4 text-dark">
              <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
                <Wallet size={45} className="text-warning" />
              </div>
              <h3 className="fw-bold mb-1">Consultation Fee</h3>
              <p className="text-muted">
                Citizenship & Residency Investment Review
              </p>

              <div className="py-3 px-4 bg-light rounded-4 mb-4 border-start border-warning border-5 text-start">
                <span className="text-muted small d-block">Required Fee:</span>
                <h2 className="display-4 fw-bold text-dark mb-0">₦10,000</h2>
              </div>

              <div className="payment-btn-container shadow-sm p-3 rounded-4 border">
                <ApplyPayment
                  amount={10000}
                  email={cbiData.email}
                  onSuccessAction={handlePaymentSuccess}
                  isSubmitting={isSubmitting}
                />
              </div>
              <button
                onClick={() => setShowPaymentStep(false)}
                className="btn btn-link text-muted mt-3"
              >
                Edit Information
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CBIApplicationForm;
