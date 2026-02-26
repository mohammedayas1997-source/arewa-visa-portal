import React, { useState, useMemo, useEffect } from 'react';
import { auth, db } from "../firebase"; 
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, onValue, remove, push, set, serverTimestamp } from 'firebase/database';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  Users, Briefcase, Wallet, Download, Printer, Phone, 
  Mail, Eye, Plane, FileText, CheckCircle, Search, Menu, X,
  ExternalLink, UserCheck, TrendingUp, Building2, 
  Filter, MoreVertical, Trash2, CheckCircle2, AlertCircle,
  Clock, MapPin, Share2, FileDown, Globe, Lock, ShieldAlert, LogOut, GraduationCap, History,
  Newspaper, ImagePlus,
  Ticket, Send, RefreshCw, BarChart3, List, Activity, PlusCircle,
  // KARA WANNAN:
  ShieldCheck 
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

// --- 1. LOGIN COMPONENT ---
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Tabbatar email da password ba sa dauke da space na kuskure
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (err) {
      console.error("Login Error:", err.code);
      setError('Invalid email or password. Access Denied.');
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen d-flex align-items-center justify-content-center bg-dark text-white p-3">
    <div className="card border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '400px', borderRadius: '25px', backgroundColor: '#1a1a1a' }}>
      <div className="text-center mb-4">
        <div className="bg-danger d-inline-block p-3 rounded-circle mb-3 shadow">
          <Lock size={30} color="white"/>
        </div>
        <h3 className="fw-bold text-white"><ShieldAlert className="d-inline me-2"/>AVA Admin</h3>
        <p className="text-secondary small">Authorized Personnel Only</p>
      </div>
      {error && <div className="alert alert-danger py-2 small border-0 shadow-sm text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label className="small fw-bold text-secondary mb-1">OFFICIAL EMAIL</label>
          <input type="email" className="form-control bg-dark text-white border-secondary py-2" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4 text-start">
          <label className="small fw-bold text-secondary mb-1">PASSWORD</label>
          <input type="password" className="form-control bg-dark text-white border-secondary py-2" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow" disabled={loading}>
          {loading ? 'Authenticating...' : 'SIGN IN'}
        </button>
      </form>
    </div>
  </div>
);
};

