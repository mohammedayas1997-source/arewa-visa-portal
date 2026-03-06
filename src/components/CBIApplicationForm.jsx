import React, { useState } from "react";
import {
  X,
  Globe,
  Send,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";

const CBIApplicationForm = ({
  showCBIForm,
  setShowCBIForm,
  handleCBISubmit,
}) => {
  // --- STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Muna amfani da wadannan states din don karanto data daga form
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

  const onLocalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Wannan zai kira function din da yake cikin Home.jsx
      await handleCBISubmit(cbiData);
      setIsSuccess(true);
      // Bayan 3 seconds, mu rufe form din
      setTimeout(() => {
        setShowCBIForm(false);
        setIsSuccess(false);
        setCbiData({
          name: "",
          email: "",
          whatsapp: "",
          address: "",
          targetCountry: "",
          programCategory: "",
          additionalInfo: "",
        });
      }, 3000);
    } catch (error) {
      alert("Submission failed. Please try again.");
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
      <div
        className="modal-content border-0 shadow-lg bg-white"
        style={{
          maxWidth: "650px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          borderRadius: "24px",
        }}
      >
        {/* HEADER SECTION */}
        <div className="p-4 bg-dark text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-warning p-2 rounded-circle">
              <Globe size={24} className="text-dark" />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-uppercase tracking-wide">
                Global Citizenship
              </h5>
              <small className="opacity-75">
                Residency by Investment Portal
              </small>
            </div>
          </div>
          <button
            onClick={() => setShowCBIForm(false)}
            className="btn btn-link text-white p-0 shadow-none"
            type="button"
          >
            <X size={28} />
          </button>
        </div>

        {/* FORM SECTION */}
        <div className="p-4 p-md-5">
          {isSuccess ? (
            <div className="text-center py-5 animate__animated animate__zoomIn">
              <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                <CheckCircle size={60} className="text-success" />
              </div>
              <h3 className="fw-bold text-dark">Application Sent!</h3>
              <p className="text-muted">
                Our advisory team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onLocalSubmit}>
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
                      placeholder="Enter full name"
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
                      placeholder="example@mail.com"
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
                      placeholder="+234..."
                      required
                    />
                  </div>
                </div>

                <div className="col-12 text-dark">
                  <label className="small fw-bold mb-1">
                    Residential Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      name="address"
                      value={cbiData.address}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="Current City and Country"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6 text-dark">
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

                <div className="col-md-6 text-dark">
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
                    placeholder="Share any specific requirements..."
                    style={{ borderRadius: "12px" }}
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow d-flex align-items-center justify-content-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        {" "}
                        <Send size={20} /> SUBMIT CBI APPLICATION{" "}
                      </>
                    )}
                  </button>
                  <p className="text-center small text-muted mt-3">
                    Our professional advisory team will review your eligibility.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CBIApplicationForm;
