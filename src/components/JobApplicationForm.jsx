import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  X,
  UserCheck,
  Loader2,
  Wallet,
  ArrowRight,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileText,
  Download,
  UploadCloud,
  Mail,
  Camera,
  Edit3
} from "lucide-react";

const JobApplicationForm = ({
  showForm,
  setShowForm,
  setIsSuccess,
  photoPreview,
  setPhotoPreview,
  applicationData = {}, 
  setApplicationData,
  handleChange,
  handlePhotoChange,
  handleFileChange,
  handleFinalPayment,
  isSubmitting,
}) => {
  const [step, setStep] = useState("form");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const receiptRef = useRef(null);

  // --- GLOBAL DATA ---
  const africaCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Democratic Republic)", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ];

  // --- TARGET COUNTRIES LIST ---
  const targetCountries = [
    "Australia", "Canada", "USA", "UK",
    "-- SCHENGEN AREA --",
    "Austria", "Belgium", "Bulgaria", "Croatia", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
    "-- ASIA --",
    "Japan", "South Korea", "Singapore", "Russia",
    "-- OCEANIA --",
    "New Zealand",
    "-- ISLAND NATIONS --",
    "Mauritius", "Seychelles",
    "-- BALKAN REGION --",
    "Albania", "Bosnia and Herzegovina", "Kosovo", "Montenegro", "North Macedonia", "Serbia", "Turkey",
    "-- MIDDLE EAST (GCC) --",
    "Qatar", "Kuwait", "Saudi Arabia", "Bahrain", "UAE", "Oman"
  ];

  const jobCategories = [
    "Information Technology (IT)", "Healthcare (Nursing/Medical)", "Engineering", "Construction & Labor", "Driving (Heavy/Light)", "Security Services", "Hospitality & Catering", "Education/Teaching", "Oil & Gas", "Agriculture", "Aviation", "Maritime", "General Office Work", "OTHER JOB"
  ];

  const nigeriaData = {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa West", "Ukwa East", "Umuahia North", "Umuahia South", "Umu-Nneochi"],
    "Adamawa": ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Akwa Ibom": ["Abak", "Eket", "Ikot Ekpene", "Uyo"], 
    "Bauchi": ["Alkaleri", "Bauchi", "Dass", "Katagum", "Misau", "Ningi", "Toro"],
    "Borno": ["Bama", "Biu", "Chibok", "Gwoza", "Jere", "Maiduguri", "Monguno"],
    "Gombe": ["Akko", "Billiri", "Dukku", "Gombe", "Kaltungo", "Kwami", "Yamaltu/Deba"],
    "Jigawa": ["Dutse", "Garki", "Gumel", "Hadejia", "Kazaure", "Ringim"],
    "Kaduna": ["Chikun", "Giwa", "Igabi", "Kaduna North", "Kaduna South", "Sabon Gari", "Zaria"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Katsina": ["Bakori", "Daura", "Dutsin Ma", "Funtua", "Jibia", "Katsina", "Malumfashi", "Zango"],
    "Kebbi": ["Argungu", "Birnin Kebbi", "Jega", "Yauri", "Zuru"],
    "Kwara": ["Ilorin East", "Ilorin South", "Ilorin West", "Offa"],
    "Lagos": ["Agege", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
    "Niger": ["Bida", "Chanchaga", "Kontagora", "Minna", "Suleja"],
    "Plateau": ["Jos East", "Jos North", "Jos South", "Mangu", "Pankshin"],
    "Sokoto": ["Sokoto North", "Sokoto South", "Tambuwal", "Wamako"],
    "Taraba": ["Bali", "Gassol", "Jalingo", "Wukari"],
    "Yobe": ["Damaturu", "Fika", "Nguru", "Potiskum"],
    "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara"]
  };

  if (!showForm) return null;

  const triggerPaystack = () => {
    if (!window.PaystackPop) return alert("Payment Gateway loading... please wait.");
    setIsProcessing(true);
    const handler = window.PaystackPop.setup({
      key: "pk_live_501518dc4688ce1fc18be571fb9b81ab785af677", 
      email: applicationData?.email || "consultant@arewavisa.com",
      amount: 100000 * 100,
      currency: "NGN",
      ref: "JOB-" + Math.floor((Math.random() * 1000000000) + 1),
      callback: (response) => {
        setPaymentRef(response.reference);
        completeSubmission(response.reference);
      },
      onClose: () => setIsProcessing(false),
    });
    handler.openIframe();
  };

  const completeSubmission = async (ref) => {
    setIsProcessing(true);
    try {
      await handleFinalPayment(ref); 
      setStep("success");
    } catch (e) {
      alert("System Error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`JOB-CONSULTATION-RECEIPT-${applicationData?.name || "Candidate"}.pdf`);
  };

  return (
    <div className="form-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 99999, backgroundColor: "rgba(0,0,0,0.98)", overflowY: "auto", backdropFilter: "blur(12px)", padding: "0px" }}>
      <div className="card-container card border-0 shadow-lg w-100 d-flex flex-column" style={{ maxWidth: "950px", overflow: "hidden", backgroundColor: "#fff", height: window.innerWidth < 768 ? "100vh" : "90vh" }}>
        
        {/* HEADER SECTION - FIXED AT TOP */}
        <div className="p-3 bg-danger text-white d-flex justify-content-between align-items-center shadow-sm sticky-top" style={{ zIndex: 10002 }}>
          <div className="d-flex align-items-center gap-2">
            <UserCheck size={24} />
            <div className="text-start">
              <h6 className="fw-black mb-0 italic uppercase">Job Portal</h6>
              <small className="x-small opacity-75 fw-bold uppercase" style={{ fontSize: '10px' }}>AVA Recruitment Terminal</small>
            </div>
          </div>
          <button onClick={() => setShowForm(false)} className="btn btn-link text-white p-0 border-0 shadow-none">
            <X size={28} />
          </button>
        </div>

        {step === "success" ? (
          <div className="bg-white flex-grow-1 overflow-auto">
             <div ref={receiptRef} className="p-4 p-md-5 text-dark text-start bg-white" style={{ border: "10px solid #000" }}>
                <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4">
                  <div className="text-start">
                    <h2 className="fw-black text-danger mb-0 italic" style={{fontSize: '1.2rem'}}>AREWA VISA ACADEMY</h2>
                    <p className="small text-muted mb-0 fw-bold uppercase">Job Consultation & Placement</p>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold mb-0 uppercase" style={{fontSize: '0.7rem'}}>REF: {paymentRef}</h6>
                  </div>
                </div>

                <div className="row g-3 mb-4 bg-light p-3 rounded-4 mx-0">
                  <div className="col-4 text-center">
                    <img src={photoPreview || "/placeholder-user.png"} style={{ width: "80px", height: "100px", objectFit: "cover" }} className="rounded-3 shadow-lg border border-2 border-white" alt="Applicant" />
                  </div>
                  <div className="col-8">
                     <h6 className="fw-black border-bottom border-danger pb-1 mb-2 uppercase small">Applicant Profile</h6>
                     <div className="x-small space-y-1" style={{fontSize: '10px'}}>
                        <p className="mb-1 uppercase"><strong>NAME:</strong> {applicationData?.name || "N/A"}</p>
                        <p className="mb-1 uppercase"><strong>PASSPORT:</strong> {applicationData?.passportNo || "N/A"}</p>
                        <p className="mb-1 uppercase"><strong>JOB:</strong> {applicationData?.otherJob || applicationData?.job || "N/A"}</p>
                        <p className="mb-1 uppercase"><strong>DESTINATION:</strong> {applicationData?.country || "N/A"}</p>
                     </div>
                  </div>
                </div>

                <div className="bg-dark p-3 rounded-4 text-white d-flex justify-content-between align-items-center shadow-lg">
                  <div className="text-start">
                    <h4 className="fw-black mb-0">₦100,000</h4>
                    <p className="x-small text-muted mb-0 uppercase">Verified Secure</p>
                  </div>
                  <CheckCircle size={30} className="text-success" />
                </div>
             </div>
             <div className="p-3 bg-light text-center d-flex gap-2 justify-content-center">
                <button onClick={downloadReceipt} className="btn btn-danger btn-sm px-4 py-2 rounded-pill fw-black uppercase"><Download size={16}/></button>
                <button onClick={() => window.location.reload()} className="btn btn-outline-dark btn-sm px-4 py-2 rounded-pill fw-bold">Finish</button>
             </div>
          </div>
        ) : (
          <div className="flex-grow-1 overflow-auto form-content">
            <div className="row g-0 h-100 flex-column flex-md-row">
              {/* SIDEBAR DESKTOP */}
              <div className="col-md-3 bg-danger p-4 text-white text-center d-none d-md-flex flex-column justify-content-center">
                {photoPreview ? (
                  <img src={photoPreview} className="mx-auto mb-3 border border-3 border-white rounded-4 shadow-lg" style={{ width: "120px", height: "150px", objectFit: "cover" }} alt="Applicant" />
                ) : (
                  <div className="bg-white/20 p-4 rounded-circle d-inline-block mx-auto mb-3"><UserCheck size={60} /></div>
                )}
                <h4 className="fw-black text-uppercase italic">Global Job Portal</h4>
                <p className="small opacity-75 fw-bold mt-2">Professional Recruitment Terminal</p>
              </div>

              {/* FORM AREA */}
              <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start">
                <form className="row g-4 pb-5" onSubmit={(e) => { e.preventDefault(); triggerPaystack(); }}>
                  <div className="col-12 border-bottom pb-2"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><User size={18} /> Candidate Identity</h6></div>
                  
                  <div className="col-md-6 text-start">
                     <label className="label-style">Passport Photo</label>
                     <input type="file" required className="sky-input" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                  <div className="col-md-6 text-start">
                     <label className="label-style">Full Legal Name</label>
                     <input type="text" name="name" className="sky-input" required value={applicationData?.name || ""} onChange={handleChange} />
                  </div>

                  <div className="col-md-6 text-start"><label className="label-style">Email Address</label><input type="email" name="email" className="sky-input" required value={applicationData?.email || ""} onChange={handleChange} /></div>
                  <div className="col-md-6 text-start"><label className="label-style">WhatsApp Number</label><input type="tel" name="whatsapp" className="sky-input" required value={applicationData?.whatsapp || ""} onChange={handleChange} /></div>
                  
                  <div className="col-md-6 text-start"><label className="label-style">NIN Number</label><input type="text" name="nin" className="sky-input" required value={applicationData?.nin || ""} onChange={handleChange} /></div>
                  <div className="col-md-6 text-start"><label className="label-style">Intl. Passport No.</label><input type="text" name="passportNo" className="sky-input uppercase" required value={applicationData?.passportNo || ""} onChange={handleChange} /></div>

                  {/* LOCATION SECTION */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><MapPin size={18} /> Origin & Location</h6></div>
                  
                  <div className="col-md-4 text-start">
                     <label className="label-style">Current Country</label>
                     <select className="sky-input" required name="countrySelection" value={applicationData?.countrySelection || ""} onChange={handleChange}>
                        <option value="">-- Select Country --</option>
                        {africaCountries.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  <div className="col-md-4 text-start">
                     <label className="label-style">Postal Code</label>
                     <input type="text" name="postalCode" className="sky-input" placeholder="000000" value={applicationData?.postalCode || ""} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 text-start">
                     <label className="label-style">State / Region</label>
                     <select className="sky-input" required name="state" value={applicationData?.state || ""} onChange={handleChange}>
                        <option value="">Select State</option>
                        {Object.keys(nigeriaData).map(st => <option key={st} value={st}>{st}</option>)}
                     </select>
                  </div>
                  <div className="col-md-6 text-start">
                     <label className="label-style">LGA / District</label>
                     <select className="sky-input" required name="lga" disabled={!applicationData?.state} value={applicationData?.lga || ""} onChange={handleChange}>
                        <option value="">Select Area</option>
                        {applicationData?.state && nigeriaData[applicationData.state]?.map(lg => <option key={lg} value={lg}>{lg}</option>)}
                     </select>
                  </div>
                  <div className="col-12 text-start"><label className="label-style">Full Residential Address</label><textarea name="address" className="sky-input" rows="2" required value={applicationData?.address || ""} onChange={handleChange}></textarea></div>

                  {/* JOB PREFERENCE */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><Briefcase size={18} /> Recruitment Details</h6></div>
                  
                  <div className="col-md-6 text-start">
                     <label className="label-style">Target Destination (Global)</label>
                     <select className="sky-input" required name="country" value={applicationData?.country || ""} onChange={handleChange}>
                        <option value="">-- Select Destination --</option>
                        {targetCountries.map((c, i) => (
                          <option key={i} value={c} disabled={c.startsWith("--")}>
                            {c}
                          </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-md-6 text-start">
                     <label className="label-style">Professional Job Category</label>
                     <select className="sky-input" required name="job" value={applicationData?.job || ""} onChange={handleChange}>
                        <option value="">-- Select Category --</option>
                        {jobCategories.map(j => <option key={j} value={j}>{j}</option>)}
                     </select>
                  </div>

                  {/* CONDITIONAL "OTHER JOB" FIELD */}
                  {applicationData?.job === "OTHER JOB" && (
                    <div className="col-12 text-start animate__animated animate__fadeIn">
                      <label className="label-style text-danger d-flex align-items-center gap-1">
                        <Edit3 size={12}/> Specify Your Job Title
                      </label>
                      <input 
                        type="text" 
                        name="otherJob" 
                        className="sky-input border-danger" 
                        placeholder="Type your specific job title here..." 
                        required 
                        value={applicationData?.otherJob || ""} 
                        onChange={handleChange} 
                      />
                    </div>
                  )}

                  {/* UPLOADS */}
                  <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><FileText size={18} /> Career Documents</h6></div>
                  
                  <div className="col-md-6 text-start">
                     <label className="label-style">CV / Resume (Mandatory PDF)</label>
                     <input type="file" required name="cvFile" className="sky-input" accept=".pdf" onChange={handleFileChange} />
                  </div>
                  <div className="col-md-6 text-start">
                     <label className="label-style">Supporting Documents (Optional)</label>
                     <input type="file" name="othersFile" className="sky-input" onChange={handleFileChange} />
                  </div>

                  {/* SUBMIT */}
                  <div className="col-12 mt-5">
                     <div className="bg-dark p-3 p-md-4 rounded-4 text-white d-flex justify-content-between align-items-center shadow-lg">
                        <div className="text-start">
                           <p className="x-small uppercase opacity-50 mb-0">Total Fee</p>
                           <h4 className="fw-black mb-0 italic">₦100,000</h4>
                        </div>
                        <button type="submit" disabled={isProcessing} className="btn btn-warning px-4 py-3 rounded-pill fw-black uppercase small border-0 text-dark">
                          {isProcessing ? <Loader2 className="animate-spin" size={20}/> : "Pay Now"}
                        </button>
                     </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sky-input { width: 100%; padding: 0.8rem 1rem; background: #f8fafc; border: 2px solid #eee; border-radius: 1rem; font-weight: 700; font-size: 0.85rem; outline: none; transition: 0.3s; color: #1e293b; }
        .sky-input:focus { border-color: #dc3545; background: white; }
        .label-style { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 5px; display: block; text-align: left; }
        .fw-black { font-weight: 900; }
        .uppercase { text-transform: uppercase; }
        .italic { font-style: italic; }
        
        .form-content::-webkit-scrollbar { width: 5px; }
        .form-content::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }

        @media (max-width: 767px) {
          .card-container { height: 100vh !important; max-height: 100vh !important; border-radius: 0 !important; width: 100% !important; margin: 0 !important; }
          .form-content { padding: 20px !important; }
          .sky-input { padding: 0.7rem 0.9rem; font-size: 0.8rem; }
        }

        @media (min-width: 768px) {
          .card-container { border-radius: 35px; max-height: 90vh; }
        }
      `}</style>
    </div>
  );
};

export default JobApplicationForm;