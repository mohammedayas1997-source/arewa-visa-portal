import React, { useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  Briefcase,
  PenTool,
  Hash,
  MapPin,
  CheckCircle,
  Globe,
  User,
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
  // --- STATES NA CIKIN FORM (Yanzu da Phone Number) ---
  const [manpowerData, setManpowerData] = useState({
    employerName: "",
    email: "",
    phone: "", // Na maido da wannan
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

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4"
      style={{
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.9)",
        overflowY: "auto",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: "900px", borderRadius: "20px", overflow: "hidden" }}
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
          <div className="col-md-4 bg-success p-5 text-white text-center d-flex flex-column justify-content-center">
            <Building2 size={70} className="mx-auto mb-4 opacity-75" />
            <h3 className="fw-bold text-uppercase">Recruitment Portal</h3>
            <p className="small opacity-75">
              Connect with the best certified professionals for your business or
              home.
            </p>
          </div>

          <div className="col-md-8 p-4 p-md-5 bg-white text-dark text-start">
            {isSuccess ? (
              <div className="text-center py-5">
                <CheckCircle size={80} className="text-success mb-4" />
                <h2 className="fw-bold">Request Sent!</h2>
                <p className="text-muted">
                  Our recruitment team will contact you shortly.
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
                <div className="col-12">
                  <h5 className="fw-bold text-success border-bottom pb-2 d-flex align-items-center gap-2">
                    <Briefcase size={20} /> Employer Information
                  </h5>
                </div>

                <div className="col-md-12">
                  <label className="small fw-bold mb-1">
                    Employer / Company Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      name="employerName"
                      value={manpowerData.employerName}
                      onChange={handleChange}
                      className="form-control bg-light border-0"
                      placeholder="Organization Name"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Contact Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={manpowerData.email}
                      onChange={handleChange}
                      className="form-control bg-light border-0"
                      placeholder="hr@company.com"
                      required
                    />
                  </div>
                </div>

                {/* --- GA PHONE NUMBER FIELD DIN A NAN --- */}
                <div className="col-md-6">
                  <label className="small fw-bold mb-1">
                    Phone Number (WhatsApp)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={manpowerData.phone}
                      onChange={handleChange}
                      className="form-control bg-light border-0"
                      placeholder="+234..."
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
                    className="form-select bg-light border-0"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="Company">Company / Industry</option>
                    <option value="Hotel">Hotel / Hospitality</option>
                    <option value="Private Home">Private Home</option>
                    <option value="Farm">Commercial Farm</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Country</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Globe size={16} />
                    </span>
                    <input
                      type="text"
                      name="country"
                      value={manpowerData.country}
                      onChange={handleChange}
                      className="form-control bg-light border-0"
                      placeholder="Deployment Country"
                      required
                    />
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <h5 className="fw-bold text-success border-bottom pb-2 d-flex align-items-center gap-2">
                    <PenTool size={20} /> Manpower Requirements
                  </h5>
                </div>

                <div className="col-md-8">
                  <label className="small fw-bold mb-1">Worker Category</label>
                  <select
                    name="workerType"
                    value={manpowerData.workerType}
                    className="form-select bg-light border-0"
                    required
                    onChange={handleChange}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Cleaner">Professional Cleaner</option>
                    <option value="Security Guard">
                      Certified Security Guard
                    </option>
                    <option value="Driver">Driver</option>
                    <option value="other">OTHER (SPECIFY)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="small fw-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={manpowerData.quantity}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    min="1"
                    required
                  />
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
                      className="form-control border-danger"
                      required
                    />
                  </div>
                )}

                <div className="col-12">
                  <label className="small fw-bold mb-1">Job Description</label>
                  <textarea
                    name="description"
                    value={manpowerData.description}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    rows="3"
                    placeholder="Additional requirements..."
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-lg"
                  >
                    SUBMIT MANPOWER REQUEST
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

export default ManpowerRequestForm;
