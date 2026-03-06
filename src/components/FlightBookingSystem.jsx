import React from "react";
import {
  Plane,
  Search,
  Edit3,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Banknote,
  Globe,
  X,
  Loader2,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const FlightBookingSystem = ({
  isLoadingFlight,
  view,
  setView,
  backgroundImages,
  bgIndex,
  nigerianStates,
  airlinePrices,
  flightTimes,
  selectedAirline,
  handleAirlineChange,
  currentPrice,
  handleProceedToPayment,
  showMap,
  setShowMap,
  isSubmitting,
  setIsSubmitting,
  setTicketID,
  handleFindTicket,
  selectedTicket,
  setCurrentPrice,
}) => {
  return (
    <div className="flight-system-wrapper">
      {/* START AREWA FLIGHT SYSTEM SECTION */}
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#485d75",
          backgroundImage: `linear-gradient(rgba(0, 15, 35, 0.75), rgba(65, 84, 105, 0.8)), 
        url('${backgroundImages[bgIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1.5s ease-in-out",
          overflowX: "hidden",
        }}
      >
        {/* 1. LOADING OVERLAY */}
        {isLoadingFlight && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ zIndex: 9999, background: "rgba(0, 15, 35, 0.98)" }}
          >
            <div className="mb-4 animate-bounce">
              <Plane
                size={80}
                className="text-warning"
                style={{ transform: "rotate(-45deg)" }}
              />
            </div>
            <h3 className="fw-bold text-white mb-2">
              Connecting to NCAA Database...
            </h3>
            <p className="text-muted">
              Fetching live flight schedules across Nigeria
            </p>
            <div
              className="spinner-border text-warning mt-3"
              role="status"
            ></div>
          </div>
        )}

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              {/* BRAND SECTION */}
              <div className="animate__animated animate__fadeInDown">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm">
                  <Globe size={16} className="me-1" /> #1 NIGERIAN TRAVEL HUB
                </span>
                <h1 className="display-4 fw-bold mb-4 text-white">
                  Fly with <span className="text-warning">Confidence</span> &
                  Ease
                </h1>
                <p
                  className="lead text-white opacity-75 mb-5 mx-auto"
                  style={{ maxWidth: "750px" }}
                >
                  Your gateway to seamless air travel in Nigeria. Book flights,
                  manage tickets, and track air traffic in real-time.
                </p>
              </div>

              {/* INTERACTIVE BUTTONS */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                <button
                  onClick={() => {
                    setView(view === "book" ? "" : "book");
                    if (typeof setSelectedTicket === "function")
                      setSelectedTicket(null);
                  }}
                  className={`btn ${view === "book" ? "btn-light" : "btn-warning"} btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2`}
                >
                  <Search size={20} />{" "}
                  {view === "book" ? "CLOSE SEARCH" : "EXPLORE ROUTES"}
                </button>
                <button
                  onClick={() => {
                    setView(view === "find" || view === "manage" ? "" : "find");
                    if (typeof setSelectedTicket === "function")
                      setSelectedTicket(null);
                  }}
                  className={`btn ${view === "find" || view === "manage" ? "btn-light" : "btn-outline-light"} btn-lg rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2`}
                >
                  <Edit3 size={20} /> MANAGE BOOKING
                </button>
              </div>

              {/* DYNAMIC CONTENT CARD */}
              {view !== "" && (
                <div
                  className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp mx-auto"
                  style={{ maxWidth: "850px" }}
                >
                  {/* ICONS PANEL */}
                  <div className="bg-light p-3 d-flex flex-wrap justify-content-center gap-4 border-bottom">
                    <div className="small fw-bold text-dark d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-warning" /> 36 States
                    </div>
                    <div className="small fw-bold text-dark d-flex align-items-center gap-2">
                      <RefreshCcw size={16} className="text-info" /> Easy Modify
                    </div>
                    <div className="small fw-bold text-dark d-flex align-items-center gap-2">
                      <ShieldCheck size={16} className="text-success" /> NCAA
                      Verified
                    </div>
                    <div className="small fw-bold text-dark d-flex align-items-center gap-2">
                      <Banknote size={16} className="text-primary" /> Instant
                      Refund
                    </div>
                  </div>

                  <div className="card-body p-4 p-md-5 bg-white text-dark text-start">
                    {/* 1. BOOKING FORM */}
                    {view === "book" && (
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="small fw-bold text-secondary mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control border-0 bg-light py-3"
                            placeholder="Enter name"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="small fw-bold text-secondary mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="form-control border-0 bg-light py-3"
                            placeholder="+234..."
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="small fw-bold text-secondary mb-1">
                            Departure City
                          </label>
                          <select className="form-select border-0 bg-light py-3">
                            <option value="">Select Origin</option>
                            {nigerianStates.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="small fw-bold text-secondary mb-1">
                            Destination
                          </label>
                          <select className="form-select border-0 bg-light py-3">
                            <option value="">Select Destination</option>
                            {nigerianStates.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="small fw-bold text-secondary mb-1">
                            Select Airline
                          </label>
                          <select
                            className="form-select border-0 bg-light py-3"
                            onChange={handleAirlineChange}
                            value={selectedAirline}
                          >
                            <option value="">-- Choose Airline --</option>
                            {Object.keys(airlinePrices).map((airline) => (
                              <option key={airline} value={airline}>
                                {airline}
                              </option>
                            ))}
                          </select>
                        </div>
                        {selectedAirline && (
                          <>
                            <div className="col-md-6 animate__animated animate__fadeIn">
                              <label className="small fw-bold text-secondary mb-1">
                                Travel Date
                              </label>
                              <input
                                type="date"
                                className="form-control border-0 bg-light py-3"
                                min={new Date().toISOString().split("T")[0]}
                                required
                              />
                            </div>
                            <div className="col-md-6 animate__animated animate__fadeIn">
                              <label className="small fw-bold text-secondary mb-1">
                                Departure Time
                              </label>
                              <select
                                className="form-select border-0 bg-light py-3"
                                required
                              >
                                <option value="">-- Select Time --</option>
                                {flightTimes.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                        {currentPrice > 0 && (
                          <div className="col-12 animate__animated animate__fadeIn">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-dashed d-flex justify-content-between align-items-center shadow-sm">
                              <div>
                                <span className="d-block small text-muted">
                                  Total Fare (Tax Inclusive)
                                </span>
                                <span className="h4 mb-0 fw-bold text-primary">
                                  ₦{currentPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="badge bg-success rounded-pill">
                                  Seats Available
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={handleProceedToPayment}
                          className="btn btn-primary btn-lg w-100 mt-4 py-3 rounded-pill fw-bold shadow"
                        >
                          PROCEED TO PAYMENT
                        </button>
                        <button
                          onClick={() => setShowMap(true)}
                          className="btn btn-outline-dark w-100 mt-2 rounded-pill small fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          <Globe size={16} /> OPEN LIVE FLIGHT RADAR
                        </button>
                      </div>
                    )}

                    {/* 2. PAYMENT GATEWAY */}
                    {view === "payment" && (
                      <div className="text-center py-4 animate__animated animate__fadeIn">
                        <div className="mb-4">
                          <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                            <Plane size={40} className="text-primary" />
                          </div>
                          <h4 className="fw-bold">Secure Flight Checkout</h4>
                          <p className="text-muted small text-uppercase tracking-widest">
                            Arewa Air Services
                          </p>
                        </div>
                        <div className="p-4 border rounded-4 mb-4 bg-light text-start shadow-sm">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-secondary small fw-bold">
                              Selected Airline:
                            </span>
                            <strong className="text-dark">
                              {selectedAirline}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between mb-3 border-top pt-3">
                            <span className="fw-bold small">
                              Total Ticket Fare:
                            </span>
                            <strong className="text-primary h5 mb-0">
                              ₦{currentPrice.toLocaleString()}
                            </strong>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsSubmitting(true);
                            setTimeout(() => {
                              setIsSubmitting(false);
                              setView("success");
                            }, 3000);
                          }}
                          disabled={isSubmitting}
                          className="btn btn-success btn-lg w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 text-uppercase"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />{" "}
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard size={20} /> Pay & Confirm Seat
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-link text-muted fw-bold text-decoration-none mt-3 small"
                          onClick={() => setView("book")}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* 3. SUCCESS VIEW */}
                    {view === "success" && (
                      <div className="text-center py-5 animate__animated animate__zoomIn">
                        <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                          <CheckCircle size={60} className="text-success" />
                        </div>
                        <h3 className="fw-bold">Action Processed!</h3>
                        <p className="text-muted">
                          Confirmation sent. Refunds take 7 working days.
                        </p>
                        <button
                          className="btn btn-primary px-5 py-3 rounded-pill mt-3 fw-bold shadow"
                          onClick={() => setView("")}
                        >
                          BACK TO HOME
                        </button>
                      </div>
                    )}

                    {/* 4. FIND TICKET */}
                    {view === "find" && (
                      <div className="text-center py-4">
                        <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                          <Search size={40} className="text-primary" />
                        </div>
                        <h4 className="fw-bold">Retrieve Booking</h4>
                        <p className="text-muted mb-4">Enter your Ticket ID.</p>
                        <div className="input-group mb-3 shadow-sm rounded-pill overflow-hidden border">
                          <input
                            type="text"
                            className="form-control py-3 border-0 bg-light ps-4"
                            placeholder="Ticket ID (e.g. AV-123)"
                            onChange={(e) => setTicketID(e.target.value)}
                          />
                          <button
                            className="btn btn-dark px-4 fw-bold"
                            onClick={handleFindTicket}
                          >
                            SEARCH
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 5. MANAGE VIEW */}
                    {view === "manage" && selectedTicket && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                          <h5 className="fw-bold mb-0 text-primary">
                            Modify Booking: {selectedTicket.id}
                          </h5>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success px-3">
                            {selectedTicket.status}
                          </span>
                        </div>
                        {/* Logic na Manage shima yana nan (Simplified for brevity) */}
                        <p className="text-center">
                          Ticket management active for {selectedTicket.name}
                        </p>
                        <button
                          className="btn btn-primary w-100 py-3 rounded-pill"
                          onClick={() => setView("")}
                        >
                          Close
                        </button>
                      </div>
                    )}

                    {/* 6. REFUND VIEW */}
                    {view === "refund" && (
                      <div className="animate__animated animate__fadeIn">
                        <h4 className="text-danger fw-bold mb-3 d-flex align-items-center gap-2">
                          <AlertTriangle size={24} /> Refund Settlement
                        </h4>
                        <button
                          className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow"
                          onClick={() => setView("success")}
                        >
                          CONFIRM REFUND
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LIVE FLIGHT RADAR MODAL */}
        {showMap && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 10000, background: "rgba(0, 0, 0, 0.96)" }}
          >
            <div
              className="container bg-dark rounded-4 overflow-hidden position-relative shadow-lg"
              style={{
                height: "90vh",
                maxWidth: "1250px",
                border: "1px solid #555",
              }}
            >
              <div className="p-3 d-flex justify-content-between align-items-center text-white border-bottom border-secondary bg-dark">
                <div>
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span
                      className="spinner-grow spinner-grow-sm text-danger"
                      role="status"
                    ></span>
                    Live Nigerian Airspace Radar
                  </h6>
                </div>
                <button
                  onClick={() => setShowMap(false)}
                  className="btn btn-danger btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                >
                  CLOSE RADAR <X size={18} />
                </button>
              </div>
              <div
                className="w-100 h-100 bg-black"
                style={{ position: "relative" }}
              >
                <iframe
                  src="https://globe.adsbexchange.com/?lat=9.080&lon=8.670&zoom=6.0"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    minHeight: "calc(90vh - 70px)",
                    background: "#1a1a1a",
                  }}
                  title="Real-Time Flight Tracker"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default FlightBookingSystem;
