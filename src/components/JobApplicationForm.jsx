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
  Camera
} from "lucide-react";

const JobApplicationForm = ({
  showForm,
  setShowForm,
  setIsSuccess,
  photoPreview,
  setPhotoPreview,
  applicationData,
  setApplicationData, // Tabbatar ka wuce wannan daga parent
  handleChange,
  handlePhotoChange,
  handleFileChange,
  handleFinalPayment, // Wannan function din zai tura komai zuwa Firebase Admin Dashboard
  isSubmitting,
}) => {
  const [step, setStep] = useState("form"); // form, success
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const receiptRef = useRef(null);

  // --- NIGERIA DATA FOR DYNAMIC SELECTION ---
  const nigeriaData = {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa West", "Ukwa East", "Umuahia North", "Umuahia South", "Umu-Nneochi"],
    "Adamawa": ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
    // Zaka iya sanya dukkan jihohin a nan...
  };

  if (!showForm) return null;

  // --- PAYSTACK INTEGRATION ---
  const triggerPaystack = () => {
    if (!window.PaystackPop) return alert("Payment Gateway loading... please wait.");
    
    setIsProcessing(true);
    const handler = window.PaystackPop.setup({
      key: "pk_live_501518dc4688ce1fc18be571fb9b81ab785af677", 
      email: applicationData.email || "consultant@arewavisa.com",
      amount: 100000 * 100, // ₦100,000
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
      // Wannan zai tura dukkan informations zuwa Firebase Admin Dashboard
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
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`JOB-CONSULTATION-RECEIPT-${applicationData.name}.pdf`);
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-2 py-4" style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.95)", overflowY: "auto", backdropFilter: "blur(12px)" }}>
      <div className="card border-0 shadow-lg w-100" style={{ maxWidth: "950px", borderRadius: "35px", overflow: "hidden" }}>
        
        {step === "success" ? (
          <div className="bg-white p-0">
             <div ref={receiptRef} className="p-5 text-dark text-start bg-white" style={{ border: "15px solid #000" }}>
                <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-danger pb-3 mb-4">
                  <div className="text-start">
                    <h2 className="fw-black text-danger mb-0 italic">AREWA VISA ACADEMY</h2>
                    <p className="small text-muted mb-0 fw-bold uppercase">Job Consultation & Placement</p>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold mb-0 uppercase">REF: {paymentRef}</h6>
                    <p className="small text-muted mb-0 font-monospace uppercase">DATE: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="row g-4 mb-4 bg-light p-4 rounded-4 mx-0">
                  <div className="col-md-3 text-center">
                    <img src={photoPreview} style={{ width: "130px", height: "160px", objectFit: "cover" }} className="rounded-3 shadow-lg border border-3 border-white" alt="Applicant" />
                  </div>
                  <div className="col-md-6">
                     <h5 className="fw-black border-bottom border-danger pb-2 mb-3 uppercase">Applicant Profile</h5>
                     <div className="small space-y-1">
                        <p className="mb-1 uppercase"><strong>Name:</strong> {applicationData.name}</p>
                        <p className="mb-1 uppercase"><strong>Passport No:</strong> {applicationData.passportNo}</p>
                        <p className="mb-1 uppercase"><strong>Target Job:</strong> {applicationData.job}</p>
                        <p className="mb-1 uppercase"><strong>Destination:</strong> {applicationData.country}</p>
                     </div>
                  </div>
                  <div className="col-md-3 text-center border-start">
                    <QRCodeSVG value={paymentRef} size={110} />
                    <p className="mt-2 fw-bold uppercase italic text-danger" style={{fontSize: '7px'}}>Verified Professional Match</p>
                  </div>
                </div>

                <div className="bg-dark p-4 rounded-4 text-white d-flex justify-content-between align-items-center shadow-lg mb-4">
                  <div className="text-start">
                    <h3 className="fw-black mb-0">PAID: ₦100,000.00</h3>
                    <p className="small text-muted mb-0 uppercase tracking-widest">Status: Consultation Secured</p>
                  </div>
                  <CheckCircle size={45} className="text-success" />
                </div>
             </div>
             <div className="p-4 bg-light text-center d-flex gap-3 justify-content-center">
                <button onClick={downloadReceipt} className="btn btn-danger px-5 py-3 rounded-pill fw-black uppercase"><Download size={20} className="me-2"/> Download PDF</button>
                <button onClick={() => window.location.reload()} className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold">Finish</button>
             </div>
          </div>
        ) : (
          <div className="row g-0">
            {/* SIDEBAR */}
            <div className="col-md-3 bg-danger p-4 text-white text-center d-flex flex-column justify-content-center">
              {photoPreview ? (
                <img src={photoPreview} className="mx-auto mb-3 border border-3 border-white rounded-4 shadow-lg" style={{ width: "120px", height: "150px", objectFit: "cover" }} alt="Applicant" />
              ) : (
                <div className="bg-white/20 p-4 rounded-circle d-inline-block mx-auto mb-3"><UserCheck size={60} /></div>
              )}
              <h4 className="fw-black text-uppercase italic">Job Portal</h4>
              <p className="small opacity-75 fw-bold mt-2">Professional Recruitment</p>
              <button onClick={() => setShowForm(false)} className="btn btn-light btn-sm rounded-pill mt-4 fw-bold">Cancel</button>
            </div>

            {/* FORM */}
            <div className="col-md-9 p-4 p-md-5 bg-white text-dark text-start overflow-auto" style={{ maxHeight: "90vh" }}>
              <form className="row g-4" onSubmit={(e) => { e.preventDefault(); triggerPaystack(); }}>
                <div className="col-12 border-bottom pb-2"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><User size={18} /> Candidate Identity</h6></div>
                
                <div className="col-md-6 text-start">
                   <label className="label-style">Passport Photo</label>
                   <input type="file" required className="sky-input" accept="image/*" onChange={handlePhotoChange} />
                </div>
                <div className="col-md-6 text-start">
                   <label className="label-style">Full Legal Name</label>
                   <input type="text" name="name" className="sky-input" required value={applicationData.name} onChange={handleChange} />
                </div>

                <div className="col-md-6 text-start"><label className="label-style">Email Address</label><input type="email" name="email" className="sky-input" required value={applicationData.email} onChange={handleChange} /></div>
                <div className="col-md-6 text-start"><label className="label-style">WhatsApp Number</label><input type="tel" name="whatsapp" className="sky-input" required value={applicationData.whatsapp} onChange={handleChange} /></div>
                
                <div className="col-md-6 text-start"><label className="label-style">NIN Number</label><input type="text" name="nin" className="sky-input" required value={applicationData.nin} onChange={handleChange} /></div>
                <div className="col-md-6 text-start"><label className="label-style">Intl. Passport No.</label><input type="text" name="passportNo" className="sky-input uppercase" required value={applicationData.passportNo} onChange={handleChange} /></div>

                {/* LOCATION SECTION */}
                <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><MapPin size={18} /> Origin & Location</h6></div>
                
                <div className="col-md-4 text-start">
                   <label className="label-style">Country</label>
                   <select className="sky-input" value={applicationData.countrySelection || "Nigeria"} onChange={(e) => setApplicationData({...applicationData, countrySelection: e.target.value})}>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Other">Other Country</option>
                   </select>
                </div>
                <div className="col-md-4 text-start">
                   <label className="label-style">Postal Code</label>
                   <input type="text" name="postalCode" className="sky-input" placeholder="000000" value={applicationData.postalCode} onChange={handleChange} />
                </div>
                <div className="col-md-4 text-start">
                   <label className="label-style">State of Origin</label>
                   <select className="sky-input" value={applicationData.state} onChange={(e) => setApplicationData({...applicationData, state: e.target.value, lga: ""})}>
                      <option value="">Select State</option>
                      {Object.keys(nigeriaData).map(st => <option key={st} value={st}>{st}</option>)}
                   </select>
                </div>
                <div className="col-md-6 text-start">
                   <label className="label-style">LGA of Origin</label>
                   <select className="sky-input" disabled={!applicationData.state} value={applicationData.lga} onChange={(e) => setApplicationData({...applicationData, lga: e.target.value})}>
                      <option value="">Select LGA</option>
                      {applicationData.state && nigeriaData[applicationData.state]?.map(lg => <option key={lg} value={lg}>{lg}</option>)}
                   </select>
                </div>
                <div className="col-md-6 text-start"><label className="label-style">Full Address</label><input type="text" name="address" className="sky-input" required value={applicationData.address} onChange={handleChange} /></div>

                {/* JOB PREFERENCE */}
                <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><Briefcase size={18} /> Recruitment Details</h6></div>
                
                <div className="col-md-6 text-start">
                   <label className="label-style">Target Country (Job)</label>
                   <input type="text" name="country" className="sky-input" required value={applicationData.country} onChange={handleChange} placeholder="e.g Canada, UK, Qatar" />
                </div>
                <div className="col-md-6 text-start">
                   <label className="label-style">Job Category</label>
                   <input type="text" name="job" className="sky-input" required value={applicationData.job} onChange={handleChange} placeholder="e.g Driver, IT, Nurse" />
                </div>

                {/* UPLOADS */}
                <div className="col-12 border-bottom pb-2 mt-4"><h6 className="fw-black text-danger uppercase italic small d-flex align-items-center gap-2"><FileText size={18} /> Career Documents</h6></div>
                
                <div className="col-md-6 text-start">
                   <label className="label-style">CV / Resume (Required PDF)</label>
                   <input type="file" required name="cvFile" className="sky-input" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                </div>
                <div className="col-md-6 text-start">
                   <label className="label-style">Others Document (Optional)</label>
                   <input type="file" name="othersFile" className="sky-input" onChange={handleFileChange} />
                </div>

                <div className="col-12 mt-5">
                   <div className="bg-dark p-4 rounded-[30px] text-white d-flex justify-content-between align-items-center shadow-xl">
                      <div className="text-start">
                         <p className="small uppercase opacity-50 mb-0">Consultation Fee</p>
                         <h2 className="fw-black mb-0 italic">₦100,000.00</h2>
                      </div>
                      <button type="submit" disabled={isProcessing} className="btn btn-warning px-5 py-3 rounded-pill fw-black uppercase tracking-widest border-0 text-dark">
                        {isProcessing ? <Loader2 className="animate-spin" /> : "Verify & Pay"}
                      </button>
                   </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sky-input { width: 100%; padding: 0.8rem 1.2rem; background: #f8fafc; border: 2px solid #eee; border-radius: 1rem; font-weight: 700; font-size: 0.85rem; outline: none; transition: 0.3s; }
        .sky-input:focus { border-color: #dc3545; background: white; }
        .label-style { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 5px; display: block; margin-left: 5px; }
        .fw-black { font-weight: 900; }
        .uppercase { text-transform: uppercase; }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
};

export default JobApplicationForm;