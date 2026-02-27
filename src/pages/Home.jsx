import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase";
import { ref, onValue, push, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Users,
  Globe,
  Headphones,
  Briefcase,
  Layout,
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
  Menu,
  BookOpen,
  ExternalLink,
  Home as HomeIcon,
  ShieldCheck,
  Clock,
  Award,
  Linkedin,
  ArrowRight,
  Upload,
  Globe2,
  UserCheck,
  Camera,
  Loader2,
  CreditCard,
  Hash,
  Calendar,
  Map,
  User2,
  Search,
  GraduationCap,
  Handshake,
  UserPlus,
  PenTool,
  Landmark,
  Laptop,
  Wind,
  Brush,
  Package,
  Store,
  ChevronDown,
  ChevronUp,
  FileUp,
  Wallet,
  Heart,
  Star,
  Activity,
  AlertTriangle,
  RefreshCcw,
  Edit3,
  Banknote,
  ArrowLeft,
} from "lucide-react";

import logo from "../assets/logo.png";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import hero5 from "../assets/hero5.jpg";

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
  const [isOtherJob, setIsOtherJob] = useState(false);
  const [isOtherCountry, setIsOtherCountry] = useState(false);
  const [isOtherManpower, setIsOtherManpower] = useState(false);
  const [expandedManpower, setExpandedManpower] = useState(false);
  const [expandedApplyInfo, setExpandedApplyInfo] = useState(false);
  const [showCBIForm, setShowCBIForm] = useState(false);
  const [showCBIDetails, setShowCBIDetails] = useState(false);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const coursesRef = useRef(null);
  const jobsRef = useRef(null);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const navigate = useNavigate();
  const heroImages = [hero1, hero2, hero3, hero4, hero5];

  // 1. Timer na Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // 2. Janyo Data daga Firebase (News & Gallery)
  useEffect(() => {
    const newsRef = ref(db, "news");
    const galleryRef = ref(db, "gallery");

    // Sauraren News
    const unsubNews = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setNews(newsList.reverse().slice(0, 3));
      } else {
        setNews([]);
      }
    });

    // Sauraren Gallery
    const unsubGallery = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const galleryList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setGallery(galleryList.reverse().slice(0, 6));
      } else {
        setGallery([]);
      }
    });

    // Wannan shine "cleanup function" da zai kashe duka saurarun idan an fita daga shafin
    return () => {
      unsubNews();
      unsubGallery();
    };
  }, []);

  const handleInsuranceApplication = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Muna amfani da sunayen da suke cikin Form dinka daidai
    const applicationData = {
      fullName: formData.fullName || "N/A",
      phone: formData.phone || "N/A",
      service: "Medical & Insurance Clearance",
      passportNumber: formData.passportNumber || "N/A",
      amount: "₦300,000",
      status: "Paid / Pending",
      timestamp: new Date().toLocaleString(),
      refID: `INS-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    try {
      // Tabbatar hanyar nan ita ce Admin yake dubawa
      const insuranceRef = ref(db, "arewa_visa_academy_apps");
      await push(insuranceRef, applicationData);

      // Kira aikin generate receipt
      generatePDFReceipt(applicationData);

      alert("Application Submitted! Your Insurance Receipt is downloading.");

      // Rufe form din ta amfani da sabon sunan state
      setShowInsuranceForm(false);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tabbatar hoto ne kuma bai wuce 2MB ba
      if (file.size > 2 * 1024 * 1024) {
        alert("The image is too large! Please ensure it is not more than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);

      setApplicationData((prev) => ({
        ...prev,
        photoFile: file,
      }));
    }
  };
  <form onSubmit={(e) => e.preventDefault()}></form>;

  const handleFlightCommit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Hadawa: Bayanan da za'a tura
    const bookingPayload = {
      ...applicationData, // Ko kuma wani state na daban kake amfani dashi
      type: "Flight Booking",
      status: "Confirmed",
      timestamp: new Date().toISOString(),
    };

    try {
      // Commit zuwa Realtime Database
      const flightRef = ref(db, "flight_bookings");
      const newFlightRef = push(flightRef);
      await set(newFlightRef, bookingPayload);

      alert("Booking Committed Successfully!");
      setIsSuccess(true);
      setView("success"); // Kai shi zuwa success screen
    } catch (error) {
      console.error("Commit Error:", error);
      alert("Failed to commit booking. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Farashin jirage (Prices)
  const airlinePrices = {
    "Air Peace (P4)": 95000,
    "Ibom Air (QI)": 105000,
    "United Nigeria Airlines (U5)": 88000,
    "Max Air (VM)": 92000,
    "Rano Air (RA)": 75000,
    "ValueJet (VK)": 78000,
    "Green Africa Airways (Q9)": 65000,
    "Arik Air (W3)": 90000,
    "Aero Contractors (AJ)": 85000,
    "NG Eagle (2N)": 82000,
    "Overland Airways (OF)": 98000,
  };

  const flightTimes = [
    "07:30 AM (Morning Flight)",
    "10:45 AM (Mid-Morning)",
    "01:15 PM (Afternoon Flight)",
    "04:00 PM (Evening Flight)",
    "06:30 PM (Night Flight)",
  ];

  const [selectedAirline, setSelectedAirline] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);

  // Function na lura da canjin jirgi
  const handleAirlineChange = (e) => {
    const airline = e.target.value;
    setSelectedAirline(airline);
    setCurrentPrice(airlinePrices[airline] || 0);
  };

  // Function na tafiya wurin biya
  const handleProceedToPayment = () => {
    if (!selectedAirline || currentPrice === 0) {
      alert("Please select an airline to continue.");
      return;
    }
    setIsLoadingFlight(true);
    setTimeout(() => {
      setView("payment"); // Zai kai mu matakin biya
      setIsLoadingFlight(false);
    }, 1500);
  };

  const [bgIndex, setBgIndex] = useState(0);
  const backgroundImages = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074", // Jirgi a sararin samaniya
    "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?q=80&w=2070", // Jirgi a filin jirgi
    "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070", // Jirgi lokacin faduwar rana
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Zai rika canzawa duk bayan 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowPaymentStep(true);
  };

  const handleFinalPayment = async () => {
    setIsSubmitting(true);

    // Gano kudin da ya kamata a biya
    const finalAmount =
      applicationData.selectedCourseTitle === "VISA PROCESSING COURSE"
        ? 200000
        : 100000;

    const updatedData = {
      ...applicationData,
      amountPaid: finalAmount,
      paymentStatus: "Completed",
      type: "Course Enrollment",
    };

    try {
      await handleSubmitApplication(updatedData);
      setIsSuccess(true);
      setShowPaymentStep(false);
      if (
        !updatedData.photoFile ||
        !updatedData.passportFile ||
        !updatedData.resumeFile ||
        !updatedData.cvFile
      ) {
        // Receipt Download
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    } catch (error) {
      alert("Submission failed. Please check your network.");
    }
    setIsSubmitting(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitApplication = async (formData) => {
    try {
      if (
        !formData.photoFile ||
        !formData.passportFile ||
        !formData.resumeFile ||
        !formData.cvFile
      ) {
        alert("Please upload all required documents.");
        return;
      }

      const timestamp = Date.now();
      const applicantName = formData.name.replace(/\s+/g, "_");
      // --- NAN NE ZAKA SAKA PROMISE.ALL DIN ---
      // Wannan zai tura duka hotunan lokaci guda (faster & safer)
      await Promise.all([
        uploadFile(
          formData.photoFile,
          `applications/${timestamp}_${applicantName}/photo`,
        ),
        uploadFile(
          formData.passportFile,
          `applications/${timestamp}_${applicantName}/passport`,
        ),
        uploadFile(
          formData.resumeFile,
          `applications/${timestamp}_${applicantName}/resume`,
        ),
        uploadFile(
          formData.cvFile,
          `applications/${timestamp}_${applicantName}/cv`,
        ),
      ]);
      // ===============================
      // 1️⃣ Upload Passport Photo
      // ===============================
      const photoRef = storageRef(
        storage,
        `applications/${timestamp}_${applicantName}/photo`,
      );
      await uploadBytes(photoRef, formData.photoFile);
      const photoUrl = await getDownloadURL(photoRef);

      // ===============================
      // 2️⃣ Upload International Passport
      // ===============================
      const passportRef = storageRef(
        storage,
        `applications/${timestamp}_${applicantName}/passport`,
      );
      await uploadBytes(passportRef, formData.passportFile);
      const passportUrl = await getDownloadURL(passportRef);

      // ===============================
      // 3️⃣ Upload Resume
      // ===============================
      const resumeRef = storageRef(
        storage,
        `applications/${timestamp}_${applicantName}/resume`,
      );
      await uploadBytes(resumeRef, formData.resumeFile);
      const resumeUrl = await getDownloadURL(resumeRef);

      // ===============================
      // 4️⃣ Upload CV
      // ===============================
      const cvRef = storageRef(
        storage,
        `applications/${timestamp}_${applicantName}/cv`,
      );
      await uploadBytes(cvRef, formData.cvFile);
      const cvUrl = await getDownloadURL(cvRef);

      // ===============================
      // 5️⃣ Save to Realtime Database
      // ===============================
      const newApplicationRef = push(ref(db, "applications"));

      await set(newApplicationRef, {
        ...formData,
        photoUrl,
        passportUrl,
        resumeUrl,
        cvUrl,
        status: "Pending Review",
        paymentStatus: "Paid",
        createdAt: new Date().toISOString(),
      });

      console.log("Application submitted successfully");
    } catch (error) {
      console.error("Submission Error:", error);
      throw error;
    }
  };

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    nin: "",
    passportNo: "",
    whatsapp: "",
    state: "",
    lga: "",
    residenceCountry: "Nigeria",
    address: "",
    country: "",
    job: "",
    jobCountry: "",
    selectedCourseTitle: "",
    photoFile: null,
    passportFile: null,
  });

  const uploadFile = async (file, path) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  // --- FLIGHT SYSTEM STATES ---
  const [view, setView] = useState("book");
  const [ticketID, setTicketID] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoadingFlight, setIsLoadingFlight] = useState(false); // Na canja suna don kar ya hadu da na Home
  const [showMap, setShowMap] = useState(false);

  // All 36 Nigerian States + FCT
  const nigerianStates = [
    "Abuja (FCT)",
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const handleSearch = () => {
    setIsLoadingFlight(true);
    setTimeout(() => {
      setIsLoadingFlight(false);
      alert("Flight Search Completed! Connecting to server...");
    }, 3500);
  };

  // 1. Tabbatar dukkan wadannan sunayen suna ciki
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    passportNumber: "",
    medicalAssessment: "",
    insuranceType: "",
    clearanceType: "",
  });

  // 2. Tabbatar kana da wannan state din shima
  const [uploading, setUploading] = useState(false);

  const handleFindTicket = () => {
    if (!ticketID) return alert("Please enter a valid Ticket ID");
    const mockTicket = {
      id: ticketID,
      name: "Ibrahim Suleiman",
      from: "Kano (KAN)",
      to: "Abuja (ABV)",
      airline: "Air Peace",
      date: "2026-04-10",
      price: 115000,
      status: "Confirmed",
    };
    setSelectedTicket(mockTicket);
    setView("manage");
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // "db" riga yana nan a Home.jsx dinka tunda ka yi import dinsa
      await addDoc(collection(db, "flight_bookings"), {
        ...bookingData,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      alert("Flight Booking Successful! We will contact you soon.");
      setBookingData({
        fullName: "",
        email: "",
        phone: "",
        departure: "",
        destination: "",
        travelDate: "",
        passengers: "1",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Booking failed. Please check your connection.");
    }
    setIsSubmitting(false);
  };

  const handleCBISubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Tabbatar an bi jere wajen dauko values
    const formData = {
      name: form[0].value,
      email: form[1].value,
      phone: form[2].value,
      address: form[3].value,
      userCountry: form[4].value,
      state: form[5].value,
      lga: form[6].value,
      targetCountry: form[7].value,
      programType: form[8].value,
      message: form[9].value,
      status: "pending",
      timestamp: Date.now(),
    };

    try {
      // Tabbatar 'cbi_applications' ne sunan node din
      await set(push(ref(db, "cbi_applications")), formData);
      alert("Application sent successfully!");
      setShowCBIForm(false);
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }

    try {
      const newRef = push(ref(db, "cbi_applications"));
      await set(newRef, formData);
      alert("Application Received! Our team will contact you shortly.");
      e.target.reset();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToJobs = () => {
    jobsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      desc: "Industrial and commercial sanitation standards.",
      details:
        "Comprehensive training in modern cleaning techniques, chemical safety, and specialized equipment handling for global sectors.",
      icon: <Brush size={40} />,
      image: "1000084709.jpg", // Hoton dake nuna tsarin aiki
      color: "#007bff",
    },
    {
      id: 2,
      title: "HOUSEKEEPING COURSE",
      desc: "Professional hospitality management for luxury hotels.",
      details:
        "Focuses on guest relations, room maintenance, and high-end service standards required in international resorts.",
      icon: <Hotel size={40} />,
      image: "1000084709.jpg",
      color: "#6610f2",
    },
    {
      id: 3,
      title: "LAUNDRY SERVICE COURSE",
      desc: "Fabric care and industrial laundry operations.",
      details:
        "Advanced dry cleaning techniques, textile science, and operational mastery of commercial laundry systems.",
      icon: <Wind size={40} />,
      image: "1000084709.jpg",
      color: "#0dcaf0",
    },
    {
      id: 4,
      title: "VISA PROCESSING COURSE",
      desc: "Global immigration and documentation training.",
      details:
        "Mastering application workflows, appointment scheduling, and embassy compliance for international travel.",
      icon: <FileText size={40} />,
      image: "1000088518.jpg", // Hoton dake nuna tsarin "Secure Session"
      color: "#dc3545",
    },
    {
      id: 5,
      title: "TICKETING & RESERVATION",
      desc: "Aviation booking and GDS system mastery.",
      details:
        "Professional training in Amadeus and Galileo systems for flight booking, fare construction, and itinerary management.",
      icon: <Plane size={40} />,
      image: "1000084761.jpg", // Hoton dake nuna "Specialization"
      color: "#198754",
    },
    {
      id: 6,
      title: "AGENCY MANAGEMENT",
      desc: "Business architecture for travel firms.",
      details:
        "Strategic management of travel agencies, IATA standards, marketing, and global partnership logistics.",
      icon: <Briefcase size={40} />,
      image: "1000084709.jpg",
      color: "#fd7e14",
    },
    {
      id: 7,
      title: "CUSTOMER SERVICE COURSE",
      desc: "Corporate communication and office administration.",
      details:
        "Professional etiquette, conflict resolution, and client relations training for high-level corporate environments.",
      icon: <Headphones size={40} />,
      image: "1000084709.jpg",
      color: "#ffc107",
    },
    {
      id: 8,
      title: "AIRCRAFT CLEANER COURSE",
      desc: "Aviation-grade sterilization and safety protocols.",
      details:
        "Specialized modules on aircraft interior maintenance, hazardous materials handling, and aviation security compliance.",
      icon: <Ship size={40} />,
      image: "1000084709.jpg",
      color: "#20c997",
    },
    {
      id: 9,
      title: "SECURITY TRAINING",
      desc: "Professional security and surveillance training.",
      details:
        "Modern security protocols, emergency response, and surveillance technology management.",
      icon: <ShieldCheck size={40} />,
      image: "1000088518.jpg",
      color: "#343a40",
    },
    {
      id: 10,
      title: "CAREGIVER - NANNY COURSE",
      desc: "Professional pediatric and elderly healthcare.",
      details:
        "Certified training in first aid, child development, geriatric care, and domestic safety for global households.",
      icon: <Users size={40} />,
      image: "WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg", // Hoton dalibai da takardar shaida
      color: "#d63384",
    },
    {
      id: 11,
      title: "CARGO & LOGISTICS COURSE",
      desc: "Global supply chain and freight operations.",
      details:
        "Mastery of freight forwarding, customs documentation, warehousing, and international shipping logistics.",
      icon: <Package size={40} />,
      image: "WhatsApp Image 2026-02-27 at 12.27.03 PM.jpeg", // Hoton Cargo and Logistics firi-fai
      color: "#6f42c1",
    },
    {
      id: 12,
      title: "TRAVELS AND TOURISM",
      desc: "International tourism and package development.",
      details:
        "Comprehensive geography, tourism legislation, and strategic planning of global vacation and travel packages.",
      icon: <Globe2 size={40} />,
      image: "WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg", // Hoton daliban Travel and Tourism
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
      image: "1000088518.jpg", // Hoton dake nuna "Secure Session" ya dace da Security
    },
    {
      id: 2,
      title: "Caregiver - Nanny",
      country: "Canada 🇨🇦",
      slot: "8 Slots Left",
      category: "Healthcare",
      image: "WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg", // Hoton dalibai da takardar shaida (Professionalism)
    },
    {
      id: 3,
      title: "Professional Cleaner",
      country: "USA 🇺🇸",
      slot: "25 Slots Left",
      category: "Cleaning",
      image: "1000084709.jpg", // Hoton dashboard dake nuna tsarin ayyukan Academy
    },
    {
      id: 4,
      title: "Visa Officer",
      country: "Schengen Area 🇪🇺",
      slot: "5 Slots Left",
      category: "Schengen",
      image: "1000088518.jpg", // Yanayin tsaro da portal ya dace da aikin Visa
    },
    {
      id: 5,
      title: "Hotel Housekeeper",
      country: "Japan 🇯🇵",
      slot: "15 Slots Left",
      category: "Hospitality",
      image: "1000084709.jpg",
    },
    {
      id: 6,
      title: "Laundry Specialist",
      country: "South Korea 🇰🇷",
      slot: "10 Slots Left",
      category: "Service",
      image: "1000084709.jpg",
    },
    {
      id: 7,
      title: "Ticketing Officer",
      country: "New Zealand 🇳🇿",
      slot: "4 Slots Left",
      category: "Travel",
      image: "1000084761.jpg", // Hoton kwas din Specialization
    },
    {
      id: 8,
      title: "Customer Support",
      country: "Gulf Countries 🇶🇦 🇦🇪",
      slot: "20 Slots Left",
      category: "Gulf",
      image: "1000088518.jpg",
    },
    {
      id: 9,
      title: "Travel Agency Manager",
      country: "United Kingdom 🇬🇧",
      slot: "2 Slots Left",
      category: "Management",
      image: "WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg", // Hoton masu takardar shaida
    },
    {
      id: 10,
      title: "Aircraft Cleaner",
      country: "Russia 🇷🇺",
      slot: "12 Slots Left",
      category: "Aviation",
      image: "1000084709.jpg",
    },
    {
      id: 11,
      title: "Logistics Clerk",
      country: "Mauritius 🇲🇺",
      slot: "7 Slots Left",
      category: "Logistics",
      image: "WhatsApp Image 2026-02-27 at 12.27.03 PM.jpeg", // Hoton Cargo and Logistics firi-fai
    },
    {
      id: 12,
      title: "Tour Guide",
      country: "Seychelles 🇸🇨",
      slot: "6 Slots Left",
      category: "Tourism",
      image: "WhatsApp Image 2026-02-27 at 12.27.04 PM.jpeg",
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

  const filteredUnskilled = unskilledJobsList.filter((job) =>
    job.toLowerCase().includes(jobSearchQuery.toLowerCase()),
  );
  const filteredSkilled = skilledJobsList.filter((job) =>
    job.toLowerCase().includes(jobSearchQuery.toLowerCase()),
  );

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
                {/* BRAND SECTION / MANPOWER */}
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
                    Your gateway to seamless air travel in Nigeria. Book
                    flights, manage tickets, and track air traffic in real-time.
                  </p>
                </div>

                {/* INTERACTIVE BUTTONS */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                  <button
                    onClick={() => {
                      setView(view === "book" ? "" : "book");
                      setSelectedTicket(null);
                    }}
                    className={`btn ${view === "book" ? "btn-light" : "btn-warning"} btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2`}
                  >
                    <Search size={20} />{" "}
                    {view === "book" ? "CLOSE SEARCH" : "EXPLORE ROUTES"}
                  </button>
                  <button
                    onClick={() => {
                      setView(
                        view === "find" || view === "manage" ? "" : "find",
                      );
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
                        <RefreshCcw size={16} className="text-info" /> Easy
                        Modify
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
                          {/* Name & Phone */}
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

                          {/* Departure & Destination */}
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

                          {/* Airline Selection */}
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

                          {/* Date & Time Selection */}
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
                                  Available Departure Time
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

                          {/* Live Price Display */}
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
                          <h4 className="fw-bold mb-4">Secure Checkout</h4>
                          <div className="p-4 border rounded-4 mb-4 bg-light text-start">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Airline:</span>{" "}
                              <strong>{selectedAirline}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-top pt-2">
                              <span className="fw-bold">Total Amount:</span>
                              <strong className="text-primary h5">
                                ₦{currentPrice.toLocaleString()}
                              </strong>
                            </div>
                            <div className="input-group mb-3 border rounded-3 overflow-hidden bg-white">
                              <span className="input-group-text bg-white border-0">
                                <CreditCard size={20} />
                              </span>
                              <input
                                type="text"
                                className="form-control border-0 py-3"
                                placeholder="0000 0000 0000 0000"
                              />
                            </div>
                            <div className="row g-2">
                              <div className="col-6">
                                <input
                                  type="text"
                                  className="form-control py-3"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="text"
                                  className="form-control py-3"
                                  placeholder="CVV"
                                />
                              </div>
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
                            className="btn btn-success btn-lg w-100 py-3 rounded-pill fw-bold shadow"
                          >
                            {isSubmitting
                              ? "PROCESSING..."
                              : `PAY ₦${currentPrice.toLocaleString()}`}
                          </button>
                          <button
                            className="btn btn-link text-muted mt-2"
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
                            A confirmation has been sent. Refunds take 7 working
                            days to reflect.
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
                          <p className="text-muted mb-4">
                            Enter your Ticket ID to manage your travel.
                          </p>
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

                      {/* 5. MANAGE VIEW (EDITABLE) */}
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

                          <div className="row g-3 mb-4">
                            <div className="col-12">
                              <label className="small fw-bold text-secondary mb-1">
                                Passenger Name
                              </label>
                              <input
                                type="text"
                                className="form-control border-0 bg-light py-2"
                                defaultValue={selectedTicket.name}
                              />
                            </div>
                            <div className="col-md-4 col-6">
                              <label className="small fw-bold text-secondary mb-1">
                                Destination State
                              </label>
                              <select className="form-select border-0 bg-light py-2">
                                <option>{selectedTicket.to}</option>
                                {nigerianStates.map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4 col-6">
                              <label className="small fw-bold text-secondary mb-1">
                                Travel Date
                              </label>
                              <input
                                type="date"
                                className="form-control border-0 bg-light py-2"
                                defaultValue={selectedTicket.date}
                              />
                            </div>
                            <div className="col-md-4 col-12">
                              <label className="small fw-bold text-secondary mb-1">
                                Flight Time
                              </label>
                              <select className="form-select border-0 bg-light py-2">
                                <option value="">-- Change Time --</option>
                                {flightTimes.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-3 mb-4 d-flex align-items-center gap-3">
                            <div className="bg-warning p-2 rounded-circle text-white">
                              <Banknote size={20} />
                            </div>
                            <div>
                              <small className="d-block fw-bold text-dark">
                                Modification Surcharge
                              </small>
                              <span className="text-muted small">
                                A fee of <strong>₦15,000</strong> applies to
                                save these changes.
                              </span>
                            </div>
                          </div>

                          <div className="row g-2">
                            <div className="col-md-4">
                              <button
                                className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
                                onClick={() => {
                                  setCurrentPrice(15000);
                                  setView("payment");
                                }}
                              >
                                SAVE & PAY ₦15,000
                              </button>
                            </div>
                            <div className="col-md-4">
                              <button
                                className="btn btn-outline-danger w-100 py-3 fw-bold"
                                onClick={() => setView("refund")}
                              >
                                REQUEST REFUND
                              </button>
                            </div>
                            <div className="col-md-4">
                              <button className="btn btn-warning w-100 py-3 fw-bold">
                                DOWNLOAD PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. REFUND VIEW */}
                      {view === "refund" && (
                        <div className="animate__animated animate__fadeIn">
                          <h4 className="text-danger fw-bold mb-3 d-flex align-items-center gap-2">
                            <AlertTriangle size={24} /> Refund Settlement
                          </h4>
                          <div className="alert alert-info border-0 shadow-sm mb-4 bg-light">
                            <div className="d-flex align-items-center gap-2">
                              <RefreshCcw size={18} className="text-primary" />
                              <span className="small fw-bold text-dark">
                                Notice: Your refund will be credited to your
                                original account within{" "}
                                <span className="text-danger">
                                  7 working days (Working Days)
                                </span>
                                .
                              </span>
                            </div>
                          </div>
                          <div className="p-4 bg-danger bg-opacity-10 border rounded-3 mb-4">
                            <div className="d-flex justify-content-between mb-1 text-muted">
                              <span>Ticket Price:</span>{" "}
                              <span>
                                ₦{selectedTicket?.price?.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-1 text-danger">
                              <span>Admin Charge:</span> <span>- ₦15,000</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold text-success border-top mt-2 pt-2">
                              <span>Refund Amount:</span>{" "}
                              <span>
                                ₦
                                {(
                                  selectedTicket?.price - 10000
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="row g-2 mb-4">
                            <div className="col-12">
                              <input
                                type="text"
                                className="form-control py-3"
                                placeholder="Account Name"
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                className="form-control py-3"
                                placeholder="Account Number"
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="form-control py-3"
                                placeholder="Bank Name"
                              />
                            </div>
                          </div>
                          <button
                            className="btn btn-danger btn-lg w-100 py-3 rounded-pill fw-bold shadow"
                            onClick={() => {
                              setIsLoadingFlight(true);
                              setTimeout(() => {
                                setView("success");
                                setIsLoadingFlight(false);
                              }, 2000);
                            }}
                          >
                            CONFIRM REFUND
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      {/* HEADER */}
                      <div className="p-3 d-flex justify-content-between align-items-center text-white border-bottom border-secondary bg-dark">
                        <div>
                          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <span
                              className="spinner-grow spinner-grow-sm text-danger"
                              role="status"
                            ></span>
                            Live Nigerian Airspace Radar (Real-Time)
                          </h6>
                          <small className="text-warning fw-bold">
                            Active Traffic Over Nigeria
                          </small>
                        </div>
                        {/* CLOSE BUTTON */}
                        <button
                          onClick={() => setShowMap(false)}
                          className="btn btn-danger btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                        >
                          CLOSE RADAR <X size={18} />
                        </button>
                      </div>

                      {/* DYNAMIC MAP CONTAINER */}
                      <div
                        className="w-100 h-100 bg-black"
                        style={{ position: "relative" }}
                      >
                        <iframe
                          // Muna amfani da ADS-B Exchange domin ya fi nuna jirage kyauta ba tare da toshewa ba
                          src="https://globe.adsbexchange.com/?lat=9.080&lon=8.670&zoom=6.0"
                          width="100%"
                          height="100%"
                          style={{
                            border: "none",
                            minHeight: "calc(90vh - 70px)",
                            background: "#1a1a1a",
                          }}
                          title="Real-Time Flight Tracker"
                          allow="geolocation"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
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
      {/* COURSES SECTION */}
      <section ref={coursesRef} className="py-5 bg-white">
        <div className="container-fluid px-lg-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-2" style={{ color: "#001f3f" }}>
              OUR TRAINING COURSES
            </h2>
            <div
              className="mx-auto"
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: "#dc3545",
              }}
            ></div>
            <p className="text-muted mt-3">
              Select a specialized course to receive world-class professional
              training.
            </p>
          </div>
          <div className="row g-4">
            {coursesData.map((course) => (
              <div className="col-lg-3 col-md-6" key={course.id}>
                <div
                  className="card h-100 border-0 shadow-sm p-4 text-center"
                  style={{ borderRadius: "20px", transition: "0.3s" }}
                >
                  <div
                    className="mb-4 d-inline-block p-3 rounded-circle"
                    style={{
                      backgroundColor: `${course.color}15`,
                      color: course.color,
                    }}
                  >
                    {course.icon}
                  </div>
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
      {/* COURSE APPLICATION FORM */}
      {showCourseForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 px-2 py-4" // Mun cire d-flex
          style={{
            zIndex: 10000,
            backgroundColor: "rgba(0,0,0,0.85)",
            overflowY: "auto", // Wannan zai bar yatsa ya yi scrolling
            display: "block", // Mun canza zuwa block domin waya
          }}
        >
          <div
            className="card border-0 shadow-lg w-100 mx-auto" // Mun ƙara mx-auto
            style={{
              maxWidth: "900px",
              borderRadius: "20px",
              overflow: "visible", // Mun canza daga hidden domin gudun yanke form
              marginTop: "20px",
              marginBottom: "40px",
            }}
          >
            {" "}
            {/* --- FARKON GYARA: DUBA KO ZA'A NUNA PAYMENT KO FORM --- */}
            {!showPaymentStep ? (
              <>
                <button
                  onClick={() => setShowCourseForm(false)}
                  className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm"
                  style={{ zIndex: 11000 }}
                >
                  <X size={20} />
                </button>
                <div className="row g-0">
                  <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
                    <GraduationCap size={60} className="mx-auto mb-3" />
                    <h4 className="fw-bold">COURSE APPLICATION</h4>
                    <p className="small mt-2">
                      {coursesData.length} Courses Available
                    </p>
                  </div>
                  {/* Upload Passport Photo */}
                  <div className="col-md-9 p-4 p-md-5 bg-white">
                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold small">
                        Upload Passport Photo (JPEG/PNG)
                      </label>
                      <div className="border-2 border-dashed rounded-3 p-3 text-center bg-light">
                        <input
                          type="file"
                          name="photoFile"
                          className="form-control form-control-sm"
                          accept="image/*"
                          required
                          onChange={handlePhotoChange}
                        />
                        <p className="small text-muted mb-0 mt-2">
                          Max file size: 5MB
                        </p>
                      </div>
                    </div>

                    <form
                      className="row g-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setShowPaymentStep(true);
                      }}
                    >
                      {/* PERSONAL DETAILS */}
                      <div className="col-12">
                        <h6 className="fw-bold text-danger border-bottom pb-2 mb-2">
                          Personal Details
                        </h6>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={applicationData.name}
                          onChange={handleChange}
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Date of Birth (Optional)
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm border-2 shadow-sm"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Age (Optional)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="Enter age if known"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleChange}
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>

                      {/* LOCATION */}
                      <div className="col-12">
                        <h6 className="fw-bold text-danger border-bottom pb-2 mt-3 mb-2">
                          Location Details
                        </h6>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Full Home Address
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">LGA</label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Country
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          defaultValue="Nigeria"
                          required
                        />
                      </div>

                      {/* EDUCATIONAL BACKGROUND */}
                      <div className="col-12 border-bottom pb-2 mt-3 mb-2">
                        <h6 className="fw-bold text-danger">
                          Educational Background (Optional)
                        </h6>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Primary School
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="School Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Primary Completion Year
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="e.g. 2010"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Secondary School
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="School Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Secondary Completion Year
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="e.g. 2016"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Tertiary Institution
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="College/Polytechnic"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Course / Diploma
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="e.g. National Diploma in Accounting"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          University
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="University Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Degree / Qualification
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm border-2 shadow-sm"
                          placeholder="e.g. BSc Economics"
                        />
                      </div>

                      {/* COURSE DETAILS */}
                      <div className="col-12">
                        <h6 className="fw-bold text-danger border-bottom pb-2 mt-3 mb-2">
                          Course Preference
                        </h6>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Course Mode
                        </label>
                        <select
                          className="form-select form-select-sm border-2 shadow-sm"
                          required
                        >
                          <option value="">-- Select Mode --</option>
                          <option value="online">Online</option>
                          <option value="physical">Physical</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">
                          Select Course
                        </label>
                        <select
                          className="form-select form-select-sm border-2 shadow-sm"
                          name="selectedCourseTitle"
                          value={applicationData.selectedCourseTitle}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Course --</option>
                          {coursesData.map((course) => (
                            <option key={course.id} value={course.title}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {applicationData.selectedCourseTitle ===
                        "VISA PROCESSING COURSE" && (
                        <div className="col-md-6 animate__animated animate__fadeIn">
                          <label className="form-label fw-bold small text-danger">
                            Select Visa Category Country
                          </label>
                          <select
                            className="form-select form-select-sm border-2 border-danger shadow-sm"
                            name="trainingCountry"
                            value={applicationData.trainingCountry}
                            onChange={handleChange}
                            required
                          >
                            <option value="">-- Select Country --</option>
                            <option value="AUSTRALIA">1. AUSTRALIA</option>
                            <option value="CANADA">2. CANADA</option>
                            <option value="NEW ZEALAND">3. NEW ZEALAND</option>
                            <option value="UK">4. UK</option>
                            <option value="USA">5. USA</option>
                            <option value="SCHENGEN">6. SCHENEGN</option>
                            <option value="ASIA">
                              7. ASIA - JAPAN- KOREA - SINGAPORE
                            </option>
                          </select>
                        </div>
                      )}

                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow text-dark"
                        >
                          PROCESS NEXT <ArrowRight size={20} className="ms-2" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              /* --- BANGAREN BIYAN KUDI (TUITION FEES) --- */
              <div className="p-4 p-md-5 text-center bg-white">
                <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
                  <GraduationCap size={45} className="text-danger" />
                </div>
                <h3 className="fw-bold mb-1 text-uppercase">
                  Tuition Fee Payment
                </h3>
                <p className="text-muted mb-4">
                  Course: <strong>{applicationData.selectedCourseTitle}</strong>
                </p>

                <div className="py-3 px-4 bg-light rounded-4 mb-4 border-start border-danger border-5 shadow-sm text-center">
                  <span className="text-muted small d-block mb-1 text-uppercase fw-bold">
                    Amount to Pay
                  </span>
                  <h2 className="display-4 fw-bold text-danger mb-0">
                    ₦
                    {applicationData.selectedCourseTitle ===
                    "VISA PROCESSING COURSE"
                      ? "200,000"
                      : "100,000"}
                  </h2>
                </div>

                <div
                  className="alert alert-danger border-0 small text-start mb-4"
                  style={{ borderRadius: "15px" }}
                >
                  <strong>Enrollment Policy:</strong> This tuition fee covers
                  your full training, materials, and certification. Fees are
                  non-refundable.
                </div>

                <div className="d-grid gap-2">
                  <button
                    onClick={handleFinalPayment}
                    disabled={isSubmitting}
                    className="btn btn-danger py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 text-uppercase"
                  >
                    {isSubmitting ? (
                      <Loader2 className="spinner-border spinner-border-sm" />
                    ) : (
                      <CreditCard size={20} />
                    )}
                    Pay Tuition & Download Receipt
                  </button>
                  <button
                    onClick={() => setShowPaymentStep(false)}
                    className="btn btn-link text-muted fw-bold text-decoration-none mt-2"
                  >
                    Back to Review Form
                  </button>
                </div>
              </div>
            )}
            {/* --- KARSHE --- */}
          </div>
        </div>
      )}
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
      {/* MANPOWER REQUEST FORM */}
      {showManpowerForm && (
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
            style={{
              maxWidth: "900px",
              borderRadius: "20px",
              overflow: "hidden",
            }}
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
                  Connect with the best certified professionals for your
                  business or home.
                </p>
              </div>
              <div className="col-md-8 p-4 p-md-5 bg-white">
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
                        Business/Requestor Information
                      </h5>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Company/Employer Name
                      </label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Mail size={18} />
                        </span>
                        <input
                          type="email"
                          className="form-control bg-light border-0"
                          placeholder="example@mail.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Phone Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          className="form-control bg-light border-0"
                          placeholder="+234..."
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Organization Type
                      </label>
                      <select className="form-select" required>
                        <option value="">-- Select --</option>
                        <option>Company</option>
                        <option>Hotel</option>
                        <option>Private Home</option>
                        <option>Farm</option>
                        <option>School</option>
                        <option>Hospital</option>
                        <option>Shop</option>
                        <option>Restaurant</option>
                        <option>Car Wash</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        Country
                      </label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        State / Province
                      </label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        Postal / Zip Code
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small">
                        Physical Address
                      </label>
                      <input type="text" className="form-control" required />
                    </div>
                    {/* REQUEST DETAILS */}
                    <div className="col-12">
                      <h6 className="fw-bold text-success border-bottom pb-2 mt-3 mb-2">
                        Job Requirements
                      </h6>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-bold small">
                        Type of Worker Needed (Category)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Briefcase size={18} />
                        </span>
                        <select
                          className="form-select bg-light border-0"
                          required
                          onChange={(e) =>
                            setIsOtherManpower(e.target.value === "other")
                          }
                        >
                          <option value="">-- Select Category --</option>

                          {/* UNSKILLED JOBS */}
                          <optgroup label="Unskilled Workers">
                            <option value="Cleaner">Cleaner</option>
                            <option value="Loader/Unloader">
                              Loader/Unloader
                            </option>
                            <option value="Helper/Assistant">
                              Helper/Assistant
                            </option>
                            <option value="Security Guard">
                              Security Guard
                            </option>
                            <option value="Farm Laborer">Farm Laborer</option>
                            <option value="Sweeper">Sweeper</option>
                            <option value="Food Preparation Worker">
                              Food Preparation Worker
                            </option>
                            <option value="Retail Clerk">Retail Clerk</option>
                            <option value="Delivery Driver">
                              Delivery Driver
                            </option>
                            <option value="Hospitality Worker">
                              Hospitality Worker
                            </option>
                            <option value="Dishwasher">Dishwasher</option>
                            <option value="Housekeeper">Housekeeper</option>
                            <option value="Car Wash Attendant">
                              Car Wash Attendant
                            </option>
                            <option value="Harvester or Picker">
                              Harvester or Picker
                            </option>
                            <option value="Babysitter">Babysitter</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Parking Lot Attendant">
                              Parking Lot Attendant
                            </option>
                            <option value="Agricultural Worker">
                              Agricultural Worker
                            </option>
                            <option value="Janitor">Janitor</option>
                            <option value="Porter">Porter</option>
                          </optgroup>

                          {/* SKILLED JOBS */}
                          <optgroup label="Skilled Professionals">
                            <option value="Software Developer">
                              Software Developer
                            </option>
                            <option value="Nurse">Nurse</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Mechanic">Mechanic</option>
                            <option value="Teacher/Lecturer">
                              Teacher/Lecturer
                            </option>
                            <option value="Accountant">Accountant</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Graphic Designer">
                              Graphic Designer
                            </option>
                          </optgroup>

                          <option value="other" className="fw-bold text-danger">
                            OTHER (NOT ON THE LIST)
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* WANNAN SHI NE GYARAN: Filin rubutu zai fito idan aka zabi Other */}
                    {isOtherManpower && (
                      <div className="col-md-12 animate__animated animate__fadeIn">
                        <label className="form-label fw-bold text-danger small">
                          Specify the Worker Type
                        </label>
                        <div className="input-group shadow-sm">
                          <span className="input-group-text bg-danger text-white border-0">
                            <PenTool size={18} />
                          </span>
                          <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="E.g. Plasterer, Welder, or Chef..."
                            required
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        Quantity (Quantity)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Hash size={18} />
                        </span>
                        <input
                          type="number"
                          className="form-control bg-light border-0"
                          placeholder="e.g. 5"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold small">
                        Work Location (City/State)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <MapPin size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          placeholder="e.g. Abuja, Nigeria"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold small">
                        Detailed Description
                      </label>
                      <textarea
                        className="form-control bg-light border-0"
                        rows="4"
                        placeholder="Provide details about job responsibilities, working hours, and other requirements..."
                        style={{ borderRadius: "15px" }}
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
      )}
      {showCBIForm && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="modal-content p-4 rounded-4 shadow bg-white"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-dark">
                Citizenship/Residency Application
              </h5>
              <button
                onClick={() => setShowCBIForm(false)}
                className="btn-close shadow-none"
                type="button"
              ></button>
            </div>

            <form onSubmit={handleCBISubmit}>
              <div className="row g-3">
                {/* Form Fields Dinka duka suna nan ba'a taba ba */}
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="tel"
                    className="form-control py-2"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Residential Address"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">
                    Your Country
                  </label>
                  <select className="form-select py-2" required>
                    <option value="">Select Country...</option>
                    {[
                      "Afghanistan",
                      "Albania",
                      "Algeria",
                      "Andorra",
                      "Angola",
                      "Antigua & Barbuda",
                      "Argentina",
                      "Armenia",
                      "Australia",
                      "Austria",
                      "Azerbaijan",
                      "Bahamas",
                      "Bahrain",
                      "Bangladesh",
                      "Barbados",
                      "Belarus",
                      "Belgium",
                      "Belize",
                      "Benin",
                      "Bhutan",
                      "Bolivia",
                      "Bosnia",
                      "Botswana",
                      "Brazil",
                      "Brunei",
                      "Bulgaria",
                      "Burkina Faso",
                      "Burundi",
                      "Cabo Verde",
                      "Cambodia",
                      "Cameroon",
                      "Canada",
                      "Central African Republic",
                      "Chad",
                      "Chile",
                      "China",
                      "Colombia",
                      "Comoros",
                      "Congo",
                      "Costa Rica",
                      "Croatia",
                      "Cuba",
                      "Cyprus",
                      "Czech Republic",
                      "Denmark",
                      "Djibouti",
                      "Dominica",
                      "Dominican Republic",
                      "Ecuador",
                      "Egypt",
                      "El Salvador",
                      "Equatorial Guinea",
                      "Eritrea",
                      "Estonia",
                      "Eswatini",
                      "Ethiopia",
                      "Fiji",
                      "Finland",
                      "France",
                      "Gabon",
                      "Gambia",
                      "Georgia",
                      "Germany",
                      "Ghana",
                      "Greece",
                      "Grenada",
                      "Guatemala",
                      "Guinea",
                      "Guinea-Bissau",
                      "Guyana",
                      "Haiti",
                      "Honduras",
                      "Hungary",
                      "Iceland",
                      "India",
                      "Indonesia",
                      "Iran",
                      "Iraq",
                      "Ireland",
                      "Israel",
                      "Italy",
                      "Jamaica",
                      "Japan",
                      "Jordan",
                      "Kazakhstan",
                      "Kenya",
                      "Kiribati",
                      "Kuwait",
                      "Kyrgyzstan",
                      "Laos",
                      "Latvia",
                      "Lebanon",
                      "Lesotho",
                      "Liberia",
                      "Libya",
                      "Liechtenstein",
                      "Lithuania",
                      "Luxembourg",
                      "Madagascar",
                      "Malawi",
                      "Malaysia",
                      "Maldives",
                      "Mali",
                      "Malta",
                      "Marshall Islands",
                      "Mauritania",
                      "Mauritius",
                      "Mexico",
                      "Micronesia",
                      "Moldova",
                      "Monaco",
                      "Mongolia",
                      "Montenegro",
                      "Morocco",
                      "Mozambique",
                      "Myanmar",
                      "Namibia",
                      "Nauru",
                      "Nepal",
                      "Netherlands",
                      "New Zealand",
                      "Nicaragua",
                      "Niger",
                      "Nigeria",
                      "North Korea",
                      "North Macedonia",
                      "Norway",
                      "Oman",
                      "Pakistan",
                      "Palau",
                      "Palestine",
                      "Panama",
                      "Papua New Guinea",
                      "Paraguay",
                      "Peru",
                      "Philippines",
                      "Poland",
                      "Portugal",
                      "Qatar",
                      "Romania",
                      "Russia",
                      "Rwanda",
                      "Saint Kitts & Nevis",
                      "Saint Lucia",
                      "Samoa",
                      "San Marino",
                      "Sao Tome & Principe",
                      "Saudi Arabia",
                      "Senegal",
                      "Serbia",
                      "Seychelles",
                      "Sierra Leone",
                      "Singapore",
                      "Slovakia",
                      "Slovenia",
                      "Solomon Islands",
                      "Somalia",
                      "South Africa",
                      "South Korea",
                      "South Sudan",
                      "Spain",
                      "Sri Lanka",
                      "Sudan",
                      "Suriname",
                      "Sweden",
                      "Switzerland",
                      "Syria",
                      "Taiwan",
                      "Tajikistan",
                      "Tanzania",
                      "Thailand",
                      "Timor-Leste",
                      "Togo",
                      "Tonga",
                      "Trinidad & Tobago",
                      "Tunisia",
                      "Türkiye",
                      "Turkmenistan",
                      "Tuvalu",
                      "Uganda",
                      "Ukraine",
                      "United Arab Emirates",
                      "United Kingdom",
                      "United States",
                      "Uruguay",
                      "Uzbekistan",
                      "Vanuatu",
                      "Vatican City",
                      "Venezuela",
                      "Vietnam",
                      "Yemen",
                      "Zambia",
                      "Zimbabwe",
                    ].map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="State"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="LGA"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">
                    Target Country
                  </label>
                  <select className="form-select py-2" required>
                    <option value="">Choose Country...</option>
                    {[
                      "Antigua & Barbuda",
                      "Argentina",
                      "Dominica",
                      "Grenada",
                      "Sao Tome & Principe",
                      "St Kitts & Nevis",
                      "St. Lucia",
                      "Türkiye",
                      "Vanuatu",
                      "Nauru",
                      "Malta",
                      "Qatar",
                      "Kuwait",
                      "Saudi Arabia",
                      "Egypt",
                      "Mauritius",
                      "Jordan",
                      "Greece",
                      "Portugal",
                      "Andorra",
                      "Thailand",
                      "Hungary",
                      "South Africa",
                      "Canada",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">
                    Program Type
                  </label>
                  <select className="form-select py-2" required>
                    <option value="">Select Program...</option>
                    <option value="Global Citizenship">
                      Global Citizenship
                    </option>
                    <option value="International Real Estate">
                      International Real Estate
                    </option>
                    <option value="Second Citizenship">
                      Second Citizenship
                    </option>
                    <option value="Foreign Residency">Foreign Residency</option>
                    <option value="Golden Visas">Golden Visas</option>
                    <option value="Citizenship By Real Estate">
                      Citizenship By Real Estate Investment
                    </option>
                  </select>
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Additional information (Tell us more about your request...)"
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-sm"
                  >
                    SUBMIT APPLICATION
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInsuranceForm && ( // Na canza sunan state din zuwa InsuranceForm domin daidaito
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)" }}
        >
          <div
            className="card border-0 shadow-lg rounded-4 p-4 w-100 m-3"
            style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Header & Close Button */}
            <div className="d-flex justify-content-between align-items-center mb-4 text-dark border-bottom pb-3">
              <div>
                <h4 className="fw-bold mb-0 text-primary">
                  Insurance & Clearance
                </h4>
                <small className="text-secondary fw-bold text-uppercase tracking-wider">
                  Arewa Flight Services Portal
                </small>
              </div>
              <button
                onClick={() => setShowInsuranceForm(false)}
                className="btn-close shadow-none"
              ></button>
            </div>

            <form onSubmit={handleInsuranceApplication} className="text-dark">
              {/* Personal Details */}
              <div className="mb-3 text-start">
                <label className="small fw-bold mb-1">
                  Full Names (As shown on Passport)
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="form-control rounded-3 py-2"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="row mb-3 text-start">
                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="080..."
                    className="form-control rounded-3 py-2"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold mb-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="A00000000"
                    className="form-control rounded-3 text-uppercase py-2"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passportNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Specialized Services */}
              <hr className="my-4 opacity-50" />
              <h6 className="fw-bold mb-3 text-primary text-uppercase small tracking-widest">
                Enrollment Requirements
              </h6>

              <div className="mb-3 text-start">
                <label className="small fw-bold mb-1">
                  Medical Assessment History
                </label>
                <textarea
                  rows="2"
                  className="form-control rounded-3"
                  placeholder="Briefly describe any health records or clinical preferences"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalAssessment: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="mb-3 text-start">
                <label className="small fw-bold mb-1">
                  Work Insurance Coverage
                </label>
                <select
                  className="form-select rounded-3 py-2"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, insuranceType: e.target.value })
                  }
                >
                  <option value="">Select Insurance Type</option>
                  <option value="Work-Travel Insurance">
                    Work-Travel Insurance (Standard)
                  </option>
                  <option value="Health & Accident Premium">
                    Health & Accident Premium
                  </option>
                </select>
              </div>

              <div className="mb-4 text-start">
                <label className="small fw-bold mb-1">
                  Police Clearance (Character Certificate)
                </label>
                <select
                  className="form-select rounded-3 py-2"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, clearanceType: e.target.value })
                  }
                >
                  <option value="">Select Clearance Type</option>
                  <option value="Standard Police Clearance">
                    Standard Police Clearance
                  </option>
                  <option value="Special Good Conduct Cert">
                    Special Good Conduct Certificate
                  </option>
                </select>
              </div>

              <div className="alert alert-primary d-flex align-items-center gap-2 py-3 rounded-4 shadow-sm border-0">
                <div className="flex-grow-1">
                  <div className="small opacity-75">ENROLLMENT FEE:</div>
                  <div className="h4 fw-bold mb-0">₦300,000</div>
                </div>
                <small
                  className="bg-white bg-opacity-25 p-2 rounded text-uppercase fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  Official Fee
                </small>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-lg text-uppercase tracking-wider mt-2"
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing Enrollment...
                  </>
                ) : (
                  "Complete Enrollment & Get Receipt"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* APPLICATION FORM MODAL */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start align-items-md-center justify-content-center px-2 py-4"
          style={{
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            overflowY: "auto",
          }}
        >
          <div
            className="card border-0 shadow-lg position-relative w-100"
            style={{
              maxWidth: "1000px",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setShowForm(false);
                setIsSuccess(false);
                setShowPaymentStep(false);
                setPhotoPreview(null);
                setSelectedCourse(null);
                setJobSearchQuery("");
              }}
              className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm"
              style={{ zIndex: 100 }}
            >
              <X size={20} />
            </button>

            <div className="row g-0">
              {/* SIDEBAR AREA */}
              <div className="col-md-3 bg-danger p-4 text-white d-flex flex-column justify-content-center text-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mx-auto mb-3 border border-3 border-white shadow"
                    style={{
                      width: "100px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <UserCheck size={60} className="mx-auto mb-3" />
                )}
                <h4 className="fw-bold">
                  {showPaymentStep
                    ? "FEES PAYMENT"
                    : selectedCourse
                      ? "ADMISSION FORM"
                      : "JOB APPLICATION"}
                </h4>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="col-md-9 p-3 p-md-5 bg-white">
                {isSuccess ? (
                  /* SUCCESS MESSAGE */
                  <div className="text-center py-5">
                    <CheckCircle size={60} className="text-success mb-4" />
                    <h2 className="fw-bold">Success!</h2>
                    <p>Your application and payment have been received.</p>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setIsSuccess(false);
                      }}
                      className="btn btn-dark px-5 py-2 rounded-pill mt-3"
                    >
                      Close Portal
                    </button>
                  </div>
                ) : showPaymentStep ? (
                  /* PAYMENT STEP */
                  <div className="p-4 p-md-5 text-center">
                    <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
                      <Wallet size={40} className="text-success" />
                    </div>
                    <h3 className="fw-bold mb-2">Job Consultation Fee</h3>
                    <h2 className="display-6 fw-bold text-success mb-3">
                      ₦100,000
                    </h2>

                    <div
                      className="alert alert-warning border-0 small text-start mb-4 shadow-sm"
                      style={{ borderRadius: "15px", fontSize: "0.85rem" }}
                    >
                      <strong>Disclaimer:</strong> Consultation fee is charged
                      for professional guidance and screening services only and
                      does not guarantee employment. This fee is non-refundable.
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        onClick={handleFinalPayment}
                        disabled={isSubmitting}
                        className="btn btn-success py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                      >
                        {isSubmitting ? (
                          <span className="d-flex align-items-center gap-2">
                            <Loader2 className="spinner-border spinner-border-sm" />{" "}
                            PROCESSING...
                          </span>
                        ) : (
                          <span className="d-flex align-items-center gap-2">
                            <CreditCard size={20} /> PAY & DOWNLOAD RECEIPT
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => setShowPaymentStep(false)}
                        className="btn btn-link text-muted fw-bold text-decoration-none mt-2"
                      >
                        Back to Application Form
                      </button>
                    </div>
                  </div>
                ) : (
                  /* APPLICATION FORM STEP */
                  <form
                    className="row g-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowPaymentStep(true);
                    }}
                  >
                    <div className="col-12 border-bottom pb-2 mb-2">
                      <h6 className="fw-bold text-danger">
                        Personal & Identity Details
                      </h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Passport Photo
                      </label>
                      <input
                        type="file"
                        name="photoFile"
                        className="form-control form-control-sm border-2 shadow-sm"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={applicationData.name || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="Firstname Middlename Surname"
                        required
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-bold small">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={applicationData.email || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="example@mail.com"
                        required
                      />
                    </div>

                    <div className="col-6 col-md-2">
                      <label className="form-label fw-bold small">Gender</label>
                      <select
                        name="gender"
                        value={applicationData.gender || ""}
                        onChange={handleChange}
                        className="form-select form-select-sm border-2"
                        required
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div className="col-6 col-md-2">
                      <label className="form-label fw-bold small">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={applicationData.age || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        NIN Number / ID
                      </label>
                      <input
                        type="text"
                        name="nin"
                        value={applicationData.nin || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        International Passport Number
                      </label>
                      <input
                        type="text"
                        name="passportNo"
                        value={applicationData.passportNo || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="A12345678"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        WhatsApp Number (+Code)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={applicationData.phone || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="+234..."
                        required
                      />
                    </div>

                    <div className="col-12 border-bottom pb-2 mt-3 mb-2">
                      <h6 className="fw-bold text-danger">
                        Location & Background
                      </h6>
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        name="state"
                        value={applicationData.state || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="State of Origin"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        name="lga"
                        value={applicationData.lga || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="LGA"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        name="residenceCountry"
                        value={applicationData.residenceCountry || "Nigeria"}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="address"
                        value={applicationData.address || ""}
                        onChange={handleChange}
                        className="form-control form-control-sm border-2 shadow-sm"
                        placeholder="Full Home Address"
                        required
                      />
                    </div>

                    {/* DESTINATION & JOB */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Select Target Country
                      </label>
                      <select
                        name="country"
                        value={applicationData.country || ""}
                        onChange={(e) => {
                          handleChange(e);
                          setIsOtherCountry(e.target.value === "Other");
                        }}
                        className="form-select form-select-sm border-2 shadow-sm"
                        required
                      >
                        <option value="">-- Select Country --</option>
                        {countriesList.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="Other">OTHER COUNTRY (Specify)</option>
                      </select>

                      {isOtherCountry && (
                        <input
                          type="text"
                          name="otherCountry"
                          value={applicationData.otherCountry || ""}
                          onChange={handleChange}
                          className="form-control form-control-sm border-2 shadow-sm mt-2"
                          placeholder="Enter name of the country"
                          required
                        />
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Job Category
                      </label>
                      <select
                        name="job"
                        value={applicationData.job || ""}
                        onChange={(e) => {
                          handleChange(e);
                          setIsOtherJob(e.target.value === "Other");
                        }}
                        className="form-select form-select-sm border-2 shadow-sm"
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {unskilledJobsList.map((j) => (
                          <option key={j} value={j}>
                            {j}
                          </option>
                        ))}
                        {skilledJobsList.map((j) => (
                          <option key={j} value={j}>
                            {j}
                          </option>
                        ))}
                        <option value="Other">OTHER JOB (Specify)</option>
                      </select>

                      {isOtherJob && (
                        <input
                          type="text"
                          name="otherJob"
                          value={applicationData.otherJob || ""}
                          onChange={handleChange}
                          className="form-control form-control-sm border-2 shadow-sm mt-2"
                          placeholder="Enter the job title you want"
                          required
                        />
                      )}
                    </div>

                    {/* JOB DESTINATION SUB-SELECT */}
                    {applicationData.job && (
                      <div className="col-12 mt-2">
                        <label className="form-label fw-bold small text-success">
                          Select Job Destination Country
                        </label>
                        <select
                          className="form-select form-select-sm border-2 border-success shadow-sm"
                          name="jobCountry"
                          value={applicationData.jobCountry || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Country --</option>
                          <option value="AUSTRALIA">1 AUSTRALIA</option>
                          <option value="CANADA">2 CANADA</option>
                          <option value="NEW ZEALAND">3 NEW ZEALAND</option>
                          <option value="UK">4 UK</option>
                          <option value="USA">5 USA</option>
                          <option value="SCHENEGEN">6 SCHENEGEN</option>
                          <option value="ASIA">
                            7 ASIA - JAPAN- KOREA - SINGAPORE
                          </option>
                        </select>
                      </div>
                    )}

                    {/* FILE UPLOADS */}
                    <div className="col-md-12 mt-3">
                      <label className="form-label fw-bold small">
                        Upload International Passport (Data Page)
                      </label>
                      <input
                        type="file"
                        name="passportFile"
                        className="form-control form-control-sm"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Upload Resume/Certificate
                      </label>
                      <input
                        type="file"
                        name="resumeFile"
                        className="form-control form-control-sm"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small">
                        Upload CV
                      </label>
                      <input
                        type="file"
                        name="cvFile"
                        className="form-control form-control-sm"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow text-dark"
                      >
                        PROCESS NEXT <ArrowRight size={20} className="ms-2" />
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
