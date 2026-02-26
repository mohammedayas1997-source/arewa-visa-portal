import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, Facebook, Instagram, Twitter, Linkedin, Menu, ChevronDown,
  Briefcase, Book, Users, Globe, FileText, UserCheck, Award
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <>
      {/* TOP BLUE BAR */}
      <div className="bg-primary text-white py-2 d-none d-lg-block w-100" style={{ position: 'relative', zIndex: 1100 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4 small">
            <span className="d-flex align-items-center gap-2">
              <Mail size={14} />
              <a href="mailto:info@arewavisaacademy.com" className="text-white text-decoration-none">
                info@arewavisaacademy.com
              </a>
            </span>
            <span className="d-flex align-items-center gap-2">
              <Phone size={14} />
              <a href="https://wa.me/2348165372359" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
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
              <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>Academy</small>
            </div>
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <Menu size={24} />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 fw-bold align-items-center">
              <li className="nav-item"><Link className="nav-link" to="/">HOME</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">ABOUT US</Link></li>

              {/* WHAT WE DO DROPDOWN */}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link text-dark p-0" id="whatWeDoDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  WHAT WE DO <ChevronDown size={16} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="whatWeDoDropdown">
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><Briefcase size={16} /> JOBS SEARCH</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><Book size={16} /> VISA TRAINING</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><FileText size={16} /> VISA CONSULTATION</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><Globe size={16} /> WORK ABROAD</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><Users size={16} /> MANPOWER</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><UserCheck size={16} /> FOREIGN RECRUITMENT</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><FileText size={16} /> CV WRITING & INTERVIEW PREPARATION</a></li>
                  <li><a className="dropdown-item d-flex align-items-center gap-2" href="#"><Award size={16} /> CITIZENSHIP BY INVESTMENT PROGRAM</a></li>
                </ul>
              </li>

              {/* E-LIBRARY DROPDOWN */}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link text-dark p-0" id="elibraryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  E-LIBRARY <ChevronDown size={16} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="elibraryDropdown">
                  <li><a className="dropdown-item" href="https://library.unimed.edu.ng/e-library/" target="_blank" rel="noopener noreferrer">UNIMED e-Library</a></li>
                  <li><a className="dropdown-item" href="https://library.cbn.gov.ng/elibrary/" target="_blank" rel="noopener noreferrer">CBN e-Library</a></li>
                  <li><a className="dropdown-item" href="https://publiclibray.librarika.com/" target="_blank" rel="noopener noreferrer">Public Library Nigeria</a></li>
                  <li><a className="dropdown-item" href="https://www.elibrarynigeria.ng/" target="_blank" rel="noopener noreferrer">E-Library Nigeria</a></li>
                  <li><a className="dropdown-item" href="https://www.nln.gov.ng/" target="_blank" rel="noopener noreferrer">National Library of Nigeria</a></li>
                  <li><a className="dropdown-item" href="https://www.theibomelibrary.com/" target="_blank" rel="noopener noreferrer">Ibom e-Library</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive</a></li>
                  <li><a className="dropdown-item" href="https://openlibrary.org/" target="_blank" rel="noopener noreferrer">Open Library</a></li>
                  <li><a className="dropdown-item" href="https://bookboon.com/" target="_blank" rel="noopener noreferrer">Books Boon</a></li>
                  <li><a className="dropdown-item" href="https://doabooks.org/" target="_blank" rel="noopener noreferrer">DOAB – Open Access Books</a></li>
                  <li><a className="dropdown-item" href="https://www.ajol.info/" target="_blank" rel="noopener noreferrer">African Journals Online (AJOL)</a></li>
                </ul>
              </li>

              {/* CONTACT DROPDOWN */}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link text-dark p-0" id="contactDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  CONTACT <ChevronDown size={16} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="contactDropdown">
                  <li><a className="dropdown-item" href="mailto:info@arewavisaacademy.com">Email Us</a></li>
                  <li><a className="dropdown-item" href="https://wa.me/2348165372359" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                  <li><a className="dropdown-item" href="tel:+2348165372359">Call Us</a></li>
                </ul>
              </li>

              <li className="nav-item ms-lg-3"><button className="btn btn-dark rounded-pill px-4">PORTAL</button></li>
              <li className="nav-item"><button className="btn btn-outline-dark rounded-pill px-4">ADMIN</button></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
