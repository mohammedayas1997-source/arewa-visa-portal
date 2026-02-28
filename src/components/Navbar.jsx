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
      {/* TOP BLUE BAR */}
      <div
        className="text-white py-2 d-none d-lg-block w-100"
        style={{
          backgroundColor: "#003366",
          position: "relative",
          zIndex: 1101, // Mun kara shi sama da komai
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
        style={{ zIndex: 1100 }} // Tabbatar Navbar tana layer na sama koyaushe
      >
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img
              src={logo}
              alt="Logo"
              height="50"
              style={{ objectFit: "contain", maxWidth: "100%" }}
            />
            <div className="lh-1">
              <strong className="d-block text-dark">AREWA VISA</strong>
              <small
                className="text-danger fw-bold text-uppercase"
                style={{ fontSize: "10px" }}
              >
                Academy
              </small>
            </div>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ outline: "none", boxShadow: "none" }}
          >
            <Menu size={28} color="#003366" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 fw-bold align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  ABOUT US
                </Link>
              </li>

              {/* WHAT WE DO DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 d-flex align-items-center gap-1"
                  id="whatWeDoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: "none", outline: "none" }}
                >
                  WHAT WE DO <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4"
                  style={{
                    minWidth: "350px",
                    maxHeight: "80vh", // Mun rage kadan don gudun overflow
                    overflowY: "auto",
                    padding: "15px",
                    zIndex: 1200, // Tabbatar dropdown din yana sama da komai
                  }}
                  aria-labelledby="whatWeDoDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <Briefcase size={18} color="#0d6efd" /> JOBS SEARCH
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <Book size={18} color="#dc3545" /> VISA TRAINING
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <FileText size={18} color="#198754" /> VISA CONSULTATION
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <Globe size={18} color="#0dcaf0" /> WORK ABROAD
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <Users size={18} color="#6610f2" /> MANPOWER
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2"
                      to="#"
                    >
                      <UserCheck size={18} color="#fd7e14" /> FOREIGN
                      RECRUITMENT
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-3 py-2 text-wrap"
                      to="#"
                    >
                      <FileText size={18} color="#6c757d" /> CV WRITING &
                      INTERVIEW PREP
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-primary small fw-bold text-uppercase">
                    Citizenship By Investment & Residency
                  </li>

                  {/* JERIN KASASHE - Grid System */}
                  <div
                    className="px-3 py-2 small text-muted"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    <span>🇦🇬 Antigua & Barbuda</span> <span>🇦🇷 Argentina</span>
                    <span>🇩🇲 Dominica</span> <span>🇬🇩 Grenada</span>
                    <span>🇸🇹 Sao Tome</span> <span>🇰🇳 St Kitts & Nevis</span>
                    <span>🇱🇨 St. Lucia</span> <span>🇹🇷 Türkiye</span>
                    <span>🇻🇺 Vanuatu</span> <span>🇳🇷 Nauru</span>
                    <span>🇲🇹 Malta</span> <span>🇶🇦 Qatar</span>
                    <span>🇰🇼 Kuwait</span> <span>🇸🇦 Saudi Arabia</span>
                    <span>🇪🇬 Egypt</span> <span>🇲🇺 Mauritius</span>
                    <span>🇯🇴 Jordan</span> <span>🇬🇷 Greece</span>
                    <span>🇵🇹 Portugal</span> <span>🇦🇩 Andorra</span>
                    <span>🇹🇭 Thailand</span> <span>🇭🇺 Hungary</span>
                    <span>🇿🇦 South Africa</span> <span>🇨🇦 Canada</span>
                  </div>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-danger small fw-bold text-uppercase">
                    WE OFFER
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <Globe size={14} color="#0d6efd" /> Global Citizenship
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <Landmark size={14} color="#198754" /> International Real
                      Estate
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <Home size={14} color="#fd7e14" /> Domestic Real Estate
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <ShieldCheck size={14} color="#6610f2" /> Second
                      Citizenship
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <MapPin size={14} color="#dc3545" /> Foreign Residency
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1"
                      to="#"
                    >
                      <Star size={14} color="#ffc107" /> Golden Visas
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-1 text-wrap"
                      to="#"
                    >
                      <PlaneTakeoff size={14} color="#0dcaf0" /> Real Estate
                      Investment
                    </Link>
                  </li>
                </ul>
              </li>

              {/* E-LIBRARY DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 d-flex align-items-center gap-1"
                  id="elibraryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: "none", outline: "none" }}
                >
                  E-LIBRARY <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow border-0"
                  aria-labelledby="elibraryDropdown"
                  style={{ zIndex: 1200 }}
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://library.unimed.edu.ng/e-library/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      UNIMED e-Library
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://library.cbn.gov.ng/elibrary/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CBN e-Library
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://publiclibray.librarika.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Public Library Nigeria
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.elibrarynigeria.ng/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      E-Library Nigeria
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://archive.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Internet Archive
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://openlibrary.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Library
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  CONTACT
                </Link>
              </li>

              <li className="nav-item ms-lg-3">
                <Link
                  to="/login"
                  className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
                >
                  PORTAL
                </Link>
              </li>
              <li className="nav-item ms-2">
                <Link
                  to="/admin-gateway"
                  className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                >
                  ADMIN
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