// --- 2. MAIN DASHBOARD COMPONENT ---
const GlobalAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [manpowerRequests, setManpowerRequests] = useState([]);
  const [trainingApps, setTrainingApps] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCBI, setSelectedCBI] = useState(null);
  const [ticketPoolInput, setTicketPoolInput] = useState('');

  // States na posting da kake bukata
  const [uploading, setUploading] = useState(false);
  const [newsData, setNewsData] = useState({ title: '', content: '' });
  const [galleryFile, setGalleryFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [view, setView] = useState('book');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null); // Tabbatar wannan yana nan

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const galleryRef = ref(db, 'gallery');
    onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setGallery(list);
      } else {
        setGallery([]);
      }
    });
  }, []);

  // 2. Logic na Goge Hoto
  const handleDeleteGallery = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await remove(ref(db, `gallery/${id}`));
        alert("Image deleted successfully!");
      } catch (error) {
        alert("Error deleting image: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribes = [
      onValue(ref(db, 'applications'), (snapshot) => {
        setApplications(snapshot.val() ? Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })).reverse() : []);
      }),
      onValue(ref(db, 'manpower'), (snapshot) => {
        setManpowerRequests(snapshot.val() ? Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })).reverse() : []);
      }),
      onValue(ref(db, 'training'), (snapshot) => {
        setTrainingApps(snapshot.val() ? Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })).reverse() : []);
      }),
      onValue(ref(db, 'admin_history'), (snapshot) => {
        setHistoryLogs(snapshot.val() ? Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })).reverse() : []);
        setLoading(false);
      })
    ];

    return () => unsubscribes.forEach(fn => fn());
  }, [user]);

  const handlePrint = () => window.print();

  const stats = useMemo(() => ({
    revenue: applications.length * 15000,
    totalApps: applications.length,
    totalMan: manpowerRequests.length,
    totalTrain: trainingApps.length,
    approved: applications.filter(a => a.status === "Approved").length
  }), [applications, manpowerRequests, trainingApps]);

  const handleUploadTickets = async () => {
    if (!ticketPoolInput.trim()) return alert("Please paste ticket numbers first!");

    setUploading(true);
    try {
      const ticketsArray = ticketPoolInput.split(/[\n,]+/).map(t => t.trim()).filter(t => t !== "");
      if (ticketsArray.length === 0) throw new Error("No valid ticket numbers found");

      const poolRef = ref(db, 'ticket_pool');
      for (const ticketNo of ticketsArray) {
        const newTicketRef = push(poolRef);
        await set(newTicketRef, {
          ticketNo,
          status: 'available',
          createdAt: serverTimestamp()
        });
      }

      logAction('TICKET_UPLOAD', `Uploaded ${ticketsArray.length} new tickets to inventory`);
      setTicketPoolInput('');
      alert(`Successfully added ${ticketsArray.length} tickets to market!`);
    } catch (err) {
      alert("Error uploading: " + err.message);
    }
    setUploading(false);
  };

  const logAction = (action, details) => {
    const historyRef = ref(db, 'admin_history');
    const newLogRef = push(historyRef);
    set(newLogRef, {
      action,
      details,
      timestamp: new Date().toLocaleString(),
      admin: user?.email || "Admin"
    });
  };

  const [ticketBookings, setTicketBookings] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(db, 'ticket_bookings');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTicketBookings(Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse());
      }
    });
  }, []);

  const handleRejectTicket = async (booking) => {
    if (window.confirm(`Are you sure you want to reject ${booking.customerName}'s ticket?`)) {
      try {
        const poolRef = push(ref(db, 'ticket_pool'));
        await set(poolRef, { ticketNo: booking.ticketNo });
        await remove(ref(ref(db, `ticket_bookings/${booking.id}`)));
        logAction('TICKET_REJECTED', `Rejected ticket ${booking.ticketNo} for ${booking.customerName}.`);
        alert("Ticket Rejected!");
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  const generatePDFReceipt = (data) => {
    const doc = new jsPDF();
    doc.setFillColor(20, 40, 80);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("AREWA VISA ACADEMY", 20, 25);
    doc.setTextColor(40, 40, 40);
    doc.text(`Enrollment ID: ${data.refID}`, 20, 60);
    doc.save(`AVA_Receipt_${data.refID}.pdf`);
  };

  const [visaApps, setVisaApps] = useState([]);

  useEffect(() => {
    onValue(ref(db, 'arewa_visa_academy_apps'), (snap) => {
      const data = snap.val();
      setVisaApps(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse() : []);
    });
  }, []);

  const handlePostNews = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const newNewsRef = push(ref(db, 'news'));
      await set(newNewsRef, {
        ...newsData,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp()
      });
      logAction('POST_NEWS', `Posted news: ${newsData.title}`);
      setNewsData({ title: '', content: '' });
      alert("News published successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setUploading(false);
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) return alert("Select an image first");
    setUploading(true);
    try {
      // GYARA: Mun tabbatar da sunan storage reference
      const storageInstance = getStorage();
      const imageRef = sRef(storageInstance, `gallery/${Date.now()}_${galleryFile.name}`);
      const uploadTask = await uploadBytes(imageRef, galleryFile);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      await set(push(ref(db, 'gallery')), { imageUrl: downloadURL, createdAt: serverTimestamp() });
      logAction('UPLOAD_GALLERY', "Uploaded new gallery photo");
      setGalleryFile(null);
      alert("Photo uploaded!");
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  const [cbiRequests, setCbiRequests] = useState([]);

  useEffect(() => {
    const cbiRef = ref(db, 'cbi_applications');
    onValue(cbiRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCbiRequests(list.reverse());
      }
    });
  }, []);

  const handleDeleteRequest = async (id) => {
    if (window.confirm("Delete record?")) {
      remove(ref(db, `cbi_applications/${id}`));
    }
  };

  const handleDelete = (id, type, name) => {
    if (window.confirm(`Goge record na ${name}?`)) {
      const path = type === 'app' ? `applications/${id}` : type === 'man' ? `manpower/${id}` : `training/${id}`;
      remove(ref(db, path)).then(() => logAction('DELETE', `Deleted ${name}`));
    }
  };

  const approveAndSendCertificate = async (student) => {
    const completionDate = document.getElementById(`date-${student.id}`).value;
    const courseTitle = document.getElementById(`course-${student.id}`).value;
    if (!completionDate) return alert("Select date!");

    const certificateID = `AVA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    try {
      await set(ref(db, `training/${student.id}/status`), "Approved");
      await set(ref(db, `training/${student.id}/certInfo`), { certificateID, completionDate, courseTitle, issuedAt: new Date().toLocaleString() });

      const input = document.getElementById(`cert-pdf-${student.id}`);
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'px', [1050, 750]);
      pdf.addImage(imgData, 'PNG', 0, 0, 1050, 750);
      pdf.save(`${student.fullName}-Certificate.pdf`);
      alert("Success!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Karka manta ka saka return (...) a karshe
  if (!user) return <AdminLogin />;

return (
  <div className="min-h-screen bg-light d-flex d-print-block">
    <aside className="bg-dark text-white p-3 shadow-lg d-none d-md-block d-print-none" style={{ width: '280px', position: 'sticky', top: 0, height: '100vh' }}>
      <div className="d-flex align-items-center gap-2 mb-5 p-2 border-bottom border-secondary pb-4">
        <div className="bg-danger rounded p-1"><Globe size={24}/></div>
        <h5 className="fw-bold mb-0">AVA GLOBAL ADMIN</h5>
      </div>
      <nav className="nav flex-column gap-2">
        <button onClick={() => setActiveTab('overview')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'overview' ? 'bg-danger shadow' : ''}`}><TrendingUp size={20}/> Overview</button>
        <button onClick={() => setActiveTab('applications')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'applications' ? 'bg-danger shadow' : ''}`}><Users size={20}/> Job Applications</button>
        <button onClick={() => setActiveTab('training')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'training' ? 'bg-danger shadow' : ''}`}><GraduationCap size={20}/> Training Apps</button>
        <button onClick={() => setActiveTab('manpower')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'manpower' ? 'bg-danger shadow' : ''}`}><Building2 size={20}/> Manpower Requests</button>
        <button onClick={() => setActiveTab('finance')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'finance' ? 'bg-danger shadow' : ''}`}><Wallet size={20}/> Revenue Tracker</button>
        <button 
          onClick={() => setActiveTab('bookings')} 
          className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent w-100 ${activeTab === 'bookings' ? 'bg-danger shadow fw-bold' : ''}`}
        >
          <List size={20}/> 
          <span>Live Bookings</span>
        </button>
        <button 
          type="button"
          onClick={() => {
            console.log("Button clicked!"); // Duba wannan a Console
            setActiveTab('visa_academy');
          }} 
          className={`w-100 d-flex align-items-center gap-3 p-3 rounded-3 border-0 mb-2 transition-all ${
            activeTab === 'visa_academy' ? 'bg-danger text-white shadow' : 'bg-transparent text-white'
          }`}
          style={{ cursor: 'pointer', textAlign: 'left' }}
        >
          <ShieldCheck size={20} /> 
          <span className="fw-bold">Insurance & Clearance</span>
          <span className="badge bg-warning text-dark ms-auto">{visaApps?.length || 0}</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent ${activeTab === 'history' ? 'bg-danger shadow' : ''}`}><History size={20}/> Activity History</button>
        <button onClick={() => setActiveTab('cbi')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent w-100 transition-all ${activeTab === 'cbi' ? 'bg-warning shadow text-dark fw-bold' : 'hover-bg-light-opacity'}`}><Globe size={20} className={activeTab === 'cbi' ? 'text-dark' : 'text-warning'} /><span>CBI Applications</span></button>
      </nav>
      <div className="mt-auto p-3 text-secondary small"><ShieldAlert size={14}/> Secured Session</div>
    </aside>

    <main className="flex-grow-1 p-4 overflow-auto">
      <header className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm d-print-none">
        <div className="d-flex align-items-center gap-3">
          <Menu className="d-md-none cursor-pointer" />
          <div>
            <h4 className="fw-bold mb-0">Management Console</h4>
            <p className="text-muted small mb-0"><Clock size={12}/> {new Date().toDateString()} | Live Data Connected</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button onClick={handlePrint} className="btn btn-light border btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
            <Printer size={16}/> Print Report
          </button>
          <button onClick={() => signOut(auth)} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </header>

      <div className="row g-4 mb-4 text-nowrap">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <div className="d-flex justify-content-between align-items-center mb-2"><h6>Revenue</h6><FileDown size={18} className="text-muted"/></div>
            <h2 className="fw-bold">₦{stats.revenue.toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <div className="d-flex justify-content-between align-items-center mb-2"><h6 className="text-danger">Applicants</h6><UserCheck size={18} className="text-danger"/></div>
            <h2 className="fw-bold text-danger">{stats.totalApps}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <div className="d-flex justify-content-between align-items-center mb-2"><h6 className="text-success">Students</h6><CheckCircle2 size={18} className="text-success"/></div>
            <h2 className="fw-bold text-success">{stats.totalTrain}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
            <div className="d-flex justify-content-between align-items-center mb-2"><h6 className="text-primary">Companies</h6><Briefcase size={18} className="text-primary"/></div>
            <h2 className="fw-bold text-primary">{stats.totalMan}</h2>
          </div>
        </div>
      </div>

{/* 3. Bangaren Gallery Management (Saka wannan a inda kake son hotunan su fito) */}
      <div className="mt-5 p-4 bg-white rounded-4 shadow-sm">
        <div className="d-flex align-items-center gap-2 mb-4 text-danger">
          <ImagePlus size={24} />
          <h4 className="fw-bold mb-0">Manage Gallery</h4>
        </div>

        <div className="row g-3">
          {gallery.length > 0 ? (
            gallery.map((img) => (
              <div className="col-lg-2 col-md-3 col-6" key={img.id}>
                <div className="card h-100 border-0 shadow-sm position-relative group">
                  <img 
                    src={img.imageUrl} 
                    className="card-img-top rounded-3 object-fit-cover" 
                    style={{ height: '120px' }} 
                    alt="Gallery" 
                  />
                  <div className="p-2">
                    <button 
                      onClick={() => handleDeleteGallery(img.id)} 
                      className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted small ps-2">No images in gallery.</p>
          )}
  </div>
</div>

<div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h5 className="fw-bold mb-3 text-danger"><Newspaper size={20} className="me-2"/> Post Latest News</h5>
            <form onSubmit={handlePostNews}>
              <input type="text" className="form-control mb-2" placeholder="News Title" value={newsData.title} onChange={e => setNewsData({...newsData, title: e.target.value})} required />
              <textarea className="form-control mb-3" rows="3" placeholder="Write news content here..." value={newsData.content} onChange={e => setNewsData({...newsData, content: e.target.value})} required></textarea>
              <button className="btn btn-dark w-100 fw-bold" disabled={uploading}>{uploading ? "Posting..." : "Publish News"}</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h5 className="fw-bold mb-3 text-primary"><ImagePlus size={20} className="me-2"/> Add to Gallery</h5>
            <p className="small text-muted">Select a photo to display on the home page gallery.</p>
            <form onSubmit={handleUploadGallery}>
              <input type="file" className="form-control mb-3" onChange={e => setGalleryFile(e.target.files[0])} accept="image/*" required />
              <button className="btn btn-primary w-100 fw-bold" disabled={uploading}>{uploading ? "Uploading..." : "Upload Photo"}</button>
            </form>
          </div>
        </div>
      </div>
      

      {activeTab === 'applications' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold"><Search size={16} className="me-2"/> Recent Job Seekers</span>
              <div className="d-flex gap-2 align-items-center">
                <Filter size={16} className="text-muted"/>
                <span className="badge bg-danger rounded-pill">{applications.length} Entries</span>
              </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr><th className="ps-4">Applicant</th><th>Job & Country</th><th>Documents</th><th>Communication</th><th>Action</th></tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                          <img src={app.photoUrl || "https://via.placeholder.com/40"} className="rounded-circle border" width="40" height="40" alt="" />
                          <CheckCircle size={12} className="position-absolute bottom-0 end-0 text-success bg-white rounded-circle"/>
                        </div>
                        <div><div className="fw-bold small">{app.name}</div><div className="text-muted small">{app.email}</div></div>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-bold">{app.job}</div>
                      <div className="small text-danger"><MapPin size={10} className="me-1"/>{app.country}</div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <a href={app.cvUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-light border" title="Download CV"><FileText size={14}/></a>
                        <a href={app.passportDocUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-light border" title="Download Passport"><Download size={14}/></a>
                        <button className="btn btn-sm btn-light border"><Eye size={14}/></button>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <a href={`mailto:${app.email}?subject=Update on your Job Application`} className="btn btn-sm btn-primary shadow-sm"><Mail size={14}/></a>
                        <a href={`https://wa.me/${app.phone}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-success shadow-sm"><Phone size={14}/></a>
                        <button className="btn btn-sm btn-light border"><Share2 size={14}/></button>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button onClick={() => handleDelete(app.id, 'app', app.name)} className="btn btn-sm text-danger border-0"><Trash2 size={16}/></button>
                        <MoreVertical size={16} className="text-muted cursor-pointer"/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    {/* --- 4. BANGARYEN LIVE BOOKINGS --- */}
{activeTab === 'bookings' && (
  <div className="animate__animated animate__fadeIn">
    {/* Inventory Setup Section */}
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 text-dark border-bottom pb-3">
        <div className="d-flex align-items-center gap-2">
          <Ticket size={24} className="text-danger" />
          <h5 className="fw-bold mb-0">Ticket Inventory & Auto-Distribution</h5>
        </div>
        <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 border border-danger border-opacity-25">
          <RefreshCw size={14} className="me-1" /> Live Stock
        </span>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="p-4 border rounded-4 bg-light shadow-sm text-dark">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Send size={18} className="text-primary" /> Upload Ticket Pool
            </h6>
            <label className="small fw-bold text-muted mb-2 text-uppercase">Input 10 Ticket Numbers (One per line)</label>
            <textarea 
              className="form-control border-0 shadow-sm p-3 mb-3" 
              rows="5" 
              placeholder="Example:&#10;AVA-TKT-001&#10;AVA-TKT-002"
              style={{ borderRadius: '15px' }}
              value={ticketPoolInput}
              onChange={(e) => setTicketPoolInput(e.target.value)} // Adana rubutun
            ></textarea>

            <button 
              onClick={handleUploadTickets} // Kira aikin add commit
              disabled={uploading}
              className="btn btn-danger w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow"
            >
              {uploading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <>
                  <CheckCircle size={18} /> RELEASE TICKETS TO MARKET
                </>
              )}
            </button>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card border-0 bg-dark text-white p-4 h-100 rounded-4 shadow-lg overflow-hidden">
            <BarChart3 size={120} className="position-absolute end-0 bottom-0 opacity-10" style={{ marginRight: '-20px', marginBottom: '-20px' }} />
            <h6 className="fw-bold text-warning mb-4 text-uppercase small">Inventory Status</h6>
            <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-50 py-3">
              <span className="opacity-75">Available in Pool:</span>
              <span className="fw-bold text-info">10 Tickets</span>
            </div>
            <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-50 py-3">
              <span className="opacity-75">Successfully Sold:</span>
              <span className="fw-bold text-success">0 Sold</span>
            </div>
            <div className="mt-4 p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary">
               <small className="text-warning fw-bold"><AlertCircle size={14}/> Automatic System:</small>
               <p className="mb-0" style={{fontSize: '11px'}}>Rejected tickets automatically return to pool and expire from user dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Table na Masu Siyan Tikiti (Sold & Rejected Info) */}
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
        <span className="fw-bold text-dark d-flex align-items-center gap-2">
          <Users size={18} className="text-danger"/> Live Booking Logs & Transactions
        </span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-white border rounded-pill px-3 small fw-bold">All</button>
          <button className="btn btn-sm btn-white border rounded-pill px-3 small">Sold</button>
          <button className="btn btn-sm btn-white border rounded-pill px-3 small">Rejected</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase">
            <tr>
              <th className="ps-4">Passenger & Contact</th>
              <th>Ticket ID</th>
              <th>Bank / Account Info</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Logic: Idan babu data, zai nuna Placeholder */}
            {ticketBookings?.length > 0 ? ticketBookings.map((b) => (
              <tr key={b.id}>
                <td className="ps-4">
                  <div className="fw-bold text-dark">{b.customerName}</div>
                  <div className="text-muted small d-flex align-items-center gap-1"><Phone size={10}/> {b.customerPhone}</div>
                </td>
                <td>
                  <span className="badge bg-danger bg-opacity-10 text-danger fw-bold border border-danger border-opacity-25 px-3 py-2">
                    {b.ticketNo}
                  </span>
                </td>
                <td>
                  <div className="fw-bold text-dark" style={{fontSize: '13px'}}>₦{b.amount?.toLocaleString()}</div>
                  <div className="text-muted" style={{fontSize: '11px'}}>
                    <Wallet size={10} className="me-1"/> {b.bankName} | {b.accountNo}
                  </div>
                </td>
                <td>
                  <span className={`badge rounded-pill px-3 ${b.status === 'Rejected' ? 'bg-secondary' : 'bg-success'}`}>
                    {b.status || 'Confirmed'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleRejectTicket(b)} 
                      className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                      style={{fontSize: '11px'}}
                    >
                      REJECT & RECYCLE
                    </button>
                    <button className="btn btn-sm btn-light border rounded-circle"><MoreVertical size={14}/></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted small">
                  <Activity size={40} className="mb-3 opacity-25 d-block mx-auto"/>
                  No live booking transactions found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

  {activeTab === 'training' && (
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div className="p-3 border-bottom fw-bold text-success d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <GraduationCap size={20}/> Student Training Applications
        </div>
        <span className="badge bg-success rounded-pill small">{trainingApps.length} Students</span>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase">
            <tr>
              <th className="ps-4">Student Info</th>
              <th>Course Title</th>
              <th>Completion Date</th>
              <th>Status/Action</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {trainingApps.map((std) => (
              <React.Fragment key={std.id}>
                <tr>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img 
                          src={std.photoUrl || "https://via.placeholder.com/45"} 
                          className="rounded border shadow-sm" 
                          width="45" height="50" 
                          style={{objectFit: 'cover'}}
                          alt="Passport" 
                        />
                      </div>
                      <div>
                        <div className="fw-bold small">{std.fullName}</div>
                        <div className="text-muted" style={{fontSize: '11px'}}>{std.email}</div>
                        <div className="text-primary" style={{fontSize: '10px'}}><Phone size={10}/> {std.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="form-control form-control-sm border-success-subtle" 
                      defaultValue={std.course} 
                      id={`course-${std.id}`}
                      style={{fontSize: '12px', maxWidth: '150px'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="date" 
                      className="form-control form-control-sm border-success-subtle" 
                      id={`date-${std.id}`}
                      style={{fontSize: '12px'}}
                    />
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <span className="text-success small fw-bold"><CheckCircle2 size={12}/> {std.status || 'Pending'}</span>
                      <button 
                        onClick={() => handleDelete(std.id, 'train', std.fullName)} 
                        className="btn btn-link btn-sm text-danger p-0 text-start decoration-none"
                        style={{fontSize: '10px'}}
                      >
                        Remove Student
                      </button>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => approveAndSendCertificate(std)} 
                      className="btn btn-success btn-sm rounded-pill px-3 shadow-sm fw-bold"
                      style={{fontSize: '11px'}}
                    >
                      APPROVE & SEND
                    </button>
                  </td>
                </tr>

                <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                  <div id={`cert-pdf-${std.id}`} style={{
                    width: '1050px', height: '750px', padding: '40px',
                    background: '#fff', border: '20px solid #C5A059',
                    fontFamily: 'serif', position: 'relative', color: '#222'
                  }}>
                    <div style={{ border: '5px solid #C5A059', height: '100%', padding: '40px', textAlign: 'center' }}>
                      <h3 style={{ color: '#d9534f', letterSpacing: '5px', margin: '0' }}>AVA GLOBAL</h3>
                      <p style={{ fontSize: '12px', marginBottom: '20px' }}>PROFESSIONAL TRAINING & WORKFORCE SOLUTIONS</p>
                      
                      <h1 style={{ fontSize: '60px', margin: '20px 0', fontWeight: 'bold' }}>CERTIFICATE</h1>
                      <p style={{ fontSize: '18px', fontStyle: 'italic' }}>OF COMPLETION</p>

                      <p style={{ fontSize: '22px', marginTop: '30px' }}>This is to certify that</p>
                      <h2 style={{ fontSize: '45px', color: '#1a1a1a', borderBottom: '2px solid #ddd', display: 'inline-block', padding: '0 20px' }}>
                        {std.fullName}
                      </h2>

                      <p style={{ fontSize: '20px', marginTop: '20px' }}>Has successfully completed the professional course in:</p>
                      <h3 style={{ fontSize: '28px', color: '#d9534f' }}>{std.course}</h3>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', padding: '0 50px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontWeight: 'bold', margin: '0' }}>__________________________</p>
                          <p style={{ fontSize: '14px' }}>Training Director</p>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ background: 'white', padding: '5px' }}>
                            <QRCodeSVG value={`https://avaglobal.com/verify/${std.id}`} size={70} />
                          </div>
                          <p style={{ fontSize: '10px', marginTop: '5px' }}>Verified Certificate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
      {activeTab === 'manpower' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="p-3 border-bottom fw-bold text-primary d-flex align-items-center gap-2">
            <Building2 size={20}/> Company Hiring Requests
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr><th className="ps-4">Company</th><th>Need</th><th>Qty</th><th>Location</th><th>Action</th></tr>
              </thead>
              <tbody>
                {manpowerRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4">
                      <div className="fw-bold small">{req.companyName}</div>
                      <div className="text-muted small">{req.contactPerson}</div>
                    </td>
                    <td><span className="badge bg-primary-subtle text-primary border">{req.category}</span></td>
                    <td className="fw-bold">{req.quantity} <Users size={12}/></td>
                    <td className="small"><MapPin size={12}/> {req.location}</td>
                    <td><ExternalLink size={16} className="text-primary cursor-pointer"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border-top border-warning border-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-dark">
            <Globe className="me-2 text-warning" /> CBI & Residency Applications
          </h4>
          <span className="badge bg-warning text-dark rounded-pill px-3">
            {cbiRequests.length} New Requests
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>Client Name</th>
                <th>Contact Info</th>
                <th>Target Country</th>
                <th>Program Type</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cbiRequests.map((req) => (
                <tr 
                  key={req.id} 
                  onClick={() => setSelectedCBI(req)} // Wannan zai bude Modal
                  style={{ cursor: 'pointer' }}
                >
                  <td className="fw-bold text-dark">{req.name}</td>
                  <td>
                    <div className="small text-muted">{req.email}</div>
                    <div className="small fw-bold text-dark">{req.phone}</div>
                  </td>
                  <td>
                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3">
                      {req.country}
                    </span>
                  </td>
                  <td><small className="fw-semibold">{req.service}</small></td>
                  <td>{req.timestamp ? new Date(req.timestamp).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}> {/* Hana Modal budewa a nan */}
                      <a 
                        href={`https://wa.me/${req.phone?.replace(/\D/g,'')}?text=Hello ${req.name}...`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-success btn-sm rounded-pill px-3"
                      >
                        <Phone size={14} />
                      </a>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(req.id);
                        }} 
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {activeTab === 'finance' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Wallet/> Revenue Tracker (Realtime)</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-4 border rounded-4 bg-light d-flex justify-content-between align-items-center">
                <div><h6>Expected Income</h6><h2 className="text-success fw-bold">₦{(applications.length * 100.000).toLocaleString()}</h2></div>
                <TrendingUp size={40} className="text-success opacity-25"/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded-4 bg-light d-flex justify-content-between align-items-center">
                <div><h6>Processing Fee</h6><h2 className="fw-bold text-dark">₦15,000</h2></div>
                <AlertCircle size={40} className="text-dark opacity-25"/>
              </div>
            </div>
          </div>
        </div>
      )}

{view === 'admin' && (
  <div className="card-body p-0 bg-white text-dark overflow-hidden" style={{ height: '88vh', borderRadius: '15px' }}>
    <div className="d-flex h-100">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <div className="bg-dark p-3 d-flex flex-column gap-2 shadow-lg" style={{ width: '280px' }}>
        <div className="text-white mb-4 px-3 py-2 border-bottom border-secondary border-opacity-50">
          <h5 className="fw-bold mb-0 text-warning">AREWA ADMIN</h5>
          <small className="opacity-50 text-uppercase fw-bold" style={{fontSize: '10px'}}>Management Suite</small>
        </div>

        <button onClick={() => setActiveTab('overview')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'overview' ? 'bg-primary shadow' : 'hover-white-10'}`}>
          <Globe size={20} className={activeTab === 'overview' ? 'text-white' : 'text-warning'}/> 
          <span>Dashboard</span>
        </button>

        <button onClick={() => setActiveTab('inventory')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'inventory' ? 'bg-success shadow' : 'hover-white-10'}`}>
          <CreditCard size={20} className={activeTab === 'inventory' ? 'text-white' : 'text-success'}/> 
          <span>Ticket Inventory</span>
        </button>

        <button onClick={() => setActiveTab('bookings')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'bookings' ? 'bg-primary shadow' : 'hover-white-10'}`}>
          <Plane size={20} className={activeTab === 'bookings' ? 'text-white' : 'text-info'}/> 
          <span>Live Bookings</span>
        </button>

        <button onClick={() => setActiveTab('refunds')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'refunds' ? 'bg-warning text-dark shadow' : 'hover-white-10'}`}>
          <RefreshCcw size={20} className={activeTab === 'refunds' ? 'text-dark' : 'text-warning'}/> 
          <span>Refund Requests</span>
        </button>

        <button onClick={() => setActiveTab('inventory')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'inventory' ? 'bg-success shadow' : 'hover-white-10'}`}>
          <CreditCard size={20} className={activeTab === 'inventory' ? 'text-white' : 'text-success'}/> 
          <span>Ticket Inventory</span>
        </button>

        <button onClick={() => setActiveTab('finance')} className={`nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 border-0 bg-transparent transition-all ${activeTab === 'finance' ? 'bg-danger shadow' : 'hover-white-10'}`}>
          <Banknote size={20} className={activeTab === 'finance' ? 'text-white' : 'text-success'}/> 
          <span>Revenue Tracker</span>
        </button>

        <div className="mt-auto pt-3 border-top border-secondary border-opacity-50">
          <button onClick={() => setView('book')} className="btn btn-outline-light w-100 rounded-pill py-2 small d-flex align-items-center justify-content-center gap-2">
            <ArrowLeft size={16}/> Exit Portal
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow-1 p-4 overflow-auto bg-light">
        
        {/* TOP SEARCH & ACTIONS */}
        <div className="d-flex justify-content-between align-items-center mb-4">
           <div className="input-group w-50 shadow-sm rounded-pill overflow-hidden">
              <span className="input-group-text bg-white border-0"><Search size={18} /></span>
              <input type="text" className="form-control border-0 py-2" placeholder="Search by Passenger, Ticket ID or Route..." />
           </div>
           <button className="btn btn-dark rounded-pill px-4 fw-bold">Download Report</button>
        </div>

        {/* 1. TICKET INVENTORY (MANAGEMENT) */}
        {activeTab === 'inventory' && (
          <div className="animate__animated animate__fadeIn">
            <div className="row g-4">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-4 rounded-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <PlusCircle size={18} className="text-primary"/> Batch Ticket Import
                  </h6>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">Select Carrier</label>
                    <select className="form-select bg-light border-0 py-2 mt-1">
                      {Object.keys(airlinePrices).map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">Serial Ticket Numbers (Comma Separated)</label>
                    <textarea 
                      className="form-control bg-light border-0 py-2 mt-1" 
                      placeholder="Ex: ABJ-001, ABJ-002, ABJ-003" 
                      rows="5"
                    ></textarea>
                    <p className="small text-muted mt-2">Tickets added here remain hidden until a customer completes payment.</p>
                  </div>
                  <button className="btn btn-primary w-100 fw-bold rounded-pill py-2">PUSH TO MARKET</button>
                </div>
              </div>

              <div className="col-md-7">
                <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                  <h6 className="fw-bold mb-3">Inventory Stock Status</h6>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="small text-muted text-uppercase">
                        <tr>
                          <th>Airline</th>
                          <th>Reference</th>
                          <th>Visibility</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        <tr>
                          <td>Air Peace</td>
                          <td><code className="text-dark">AP-9920-X</code></td>
                          <td><span className="badge bg-secondary">Hidden</span></td>
                          <td><span className="badge bg-success bg-opacity-10 text-success border border-success">In Stock</span></td>
                        </tr>
                        <tr>
                          <td>Max Air</td>
                          <td><code className="text-dark">MX-1102-A</code></td>
                          <td><span className="badge bg-primary">Customer Device</span></td>
                          <td><span className="badge bg-danger bg-opacity-10 text-danger border border-danger">Sold Out</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REFUND & REJECTION MANAGEMENT */}
        {activeTab === 'refunds' && (
          <div className="card border-0 shadow-sm p-4 rounded-4 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2">
                <AlertTriangle size={20}/> Rejection & Refund Processing
              </h5>
              <span className="badge bg-danger rounded-pill px-3">Pending Action</span>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="small text-muted uppercase">
                    <th>Passenger Detail</th>
                    <th>Ticket Ref</th>
                    <th>Airline</th>
                    <th>Auto-Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  <tr>
                    <td>
                      <div className="fw-bold">Ibrahim Kabiru</div>
                      <div className="text-muted" style={{fontSize: '11px'}}>Ref: #RQ-772</div>
                    </td>
                    <td><span className="text-primary fw-bold">NG-9901</span></td>
                    <td>United Nigeria</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success rounded-pill px-3 fw-bold">Approve & Restock</button>
                        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">Decline</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="alert alert-info border-0 bg-info bg-opacity-10 mt-3 py-2 small">
                <strong>System Logic:</strong> Approving a refund automatically returns the Ticket ID to the Inventory for re-sale.
              </div>
            </div>
          </div>
        )}

  {activeTab === 'bookings' && (
    <div className="animate__animated animate__fadeIn">
      <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
        
        {/* HEADER TARE DA ICON */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-dark border-bottom pb-3">
          <div className="d-flex align-items-center gap-2">
            <Ticket size={24} className="text-danger" />
            <h5 className="fw-bold mb-0">Ticket Inventory & Auto-Distribution</h5>
          </div>
          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 border border-danger border-opacity-25">
            <RefreshCw size={14} className="me-1" /> Live Synchronization
          </span>
        </div>

        <div className="row g-4">
          {/* 1. INPUT AREA */}
          <div className="col-md-6">
            <div className="p-4 border rounded-4 bg-light shadow-sm">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Send size={18} className="text-primary" /> 
                Upload Ticket Pool
              </h6>
              <label className="small fw-bold text-muted mb-2">Enter 10 Ticket Numbers (Comma separated)</label>
              <textarea 
                className="form-control border-0 shadow-sm p-3 mb-3" 
                rows="5" 
                placeholder="Example: TKT-101, TKT-102, TKT-103..."
                style={{ borderRadius: '15px' }}
              ></textarea>
              <button className="btn btn-danger w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow">
                <CheckCircle size={18} /> RELEASE TO MARKET
              </button>
            </div>
          </div>

          {/* 2. LIVE STATISTICS AREA */}
          <div className="col-md-6">
            <div className="card border-0 bg-dark text-white p-4 h-100 rounded-4 shadow-lg position-relative overflow-hidden">
              {/* Background design icon */}
              <BarChart3 size={150} className="position-absolute end-0 bottom-0 opacity-10" style={{ marginRight: '-30px', marginBottom: '-30px' }} />
              
              <h6 className="fw-bold text-warning mb-4 d-flex align-items-center gap-2">
                <BarChart3 size={18} /> Real-Time Analytics
              </h6>
              
              <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-50 py-3">
                <span className="opacity-75">Hidden in Inventory:</span>
                <span className="fw-bold text-info">10 Tickets</span>
              </div>
              
              <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-50 py-3">
                <span className="opacity-75">Active/Sold:</span>
                <span className="fw-bold text-danger">0 Issued</span>
              </div>

              <div className="mt-4 p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary">
                <div className="d-flex gap-2 align-items-start">
                  <AlertCircle size={20} className="text-warning flex-shrink-0" />
                  <p className="small mb-0 text-white-50">
                    <strong>Auto-Process:</strong> Tickets are only revealed to customers in their dashboard after a successful payment transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

        {/* Rest of the Dashboard content (Overview, Finance etc) remains active below */}

          {/* DATA TABLE SECTION */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom border-light">
            <h5 className="mb-0 fw-bold text-dark text-start">
              {activeTab === 'bookings' ? 'Active Flight Bookings' : 'Pending Refund Settlements'}
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-start">
              <thead className="table-light text-uppercase">
                <tr style={{fontSize: '12px'}}>
                  <th className="ps-4">Passenger & Contact</th>
                  <th>Flight Details</th>
                  <th>Pricing</th>
                  <th>Status</th>
                  <th className="text-center">Control Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ps-4 py-3">
                    <div className="fw-bold text-primary">Ibrahim Suleiman</div>
                    <div className="small text-muted"><Globe size={12}/> ibrahim@arewa.com</div>
                    <div className="small text-muted">+234 803 000 1111</div>
                  </td>
                  <td>
                    <div className="fw-bold">Kano (KAN) ➔ Lagos (LOS)</div>
                    <div className="small text-dark fw-bold bg-light d-inline-block px-2 rounded">Ticket ID: AV-1022</div>
                    <div className="x-small text-muted mt-1">Date: 12th Feb 2026 | Airline: Air Peace</div>
                  </td>
                  <td>
                    <div className="fw-bold text-success">₦125,500</div>
                    <div className="x-small text-muted">Paid via Card</div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 ${activeTab === 'refunds' ? 'bg-warning text-dark' : 'bg-success bg-opacity-10 text-success border border-success'}`}>
                      {activeTab === 'refunds' ? 'Refund Pending' : 'Confirmed'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group shadow-sm rounded-3">
                      <button className="btn btn-white border btn-sm p-2" title="Modify Details"><Edit3 size={16} className="text-primary"/></button>
                      <button className="btn btn-white border btn-sm p-2" title="Process Refund"><RefreshCcw size={16} className="text-warning"/></button>
                      <button className="btn btn-white border btn-sm p-2" title="Delete Record"><Trash2 size={16} className="text-danger"/></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCE OVERVIEW (Only shows in Revenue Tab) */}
        {activeTab === 'finance' && (
          <div className="row mt-4 g-4 animate__animated animate__fadeIn">
             <div className="col-md-8">
                <div className="card border-0 shadow-sm p-4 rounded-4 text-start">
                   <h6 className="text-muted fw-bold">REVENUE GROWTH CHART</h6>
                   <div className="bg-light rounded-3 d-flex align-items-end justify-content-between p-3" style={{height: '200px'}}>
                      {/* Placeholder for Bars */}
                      {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} className="bg-primary rounded-top" style={{height: `${h}%`, width: '10%'}}></div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="col-md-4 text-start">
                <div className="card border-0 bg-danger text-white p-4 rounded-4 mb-3 shadow">
                   <small className="opacity-75 fw-bold">NET REVENUE</small>
                   <h2 className="fw-bold mb-0">₦4.2M</h2>
                </div>
                <div className="card border-0 bg-success text-white p-4 rounded-4 shadow">
                   <small className="opacity-75 fw-bold">SUCCESSFUL PAYMENTS</small>
                   <h2 className="fw-bold mb-0">1,102</h2>
                </div>
             </div>
          </div>
        )}
      </div>

    </div>
  </div>
)}

      {activeTab === 'history' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><History/> Admin Activity Logs</h5>
          <div className="list-group list-group-flush">
            {historyLogs.length > 0 ? historyLogs.map(log => (
              <div key={log.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light rounded-circle"><Clock size={16} className="text-danger"/></div>
                  <div>
                    <div className="fw-bold text-dark small">{log.action}</div>
                    <div className="text-muted small">{log.details}</div>
                    <div className="text-danger" style={{fontSize: '10px'}}><ShieldAlert size={10} className="me-1"/>{log.admin}</div>
                  </div>
                </div>
                <span className="badge bg-light text-dark fw-normal border">{log.timestamp}</span>
              </div>
            )) : <div className="text-center p-5 text-muted"><AlertCircle size={40} className="mb-2"/><br/>No activities recorded yet.</div>}
          </div>
        </div>
      )}

{/* TABBATAR WANNAN SUNAN 'visa_academy' YA DAIDAI DA NA BUTTON DIN SIDEBAR */}
{activeTab === 'visa_academy' && (
  <div className="animate__animated animate__fadeIn">
    {/* Modal don nuna cikakken bayani */}
    {selectedApp && (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
        <div className="card border-0 shadow-lg rounded-4 p-4 w-100 m-3" style={{ maxWidth: '500px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-primary">Application Details</h5>
            <button onClick={() => setSelectedApp(null)} className="btn-close"></button>
          </div>
          <div className="small text-dark">
            <p className="mb-2"><strong>Full Name:</strong> {selectedApp.fullName || selectedApp.name}</p>
            <p className="mb-2"><strong>Passport:</strong> {selectedApp.passportNumber || selectedApp.passportNo}</p>
            <p className="mb-2"><strong>Service:</strong> {selectedApp.service}</p>
            <p className="mb-2"><strong>Medical:</strong> {selectedApp.medicalAssessment || 'None'}</p>
            <p className="mb-2"><strong>Insurance:</strong> {selectedApp.insuranceType || 'Standard'}</p>
            <p className="mb-2"><strong>Clearance:</strong> {selectedApp.clearanceType || 'Standard'}</p>
            <p className="mb-2"><strong>Phone:</strong> {selectedApp.phone || 'N/A'}</p>
            <p className="mb-2"><strong>Reference:</strong> {selectedApp.refID}</p>
          </div>
          <button onClick={() => setSelectedApp(null)} className="btn btn-secondary w-100 rounded-pill mt-3 fw-bold">Close View</button>
        </div>
      </div>
    )}

    {/* Babban Teburin Bayanai */}
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold mb-0 text-dark">Insurance & Clearance Dashboard</h5>
          <small className="text-muted">Medical & Police Clearance Logs (₦300k Payments)</small>
        </div>
        <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm fw-bold">
          Total Apps: {visaApps?.length || 0}
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase text-secondary">
            <tr>
              <th className="ps-4">Applicant</th>
              <th>Service</th>
              <th>Ref ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visaApps && visaApps.length > 0 ? visaApps.map((app) => (
              <tr key={app.id}>
                <td className="ps-4">
                  <div className="fw-bold text-dark">{app.fullName || app.name}</div>
                  <div className="small text-muted">{app.phone || 'No Phone'}</div>
                </td>
                <td>
                  <div className="small fw-bold text-primary">{app.service}</div>
                  <div className="badge bg-secondary bg-opacity-10 text-dark border-0 px-2" style={{fontSize: '10px'}}>
                    Passport: {app.passportNumber || app.passportNo || 'N/A'}
                  </div>
                </td>
                <td><code className="text-danger fw-bold">{app.refID}</code></td>
                <td className="fw-bold text-success">{app.amount || "₦300,000"}</td>
                <td>
                  <span className={`badge rounded-pill px-3 ${
                    app.status?.includes('Approved') ? 'bg-success' : 'bg-warning text-dark'
                  }`}>
                    {app.status || 'Verification Pending'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => setSelectedApp(app)} 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                  >
                    View
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <div className="fs-2 mb-2">📁</div>
                  No Insurance & Clearance applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
    
  {selectedCBI && (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-dark text-warning border-bottom border-secondary">
            <h5 className="modal-title fw-bold text-uppercase">Client Full Information</h5>
            <button className="btn-close btn-close-white" onClick={() => setSelectedCBI(null)}></button>
          </div>
          
          <div className="modal-body p-4 bg-light">
            <div className="row g-3">
              {/* Personal Details */}
              <div className="col-md-6 border-bottom pb-2">
                <label className="text-muted small fw-bold">Full Name</label>
                <p className="mb-0 fw-bold text-dark">{selectedCBI.name}</p>
              </div>
             {/* Target Country */}
              <div className="col-md-6 border-bottom pb-2">
                <label className="text-muted small fw-bold">Target Country</label>
                {/* Idan 'country' ne a Firebase, yi amfani da 'country'. Idan kuma 'targetCountry' ne, canza shi zuwa hakan */}
                <p className="mb-0 fw-bold text-primary fs-5">
                  {selectedCBI.country || selectedCBI.targetCountry || 'Not Selected'}
                </p>
              </div>

              {/* Address Details */}
              <div className="col-md-4">
                <label className="text-muted small fw-bold">State</label>
                <p className="mb-0">{selectedCBI.state || 'N/A'}</p>
              </div>
              <div className="col-md-4">
                <label className="text-muted small fw-bold">LGA</label>
                <p className="mb-0">{selectedCBI.lga || 'N/A'}</p>
              </div>
              <div className="col-md-4">
                <label className="text-muted small fw-bold">Nationality</label>
                <p className="mb-0">{selectedCBI.nationality || 'N/A'}</p>
              </div>
              <div className="col-12 bg-white p-2 border rounded">
                <label className="text-muted small fw-bold">Full Address</label>
                <p className="mb-0">{selectedCBI.address || 'No address provided'}</p>
              </div>

              <hr />

             {/* Program Type / Service */}
              <div className="col-md-6 border-bottom pb-2">
                <label className="text-muted small fw-bold">Program Selected</label>
                {/* Idan 'service' ne a Firebase, yi amfani da 'service'. Idan 'programType' ne, canza shi zuwa hakan */}
                <p className="mb-0 fw-bold text-info fs-5">
                  {selectedCBI.service || selectedCBI.programType || 'No Program Selected'}
                </p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-bold">Budget</label>
                <p className="mb-0 text-success fw-bold">{selectedCBI.budget}</p>
              </div>
              
              <div className="col-12 bg-warning bg-opacity-10 p-3 rounded">
                <label className="text-muted small fw-bold">Client Message</label>
                <p className="mb-0 fst-italic">"{selectedCBI.message || 'No additional notes.'}"</p>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light border-top-0 d-flex justify-content-between">
            <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedCBI(null)}>Close</button>
            
            <div className="d-flex gap-2">
              {/* WhatsApp Contact Icon */}
              <a 
                href={`https://wa.me/${selectedCBI.phone?.replace(/\D/g,'')}?text=Hello ${selectedCBI.name}, this is Arewa Visa Academy regarding your inquiry for ${selectedCBI.country}.`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-success rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
              >
                <Phone size={18} /> Chat on WhatsApp
              </a>
              
              <a href={`mailto:${selectedCBI.email}`} className="btn btn-primary rounded-pill px-4">
                Email Client
              </a>
            </div>
          </div>
        </div>

          </div>
        </div>
      )}
    </main>
  </div>
);
};

export default GlobalAdminDashboard; //