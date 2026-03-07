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
  Loader2,
  FileText,
  Camera,
} from "lucide-react";

const CBIApplicationForm = ({
  showCBIForm,
  setShowCBIForm,
  handleCBISubmit,
}) => {
  // --- STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cbiData, setCbiData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    state: "",
    lga: "",
    address: "",
    targetCountry: "",
    programCategory: "",
    additionalInfo: "",
    photoFile: null,
    passportFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCbiData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCbiData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const onLocalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleCBISubmit(cbiData);
      setIsSuccess(true);

      setTimeout(() => {
        setShowCBIForm(false);
        setIsSuccess(false);
        setCbiData({
          name: "",
          email: "",
          whatsapp: "",
          state: "",
          lga: "",
          address: "",
          targetCountry: "",
          programCategory: "",
          additionalInfo: "",
          photoFile: null,
          passportFile: null,
        });
      }, 4000);
    } catch (error) {
      alert("Submission failed. Please check your connection.");
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
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: 11000,
        display: "flex",
        alignItems: "flex-start", // Yana ba da damar scroll a waya
        justifyContent: "center",
        padding: "10px",
        backdropFilter: "blur(8px)",
        overflowY: "auto", // Scroll a babban overlay
      }}
    >
      <div
        className="modal-content border-0 shadow-lg bg-white"
        style={{
          maxWidth: "750px",
          width: "100%",
          margin: "20px auto", // Don ya bar sarari a waya
          position: "relative",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER - FIXED AT TOP OF MODAL */}
        <div
          className="p-4 bg-dark text-white d-flex justify-content-between align-items-center sticky-top"
          style={{ zIndex: 10 }}
        >
          <div className="d-flex align-items-center gap-3 text-start">
            <div className="bg-warning p-2 rounded-circle shadow-sm">
              <Globe size={24} className="text-dark" />
            </div>
            <div>
              <h5
                className="fw-bold mb-0 text-uppercase tracking-wide"
                style={{ fontSize: "0.95rem" }}
              >
                Global Citizenship
              </h5>
              <small
                className="opacity-75 d-block"
                style={{ fontSize: "0.75rem" }}
              >
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
            <div className="text-center py-5 animate__animated animate__zoomIn">
              <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                <CheckCircle size={60} className="text-success" />
              </div>
              <h3 className="fw-bold text-dark">Application Submitted!</h3>
              <p className="text-muted">
                Your investment residency request has been sent to the admin
                dashboard. Our advisory team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onLocalSubmit}>
              <div className="row g-4 text-start">
                {/* PERSONAL INFORMATION */}
                <div className="col-12 border-bottom pb-2">
                  <h6 className="fw-bold text-warning uppercase small tracking-wider mb-0">
                    Personal Information
                  </h6>
                </div>

                <div className="col-12">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Full Legal Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={cbiData.name}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2 text-dark shadow-none"
                      placeholder="As shown on Passport"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={cbiData.email}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2 text-dark shadow-none"
                      placeholder="example@mail.com"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    WhatsApp Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={cbiData.whatsapp}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2 text-dark shadow-none"
                      placeholder="+234..."
                      required
                    />
                  </div>
                </div>

                {/* LOCATION DETAILS */}
                <div className="col-12 border-bottom pb-2 mt-2">
                  <h6 className="fw-bold text-warning uppercase small tracking-wider mb-0">
                    Location & Origin
                  </h6>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    State of Origin
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={cbiData.state}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2 text-dark shadow-none"
                    placeholder="State"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    LGA
                  </label>
                  <input
                    type="text"
                    name="lga"
                    value={cbiData.lga}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2 text-dark shadow-none"
                    placeholder="LGA"
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
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
                      className="form-control bg-light border-0 py-2 text-dark shadow-none"
                      placeholder="Current City and Country"
                      required
                    />
                  </div>
                </div>

                {/* PROGRAM DETAILS */}
                <div className="col-12 border-bottom pb-2 mt-2">
                  <h6 className="fw-bold text-warning uppercase small tracking-wider mb-0">
                    Investment Interest
                  </h6>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Target Country
                  </label>
                  <select
                    name="targetCountry"
                    value={cbiData.targetCountry}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2 text-dark shadow-none"
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

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Program Category
                  </label>
                  <select
                    name="programCategory"
                    value={cbiData.programCategory}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2 text-dark shadow-none"
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

                {/* UPLOADS */}
                <div className="col-12 border-bottom pb-2 mt-2">
                  <h6 className="fw-bold text-warning uppercase small tracking-wider mb-0">
                    Required Documents
                  </h6>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Passport Photo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Camera size={18} />
                    </span>
                    <input
                      type="file"
                      name="photoFile"
                      onChange={handleFileChange}
                      className="form-control bg-light border-0 py-2 shadow-none"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Passport Data Page
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <FileText size={18} />
                    </span>
                    <input
                      type="file"
                      name="passportFile"
                      onChange={handleFileChange}
                      className="form-control bg-light border-0 py-2 shadow-none"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label
                    className="small fw-bold mb-1 text-dark uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Additional Info (Optional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={cbiData.additionalInfo}
                    onChange={handleChange}
                    className="form-control bg-light border-0 text-dark shadow-none"
                    rows="3"
                    placeholder="Share any specific requirements..."
                  ></textarea>
                </div>

                <div className="col-12 mt-4 pb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={20} />
                        <span className="text-uppercase tracking-wider">
                          Submit CBI Application
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-center small text-muted mt-3 mb-0">
                    Arewa Visa Academy &copy; 2026
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
