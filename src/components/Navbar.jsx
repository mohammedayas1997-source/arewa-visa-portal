import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Menu,
  ChevronDown,
  Briefcase,
  Book,
  Users,
  Globe,
  FileText,
  UserCheck,
  Landmark,
  Home,
  ShieldCheck,
  PlaneTakeoff,
  Star,
  MapPin,
  Award,
  BookOpen,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <>
      {/* TOP BLUE BAR - Hidden on mobile for cleaner look, but accessible via Menu */}
      <div
        className="text-white py-2 d-none d-lg-block w-100"
        style={{
          backgroundColor: "#003366",
          position: "relative",
          zIndex: 1101,
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4 small fw-bold">
            <span className="d-flex align-items-center gap-2">
              <Mail size={14} strokeWidth={2.5} />
              <a
                href="mailto:info@arewavisaacademy.com"
                className="text-white text-decoration-none"
              >
                info@arewavisaacademy.com
              </a>
            </span>
            <span className="d-flex align-items-center gap-2">
              <Phone size={14} strokeWidth={2.5} />
              <a
                href="https://wa.me/2348165372359"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                +234 816 537 2359
              </a>
            </span>
          </div>
          <div className="d-flex gap-3">
            <Facebook size={16} className="cursor-pointer" />
            <Instagram size={16} className="cursor-pointer" />
            <Twitter size={16} className="cursor-pointer" />
            <Linkedin size={16} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2"
        style={{ zIndex: 1100, borderBottom: "2px solid #f8f9fa" }}
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img
              src={logo}
              alt="Logo"
              height="45"
              className="mobile-logo"
              style={{ objectFit: "contain", maxWidth: "100%" }}
            />
            <div className="lh-1">
              <strong className="d-block text-dark" style={{ fontSize: "16px", letterSpacing: "-0.5px" }}>AREWA VISA</strong>
              <small
                className="text-danger fw-bold text-uppercase"
                style={{ fontSize: "9px" }}
              >
                Academy
              </small>
            </div>
          </Link>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <Menu size={28} color="#003366" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Mobile Contact Info - Only shows when menu is collapsed on mobile */}
            <div className="d-lg-none mt-3 mb-2 px-3 py-2 bg-light rounded-3">
               <div className="small fw-bold text-muted mb-2">QUICK CONNECT</div>
               <div className="d-flex flex-column gap-2 small">
                  <a href="tel:+2348165372359" className="text-dark text-decoration-none d-flex align-items-center gap-2"><Phone size={14}/> Call Support</a>
                  <a href="mailto:info@arewavisaacademy.com" className="text-dark text-decoration-none d-flex align-items-center gap-2"><Mail size={14}/> Email Us</a>
               </div>
            </div>

            <ul className="navbar-nav ms-auto gap-2 gap-lg-3 fw-bold align-items-lg-center mt-3 mt-lg-0 px-2 px-lg-0">
              <li className="nav-item">
                <Link className="nav-link py-2" to="/">HOME</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link py-2" to="/about">ABOUT US</Link>
              </li>

              {/* WHAT WE DO DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 d-flex align-items-center justify-content-between w-100 py-2 gap-1 shadow-none border-0"
                  id="whatWeDoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  WHAT WE DO <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 animate__animated animate__fadeIn"
                  style={{
                    minWidth: "300px",
                    maxHeight: "75vh",
                    overflowY: "auto",
                    padding: "15px",
                    zIndex: 1200,
                  }}
                  aria-labelledby="whatWeDoDropdown"
                >
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><Briefcase size={18} color="#0d6efd" /> JOBS SEARCH</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><Book size={18} color="#dc3545" /> VISA TRAINING</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><FileText size={18} color="#198754" /> VISA CONSULTATION</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><Globe size={18} color="#0dcaf0" /> WORK ABROAD</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><Users size={18} color="#6610f2" /> MANPOWER</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2" to="#"><UserCheck size={18} color="#fd7e14" /> FOREIGN RECRUITMENT</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-3 py-2 text-wrap" to="#"><FileText size={18} color="#6c757d" /> CV WRITING & INTERVIEW PREP</Link></li>

                  <li><hr className="dropdown-divider" /></li>
                  <li className="px-3 py-1 text-primary small fw-bold text-uppercase" style={{ fontSize: "11px" }}>Citizenship By Investment</li>

                  {/* JERIN KASASHE - Fixed Grid for Mobile */}
                  <div className="px-3 py-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "10px", fontWeight: "600" }}>
                    <span>🇦🇬 Antigua</span> <span>🇦🇷 Argentina</span>
                    <span>🇩🇲 Dominica</span> <span>🇬🇩 Grenada</span>
                    <span>🇸🇹 Sao Tome</span> <span>🇰🇳 St Kitts</span>
                    <span>🇱🇨 St. Lucia</span> <span>🇹🇷 Türkiye</span>
                    <span>🇻🇺 Vanuatu</span> <span>🇳🇷 Nauru</span>
                    <span>🇲🇹 Malta</span> <span>🇶🇦 Qatar</span>
                  </div>

                  <li><hr className="dropdown-divider" /></li>
                  <li className="px-3 py-1 text-danger small fw-bold text-uppercase" style={{ fontSize: "11px" }}>WE OFFER</li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-2 py-1" to="#"><Globe size={14} color="#0d6efd" /> Global Citizenship</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-2 py-1" to="#"><Landmark size={14} color="#198754" /> Int. Real Estate</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-2 py-1" to="#"><Home size={14} color="#fd7e14" /> Domestic Estate</Link></li>
                  <li><Link className="dropdown-item d-flex align-items-center gap-2 py-1" to="#"><ShieldCheck size={14} color="#6610f2" /> 2nd Citizenship</Link></li>
                </ul>
              </li>

              {/* E-LIBRARY DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 d-flex align-items-center justify-content-between w-100 py-2 gap-1 shadow-none border-0"
                  id="elibraryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  E-LIBRARY <ChevronDown size={16} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2 rounded-3 animate__animated animate__fadeIn" aria-labelledby="elibraryDropdown">
                  <li><a className="dropdown-item py-2" href="https://library.unimed.edu.ng/e-library/" target="_blank" rel="noopener noreferrer">UNIMED e-Library</a></li>
                  <li><a className="dropdown-item py-2" href="https://library.cbn.gov.ng/elibrary/" target="_blank" rel="noopener noreferrer">CBN e-Library</a></li>
                  <li><a className="dropdown-item py-2" href="https://publiclibray.librarika.com/" target="_blank" rel="noopener noreferrer">Public Library</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item py-2" href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link py-2" to="/contact">CONTACT</Link>
              </li>

              {/* ACTION BUTTONS - Centered or Full width on mobile */}
              <li className="nav-item mt-2 mt-lg-0 ms-lg-3">
                <Link to="/login" className="btn btn-dark rounded-pill px-4 py-2 w-100 w-lg-auto fw-bold shadow-sm">PORTAL</Link>
              </li>
              <li className="nav-item mt-2 mt-lg-0 ms-lg-2 mb-3 mb-lg-0">
                <Link to="/admin-gateway" className="btn btn-outline-dark rounded-pill px-4 py-2 w-100 w-lg-auto fw-bold">ADMIN</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}