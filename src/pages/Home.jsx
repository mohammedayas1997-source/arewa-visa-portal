import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

// Sabbin Components din da ka hada
import CBIApplicationForm from "../components/CBIApplicationForm";
import InsuranceApplicationForm from "../components/InsuranceApplicationForm";
import JobApplicationForm from "../components/JobApplicationForm";
import CourseApplicationForm from "../components/CourseApplicationForm";
import FlightBookingSystem from "../components/FlightBookingSystem";
import ManpowerRequestForm from "../components/ManpowerRequestForm";
import ApplyPayment from "../components/ApplyPayment";

// Icons
import {
  Plane,
  Users,
  Globe,
  Headphones,
  Briefcase,
  Ship,
  FileText,
  Building2,
  Hotel,
  X,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  BookOpen,
  ShieldCheck,
  Clock,
  Award,
  Linkedin,
  ArrowRight,
  Globe2,
  UserCheck,
  Loader2,
  CreditCard,
  Hash,
  Search,
  GraduationCap,
  Brush,
  Package,
  ChevronDown,
  ChevronUp,
  Wallet,
  Heart,
  Star,
  Activity,
  AlertTriangle,
  RefreshCcw,
  Edit3,
  Banknote,
  ArrowLeft,
  Wind,
} from "lucide-react";

// Assets
import logo from "../assets/logo.png";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import hero5 from "../assets/hero5.jpg";

