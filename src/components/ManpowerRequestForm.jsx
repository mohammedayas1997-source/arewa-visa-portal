import React from "react";
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
  if (!showManpowerForm) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4"
      style={{
        zIndex: 10000,
        backgroundColor: "rgba(0,0,0,0.9)",
        overflowY: "auto",
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
            <h3 className="fw-bold">RECRUITMENT PORTAL</h3>
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
                  className="btn btn-dark px-5 py-2 rounded-pill mt-3"
                >
                  Finish
                </button>
              </div>
            ) : (
              <form className="row g-3" onSubmit={handleInitialSubmit}>
                <div className="col-12">
                  <h5 className="fw-bold text-success border-bottom pb-2">
                    Business Information
                  </h5>
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">Employer Name</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">Email Address</label>
                  <input type="email" className="form-control" required />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold">Organization Type</label>
                  <select className="form-select" required>
                    <option value="">-- Select --</option>
                    <option>Company</option>
                    <option>Hotel</option>
                    <option>Private Home</option>
                    <option>Farm</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold">Country</label>
                  <input type="text" className="form-control" required />
                </div>

                <div className="col-md-8">
                  <label className="small fw-bold">Type of Worker Needed</label>
                  <select
                    className="form-select"
                    required
                    onChange={(e) =>
                      setIsOtherManpower(e.target.value === "other")
                    }
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="other">OTHER (SPECIFY)</option>
                  </select>
                </div>

                {isOtherManpower && (
                  <div className="col-md-12 animate__animated animate__fadeIn">
                    <label className="small fw-bold text-danger">
                      Specify Worker Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. Welder, Chef..."
                      required
                    />
                  </div>
                )}

                <div className="col-md-4">
                  <label className="small fw-bold">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="small fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Job responsibilities..."
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3 fw-bold rounded-pill"
                  >
                    SUBMIT REQUEST
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
