import React, { useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  Briefcase,
  PenTool,
  MapPin,
  CheckCircle,
  Globe,
  User,
  Hash,
  Navigation,
} from "lucide-react";

const ManpowerRequestForm = ({
  showManpowerForm,
  setShowManpowerForm,
  isSuccess,
  setIsSuccess,
  handleInitialSubmit,
  isOtherManpower,
  setIsOtherManpower,
}) => {
  // --- STATES ---
  const [manpowerData, setManpowerData] = useState({
    employerName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    postalCode: "",
    orgType: "",
    country: "",
    workerType: "",
    otherWorkerType: "",
    quantity: "1",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManpowerData((prev) => ({ ...prev, [name]: value }));

    if (name === "workerType") {
      setIsOtherManpower(value === "other");
    }
  };

  const onLocalSubmit = (e) => {
    e.preventDefault();
    handleInitialSubmit(manpowerData);
  };

  if (!showManpowerForm) return null;

  // --- FULL LIST OF WORKER CATEGORIES ---
  const workerCategories = [
    "Professional Cleaner",
    "Security Guard",
    "Executive Driver",
    "Construction Worker",
    "Warehouse Staff",
    "Hospitality/Hotel Staff",
    "Commercial Farm Hand",
    "House Help / Nanny",
    "Office Assistant",
    "Delivery Rider",
    "Sales Representative",
    "Factory Worker",
    "Maintenance Technician",
    "Nurse / Health Caregiver",
  ];

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4"
      style={{
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.9)",
        overflowY: "auto",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: "950px", borderRadius: "24px", overflow: "hidden" }}
      >
        <button
          onClick={() => {
            setShowManpowerForm(false);
            setIsSuccess(false);
          }}
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm"
          style={{ zIndex: 100 }}
        >
          <X size={20} />
        </button>

        <div className="row g-0">
          {/* SIDEBAR */}
          <div className="col-md-4 bg-success p-4 p-md-5 text-white text-center d-flex flex-column justify-content-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-circle d-inline-block mx-auto mb-4">
              <Building2 size={50} className="text-white" />
            </div>
            <h3 className="fw-bold text-uppercase tracking-tighter">
              Recruitment Portal
            </h3>
            <p className="small opacity-75">
              Official Manpower Request for International & Domestic Deployment.
            </p>
          </div>

          {/* FORM AREA */}
          <div
            className="col-md-8 p-4 p-md-5 bg-white text-dark text-start"
            style={{ maxHeight: "85vh", overflowY: "auto" }}
          >
            {isSuccess ? (
              <div className="text-center py-5 animate__animated animate__zoomIn">
                <CheckCircle size={80} className="text-success mb-4" />
                <h2 className="fw-bold">Request Logged!</h2>
                <p className="text-muted">
                  Your manpower requirement has been sent to our recruitment
                  dashboard.
                </p>
                <button
                  onClick={() => {
                    setShowManpowerForm(false);
                    setIsSuccess(false);
                  }}
                  className="btn btn-dark px-5 py-2 rounded-pill mt-3 shadow"
                >
                  Finish
                </button>
              </div>
            ) : (
              <form className="row g-3" onSubmit={onLocalSubmit}>
                {/* EMPLOYER IDENTITY */}
                <div className="col-12 border-bottom pb-2">
                  <h6 className="fw-bold text-success text-uppercase small tracking-widest d-flex align-items-center gap-2">
                    <User size={18} /> Employer Details
                  </h6>
                </div>

                <div className="col-md-12">
                  <label className="small fw-bold mb-1">
                    Company / Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Building2 size={16} />
                    </span>
                    <input
                      type="text"
                      name="employerName"
                      value={manpowerData.employerName}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="Full Legal Name"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={manpowerData.email}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="hr@org.com"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">WhatsApp Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={manpowerData.phone}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="+234..."
                      required
                    />
                  </div>
                </div>

                {/* ADDRESS SECTION */}
                <div className="col-12 border-bottom pb-2 mt-3">
                  <h6 className="fw-bold text-success text-uppercase small tracking-widest d-flex align-items-center gap-2">
                    <MapPin size={18} /> Location Information
                  </h6>
                </div>

                <div className="col-12">
                  <label className="small fw-bold mb-1">
                    Full Office/Home Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={manpowerData.address}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    placeholder="Street Number and Name"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={manpowerData.state}
                    onChange={handleChange}
                    className="form-control bg-light border-0 py-2"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Postal / Zip Code
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Navigation size={16} />
                    </span>
                    <input
                      type="text"
                      name="postalCode"
                      value={manpowerData.postalCode}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Deployment Country
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Globe size={16} />
                    </span>
                    <input
                      type="text"
                      name="country"
                      value={manpowerData.country}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="e.g. Saudi Arabia"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Organization Type
                  </label>
                  <select
                    name="orgType"
                    value={manpowerData.orgType}
                    onChange={handleChange}
                    className="form-select bg-light border-0 py-2"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="Company">Company / Industry</option>
                    <option value="Hotel">Hotel / Hospitality</option>
                    <option value="Private Home">Private Home</option>
                    <option value="Farm">Commercial Farm</option>
                  </select>
                </div>

                {/* MANPOWER REQUIREMENTS */}
                <div className="col-12 border-bottom pb-2 mt-3">
                  <h6 className="fw-bold text-success text-uppercase small tracking-widest d-flex align-items-center gap-2">
                    <PenTool size={18} /> Recruitment Request
                  </h6>
                </div>

                <div className="col-md-8">
                  <label className="small fw-bold mb-1">Worker Category</label>
                  <select
                    name="workerType"
                    value={manpowerData.workerType}
                    className="form-select bg-light border-0 py-2"
                    required
                    onChange={handleChange}
                  >
                    <option value="">-- Select Category --</option>
                    {workerCategories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="other">OTHER (PLEASE SPECIFY)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="small fw-bold mb-1">Quantity</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Hash size={16} />
                    </span>
                    <input
                      type="number"
                      name="quantity"
                      value={manpowerData.quantity}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {isOtherManpower && (
                  <div className="col-md-12">
                    <label className="small fw-bold text-danger mb-1">
                      Specify Worker Type
                    </label>
                    <input
                      type="text"
                      name="otherWorkerType"
                      value={manpowerData.otherWorkerType}
                      onChange={handleChange}
                      className="form-control border-danger py-2"
                      required
                    />
                  </div>
                )}

                <div className="col-12">
                  <label className="small fw-bold mb-1">
                    Additional Description
                  </label>
                  <textarea
                    name="description"
                    value={manpowerData.description}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    rows="3"
                    placeholder="Specify skills, language or height requirements..."
                  ></textarea>
                </div>

                <div className="col-12 mt-4 pb-3">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase tracking-wider"
                  >
                    Submit Manpower Request
                  </button>
                  <p className="text-center x-small text-muted mt-3 mb-0">
                    Arewa Visa Academy &copy; 2026 | Recruitment Division
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

export default ManpowerRequestForm;
