import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, Users, Globe, Headphones, Briefcase, Layout, Ship, 
  FileText, Building2, Hotel, X, CheckCircle, Mail, Phone, 
  MapPin, Facebook, Twitter, Instagram, Menu, BookOpen, 
  ExternalLink, Home as HomeIcon, ShieldCheck, Clock,
  Award, Linkedin, ArrowRight, Upload, Globe2, UserCheck, Camera,
  Loader2, CreditCard, Hash, Calendar, Map, User2, Search, GraduationCap, 
  Handshake, UserPlus, PenTool, Landmark, Laptop, Wind, Brush, Package, Store,
  ChevronDown, FileUp, Wallet
} from "lucide-react";

import logo from '../assets/logo.png';
import hero1 from '../assets/hero1.jpg';
import hero2 from '../assets/hero2.jpg';
import hero3 from '../assets/hero3.jpg';
import hero4 from '../assets/hero4.jpg';
import hero5 from '../assets/hero5.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showManpowerForm, setShowManpowerForm] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);

  
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  
  const coursesRef = useRef(null);
  const jobsRef = useRef(null);

  const heroImages = [hero1, hero2, hero3, hero4, hero5];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowPaymentStep(true);
  };

  const handleFinalPayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setShowPaymentStep(false);
    }, 3000);
  };

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJobs = () => {
    jobsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const whatWeDoList = [
    "JOBS SEARCH", "VISA TRAINING", "VISA CONSULTATION", "WORK ABROAD",
    "MANPOWER", "FOREIGN RECRUITMENT", "CV WRITING & INTERVIEW PREPARATION",
    "CITIZENSHIP BY INVESTMENT PROGRAM"
  ];

  const coursesData = [
    { id: 1, title: 'CLEANING COURSE', desc: 'Industrial and commercial sanitation standards.', details: 'Comprehensive training in modern cleaning techniques, chemical safety, and specialized equipment handling for global sectors.', icon: <Brush size={40}/>, color: '#007bff' },
    { id: 2, title: 'HOUSEKEEPING COURSE', desc: 'Professional hospitality management for luxury hotels.', details: 'Focuses on guest relations, room maintenance, and high-end service standards required in international resorts.', icon: <Hotel size={40}/>, color: '#6610f2' },
    { id: 3, title: 'LAUNDRY SERVICE COURSE', desc: 'Fabric care and industrial laundry operations.', details: 'Advanced dry cleaning techniques, textile science, and operational mastery of commercial laundry systems.', icon: <Wind size={40}/>, color: '#0dcaf0' },
    { id: 4, title: 'VISA PROCESSING COURSE', desc: 'Global immigration and documentation training.', details: 'Mastering application workflows, appointment scheduling, and embassy compliance for international travel.', icon: <FileText size={40}/>, color: '#dc3545' },
    { id: 5, title: 'TICKETING & RESERVATION', desc: 'Aviation booking and GDS system mastery.', details: 'Professional training in Amadeus and Galileo systems for flight booking, fare construction, and itinerary management.', icon: <Plane size={40}/>, color: '#198754' },
    { id: 6, title: 'AGENCY MANAGEMENT', desc: 'Business architecture for travel firms.', details: 'Strategic management of travel agencies, IATA standards, marketing, and global partnership logistics.', icon: <Briefcase size={40}/>, color: '#fd7e14' },
    { id: 7, title: 'CUSTOMER SERVICE COURSE', desc: 'Corporate communication and office administration.', details: 'Professional etiquette, conflict resolution, and client relations training for high-level corporate environments.', icon: <Headphones size={40}/>, color: '#ffc107' },
    { id: 8, title: 'AIRCRAFT CLEANER COURSE', desc: 'Aviation-grade sterilization and safety protocols.', details: 'Specialized modules on aircraft interior maintenance, hazardous materials handling, and aviation security compliance.', icon: <Ship size={40}/>, color: '#20c997' },
    { id: 9, title: 'SECURITY TRAINING', desc: 'Professional security and surveillance training.', details: 'Modern security protocols, emergency response, and surveillance technology management.', icon: <ShieldCheck size={40}/>, color: '#343a40' },
    { id: 10, title: 'CAREGIVER - NANNY COURSE', desc: 'Professional pediatric and elderly healthcare.', details: 'Certified training in first aid, child development, geriatric care, and domestic safety for global households.', icon: <Users size={40}/>, color: '#d63384' },
    { id: 11, title: 'CARGO & LOGISTICS COURSE', desc: 'Global supply chain and freight operations.', details: 'Mastery of freight forwarding, customs documentation, warehousing, and international shipping logistics.', icon: <Package size={40}/>, color: '#6f42c1' },
    { id: 12, title: 'TRAVELS AND TOURISM', desc: 'International tourism and package development.', details: 'Comprehensive geography, tourism legislation, and strategic planning of global vacation and travel packages.', icon: <Globe2 size={40}/>, color: '#001f3f' }
  ];

  const availableJobs = [
    { id: 1, title: 'Security Guard', country: 'Australia 🇦🇺', slot: '12 Slots Left', category: 'Security' },
    { id: 2, title: 'Caregiver - Nanny', country: 'Canada 🇨🇦', slot: '8 Slots Left', category: 'Healthcare' },
    { id: 3, title: 'Professional Cleaner', country: 'USA 🇺🇸', slot: '25 Slots Left', category: 'Cleaning' }, 
    { id: 4, title: 'Visa Officer', country: 'Schengen Area 🇪🇺', slot: '5 Slots Left', category: 'Schengen' },
    { id: 5, title: 'Hotel Housekeeper', country: 'Japan 🇯🇵', slot: '15 Slots Left', category: 'Hospitality' },
    { id: 6, title: 'Laundry Specialist', country: 'South Korea 🇰🇷', slot: '10 Slots Left', category: 'Service' },
    { id: 7, title: 'Ticketing Officer', country: 'New Zealand 🇳🇿', slot: '4 Slots Left', category: 'Travel' },
    { id: 8, title: 'Customer Support', country: 'Gulf Countries 🇶🇦 🇦🇪', slot: '20 Slots Left', category: 'Gulf' },
    { id: 9, title: 'Agency Manager', country: 'United Kingdom 🇬🇧', slot: '2 Slots Left', category: 'Management' },
    { id: 10, title: 'Aircraft Cleaner', country: 'Russia 🇷🇺', slot: '12 Slots Left', category: 'Aviation' },
    { id: 11, title: 'Logistics Clerk', country: 'Mauritius 🇲🇺', slot: '7 Slots Left', category: 'Logistics' },
    { id: 12, title: 'Tour Guide', country: 'Seychelles 🇸🇨', slot: '6 Slots Left', category: 'Tourism' },
  ];

  const countriesList = [
    "Australia", "Canada", "USA", "Schengen (Germany, Poland, France, etc.)", 
    "Japan", "South Korea", "New Zealand", "Gulf (Qatar, Oman, Kuwait, UAE, etc.)", 
    "United Kingdom", "Russia", "Mauritius", "Seychelles", "Central Asia", "Balkans"
  ];

  const unskilledJobsList = [
    "Cleaner", "Loader/Unloader", "Helper/Assistant", "Security Guard", "Farm Laborer",
    "Sweeper", "Food Preparation Worker", "Retail Clerk", "Delivery Driver", "Hospitality Worker",
    "Dishwasher", "Housekeeper", "Car Wash Attendant", "Harvester or Picker", "Babysitter",
    "Cashier", "Parking Lot Attendant", "Agricultural Worker", "Janitor", "Porter"
  ];

  const skilledJobsList = [
    "Software Developer", "Nurse", "Electrician", "Plumber", "Carpenter", "Mechanic",
    "Teacher/Lecturer", "Accountant", "Engineer", "Graphic Designer", 
  ];

  const filteredUnskilled = unskilledJobsList.filter(job => job.toLowerCase().includes(jobSearchQuery.toLowerCase()));
  const filteredSkilled = skilledJobsList.filter(job => job.toLowerCase().includes(jobSearchQuery.toLowerCase()));
 

  return (
    <div className="home-container" style={{ width: '100%', overflowX: 'hidden' }}>
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0" style={{ zIndex: 1000, background: 'rgba(0,12,26,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container-fluid px-lg-5">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={logo} alt="Logo" height="40" className="bg-white rounded p-1 me-2" />
            <span className="fw-bold">AREWA VISA ACADEMY</span>
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="position-relative text-white d-flex align-items-center overflow-hidden" style={{ minHeight: '100vh', width: '100%' }}>
        {heroImages.map((img, index) => (
          <div key={index} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `linear-gradient(rgba(0,31,63,0.7), rgba(0,77,0,0.6)), url(${img})`,
            backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.5s ease-in-out',
            opacity: currentSlide === index ? 1 : 0, zIndex: currentSlide === index ? 1 : 0
          }} />
        ))}
        
        <div className="container-fluid px-lg-5 px-3 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h6 className="text-uppercase fw-bold mb-3" style={{ letterSpacing: '3px', color: '#90ee90' }}>Your Global Career Awaits</h6>
              <h1 className="display-2 fw-bold mb-4" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>AREWA VISA ACADEMY</h1>
              <p className="lead mb-5 opacity-90 fw-light" style={{ maxWidth: '700px', fontSize: '1.25rem' }}>
                Bridging the gap between your ambition and a global career. We provide professional training and seamless visa processing for worldwide opportunities.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button 
                  onClick={() => { setShowCourseForm(true); setSelectedCourse("general"); }} 
                  className="btn btn-danger btn-lg px-4 py-3 fw-bold rounded-pill shadow"
                >
                  APPLY TRAINING COURSE
                </button>

                <button onClick={() => setShowForm(true)} className="btn btn-warning btn-lg px-4 py-3 fw-bold rounded-pill shadow text-dark">
                  APPLY FOR JOB
                </button>
                <button onClick={scrollToCourses} className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-pill">VIEW COURSES</button>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="glass-card p-4 p-md-5 rounded-4 border border-white border-opacity-25" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="bg-success p-3 rounded-circle text-white shadow"><Building2 size={30}/></div>
                  <div>
                    <h4 className="fw-bold mb-0">FOR EMPLOYERS</h4>
                    <p className="small mb-0 opacity-75">Hire our certified professionals</p>
                  </div>
                </div>
                <p className="mb-4 small">Are you a Hotel, Company, Shop, or Homeowner in need of highly trained workers? Request skilled manpower from our academy today.</p>
                <button onClick={() => setShowManpowerForm(true)} className="btn btn-success w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2">
                  <Users size={20}/> REQUEST MANPOWER
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="py-5 shadow-sm w-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid px-lg-5">
          <div className="row text-center g-4">
            <div className="col-md-4"><div className="d-flex align-items-center justify-content-center gap-3"><Globe className="text-success" size={32} /><span className="fw-bold text-dark fs-5">Global Opportunities</span></div></div>
            <div className="col-md-4 border-md-start border-md-end border-2"><div className="d-flex align-items-center justify-content-center gap-3"><Award className="text-primary" size={32} /><span className="fw-bold text-dark fs-5">Certified Training</span></div></div>
            <div className="col-md-4"><div className="d-flex align-items-center justify-content-center gap-3"><CheckCircle className="text-danger" size={32} /><span className="fw-bold text-dark fs-5">100% Transparency</span></div></div>
          </div>
        </div>
      </section>

     {/* COURSES SECTION */}
      <section ref={coursesRef} className="py-5 bg-white">
        <div className="container-fluid px-lg-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-2" style={{ color: '#001f3f' }}>OUR TRAINING COURSES</h2>
            <div className="mx-auto" style={{ width: '60px', height: '4px', backgroundColor: '#dc3545' }}></div>
            <p className="text-muted mt-3">Select a specialized course to receive world-class professional training.</p>
          </div>
          <div className="row g-4">
            {coursesData.map((course) => (
              <div className="col-lg-3 col-md-6" key={course.id}>
                <div className="card h-100 border-0 shadow-sm p-4 text-center" style={{ borderRadius: '20px', transition: '0.3s' }}>
                  <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ backgroundColor: `${course.color}15`, color: course.color }}>{course.icon}</div>
                  <h5 className="fw-bold mb-3">{course.title}</h5>
                  <p className="text-muted small mb-4">{course.desc}</p>
                  <button 
                    onClick={() => { 
                      setShowCourseForm(true); 
                      setSelectedCourse(course.title); 
                    }} 
                    className="btn btn-danger w-100 rounded-pill py-2"
                  >
                    Apply for this Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* COURSE APPLICATION FORM */}
      {showCourseForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-2 py-4" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.85)', overflowY: 'auto' }}>
          <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '900px', borderRadius: '20px', overflow: 'hidden' }}>
            <button onClick={() => setShowCourseForm(false)} className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm"><X size={20} /></button>
            <div className="row g-0">
              <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                <GraduationCap size={60} className="mx-auto mb-3"/>
                <h4 className="fw-bold">COURSE APPLICATION</h4>
                <p className="small mt-2">{coursesData.length} Courses Available</p>
              </div>
              {/* Upload Passport Photo */}
              <div className="col-md-6">
                <label className="form-label fw-bold small">Upload Passport Photo (JPEG/PNG)</label>
                <div className="border-2 border-dashed rounded-3 p-3 text-center bg-light">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    required
                    onChange={handlePhotoChange}
                  />
                  <p className="small text-muted mb-0 mt-2">Max file size: 5MB</p>
                </div>
              </div>
              <div className="col-md-9 p-4 p-md-5 bg-white">
                <form className="row g-3" onSubmit={handleInitialSubmit}>
                  {/* PERSONAL DETAILS */}
                  <div className="col-12"><h6 className="fw-bold text-danger border-bottom pb-2 mb-2">Personal Details</h6></div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Full Name</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Date of Birth (Optional)</label>
                    <input type="date" className="form-control form-control-sm border-2 shadow-sm" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Age (Optional)</label>
                    <input type="number" className="form-control form-control-sm border-2 shadow-sm" placeholder="Enter age if known" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Email Address</label>
                    <input type="email" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Phone Number</label>
                    <input type="tel" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>

                  {/* LOCATION */}
                  <div className="col-12"><h6 className="fw-bold text-danger border-bottom pb-2 mt-3 mb-2">Location Details</h6></div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Full Home Address</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">State</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">LGA</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Country</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" defaultValue="Nigeria" required />
                  </div>
                  {/* EDUCATIONAL BACKGROUND - OPTIONAL */}
                  <div className="col-12 border-bottom pb-2 mt-3 mb-2">
                    <h6 className="fw-bold text-danger">Educational Background (Optional)</h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Primary School</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="School Name" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Primary Completion Year</label>
                    <input type="number" className="form-control form-control-sm border-2 shadow-sm" placeholder="e.g. 2010" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Secondary School</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="School Name" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Secondary Completion Year</label>
                    <input type="number" className="form-control form-control-sm border-2 shadow-sm" placeholder="e.g. 2016" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Tertiary Institution</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="College/Polytechnic" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Course / Diploma</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="e.g. National Diploma in Accounting" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small">University</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="University Name" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Degree / Qualification</label>
                    <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="e.g. BSc Economics" />
                  </div>

                  {/* COURSE DETAILS */}
                  <div className="col-12"><h6 className="fw-bold text-danger border-bottom pb-2 mt-3 mb-2">Course Preference</h6></div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Course Mode</label>
                    <select className="form-select form-select-sm border-2 shadow-sm" required>
                      <option value="">-- Select Mode --</option>
                      <option value="online">Online</option>
                      <option value="physical">Physical</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Select Course</label>
                    <select className="form-select form-select-sm border-2 shadow-sm" required>
                      <option value="">-- Select Course --</option>
                      {coursesData.map(course => <option key={course.id} value={course.title}>{course.title}</option>)}
                    </select>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg">
                      SUBMIT APPLICATION & PAY ₦15,000 <ArrowRight size={20} className="ms-2"/>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* COURSE DETAIL MODAL - UPDATED WORLD CLASS VERSION */}
      {selectedCourse && typeof selectedCourse !== 'string' && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '850px', borderRadius: '25px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 p-md-5 position-relative">
              <button onClick={() => setSelectedCourse(null)} className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm"><X size={20} /></button>
              <div className="text-center py-4">
                <div className="mb-4 d-inline-block p-4 rounded-circle bg-light shadow-sm" style={{ color: selectedCourse.color }}>{selectedCourse.icon}</div>
                <h2 className="fw-bold mb-3 text-uppercase">{selectedCourse.title}</h2>
                <p className="lead text-muted mb-4">{selectedCourse.desc}</p>
                <div className="row g-3 text-start mb-5">
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-4 border-start border-4 border-danger h-100">
                      <h6 className="fw-bold d-flex align-items-center"><BookOpen size={18} className="me-2 text-danger"/> Syllabus Content</h6>
                      <p className="small text-muted mb-0">{selectedCourse.details}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-4 border-start border-4 border-primary h-100">
                      <h6 className="fw-bold d-flex align-items-center"><Award size={18} className="me-2 text-primary"/> Certification</h6>
                      <p className="small text-muted mb-0">Student receives a globally recognized certificate verifiable online.</p>
                    </div>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button onClick={() => { setShowForm(true); setSelectedCourse(selectedCourse.title); }} className="btn btn-danger py-3 rounded-pill fw-bold">ENROLL NOW</button>
                  <button onClick={() => setSelectedCourse(null)} className="btn btn-light py-3 rounded-pill fw-bold">CLOSE</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORK ABROAD GRID */}
      <section ref={jobsRef} className="py-5 bg-light w-100">
        <div className="container-fluid px-lg-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-2" style={{ color: '#001f3f' }}>WORK ABROAD OPPORTUNITIES</h2>
            <div className="mx-auto" style={{ width: '80px', height: '5px', backgroundColor: '#004d00' }}></div>
            <p className="mt-3 text-muted">Explore latest international job openings available for our certified graduates.</p>
          </div>
          <div className="row g-4">
            {availableJobs.map(job => (
              <div className="col-xl-3 col-md-6 col-sm-12" key={job.id}>
                <div className="card h-100 border-0 shadow-sm p-4" style={{ borderTop: '5px solid #004d00', borderRadius: '15px' }}>
                  <span className="text-muted small text-uppercase fw-bold">{job.category}</span>
                  <h4 className="fw-bold my-3" style={{ fontSize: '1.2rem' }}>{job.title}</h4>
                  <p className="text-primary fw-semibold mb-1"><MapPin size={18} className="me-1" /> {job.country}</p>
                  <p className="text-muted small mb-0">{job.slot}</p>
                  <button onClick={() => { setShowForm(true); setSelectedCourse(null); }} className="btn btn-outline-success btn-sm rounded-pill mt-3 fw-bold">APPLY NOW</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US MODAL */}
      {showAboutModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 11000, backgroundColor: 'rgba(0,0,0,0.85)', overflowY: 'auto' }}>
          <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '800px', borderRadius: '25px' }}>
            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h2 className="fw-bold text-danger">ABOUT US</h2>
                <button onClick={() => setShowAboutModal(false)} className="btn btn-light rounded-circle"><X size={20}/></button>
              </div>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <h5 className="fw-bold">Who We Are</h5>
                <p>Arewa Visa Academy is a forward‑thinking recruitment and training institution dedicated to connecting talent with global opportunities. We operate at the intersection of international recruitment, professional skills development, and digital automation, providing a transparent and structured pathway for individuals seeking career growth beyond borders.</p>
                <h5 className="fw-bold mt-4">Our Mission</h5>
                <p>To empower individuals with the right skills, guidance, and access needed to compete confidently in the global job market through ethical recruitment practices, quality training, and secure digital systems.</p>
                <h5 className="fw-bold mt-4">Our Vision</h5>
                <p>To become a trusted African‑based global platform for recruitment and vocational education, recognized for integrity, innovation, and measurable success stories.</p>
                <h5 className="fw-bold mt-4">What We Do</h5>
                <ul>
                  <li>Facilitate international job recruitment through verified partner networks</li>
                  <li>Deliver practical online and physical training programs via a hybrid LMS</li>
                  <li>Automate application processing, payments, and communication for efficiency and transparency</li>
                </ul>
                <h5 className="fw-bold mt-4">Our Approach</h5>
                <p>We believe opportunity should be clear, structured, and accessible. Our platform is designed to guide users step‑by‑step — from application and training to communication and progress tracking.</p>
                <h5 className="fw-bold mt-4 text-danger">Trust & Transparency</h5>
                <p>Arewa Visa Academy does not promise guaranteed visas or employment. Instead, we focus on preparation, compliance, and proper representation, ensuring every applicant is processed fairly and informed at every stage.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TERMS & PRIVACY MODAL */}
      {showTermsModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 11000, backgroundColor: 'rgba(0,0,0,0.85)', overflowY: 'auto' }}>
          <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '850px', borderRadius: '25px' }}>
            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h2 className="fw-bold text-primary">TERMS & PRIVACY POLICY</h2>
                <button onClick={() => setShowTermsModal(false)} className="btn btn-light rounded-circle"><X size={20}/></button>
              </div>
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <h4 className="fw-bold mb-3 border-bottom pb-2">TERMS & CONDITIONS</h4>
                <p className="small"><strong>1. Acceptance:</strong> By accessing the portal, you agree to these Terms.</p>
                <p className="small"><strong>2. Scope:</strong> We provide recruitment facilitation and training. We do not guarantee visa approval.</p>
                <p className="small"><strong>3. Responsibility:</strong> Users must provide truthful information and valid documents.</p>
                <p className="small"><strong>4. Liability:</strong> We are not liable for rejections caused by third parties or immigration authorities.</p>

                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">PRIVACY POLICY</h4>
                <p className="small"><strong>1. Collection:</strong> We collect personal data including names, contact details, and uploaded documents.</p>
                <p className="small"><strong>2. Protection:</strong> Data is protected using SSL encryption and restricted to authorized personnel.</p>
                <p className="small"><strong>3. Sharing:</strong> Data is only shared with verified recruitment partners where necessary.</p>

                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">REFUND POLICY</h4>
                <p className="small">All job application and processing fees are non-refundable once submitted. Training fees are non-refundable once access is granted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANPOWER REQUEST FORM */}
      {showManpowerForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.9)', overflowY: 'auto' }}>
          <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '900px', borderRadius: '20px', overflow: 'hidden' }}>
            <button onClick={() => { setShowManpowerForm(false); setIsSuccess(false); }} className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm" style={{ zIndex: 100 }}><X size={20} /></button>
            <div className="row g-0">
              <div className="col-md-4 bg-success p-5 text-white text-center d-flex flex-column justify-content-center">
                <Building2 size={70} className="mx-auto mb-4 opacity-75"/>
                <h3 className="fw-bold">RECRUITMENT PORTAL</h3>
                <p className="small opacity-75">Connect with the best certified professionals for your business or home.</p>
              </div>
              <div className="col-md-8 p-4 p-md-5 bg-white">
                {isSuccess ? (
                  <div className="text-center py-5">
                    <CheckCircle size={80} className="text-success mb-4"/>
                    <h2 className="fw-bold">Request Sent!</h2>
                    <p className="text-muted">Our recruitment team will contact you shortly.</p>
                    <button onClick={() => { setShowManpowerForm(false); setIsSuccess(false); }} className="btn btn-dark px-5 py-2 rounded-pill mt-3">Finish</button>
                  </div>
                ) : (
                  <form className="row g-3" onSubmit={handleInitialSubmit}>
                    <div className="col-12"><h5 className="fw-bold text-success border-bottom pb-2">Business/Requestor Information</h5></div>
                    <div className="col-md-6"><label className="form-label fw-bold small">Company/Employer Name</label><input type="text" className="form-control" required /></div>
                    <div className="col-md-6"><label className="form-label fw-bold small">Organization Type</label><select className="form-select" required><option value="">-- Select --</option><option>Company</option><option>Hotel</option><option>Private Home</option></select></div>
                    <div className="col-md-4"><label className="form-label fw-bold small">Country</label><input type="text" className="form-control" required /></div>
                    <div className="col-md-4"><label className="form-label fw-bold small">State / Province</label><input type="text" className="form-control" required /></div>
                    <div className="col-md-4"><label className="form-label fw-bold small">Postal / Zip Code</label><input type="text" className="form-control" /></div>
                    <div className="col-12"><label className="form-label fw-bold small">Physical Address</label><input type="text" className="form-control" required /></div>
                    <div className="col-12 mt-4"><button type="submit" className="btn btn-success w-100 py-3 fw-bold rounded-pill">SUBMIT REQUEST</button></div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM MODAL */}
      {showForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', overflowY: 'auto' }}>
          <div className="card border-0 shadow-lg position-relative w-100" style={{ maxWidth: '1000px', borderRadius: '20px', overflow: 'hidden' }}>
            <button onClick={() => { setShowForm(false); setIsSuccess(false); setShowPaymentStep(false); setPhotoPreview(null); setSelectedCourse(null); setJobSearchQuery(""); }} className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm" style={{ zIndex: 100 }}><X size={20} /></button>
            <div className="row g-0">
              <div className="col-md-3 bg-danger p-4 text-white d-flex flex-column justify-content-center text-center">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="mx-auto mb-3 border border-3 border-white shadow" style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px' }} /> : <UserCheck size={60} className="mx-auto mb-3" />}
                <h4 className="fw-bold">{showPaymentStep ? "FEES PAYMENT" : (selectedCourse ? "ADMISSION FORM" : "JOB APPLICATION")}</h4>
              </div>
              <div className="col-md-9 p-3 p-md-5 bg-white">
                {isSuccess ? (
                  <div className="text-center py-5">
                    <CheckCircle size={60} className="text-success mb-4"/><h2 className="fw-bold">Success!</h2>
                    <p>Your application and payment have been received.</p>
                    <button onClick={() => { setShowForm(false); setIsSuccess(false); }} className="btn btn-dark px-5 py-2 rounded-pill mt-3">Close Portal</button>
                  </div>
                ) : showPaymentStep ? (
                  <div className="text-center py-4">
                    <Wallet size={60} className="text-danger mb-3"/>
                    <h3 className="fw-bold mb-3">Consultation & Processing Fee</h3>
                    <div className="bg-light p-4 rounded-4 mb-4">
                      <h1 className="display-5 fw-bold text-dark">₦15,000</h1>
                      <p className="text-muted mb-0 small">Secure Payment Required to Complete Registration</p>
                    </div>
                    <ul className="list-unstyled text-start mx-auto mb-5" style={{maxWidth: '400px'}}>
                      <li className="mb-2"><CheckCircle size={16} className="text-success me-2"/> Application Review</li>
                      <li className="mb-2"><CheckCircle size={16} className="text-success me-2"/> Document Verification</li>
                      <li className="mb-2"><CheckCircle size={16} className="text-success me-2"/> Consultation Session</li>
                    </ul>
                    <div className="d-grid gap-2">
                      <button onClick={handleFinalPayment} className="btn btn-danger py-3 rounded-pill fw-bold shadow">
                        {isSubmitting ? <><Loader2 className="spinner-border spinner-border-sm me-2"/> PROCESSING...</> : "PAY & COMPLETE NOW"}
                      </button>
                      <button onClick={() => setShowPaymentStep(false)} className="btn btn-link text-muted fw-bold">Back to Form</button>
                    </div>
                  </div>
                ) : (
                  <form className="row g-3" onSubmit={handleInitialSubmit}>
                    <div className="col-12 border-bottom pb-2 mb-2"><h6 className="fw-bold text-danger">Personal & Identity Details</h6></div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Passport Photo</label>
                      <input type="file" className="form-control form-control-sm border-2 shadow-sm" accept="image/*" onChange={handlePhotoChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Full Legal Name</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" placeholder="Firstname Middlename Surname" required />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-bold small">Email Address</label>
                      <input type="email" className="form-control form-control-sm border-2 shadow-sm" placeholder="example@mail.com" required />
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label fw-bold small">Gender</label>
                      <select className="form-select form-select-sm border-2" required>
                        <option value="">Select</option><option>Male</option><option>Female</option>
                      </select>
                    </div>
                    <div className="col-6 col-md-2">
                      <label className="form-label fw-bold small">Age</label>
                      <input type="number" className="form-control form-control-sm border-2" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">NIN Number / ID</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                    </div>
                    <div className="col-md-6">
                    <label className="form-label fw-bold small">International Passport Number</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm border-2 shadow-sm" 
                      placeholder="A12345678" 
                      required 
                    />
                  </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">WhatsApp Number (+Code)</label>
                      <input type="tel" className="form-control form-control-sm border-2 shadow-sm" placeholder="+234..." required />
                    </div>

                    <div className="col-12 border-bottom pb-2 mt-3 mb-2"><h6 className="fw-bold text-danger">Location & Background</h6></div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">State of Origin</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">LGA</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Country of Residence</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" defaultValue="Nigeria" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small">Full Home Address</label>
                      <input type="text" className="form-control form-control-sm border-2 shadow-sm" required />
                    </div>

                    <div className="col-12 border-bottom pb-2 mt-3 mb-2"><h6 className="fw-bold text-danger">Application Interest</h6></div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Target Destination</label>
                      <select className="form-select form-select-sm border-2 shadow-sm" required>
                        <option value="">-- Select Country --</option>
                        {countriesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">Position Category</label>
                      <select className="form-select form-select-sm border-2 shadow-sm" required>
                        <option value="">-- Select Category --</option>
                        <optgroup label="Unskilled">{unskilledJobsList.map(j => <option key={j} value={j}>{j}</option>)}</optgroup>
                        <optgroup label="Skilled">{skilledJobsList.map(j => <option key={j} value={j}>{j}</option>)}</optgroup>
                      </select>
                    </div>
                    <div className="col-md-6">
                    <label className="form-label fw-bold small">Upload int'l Passport (PDF / Image)</label>
                    <div className="border-2 border-dashed rounded-3 p-3 text-center bg-light">
                      <input 
                        type="file" 
                        className="form-control form-control-sm" 
                        accept="image/*,application/pdf"
                        required 
                      />
                      <p className="small text-muted mb-0 mt-2">Max file size: 5MB</p>
                    </div>
                  </div>
                  <div className="col-12">
                  <label className="form-label fw-bold small">Upload Resume / Credentials (PDF)</label>
                  <div className="border-2 border-dashed rounded-3 p-3 text-center bg-light">
                    <input type="file" className="form-control form-control-sm" accept="application/pdf" required />
                    <p className="small text-muted mb-0 mt-2">Max file size: 5MB</p>
                  </div>
                </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small">Upload CV (PDF)</label>
                      <div className="border-2 border-dashed rounded-3 p-3 text-center bg-light">
                        <input type="file" className="form-control form-control-sm" required />
                        <p className="small text-muted mb-0 mt-2">Max file size: 5MB</p>
                      </div>
                    </div>
                    
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg">
                        SUBMIT APPLICATION & PAY ₦15,000 <ArrowRight size={20} className="ms-2"/>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-5 bg-dark text-white">
        <div className="container-fluid px-lg-5 text-center">
          <img src={logo} alt="Logo" height="50" className="bg-white rounded p-1 mb-4" />
          <h4 className="fw-bold mb-4">AREWA VISA ACADEMY</h4>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <Facebook className="pointer hover-scale" />
            <Twitter className="pointer hover-scale" />
            <Instagram className="pointer hover-scale" />
            <Linkedin className="pointer hover-scale" />
          </div>
          <p className="small opacity-50">© 2026 Arewa Visa Academy. All Rights Reserved.</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
             <span className="small pointer text-decoration-underline" onClick={() => setShowTermsModal(true)}>Terms of Service</span>
             <span className="small pointer text-decoration-underline" onClick={() => setShowTermsModal(true)}>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;