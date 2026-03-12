import React, { useState } from "react";
import {
  X,
  Globe,
  Send,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  FileText,
  Camera,
  Fingerprint,
  UploadCloud,
} from "lucide-react";

const CBIApplicationForm = ({
  showCBIForm,
  setShowCBIForm,
  handleCBISubmit,
}) => {
  // --- STATES ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cbiData, setCbiData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    nin: "",
    country: "Nigeria",
    state: "",
    lga: "",
    postalCode: "",
    address: "",
    targetCountry: "",
    programCategory: "",
    additionalInfo: "",
    photoFile: null,
    passportFile: null,
    othersFile: null,
  });

  // --- GLOBAL DATA ---
  const africaCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Democratic Republic)", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ];

  const nigeriaData = {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa West", "Ukwa East", "Umuahia North", "Umuahia South", "Umu-Nneochi"],
    "Adamawa": ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCbiData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCbiData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const onLocalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleCBISubmit(cbiData);
      setIsSuccess(true);
      setTimeout(() => {
        setShowCBIForm(false);
        setIsSuccess(false);
        setCbiData({
          name: "", email: "", whatsapp: "", nin: "", country: "Nigeria",
          state: "", lga: "", postalCode: "", address: "", targetCountry: "",
          programCategory: "", additionalInfo: "", photoFile: null,
          passportFile: null, othersFile: null,
        });
      }, 4000);
    } catch (error) {
      alert("Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCBIForm) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.92)", zIndex: 11000, display: "flex",
        alignItems: "flex-start", justifyContent: "center", padding: "10px",
        backdropFilter: "blur(10px)", overflowY: "auto",
      }}
    >
      <div
        className="modal-content border-0 shadow-lg bg-white"
        style={{
          maxWidth: "750px", width: "100%", margin: "10px auto",
          position: "relative", borderRadius: "30px", overflow: "hidden",
        }}
      >
        {/* HEADER TARE DA CLOSE BUTTON */}
        <div className="p-4 bg-dark text-white d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3 text-start">
            <div className="bg-warning p-2 rounded-circle shadow-sm">
              <Globe size={24} className="text-dark" />
            </div>
            <div>
              <h5 className="fw-black mb-0 text-uppercase tracking-tighter italic" style={{ fontSize: "1rem" }}>CBI Global Registry</h5>
              <small className="opacity-75 d-block fw-bold uppercase" style={{ fontSize: "0.6rem" }}>Residency & Citizenship Investment</small>
            </div>
          </div>
          
          {/* WANNAN SHINE CLOSE BUTTON DIN (X) */}
          <button 
            type="button"
            onClick={() => setShowCBIForm(false)} 
            className="btn btn-link text-white p-0 border-0 shadow-none"
            style={{ transition: "all 0.3s" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "rotate(90deg)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-4 p-md-5 bg-white text-dark text-start h-100 overflow-auto custom-scrollbar">
          {isSuccess ? (
            <div className="text-center py-5 animate__animated animate__zoomIn">
              <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                <CheckCircle size={60} className="text-success" />
              </div>
              <h3 className="fw-black italic uppercase">Application Logged!</h3>
              <p className="text-muted fw-bold small">Your CBI request is being synced with the global dashboard.</p>
            </div>
          ) : (
            <form onSubmit={onLocalSubmit} className="row g-4">
              
              {/* SECTION 1: IDENTITY */}
              <div className="col-12 border-bottom pb-2">
                <h6 className="fw-black text-warning uppercase italic small tracking-widest"><Fingerprint size={16} className="me-2"/> Legal Identity</h6>
              </div>

              <div className="col-12">
                <label className="label-style">Full Legal Name (Passport Standard)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><User size={18} /></span>
                  <input type="text" name="name" className="form-control sky-input" value={cbiData.name} onChange={handleChange} placeholder="As shown on Passport" required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="label-style">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Mail size={18} /></span>
                  <input type="email" name="email" className="form-control sky-input" value={cbiData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="label-style">WhatsApp Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Phone size={18} /></span>
                  <input type="tel" name="whatsapp" className="form-control sky-input" value={cbiData.whatsapp} onChange={handleChange} required />
                </div>
              </div>

              <div className="col-12">
                <label className="label-style">NIN Number (National ID)</label>
                <input type="text" name="nin" className="form-control sky-input" value={cbiData.nin} onChange={handleChange} placeholder="00000000000" required />
              </div>

              {/* SECTION 2: LOCATION */}
              <div className="col-12 border-bottom pb-2 mt-4">
                <h6 className="fw-black text-warning uppercase italic small tracking-widest"><MapPin size={16} className="me-2"/> Residency & Origin</h6>
              </div>

              <div className="col-md-6">
                <label className="label-style">Country of Residence</label>
                <select name="country" className="form-select sky-input" value={cbiData.country} onChange={handleChange} required>
                  {africaCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="label-style">Postal / Zip Code</label>
                <input type="text" name="postalCode" className="form-control sky-input" value={cbiData.postalCode} onChange={handleChange} placeholder="000000" required />
              </div>

              <div className="col-md-6">
                <label className="label-style">State (Region)</label>
                <select name="state" className="form-select sky-input" value={cbiData.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  {cbiData.country === "Nigeria" ? Object.keys(nigeriaData).map(st => <option key={st} value={st}>{st}</option>) : <option value="Other">Outside Nigeria</option>}
                </select>
              </div>

              <div className="col-md-6">
                <label className="label-style">LGA (District)</label>
                <select name="lga" className="form-select sky-input" value={cbiData.lga} onChange={handleChange} required disabled={!cbiData.state}>
                  <option value="">Select Area</option>
                  {cbiData.state && nigeriaData[cbiData.state]?.map(lg => <option key={lg} value={lg}>{lg}</option>)}
                  {cbiData.state === "Other" && <option value="Foreign District">Foreign District</option>}
                </select>
              </div>

              <div className="col-12">
                <label className="label-style">Full Residential Address</label>
                <textarea name="address" className="form-control sky-input" rows="2" value={cbiData.address} onChange={handleChange} required></textarea>
              </div>

              {/* SECTION 3: INVESTMENT INTEREST */}
              <div className="col-12 border-bottom pb-2 mt-4">
                <h6 className="fw-black text-warning uppercase italic small tracking-widest"><Globe size={16} className="me-2"/> Target Investment</h6>
              </div>

              <div className="col-md-6">
                <label className="label-style">Target Country</label>
                <select name="targetCountry" className="form-select sky-input" value={cbiData.targetCountry} onChange={handleChange} required>
                  <option value="">Choose Country...</option>
                  {["Antigua & Barbuda", "Dominica", "Grenada", "St Kitts & Nevis", "St. Lucia", "Türkiye", "Vanuatu", "Malta", "Portugal", "Canada"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="label-style">Program Category</label>
                <select name="programCategory" className="form-select sky-input" value={cbiData.programCategory} onChange={handleChange} required>
                  <option value="">Select Program...</option>
                  <option value="Global Citizenship">Global Citizenship</option>
                  <option value="Second Citizenship">Second Citizenship</option>
                  <option value="Foreign Residency">Foreign Residency</option>
                  <option value="Golden Visas">Golden Visas</option>
                </select>
              </div>

              {/* SECTION 4: DOCUMENTS */}
              <div className="col-12 border-bottom pb-2 mt-4">
                <h6 className="fw-black text-warning uppercase italic small tracking-widest"><FileText size={16} className="me-2"/> Digital Repository</h6>
              </div>

              <div className="col-md-6">
                <label className="label-style">Passport Photo</label>
                <div className="p-3 bg-light rounded-4 border-dashed border-2 d-flex flex-column align-items-center gap-2">
                  <Camera size={20} className="text-muted" />
                  <input type="file" name="photoFile" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="label-style">Passport Data Page</label>
                <div className="p-3 bg-light rounded-4 border-dashed border-2 d-flex flex-column align-items-center gap-2">
                  <FileText size={20} className="text-muted" />
                  <input type="file" name="passportFile" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} required />
                </div>
              </div>

              <div className="col-12">
                <label className="label-style">Additional Documents (Optional)</label>
                <div className="p-3 bg-light rounded-4 border-dashed border-2 d-flex flex-column align-items-center gap-2">
                  <UploadCloud size={20} className="text-muted" />
                  <input type="file" name="othersFile" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} />
                </div>
              </div>

              <div className="col-12">
                <label className="label-style">Karin Bayani / Remarks (Optional)</label>
                <textarea name="additionalInfo" className="form-control sky-input" rows="3" value={cbiData.additionalInfo} onChange={handleChange}></textarea>
              </div>

              {/* SUBMIT */}
              <div className="col-12 mt-4 pb-4">
                <button type="submit" disabled={isSubmitting} className="btn btn-warning w-100 py-3 fw-black uppercase italic tracking-widest rounded-pill shadow shadow-warning d-flex align-items-center justify-content-center gap-2 border-0">
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Deploy Application</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .sky-input { width: 100%; padding: 0.8rem 1.2rem; background: #f8fafc; border: 2px solid #eee; border-radius: 1rem; font-weight: 700; font-size: 0.85rem; outline: none; transition: 0.3s; }
        .sky-input:focus { border-color: #ffc107; background: white; }
        .label-style { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 5px; display: block; margin-left: 5px; letter-spacing: 0.05em; }
        .fw-black { font-weight: 900; }
        .italic { font-style: italic; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffc107; border-radius: 10px; }
        @media (max-width: 768px) {
           .modal-content { height: 95vh; margin: 0; }
           .p-md-5 { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default CBIApplicationForm;