const Home = () => {
  const navigate = useNavigate();
  const coursesRef = useRef(null);
  const jobsRef = useRef(null);

  // --- STATES ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [admissionId, setAdmissionId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Toggle States
  const [showForm, setShowForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showManpowerForm, setShowManpowerForm] = useState(false);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [showCBIForm, setShowCBIForm] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [expandedApplyInfo, setExpandedApplyInfo] = useState(false);
  const [expandedManpower, setExpandedManpower] = useState(false);
  const [showCBIDetails, setShowCBIDetails] = useState(false);

  // Form Data States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isOtherCountry, setIsOtherCountry] = useState(false);
  const [isOtherJob, setIsOtherJob] = useState(false);
  const [isOtherManpower, setIsOtherManpower] = useState(false);

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    country: "",
    job: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    passportNumber: "",
    insuranceType: "",
  });

  // Flight System States
  const [view, setView] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoadingFlight, setIsLoadingFlight] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketID, setTicketID] = useState("");

  // Assets Arrays
  const heroImages = [hero1, hero2, hero3, hero4, hero5];
  const backgroundImages = [hero1, hero2, hero3];
  const nigerianStates = ["Kano", "Kaduna", "Abuja", "Lagos", "Katsina"];
  const airlinePrices = {
    "Air Peace": 95000,
    "Max Air": 90000,
    "Arik Air": 85000,
  };
  const flightTimes = ["08:00 AM", "12:00 PM", "04:00 PM", "09:00 PM"];

  // --- FUNCTIONS (Placeholders to prevent blank screen) ---
  const handlePhotoChange = (e) => {
    /* Logic here */
  };
  const handleChange = (e) => {
    /* Logic here */
  };
  const handleFileChange = (e) => {
    /* Logic here */
  };
  const handleFinalPayment = () => {
    /* Logic here */
  };
  const handleVerifyID = () => {
    setIsVerified(true);
  };
  const handleInitialSubmit = (e) => {
    e.preventDefault();
  };
  const handleCBISubmit = (e) => {
    e.preventDefault();
  };
  const handleInsuranceApplication = (e) => {
    e.preventDefault();
  };
  const handleAirlineChange = (e) => {
    setSelectedAirline(e.target.value);
  };
  const handleProceedToPayment = () => {
    /* Logic */
  };
  const handleFindTicket = () => {
    /* Logic */
  };
  const scrollToCourses = () =>
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Fetch News & Gallery from Firebase
  useEffect(() => {
    const newsRef = ref(db, "news");
    onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNews(Object.values(data));
    });

    const galleryRef = ref(db, "gallery");
    onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setGallery(Object.values(data));
    });
  }, []);

  const whatWeDoList = [
    "JOBS SEARCH",
    "VISA TRAINING",
    "VISA CONSULTATION",
    "WORK ABROAD",
    "MANPOWER",
    "FOREIGN RECRUITMENT",
    "CV WRITING & INTERVIEW PREPARATION",
    "CITIZENSHIP BY INVESTMENT PROGRAM",
  ];

  const coursesData = [
    {
      id: 1,
      title: "CLEANING COURSE",
      price: 100000,
      desc: "Industrial and commercial sanitation standards.",
      details:
        "Comprehensive training in modern cleaning techniques, chemical safety, and specialized equipment handling for global sectors.",
      icon: <Brush size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.50 PM.jpeg",
      color: "#007bff",
    },
    {
      id: 2,
      title: "HOUSEKEEPING COURSE",
      price: 100000,
      desc: "Professional hospitality management for luxury hotels.",
      details:
        "Focuses on guest relations, room maintenance, and high-end service standards required in international resorts.",
      icon: <Hotel size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.51 PM.jpeg",
      color: "#6610f2",
    },
    {
      id: 3,
      title: "LAUNDRY SERVICE COURSE",
      price: 100000,
      desc: "Fabric care and industrial laundry operations.",
      details:
        "Advanced dry cleaning techniques, textile science, and operational mastery of commercial laundry systems.",
      icon: <Wind size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.51 PM (1).jpeg",
      color: "#0dcaf0",
    },
    {
      id: 4,
      title: "VISA PROCESSING COURSE",
      price: 200000, // Higher price for specialized course
      desc: "Global immigration and documentation training.",
      details:
        "Mastering application workflows, appointment scheduling, and embassy compliance for international travel.",
      icon: <FileText size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.51 PM (2).jpeg",
      color: "#dc3545",
    },
    {
      id: 5,
      title: "TICKETING & RESERVATION",
      price: 100000,
      desc: "Aviation booking and GDS system mastery.",
      details:
        "Professional training in Amadeus and Galileo systems for flight booking, fare construction, and itinerary management.",
      icon: <Plane size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.52 PM.jpeg",
      color: "#198754",
    },
    {
      id: 6,
      title: "AGENCY MANAGEMENT",
      price: 100000,
      desc: "Business architecture for travel firms.",
      details:
        "Strategic management of travel agencies, IATA standards, marketing, and global partnership logistics.",
      icon: <Briefcase size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.52 PM (1).jpeg",
      color: "#fd7e14",
    },
    {
      id: 7,
      title: "CUSTOMER SERVICE COURSE",
      price: 100000,
      desc: "Corporate communication and office administration.",
      details:
        "Professional etiquette, conflict resolution, and client relations training for high-level corporate environments.",
      icon: <Headphones size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.57 PM.jpeg",
      color: "#ffc107",
    },
    {
      id: 8,
      title: "AIRCRAFT CLEANER COURSE",
      price: 100000,
      desc: "Aviation-grade sterilization and safety protocols.",
      details:
        "Specialized modules on aircraft interior maintenance, hazardous materials handling, and aviation security compliance.",
      icon: <Ship size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.57 PM (1).jpeg",
      color: "#20c997",
    },
    {
      id: 9,
      title: "SECURITY TRAINING",
      price: 100000,
      desc: "Professional security and surveillance training.",
      details:
        "Modern security protocols, emergency response, and surveillance technology management.",
      icon: <ShieldCheck size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.26.58 PM.jpeg",
      color: "#343a40",
    },
    {
      id: 10,
      title: "CAREGIVER - NANNY COURSE",
      price: 100000,
      desc: "Professional pediatric and elderly healthcare.",
      details:
        "Certified training in first aid, child development, geriatric care, and domestic safety for global households.",
      icon: <Users size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.27.02 PM.jpeg",
      color: "#d63384",
    },
    {
      id: 11,
      title: "CARGO & LOGISTICS COURSE",
      price: 100000,
      desc: "Global supply chain and freight operations.",
      details:
        "Mastery of freight forwarding, customs documentation, warehousing, and international shipping logistics.",
      icon: <Package size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.27.03 PM.jpeg",
      color: "#6f42c1",
    },
    {
      id: 12,
      title: "TRAVELS AND TOURISM",
      price: 100000,
      desc: "International tourism and package development.",
      details:
        "Comprehensive geography, tourism legislation, and strategic planning of global vacation and travel packages.",
      icon: <Globe2 size={40} />,
      image: "/WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg",
      color: "#001f3f",
    },
  ];
  const availableJobs = [
    {
      id: 1,
      title: "Security Guard",
      country: "Australia 🇦🇺",
      slot: "12 Slots Left",
      category: "Security",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Caregiver - Nanny",
      country: "Canada 🇨🇦",
      slot: "8 Slots Left",
      category: "Healthcare",
      image:
        "https://images.unsplash.com/photo-1516533075015-a3838414c3ca?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Professional Cleaner",
      country: "USA 🇺🇸",
      slot: "25 Slots Left",
      category: "Cleaning",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Visa Officer",
      country: "Schengen Area 🇪🇺",
      slot: "5 Slots Left",
      category: "Schengen",
      image:
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      title: "Hotel Housekeeper",
      country: "Japan 🇯🇵",
      slot: "15 Slots Left",
      category: "Hospitality",
      image:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      title: "Laundry Specialist",
      country: "South Korea 🇰🇷",
      slot: "10 Slots Left",
      category: "Service",
      image:
        "https://images.unsplash.com/photo-1545173153-5d0bad499755?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 7,
      title: "Ticketing Officer",
      country: "New Zealand 🇳🇿",
      slot: "4 Slots Left",
      category: "Travel",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 8,
      title: "Customer Support",
      country: "Gulf Countries 🇶🇦 🇦🇪",
      slot: "20 Slots Left",
      category: "Gulf",
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 9,
      title: "Travel Agency Manager",
      country: "United Kingdom 🇬🇧",
      slot: "2 Slots Left",
      category: "Management",
      image:
        "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 10,
      title: "Aircraft Cleaner",
      country: "Russia 🇷🇺",
      slot: "12 Slots Left",
      category: "Aviation",
      image:
        "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 11,
      title: "Logistics Clerk",
      country: "Mauritius 🇲🇺",
      slot: "7 Slots Left",
      category: "Logistics",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 12,
      title: "Tour Guide",
      country: "Seychelles 🇸🇨",
      slot: "6 Slots Left",
      category: "Tourism",
      image:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    },
  ];
  const countriesList = [
    "Australia",
    "Canada",
    "USA",
    "Schengen (Germany, Poland, France, etc.)",
    "Japan",
    "South Korea",
    "New Zealand",
    "Gulf (Qatar, Oman, Kuwait, UAE, etc.)",
    "United Kingdom",
    "Russia",
    "Mauritius",
    "Seychelles",
    "Central Asia",
    "Balkans",
  ];

  const unskilledJobsList = [
    "Cleaner",
    "Loader/Unloader",
    "Helper/Assistant",
    "Security Guard",
    "Farm Laborer",
    "Sweeper",
    "Food Preparation Worker",
    "Retail Clerk",
    "Delivery Driver",
    "Hospitality Worker",
    "Dishwasher",
    "Housekeeper",
    "Car Wash Attendant",
    "Harvester or Picker",
    "Babysitter",
    "Cashier",
    "Parking Lot Attendant",
    "Agricultural Worker",
    "Janitor",
    "Porter",
  ];

  const skilledJobsList = [
    "Software Developer",
    "Nurse",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Mechanic",
    "Teacher/Lecturer",
    "Accountant",
    "Engineer",
    "Graphic Designer",
  ];

  return (
    <div
      className="home-container"
      style={{ width: "100%", overflowX: "hidden" }}
    >
      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-dark position-fixed w-100 top-0"
        style={{
          zIndex: 1000,
          background: "rgba(0,12,26,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="container-fluid px-lg-5">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src={logo}
              alt="Logo"
              height="40"
              className="bg-white rounded p-1 me-2"
            />
            <span className="fw-bold">AREWA VISA ACADEMY</span>
          </a>
        </div>
      </nav>
      {/* HERO SECTION */}
      <section
        className="position-relative text-white d-flex align-items-center overflow-hidden"
        style={{ minHeight: "100vh", width: "100%" }}
      >
        {heroImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(0,31,63,0.7), rgba(0,77,0,0.6)), url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 1.5s ease-in-out",
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 1 : 0,
            }}
          />
        ))}

        <div
          className="container-fluid px-lg-5 px-3 position-relative"
          style={{ zIndex: 2 }}
        >
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h6
                className="text-uppercase fw-bold mb-3"
                style={{ letterSpacing: "3px", color: "#90ee90" }}
              >
                Your Global Career Awaits
              </h6>
              <h1
                className="display-2 fw-bold mb-4"
                style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}
              >
                AREWA VISA ACADEMY
              </h1>
              <p
                className="lead mb-5 opacity-90 fw-light"
                style={{ maxWidth: "700px", fontSize: "1.25rem" }}
              >
                Bridging the gap between your ambition and a global career. We
                provide professional training and seamless visa processing for
                worldwide opportunities.
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setShowCourseForm(true);
                    setSelectedCourse("general");
                  }}
                  className="btn btn-danger px-3 py-2 fw-bold rounded-pill shadow-sm"
                  style={{ fontSize: "0.9rem" }}
                >
                  APPLY TRAINING COURSE
                </button>

                {/* STUDENT PORTAL BUTTON - AREWA VISA ACADEMY */}
                <button
                  onClick={() => navigate("/student-login")}
                  className="btn btn-lg rounded-pill px-5 py-3 fw-black d-flex align-items-center gap-2 shadow-sm transition-all"
                  style={{
                    border: "2px solid #2563eb", // Kalar Blue din Arewa Visa
                    backgroundColor: "transparent",
                    color: "#2563eb",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    fontWeight: "900",
                    // Wannan zai sa button din ya canja launi idan an taba shi
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  <GraduationCap size={20} />
                  Student Portal
                </button>
                {/* APPLY JOB BUTTON & CONTENT */}
                <div className="col-lg-12 mt-4">
                  <div
                    className="card border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{ maxWidth: "600px" }}
                  >
                    <button
                      onClick={() => setExpandedApplyInfo(!expandedApplyInfo)}
                      className="btn btn-danger btn-lg py-4 fw-bold rounded-0 d-flex align-items-center justify-content-between px-4"
                    >
                      <span className="d-flex align-items-center gap-2">
                        <Plane size={18} /> OPEN THE DOOR TO OVERSEAS JOBS 🌍✈️
                      </span>
                      <ChevronDown
                        style={{
                          transform: expandedApplyInfo
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "0.3s",
                        }}
                      />
                    </button>

                    {expandedApplyInfo && (
                      <div
                        className="p-4 bg-white text-dark animate__animated animate__fadeIn"
                        style={{ maxHeight: "60vh", overflowY: "auto" }}
                      >
                        {/* Intro Section */}
                        <div className="mb-4">
                          <h5 className="fw-bold text-danger">
                            Open the Door to Overseas Job Opportunities
                          </h5>
                          <p
                            className="fw-bold mb-1 mt-3"
                            style={{ fontSize: "0.9rem" }}
                          >
                            Some people dream. Others take action.
                          </p>
                          <p className="small text-muted">
                            If you are among those who want to change their
                            lives through working abroad, you are in the right
                            place. We do not come with false promises. We come
                            with structure, honesty, and professional expertise
                            — because overseas employment is not about luck, it
                            is about preparation.
                          </p>
                        </div>

                        {/* Why Choose Us */}
                        <div
                          className="p-3 rounded-4 mb-4"
                          style={{
                            backgroundColor: "#fff5f5",
                            border: "1px solid #fed7d7",
                          }}
                        >
                          <h6 className="fw-bold text-danger mb-3">
                            Why People Choose to Work With Us
                          </h6>
                          <p className="small text-muted mb-3">
                            Because we understand one simple truth: A person’s
                            life can change through one opportunity — when it is
                            properly prepared.
                          </p>
                          <div className="row g-2 small fw-bold">
                            <div className="col-md-6">
                              ✅ We understand your goals
                            </div>
                            <div className="col-md-6">
                              ✅ We tell you the truth
                            </div>
                            <div className="col-md-6">
                              ✅ Transparent process
                            </div>
                            <div className="col-md-6">
                              ✅ Support until destination
                            </div>
                          </div>
                        </div>

                        {/* Journey Steps */}
                        <h6 className="fw-bold mb-3 text-dark">
                          Your Journey With Us (Simple & Clear)
                        </h6>
                        <div className="ps-3 border-start border-danger border-2 mb-4">
                          <div className="mb-4">
                            <span className="d-block fw-bold text-danger">
                              🔹 Step One: Consultation
                            </span>
                            <p className="small text-muted mb-1">
                              Everything starts with understanding. We listen to
                              your goals, review your CV, and assess which
                              country suits you best.
                            </p>
                          </div>
                          <div className="mb-4">
                            <span className="d-block fw-bold text-danger">
                              🔹 Step Two: Assessment
                            </span>
                            <p className="small text-muted">
                              We assess your profile professionally and conduct
                              interviews.
                            </p>
                          </div>
                          <div className="mb-4">
                            <span className="d-block fw-bold text-danger">
                              🔹 Step Three: Offer Letter
                            </span>
                            <p className="small text-muted mb-1">
                              Official offer letter showing: country, job role,
                              and salary.
                            </p>
                          </div>
                          <div className="mb-4">
                            <span className="d-block fw-bold text-danger">
                              🔹 Step Four: Confirmation
                            </span>
                            <p className="small text-muted">
                              Once you accept, a Placement Fee becomes
                              applicable.
                            </p>
                          </div>
                        </div>

                        {/* Training Courses */}
                        <div className="bg-dark text-white p-4 rounded-4 shadow-sm">
                          <h6 className="fw-bold text-warning mb-3 d-flex align-items-center gap-2">
                            <GraduationCap size={20} /> Professional Training
                          </h6>
                          <div className="row g-2" style={{ fontSize: "12px" }}>
                            <div className="col-12 border-bottom border-secondary pb-1">
                              ✓ Interview Preparation Training
                            </div>
                            <div className="col-12 border-bottom border-secondary pb-1">
                              ✓ CV & Professional Development
                            </div>
                            <div className="col-12 border-bottom border-secondary pb-1">
                              ✓ Workplace Ethics
                            </div>
                          </div>
                        </div>

                        {/* Final Message */}
                        <div className="text-center mt-4">
                          <div
                            className="p-3 rounded-4 mb-3"
                            style={{ backgroundColor: "#fff5f5" }}
                          >
                            <h6 className="fw-bold text-danger">
                              A Message From the Heart ❤️
                            </h6>
                            <p className="small italic mb-0">
                              "If you are looking for shortcuts, we may not be
                              the right fit. But if you are looking for a
                              transparent path — we are ready to work with you."
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setShowForm(true);
                              setExpandedApplyInfo(false);
                            }}
                            className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow"
                          >
                            Start with a Consultation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-warning btn-lg px-4 py-3 fw-bold rounded-pill shadow text-dark"
                >
                  APPLY FOR JOB
                </button>
                <button
                  onClick={scrollToCourses}
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-pill"
                >
                  VIEW COURSES
                </button>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div
                className="glass-card p-4 p-md-5 rounded-4 border border-white border-opacity-25"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(15px)",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="bg-success p-3 rounded-circle text-white shadow">
                    <Building2 size={30} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">FOR EMPLOYERS</h4>
                    <p className="small mb-0 opacity-75">
                      Hire our certified professionals
                    </p>
                  </div>
                </div>
                {/* --- MANPOWER & APPLY INFO SECTION --- */}
                <section className="py-5 bg-white">
                  <div className="container-fluid px-lg-5">
                    <div className="row g-4">
                      {/* MANPOWER BUTTON & CONTENT */}
                      <div className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                          <button
                            onClick={() =>
                              setExpandedManpower(!expandedManpower)
                            }
                            className="btn btn-primary btn-lg py-4 fw-bold rounded-0 d-flex align-items-center justify-content-between px-4"
                          >
                            <span className="d-flex align-items-center gap-2">
                              <Building2 size={24} /> MANPOWER REQUEST SERVICES
                            </span>
                            <ChevronDown
                              style={{
                                transform: expandedManpower
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "0.3s",
                              }}
                            />
                          </button>

                          {expandedManpower && (
                            <div className="p-4 bg-light animate__animated animate__fadeIn shadow-inner">
                              <h5 className="fw-bold text-primary mb-3">
                                🤝 Reliable Workforce Solutions for
                                International Employers
                              </h5>
                              <p className="small text-muted">
                                We provide professional manpower recruitment
                                services exclusively for employers, contractors,
                                and international partners seeking qualified,
                                reliable, and well-screened workers.
                                <br />
                                <strong>
                                  This service is strictly business-to-business
                                  (B2B) and is completely separate from job
                                  seeker consultation or training services.
                                </strong>
                              </p>

                              <hr />

                              <h6 className="fw-bold mt-4 mb-3 text-dark">
                                <Globe2
                                  size={18}
                                  className="me-2 text-primary"
                                />{" "}
                                Our Manpower Recruitment Scope
                              </h6>
                              <p className="small mb-2">
                                We support employers with:
                              </p>
                              <ul className="list-unstyled small ps-3">
                                <li className="mb-2">
                                  ✅ Skilled and semi-skilled manpower sourcing
                                </li>
                                <li className="mb-2">
                                  ✅ Candidate screening and background
                                  verification
                                </li>
                                <li className="mb-2">
                                  ✅ Interview coordination and scheduling
                                </li>
                                <li className="mb-2">
                                  ✅ Trade testing (where applicable)
                                </li>
                                <li className="mb-2">
                                  ✅ Documentation and deployment coordination
                                </li>
                              </ul>
                              <p className="small italic text-muted mt-2">
                                Our focus is to deliver the right people for the
                                right roles, in compliance with local and
                                international recruitment standards.
                              </p>

                              <h6 className="fw-bold mt-4 mb-3 text-dark">
                                <Hash size={18} className="me-2 text-primary" />{" "}
                                Manpower Request Process (Step-by-Step)
                              </h6>
                              <div className="small border-start border-3 border-primary ps-3">
                                <div className="mb-3">
                                  <strong>
                                    1️⃣ Manpower Request Submission
                                  </strong>
                                  <p className="mb-0 text-muted">
                                    Employers submit a request detailing: Job
                                    title, Number of workers, Country, Required
                                    skills, and Contract duration.
                                  </p>
                                </div>
                                <div className="mb-3">
                                  <strong>
                                    2️⃣ Candidate Sourcing & Screening
                                  </strong>
                                  <p className="mb-0 text-muted">
                                    We source suitable candidates, conduct
                                    document verification, and screen based on
                                    employer requirements.
                                  </p>
                                </div>
                                <div className="mb-3">
                                  <strong>3️⃣ Interview & Selection</strong>
                                  <p className="mb-0 text-muted">
                                    Employer conducts interviews (online or
                                    physical). Final approval and selection of
                                    candidates.
                                  </p>
                                </div>
                                <div className="mb-3">
                                  <strong>
                                    4️⃣ Offer Letter & Confirmation
                                  </strong>
                                  <p className="mb-0 text-muted">
                                    Employer issues official offer letters. Job
                                    terms, salary, and conditions are confirmed.
                                  </p>
                                </div>
                                <div className="mb-3">
                                  <strong>5️⃣ Documentation & Deployment</strong>
                                  <p className="mb-0 text-muted">
                                    We coordinate required documentation,
                                    medical/clearance processes, and travel
                                    logistics.
                                  </p>
                                </div>
                              </div>

                              <h6 className="fw-bold mt-4 mb-2 text-dark">
                                <UserCheck
                                  size={18}
                                  className="me-2 text-primary"
                                />{" "}
                                Professional Standards
                              </h6>
                              <ul className="list-unstyled small ps-3 mb-4">
                                <li>🔹 Transparent recruitment process</li>
                                <li>
                                  🔹 Compliance with recruitment regulations
                                </li>
                                <li>🔹 Ethical manpower sourcing</li>
                                <li>🔹 Clear communication with employers</li>
                              </ul>

                              <div className="alert alert-danger py-3 small mt-3 border-0 shadow-sm">
                                <div className="d-flex gap-2">
                                  <ShieldCheck
                                    size={20}
                                    className="flex-shrink-0"
                                  />
                                  <div>
                                    <strong>Important Notice:</strong> Our role
                                    is limited to manpower recruitment and
                                    deployment coordination. Final employment
                                    decisions rest solely with the employer and
                                    relevant authorities.
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 p-3 bg-white rounded-3 border">
                                <h6 className="fw-bold mb-2">
                                  Request Manpower
                                </h6>
                                <p className="small text-muted mb-3">
                                  If you are an employer or partner seeking
                                  dependable manpower solutions, contact us to
                                  submit a manpower request.
                                </p>
                                <button
                                  onClick={() => setShowManpowerForm(true)}
                                  className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm"
                                >
                                  👉 Request Manpower Now
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <p className="mb-4 small">
                  Are you a Hotel, Company, Shop, or Homeowner in need of highly
                  trained workers? Request skilled manpower from our academy
                  today.
                </p>
                <button
                  onClick={() => setShowManpowerForm(true)}
                  className="btn btn-success w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                >
                  <Users size={20} /> REQUEST MANPOWER
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowInsuranceForm(true)} // Mun canza wannan layin
                className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow"
              >
                APPLY FOR INSURANCE & CLEARANCE (₦300k)
              </button>
            </div>

            {/* --- GLOBAL CITIZENSHIP SERVICES SECTION --- */}
            <div className="mt-5 p-4 rounded-4 shadow-lg border border-warning border-opacity-25 bg-dark text-white">
              <div className="text-center mb-4">
                <div className="d-inline-block p-3 rounded-circle bg-warning bg-opacity-10 mb-3">
                  <Globe className="text-warning" size={48} />
                </div>
                <h2 className="fw-bold text-warning mb-2 text-uppercase">
                  Global Citizenship By Investment Services
                </h2>
                <h5 className="text-white-50 fst-italic">
                  A Strategic Path to Freedom, Security & Wealth
                </h5>

                <div className="mt-4 mb-3">
                  <button
                    type="button"
                    onClick={() => setShowCBIDetails(!showCBIDetails)}
                    className="btn btn-warning rounded-pill px-4 fw-bold d-flex align-items-center mx-auto gap-2 shadow"
                  >
                    {showCBIDetails ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                    {showCBIDetails
                      ? "HIDE FULL DETAILS"
                      : "READ MORE & VIEW SERVICES"}
                  </button>
                </div>
              </div>

              {showCBIDetails && (
                <div className="cbi-content-area animate__animated animate__fadeIn">
                  {/* Introduction - Background is dark, text is white */}
                  <div className="p-3 border-start border-warning border-4 bg-secondary bg-opacity-25 rounded mb-4 shadow-sm">
                    <p className="mb-0 text-white">
                      In today’s world, one passport or one country is no longer
                      enough. Visionary entrepreneurs, global investors, and
                      forward-thinking families are seeking freedom, security,
                      and global access.{" "}
                      <strong>This is where we come in.</strong>
                    </p>
                    <p className="mt-2 small text-white opacity-75">
                      We are a professional firm providing Citizenship and
                      Residency by Investment solutions, delivered through
                      legal, government-approved, and internationally compliant
                      frameworks.
                    </p>
                  </div>

                  <div className="row g-4 text-start">
                    {/* 1. GLOBAL CITIZENSHIP - Dark background to show white text */}
                    <div className="col-12">
                      <div className="p-4 rounded-4 bg-secondary bg-opacity-10 border border-secondary">
                        <h4 className="text-warning fw-bold mb-3">
                          <ShieldCheck className="me-2" /> 1. GLOBAL CITIZENSHIP
                          (SECOND PASSPORT)
                        </h4>
                        <p className="small mb-3 text-white">
                          Global Citizenship means acquiring a second or third
                          passport through lawful investment — not migration,
                          not escape — but a strategic financial decision.
                        </p>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <h6 className="fw-bold text-warning">
                              <Star className="me-2" size={16} />
                              The Benefits:
                            </h6>
                            <ul className="list-unstyled small text-white">
                              <li className="mb-2">
                                ✅ Visa-free or visa-on-arrival access to 150+
                                countries.
                              </li>
                              <li className="mb-2">
                                ✅ Easier international business and banking.
                              </li>
                              <li className="mb-2">
                                ✅ Long-term security for you and your family.
                              </li>
                              <li className="mb-2">
                                ✅ Political and economic risk diversification.
                              </li>
                              <li className="mb-2">
                                ✅ Freedom of movement at all times.
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6 mb-3 border-start border-secondary ps-md-4">
                            <h6 className="fw-bold text-warning">
                              <Activity className="me-2" size={16} />
                              Our Structured Process:
                            </h6>
                            <ul className="list-unstyled small text-white">
                              <li className="mb-1">
                                1️⃣ <strong>Consultation:</strong> Understanding
                                your goals.
                              </li>
                              <li className="mb-1">
                                2️⃣ <strong>Country Matching:</strong> Selecting
                                jurisdiction (Dominica, St. Lucia, etc).
                              </li>
                              <li className="mb-1">
                                3️⃣ <strong>Structuring:</strong> Donation or
                                Real Estate route.
                              </li>
                              <li className="mb-1">
                                4️⃣ <strong>Due Diligence:</strong> Documentation
                                and background checks.
                              </li>
                              <li className="mb-1">
                                5️⃣ <strong>Approval:</strong> Passport Issuance.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. FOREIGN RESIDENCY - Dark background to show white text */}
                    <div className="col-12">
                      <div className="p-4 rounded-4 bg-secondary bg-opacity-10 border border-secondary">
                        <h4 className="text-warning fw-bold mb-3">
                          <Plane className="me-2" /> 2. FOREIGN RESIDENCY &
                          GOLDEN VISA PROGRAMS
                        </h4>
                        <p className="small mb-3 text-white">
                          Many clients prefer EU access, international
                          education, and favorable tax environments without
                          immediate citizenship.
                        </p>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {[
                            "Portugal Golden Visa",
                            "Greece Real Estate",
                            "Hungary Residency",
                            "Türkiye",
                            "Malta",
                            "Thailand LTR",
                            "Qatar",
                            "Saudi Arabia",
                            "Kuwait",
                            "St. Kitts",
                            "Grenada",
                            "Dominica",
                            "Mauritius",
                          ].map((tag) => (
                            <span
                              key={tag}
                              className="badge bg-dark text-warning border border-warning px-3 py-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="small fw-bold text-warning">
                          Journey: Eligibility Assessment → Investment Selection
                          → Legal Filing → Biometrics → Permit Issuance.
                        </p>
                      </div>
                    </div>

                    {/* 3. REAL ESTATE - White background needs DARK text */}
                    <div className="col-md-6">
                      <div className="p-4 rounded-4 bg-white shadow-sm h-100 border border-warning">
                        <h4 className="text-dark fw-bold mb-3">
                          <Building2 className="me-2 text-warning" /> 3. REAL
                          ESTATE INVESTMENT
                        </h4>
                        <p className="small mb-3 text-dark fw-medium">
                          Secure, tangible assets with dual benefit: ownership +
                          legal status.
                        </p>
                        <ul className="list-unstyled text-dark small">
                          <li className="mb-2">
                            🏠 Government-approved projects only.
                          </li>
                          <li className="mb-2">
                            ⚖️ Fully legal and compliant investments.
                          </li>
                          <li className="mb-2">
                            💰 Rental income opportunities.
                          </li>
                          <li className="mb-2">
                            🛡️ Asset ownership + Legal status.
                          </li>
                          <li className="mb-2">
                            📊 Clear exit strategy after holding period.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* 4. ADVISORY - White background needs DARK text */}
                    <div className="col-md-6">
                      <div className="p-4 rounded-4 bg-white shadow-sm h-100 border border-warning">
                        <h4 className="text-dark fw-bold mb-3">
                          <Briefcase className="me-2 text-warning" /> 4. REAL
                          ESTATE ADVISORY
                        </h4>
                        <p className="small mb-3 text-dark fw-medium">
                          Our expertise goes beyond borders to secure your
                          wealth.
                        </p>
                        <ul className="list-unstyled text-dark small">
                          <li className="mb-2">
                            🌍 International real estate investment advisory.
                          </li>
                          <li className="mb-2">
                            🏠 Domestic property investment guidance.
                          </li>
                          <li className="mb-2">
                            📈 Portfolio diversification strategies.
                          </li>
                        </ul>
                        <div className="p-2 bg-warning bg-opacity-10 border border-warning rounded mt-3 text-center">
                          <span className="x-small text-dark fw-bold">
                            Smart investors never place all their assets in one
                            country.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 5. GLOBAL STANDARD PROCESS - Yellow background needs DARK text */}
                    <div className="col-12">
                      <div className="p-4 rounded-4 border border-warning border-opacity-50 bg-warning text-center shadow-lg">
                        <h4 className="text-dark fw-bold mb-4">
                          <CheckCircle className="me-2" /> 5. OUR GLOBAL
                          STANDARD PROCESS
                        </h4>
                        <div className="row g-2 justify-content-center x-small text-uppercase fw-bold text-dark">
                          {[
                            "Strategy Session",
                            "Mobility Plan",
                            "Compliance",
                            "Execution",
                            "Settlement",
                            "Post-Approval",
                          ].map((step) => (
                            <div
                              key={step}
                              className="col-4 col-md-2 border-end border-dark border-opacity-25 px-1"
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WHY ACT NOW */}
                  <div className="mt-5 text-center p-4 rounded-4 bg-danger bg-opacity-10 border border-danger">
                    <h3 className="text-danger fw-bold mb-3">
                      <AlertTriangle className="me-2" /> WHY YOU MUST ACT NOW
                    </h3>
                    <p className="small mb-4 text-white">
                      The world does not wait. Policies change. Opportunities
                      close. Costs increase. Successful people act before
                      urgency forces them.
                    </p>
                    <div className="row g-2 justify-content-center">
                      {[
                        "Protecting Family",
                        "Global Expansion",
                        "Securing Wealth",
                        "Resilient Future",
                      ].map((t) => (
                        <div key={t} className="col-md-3 col-6">
                          <span className="badge bg-danger text-white w-100 p-2">
                            {t}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-5 pt-4 border-top border-secondary border-opacity-25">
                <button
                  onClick={() => setShowCBIForm(true)}
                  className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow-lg"
                >
                  APPLY FOR GLOBAL CITIZENSHIP NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FLIGHT SYSTEM */}
      <div className="flight-system-wrapper">
        <FlightBookingSystem
          isLoadingFlight={isLoadingFlight}
          view={view}
          setView={setView}
          backgroundImages={backgroundImages}
          bgIndex={currentSlide}
          nigerianStates={nigerianStates}
          airlinePrices={airlinePrices}
          flightTimes={flightTimes}
          selectedAirline={selectedAirline}
          handleAirlineChange={handleAirlineChange}
          currentPrice={currentPrice}
          handleProceedToPayment={handleProceedToPayment}
          showMap={showMap}
          setShowMap={setShowMap}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setTicketID={setTicketID}
          handleFindTicket={handleFindTicket}
          selectedTicket={selectedTicket}
          setCurrentPrice={setCurrentPrice}
        />
      </div>
      {/* INFO STRIP */}
      <section
        className="py-5 shadow-sm w-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid px-lg-5">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <Globe className="text-success" size={32} />
                <span className="fw-bold text-dark fs-5">
                  Global Opportunities
                </span>
              </div>
            </div>
            <div className="col-md-4 border-md-start border-md-end border-2">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <Award className="text-primary" size={32} />
                <span className="fw-bold text-dark fs-5">
                  Certified Training
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <CheckCircle className="text-danger" size={32} />
                <span className="fw-bold text-dark fs-5">
                  100% Transparency
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">OUR FEATURED COURSES</h2>
            <div
              className="mx-auto bg-danger"
              style={{ width: "60px", height: "3px" }}
            ></div>
          </div>

          <div className="row g-4">
            {" "}
            {/* "g-4" yana bayar da madaidaicin space tsakanin katinan */}
            {coursesData.map((course) => (
              <div className="col-lg-3 col-md-6" key={course.id}>
                <div
                  className="card h-100 border-0 shadow-sm overflow-hidden"
                  style={{ borderRadius: "20px" }}
                >
                  {/* IMAGE CONTAINER - Wannan zai hana shafin wargajewa */}
                  <div
                    style={{
                      height: "180px",
                      width: "100%",
                      backgroundColor: "#e9ecef",
                      position: "relative",
                    }}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x250?text=Arewa+Visa+Academy";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        backgroundColor: "white",
                        padding: "8px",
                        borderRadius: "12px",
                        color: course.color,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {React.cloneElement(course.icon, { size: 20 })}
                    </div>
                  </div>

                  <div className="card-body p-4 text-center">
                    <h5 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
                      {course.title}
                    </h5>
                    <p
                      className="text-muted small mb-4"
                      style={{ minHeight: "45px" }}
                    >
                      {course.desc}
                    </p>
                    <button
                      onClick={() => {
                        setShowCourseForm(true);
                        setSelectedCourse(course.title);
                      }}
                      className="btn btn-danger w-100 rounded-pill py-2 fw-bold"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- LATEST NEWS SECTION (REAL-TIME) --- */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold text-uppercase mb-0">Latest News</h2>
              <div
                className="bg-danger mt-2"
                style={{ height: "3px", width: "50px" }}
              ></div>
            </div>
            <button className="btn btn-outline-danger btn-sm rounded-pill px-3">
              View All News
            </button>
          </div>

          <div className="row g-4">
            {news.length > 0 ? (
              news.slice(0, 3).map((item) => (
                <div className="col-lg-4 col-md-6" key={item.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-hover">
                    <div className="position-relative">
                      <img
                        src={item.imageUrl}
                        className="card-img-top object-fit-cover"
                        alt={item.title}
                        style={{ height: "220px" }}
                      />
                      <span className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-danger">
                        {item.category || "Update"}
                      </span>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
                        <Clock size={14} />
                        <span>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-3 line-clamp-2">
                        {item.title}
                      </h5>
                      <p className="card-text text-muted small mb-4 line-clamp-3">
                        {item.content}
                      </p>
                      <button className="btn btn-link text-danger p-0 fw-bold text-decoration-none d-flex align-items-center gap-2">
                        Read More <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div
                  className="spinner-grow text-danger mb-3"
                  role="status"
                ></div>
                <p className="text-muted">
                  Fetching latest updates from Arewa Visa Academy...
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
        .line-clamp-2 {
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .transition-hover:hover {
          transform: translateY(-5px);
          transition: 0.3s ease-in-out;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
      </section>
      {/* --- GALLERY SECTION (AUTO-SLIDER) --- */}
      <section className="py-5 bg-light overflow-hidden">
        <div className="container">
          <div className="text-center mb-5">
            <h2
              className="fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              Our Gallery
            </h2>
            <div
              className="bg-danger mx-auto"
              style={{ height: "3px", width: "60px" }}
            ></div>
            <p className="text-muted mt-2">
              Real-time moments from our training and activities
            </p>
          </div>

          {/* Scrolling Wrapper */}
          <div
            className="d-flex gap-3 animate-gallery"
            style={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              paddingBottom: "20px",
              scrollbarWidth: "none" /* Hidden scrollbar for clean look */,
            }}
          >
            {gallery.length > 0 ? (
              gallery.map((img) => (
                <div
                  key={img.id}
                  className="flex-shrink-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ width: "280px", height: "280px" }}
                >
                  <img
                    src={img.imageUrl}
                    alt="AVA Gallery"
                    className="w-100 h-100 object-fit-cover transition"
                    style={{ transition: "0.5s transform" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-center w-100 py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-2 text-muted">Loading latest moments...</p>
              </div>
            )}
          </div>
        </div>

        {/* CSS for Auto-scroll (Saka wannan a App.css ko cikin Style tag) */}
        <style>{`
        .animate-gallery {
          scroll-behavior: smooth;
          -ms-overflow-style: none;
        }
        .animate-gallery::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </section>{" "}
      {/* 1. SAKA SHI A NAN (Mazaunin tsohon form din) */}
      <CourseApplicationForm
        showCourseForm={showCourseForm}
        setShowCourseForm={setShowCourseForm}
        showPaymentStep={showPaymentStep}
        setShowPaymentStep={setShowPaymentStep}
        applicationData={applicationData}
        handleChange={handleChange}
        handlePhotoChange={handlePhotoChange}
        coursesData={coursesData}
        handleFinalPayment={handleFinalPayment}
        isSubmitting={isSubmitting}
      />
      <div className="payment-validation-gate py-4">
        <h5 className="fw-bold mb-3">Tuition Fee Verification</h5>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your Admission ID (e.g. AVA-12345)"
            onChange={(e) => setAdmissionId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleVerifyID}>
            Verify ID
          </button>
        </div>

        {isVerified && selectedCourse && (
          <div className="animate__animated animate__fadeIn">
            <div className="alert alert-success">
              {/* Mun sa ?. domin tsaro */}
              ID Verified! You are paying for {selectedCourse?.title}
            </div>
            <h2 className="fw-bold text-danger">
              Total: ₦{selectedCourse?.price?.toLocaleString()}
            </h2>

            <ApplyPayment
              amount={selectedCourse?.price || 5000}
              email={applicationData?.email || "arewavisaacademy@gmail.com"}
              applicationId={admissionId}
              onSuccessAction={() => {
                setIsSuccess(true);
                setShowPaymentStep(false);
              }}
            />
          </div>
        )}
      </div>
      {/* COURSE DETAIL MODAL - UPDATED WORLD CLASS VERSION */}
      {selectedCourse && typeof selectedCourse === "object" && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 10000, backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div
            className="card border-0 shadow-lg w-100"
            style={{
              maxWidth: "850px",
              borderRadius: "25px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="p-4 p-md-5 position-relative">
              <button
                onClick={() => setSelectedCourse(null)}
                className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm"
              >
                <X size={20} />
              </button>
              <div className="text-center py-4">
                <div
                  className="mb-4 d-inline-block p-4 rounded-circle bg-light shadow-sm"
                  style={{ color: selectedCourse.color }}
                >
                  {selectedCourse.icon}
                </div>
                <h2 className="fw-bold mb-3 text-uppercase">
                  {selectedCourse.title}
                </h2>
                <p className="lead text-muted mb-4">{selectedCourse.desc}</p>
                <div className="row g-3 text-start mb-5">
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-4 border-start border-4 border-danger h-100">
                      <h6 className="fw-bold d-flex align-items-center">
                        <BookOpen size={18} className="me-2 text-danger" />{" "}
                        Syllabus Content
                      </h6>
                      <p className="small text-muted mb-0">
                        {selectedCourse.details}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-4 border-start border-4 border-primary h-100">
                      <h6 className="fw-bold d-flex align-items-center">
                        <Award size={18} className="me-2 text-primary" />{" "}
                        Certification
                      </h6>
                      <p className="small text-muted mb-0">
                        Student receives a globally recognized certificate
                        verifiable online.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setSelectedCourse(selectedCourse.title);
                    }}
                    className="btn btn-danger py-3 rounded-pill fw-bold"
                  >
                    ENROLL NOW
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn btn-light py-3 rounded-pill fw-bold"
                  >
                    CLOSE
                  </button>
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
            <h2 className="display-5 fw-bold mb-2" style={{ color: "#001f3f" }}>
              WORK ABROAD OPPORTUNITIES
            </h2>
            <div
              className="mx-auto"
              style={{
                width: "80px",
                height: "5px",
                backgroundColor: "#004d00",
              }}
            ></div>
            <p className="mt-3 text-muted">
              Explore latest international job openings available for our
              certified graduates.
            </p>
          </div>
          <div className="row g-4">
            {availableJobs.map((job) => (
              <div className="col-xl-3 col-md-6 col-sm-12" key={job.id}>
                <div
                  className="card h-100 border-0 shadow-sm p-4"
                  style={{
                    borderTop: "5px solid #004d00",
                    borderRadius: "15px",
                  }}
                >
                  <span className="text-muted small text-uppercase fw-bold">
                    {job.category}
                  </span>
                  <h4 className="fw-bold my-3" style={{ fontSize: "1.2rem" }}>
                    {job.title}
                  </h4>
                  <p className="text-primary fw-semibold mb-1">
                    <MapPin size={18} className="me-1" /> {job.country}
                  </p>
                  <p className="text-muted small mb-0">{job.slot}</p>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setSelectedCourse(null);
                    }}
                    className="btn btn-outline-success btn-sm rounded-pill mt-3 fw-bold"
                  >
                    APPLY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ABOUT US MODAL */}
      {showAboutModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 11000,
            backgroundColor: "rgba(0,0,0,0.85)",
            overflowY: "auto",
          }}
        >
          <div
            className="card border-0 shadow-lg w-100"
            style={{ maxWidth: "800px", borderRadius: "25px" }}
          >
            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h2 className="fw-bold text-danger">ABOUT US</h2>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="btn btn-light rounded-circle"
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <h5 className="fw-bold">Who We Are</h5>
                <p>
                  Arewa Visa Academy is a forward‑thinking recruitment and
                  training institution dedicated to connecting talent with
                  global opportunities. We operate at the intersection of
                  international recruitment, professional skills development,
                  and digital automation, providing a transparent and structured
                  pathway for individuals seeking career growth beyond borders.
                </p>
                <h5 className="fw-bold mt-4">Our Mission</h5>
                <p>
                  To empower individuals with the right skills, guidance, and
                  access needed to compete confidently in the global job market
                  through ethical recruitment practices, quality training, and
                  secure digital systems.
                </p>
                <h5 className="fw-bold mt-4">Our Vision</h5>
                <p>
                  To become a trusted African‑based global platform for
                  recruitment and vocational education, recognized for
                  integrity, innovation, and measurable success stories.
                </p>
                <h5 className="fw-bold mt-4">What We Do</h5>
                <ul>
                  <li>
                    Facilitate international job recruitment through verified
                    partner networks
                  </li>
                  <li>
                    Deliver practical online and physical training programs via
                    a hybrid LMS
                  </li>
                  <li>
                    Automate application processing, payments, and communication
                    for efficiency and transparency
                  </li>
                </ul>
                <h5 className="fw-bold mt-4">Our Approach</h5>
                <p>
                  We believe opportunity should be clear, structured, and
                  accessible. Our platform is designed to guide users
                  step‑by‑step — from application and training to communication
                  and progress tracking.
                </p>
                <h5 className="fw-bold mt-4 text-danger">
                  Trust & Transparency
                </h5>
                <p>
                  Arewa Visa Academy does not promise guaranteed visas or
                  employment. Instead, we focus on preparation, compliance, and
                  proper representation, ensuring every applicant is processed
                  fairly and informed at every stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TERMS & PRIVACY MODAL */}
      {showTermsModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 11000,
            backgroundColor: "rgba(0,0,0,0.85)",
            overflowY: "auto",
          }}
        >
          <div
            className="card border-0 shadow-lg w-100"
            style={{ maxWidth: "850px", borderRadius: "25px" }}
          >
            <div className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h2 className="fw-bold text-primary">TERMS & PRIVACY POLICY</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="btn btn-light rounded-circle"
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <h4 className="fw-bold mb-3 border-bottom pb-2">
                  TERMS & CONDITIONS
                </h4>
                <p className="small">
                  <strong>1. Acceptance:</strong> By accessing the portal, you
                  agree to these Terms.
                </p>
                <p className="small">
                  <strong>2. Scope:</strong> We provide recruitment facilitation
                  and training. We do not guarantee visa approval.
                </p>
                <p className="small">
                  <strong>3. Responsibility:</strong> Users must provide
                  truthful information and valid documents.
                </p>
                <p className="small">
                  <strong>4. Liability:</strong> We are not liable for
                  rejections caused by third parties or immigration authorities.
                </p>

                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">
                  PRIVACY POLICY
                </h4>
                <p className="small">
                  <strong>1. Collection:</strong> We collect personal data
                  including names, contact details, and uploaded documents.
                </p>
                <p className="small">
                  <strong>2. Protection:</strong> Data is protected using SSL
                  encryption and restricted to authorized personnel.
                </p>
                <p className="small">
                  <strong>3. Sharing:</strong> Data is only shared with verified
                  recruitment partners where necessary.
                </p>

                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">
                  REFUND POLICY
                </h4>
                <p className="small">
                  All job application and processing fees are non-refundable
                  once submitted. Training fees are non-refundable once access
                  is granted.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ManpowerRequestForm
        showManpowerForm={showManpowerForm}
        setShowManpowerForm={setShowManpowerForm}
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        handleInitialSubmit={handleInitialSubmit}
        isOtherManpower={isOtherManpower}
        setIsOtherManpower={setIsOtherManpower}
      />
      <CBIApplicationForm
        showCBIForm={showCBIForm}
        setShowCBIForm={setShowCBIForm}
        handleCBISubmit={handleCBISubmit}
      />
      <InsuranceApplicationForm
        showInsuranceForm={showInsuranceForm}
        setShowInsuranceForm={setShowInsuranceForm}
        formData={formData}
        setFormData={setFormData}
        handleInsuranceApplication={handleInsuranceApplication}
        uploading={uploading}
      />
      <JobApplicationForm
        showForm={showForm}
        setShowForm={setShowForm}
        showPaymentStep={showPaymentStep}
        setShowPaymentStep={setShowPaymentStep}
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        applicationData={applicationData}
        handleChange={handleChange}
        handlePhotoChange={handlePhotoChange}
        handleFileChange={handleFileChange}
        handleFinalPayment={handleFinalPayment}
        isSubmitting={isSubmitting}
        countriesList={countriesList}
        unskilledJobsList={unskilledJobsList}
        skilledJobsList={skilledJobsList}
        isOtherCountry={isOtherCountry}
        setIsOtherCountry={setIsOtherCountry}
        isOtherJob={isOtherJob}
        setIsOtherJob={setIsOtherJob}
      />
      {/* FOOTER */}
      <footer className="py-5 bg-dark text-white">
        <div className="container-fluid px-lg-5 text-center">
          <img
            src={logo}
            alt="Logo"
            height="50"
            className="bg-white rounded p-1 mb-4"
          />
          <h4 className="fw-bold mb-4">AREWA VISA ACADEMY</h4>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <Facebook className="pointer hover-scale" />
            <Twitter className="pointer hover-scale" />
            <Instagram className="pointer hover-scale" />
            <Linkedin className="pointer hover-scale" />
          </div>
          <p className="small opacity-50">
            © 2026 Arewa Visa Academy. All Rights Reserved.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <span
              className="small pointer text-decoration-underline"
              onClick={() => setShowTermsModal(true)}
            >
              Terms of Service
            </span>
            <span
              className="small pointer text-decoration-underline"
              onClick={() => setShowTermsModal(true)}
            >
              Privacy Policy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
