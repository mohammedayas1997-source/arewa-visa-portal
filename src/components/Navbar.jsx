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
  Award,
  MapPin,
  Home,
  ShieldCheck,
  Landmark,
  PlaneTakeoff,
  Star,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <>
      {/* TOP BLUE BAR */}
      <div
        className="bg-primary text-white py-2 d-none d-lg-block w-100"
        style={{ position: "relative", zIndex: 1100 }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4 small">
            <span className="d-flex align-items-center gap-2">
              <Mail size={14} />
              <a
                href="mailto:info@arewavisaacademy.com"
                className="text-white text-decoration-none"
              >
                info@arewavisaacademy.com
              </a>
            </span>
            <span className="d-flex align-items-center gap-2">
              <Phone size={14} />
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} alt="Logo" height="50" />
            <div className="lh-1">
              <strong className="d-block text-dark">AREWA VISA</strong>
              <small
                className="text-muted text-uppercase"
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
          >
            <Menu size={24} />
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
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0"
                  id="whatWeDoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  WHAT WE DO <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                  style={{
                    minWidth: "320px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                  }}
                  aria-labelledby="whatWeDoDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Briefcase size={16} color="#0d6efd" /> JOBS SEARCH
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Book size={16} color="#dc3545" /> VISA TRAINING
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <FileText size={16} color="#198754" /> VISA CONSULTATION
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Globe size={16} color="#0dcaf0" /> WORK ABROAD
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Users size={16} color="#6610f2" /> MANPOWER
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <UserCheck size={16} color="#fd7e14" /> FOREIGN
                      RECRUITMENT
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <FileText size={16} color="#6c757d" /> CV WRITING &
                      INTERVIEW PREPARATION
                    </a>
                  </li>

                  {/* CITIZENSHIP SECTION */}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-primary small fw-bold text-uppercase">
                    Citizenship By Investment & Residency
                  </li>
                  <div
                    className="px-3 py-2 small text-muted"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "5px",
                      fontSize: "11px",
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

                  {/* WE OFFER SECTION */}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-danger small fw-bold text-uppercase">
                    WE OFFER
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Globe size={14} color="#0d6efd" /> Global Citizenship
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Landmark size={14} color="#198754" /> International Real
                      Estate
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Home size={14} color="#fd7e14" /> Domestic Real Estate
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <ShieldCheck size={14} color="#6610f2" /> Second
                      Citizenship
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <MapPin size={14} color="#dc3545" /> Foreign Residency
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <Star size={14} color="#ffc107" /> Golden Visas
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      href="#"
                    >
                      <PlaneTakeoff size={14} color="#0dcaf0" /> Citizenship By
                      Real Estate Investment
                    </a>
                  </li>
                </ul>
              </li>

              {/* E-LIBRARY DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0"
                  id="elibraryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  E-LIBRARY <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="elibraryDropdown"
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
                    <a
                      className="dropdown-item"
                      href="https://www.nln.gov.ng/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      National Library of Nigeria
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.theibomelibrary.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ibom e-Library
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
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://bookboon.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Books Boon
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://doabooks.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DOAB – Open Access Books
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://www.ajol.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      African Journals Online (AJOL)
                    </a>
                  </li>
                </ul>
              </li>

              {/* CONTACT DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0"
                  id="contactDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  CONTACT <ChevronDown size={16} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="contactDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="mailto:arewavisaacademy@gmail.com"
                    >
                      Email Us
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://wa.me/2348165372359"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="tel:+2348165372359">
                      Call Us
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item ms-lg-3">
                <button className="btn btn-dark rounded-pill px-4">
                  PORTAL
                </button>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin"
                  className="btn btn-outline-dark rounded-pill px-4"
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
