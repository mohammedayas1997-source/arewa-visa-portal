import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  LogOut,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case "student":
        return "/student-portal";
      case "admin":
        return "/admin-dashboard";
      case "supervisor":
        return "/supervisor-dashboard";
      case "rector":
        return "/rector-dashboard";
      default:
        return "/login";
    }
  };

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
                className="text-white text-decoration-none small"
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
                className="text-white text-decoration-none small"
              >
                +234 816 537 2359
              </a>
            </span>
          </div>
          <div className="d-flex gap-3">
            <Facebook size={16} className="cursor-pointer hover-opacity" />
            <Instagram size={16} className="cursor-pointer hover-opacity" />
            <Twitter size={16} className="cursor-pointer hover-opacity" />
            <Linkedin size={16} className="cursor-pointer hover-opacity" />
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} alt="AVA Logo" height="50" />
            <div className="lh-1">
              <strong className="d-block text-dark font-black tracking-tighter">
                AREWA VISA
              </strong>
              <small
                className="text-danger text-uppercase fw-bold"
                style={{ fontSize: "10px", letterSpacing: "2px" }}
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

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 border-0 fw-bold"
                  id="whatWeDoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  WHAT WE DO <ChevronDown size={14} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-3"
                  style={{
                    minWidth: "350px",
                    maxHeight: "85vh",
                    overflowY: "auto",
                  }}
                  aria-labelledby="whatWeDoDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <Briefcase size={16} color="#0d6efd" />{" "}
                      <span>JOBS SEARCH</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <Book size={16} color="#dc3545" />{" "}
                      <span>VISA TRAINING</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <FileText size={16} color="#198754" />{" "}
                      <span>VISA CONSULTATION</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <Globe size={16} color="#0dcaf0" />{" "}
                      <span>WORK ABROAD</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <Users size={16} color="#6610f2" /> <span>MANPOWER</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <UserCheck size={16} color="#fd7e14" />{" "}
                      <span>FOREIGN RECRUITMENT</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3"
                      href="#"
                    >
                      <FileText size={16} color="#6c757d" />{" "}
                      <span>CV & INTERVIEW PREP</span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-primary small fw-black text-uppercase italic">
                    Citizenship By Investment
                  </li>
                  <div
                    className="px-3 py-2 small text-muted"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
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
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="px-3 py-1 text-danger small fw-black text-uppercase">
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
                </ul>
              </li>

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-dark p-0 border-0 fw-bold"
                  id="elibraryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  E-LIBRARY <ChevronDown size={14} />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2"
                  aria-labelledby="elibraryDropdown"
                >
                  <li>
                    <a
                      className="dropdown-item py-2"
                      href="https://library.unimed.edu.ng/e-library/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      UNIMED e-Library
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2"
                      href="https://library.cbn.gov.ng/elibrary/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CBN e-Library
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2"
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
                      className="dropdown-item py-2"
                      href="https://archive.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Internet Archive
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2"
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

              {!user ? (
                <>
                  <li className="nav-item ms-lg-3">
                    <Link
                      to="/login"
                      className="btn btn-dark rounded-pill px-4 fw-black text-uppercase small tracking-widest shadow-sm"
                    >
                      LOGIN
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/admin-gateway"
                      className="btn btn-outline-danger rounded-pill px-4 fw-black text-uppercase small tracking-widest"
                    >
                      STAFF
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ms-lg-3">
                    <Link
                      to={getDashboardLink()}
                      className="btn btn-primary rounded-pill px-4 fw-black text-uppercase small tracking-widest shadow-lg d-flex align-items-center gap-2"
                    >
                      DASHBOARD
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger rounded-pill px-4 fw-black text-uppercase small tracking-widest d-flex align-items-center gap-2"
                    >
                      <LogOut size={16} /> LOGOUT
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
