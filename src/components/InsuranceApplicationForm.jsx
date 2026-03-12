import React from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  Wallet,
  User,
  Phone,
  FileText,
  MapPin,
  Globe,
  Camera,
  UploadCloud,
  Mail,
  MessageSquare
} from "lucide-react";
import ApplyPayment from "./ApplyPayment";

const InsuranceApplicationForm = ({
  showInsuranceForm,
  setShowInsuranceForm,
  formData,
  setFormData,
  handleInsuranceApplication,
  uploading,
}) => {
  // --- AFRICA COUNTRIES LIST ---
  const africaCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Congo-Brazzaville)", "Congo (Democratic Republic)", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
  ];

  // --- TARGET COUNTRIES (Global Destinations) ---
  const targetCountriesList = [
    "United Kingdom", "Canada", "United States", "Australia", "Germany", "France", "Saudi Arabia", "United Arab Emirates", "Qatar", "Turkey", "China", "Japan", "Schengen Area (Europe)", "Other"
  ];

  // --- NIGERIA DATA ---
  const nigeriaData = {
    "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa West", "Ukwa East", "Umuahia North", "Umuahia South", "Umu-Nneochi"],
    "Adamawa": ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
    "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
    "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
    "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
    "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
    "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
    "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
    "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
    "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
    "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
    "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
    "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
    "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Ituku-Ozalla", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo-Uwani"],
    "FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
    "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
    "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
    "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Ihigawa", "Ingawa", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
    "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makaerfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
    "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
    "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
    "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
    "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
    "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
    "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
    "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
    "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
    "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
    "Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
    "Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede Central", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifelodun", "Ifedayo", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
    "Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
    "Plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
    "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", " Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
    "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
    "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
    "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", " Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
    "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"]
  };

  if (!showInsuranceForm) return null;

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const onPaymentSuccess = (reference) => {
    handleInsuranceApplication();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(15px)",
        zIndex: 11000,
        padding: window.innerWidth < 768 ? "10px" : "15px",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-[30px] overflow-hidden w-100"
        style={{
          maxWidth: "750px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER SECTION */}
        <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center flex-shrink-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <div className="text-start">
              <h5 className="fw-black mb-0 text-uppercase tracking-tighter italic">Global Insurance Portal</h5>
              <small className="opacity-75 d-block fw-bold uppercase" style={{ fontSize: "0.65rem" }}>International Travel Clearance System</small>
            </div>
          </div>
          <button onClick={() => setShowInsuranceForm(false)} className="btn btn-link text-white p-0 shadow-none border-0 transition-transform hover:rotate-90">
            <X size={28} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="p-4 p-md-5 bg-white text-dark text-start overflow-auto custom-scrollbar h-100">
          <form onSubmit={(e) => e.preventDefault()} className="row g-4">
            
            {/* PERSONAL SECTION */}
            <div className="col-12 border-bottom pb-2">
              <h6 className="fw-black text-primary d-flex align-items-center gap-2 uppercase italic" style={{ fontSize: "0.8rem" }}>
                <User size={16} /> Biometric & Personal Info
              </h6>
            </div>

            <div className="col-12 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Full Legal Name (Passport Standard)</label>
              <input type="text" className="form-control bg-light border-0 py-3 rounded-3 shadow-sm font-bold" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>

            <div className="col-12 col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text border-0 bg-light"><Mail size={16} /></span>
                <input type="email" className="form-control bg-light border-0 py-3 rounded-end-3 shadow-sm font-bold" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="col-12 col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>WhatsApp Number</label>
              <div className="input-group">
                <span className="input-group-text border-0 bg-light"><Phone size={16} /></span>
                <input type="tel" className="form-control bg-light border-0 py-3 rounded-end-3 shadow-sm font-bold" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            {/* LOCATION SECTION */}
            <div className="col-12 border-bottom pb-2 mt-5">
              <h6 className="fw-black text-primary d-flex align-items-center gap-2 uppercase italic" style={{ fontSize: "0.8rem" }}>
                <MapPin size={16} /> Residency & Contact
              </h6>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Country of Residence</label>
              <select className="form-select bg-light border-0 py-3 rounded-3 shadow-sm font-bold" value={formData.country || ""} onChange={(e) => setFormData({...formData, country: e.target.value})}>
                <option value="">Select Country</option>
                {africaCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Postal / Zip Code</label>
              <input type="text" className="form-control bg-light border-0 py-3 rounded-3 shadow-sm font-bold" placeholder="000000" value={formData.postalCode || ""} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>State (Nigeria Only)</label>
              <select className="form-select bg-light border-0 py-3 rounded-3 shadow-sm font-bold" value={formData.state || ""} onChange={(e) => setFormData({...formData, state: e.target.value, lga: ""})}>
                <option value="">Select State</option>
                {Object.keys(nigeriaData).map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>LGA / District</label>
              <select className="form-select bg-light border-0 py-3 rounded-3 shadow-sm font-bold" disabled={!formData.state} value={formData.lga || ""} onChange={(e) => setFormData({...formData, lga: e.target.value})}>
                <option value="">Select LGA</option>
                {formData.state && nigeriaData[formData.state]?.map(lg => <option key={lg} value={lg}>{lg}</option>)}
              </select>
            </div>

            <div className="col-12 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Full Residential Address</label>
              <textarea className="form-control bg-light border-0 py-3 rounded-3 shadow-sm font-bold" rows="2" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}></textarea>
            </div>

            {/* TRAVEL SECTION */}
            <div className="col-12 border-bottom pb-2 mt-5">
              <h6 className="fw-black text-primary d-flex align-items-center gap-2 uppercase italic" style={{ fontSize: "0.8rem" }}>
                <Globe size={16} /> Travel Intelligence
              </h6>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Intl. Passport Number</label>
              <input type="text" className="form-control bg-light border-0 py-3 rounded-3 shadow-sm font-bold text-uppercase" required value={formData.passportNumber} onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })} />
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Target Destination</label>
              <select className="form-select bg-light border-0 py-3 rounded-3 shadow-sm font-bold" required value={formData.targetCountry || ""} onChange={(e) => setFormData({...formData, targetCountry: e.target.value})}>
                <option value="">Select Destination</option>
                {targetCountriesList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="col-12 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Insurance Tier Selection</label>
              <select className="form-select bg-light border-0 py-3 rounded-3 shadow-sm font-black italic" required value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}>
                <option value="">Choose Policy...</option>
                <option value="Work-Travel Insurance">Standard Work-Travel Protection</option>
                <option value="Health & Accident Premium">Health & Accident Premium (Schengen Standard)</option>
                <option value="Global Medical Clearance">Comprehensive Global Medical Clearance</option>
              </select>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="col-12 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>
                <MessageSquare size={12} className="me-1 d-inline" /> Additional Information
              </label>
              <textarea 
                className="form-control bg-light border-0 py-3 rounded-3 shadow-sm font-bold italic" 
                rows="3" 
                placeholder="Any special medical conditions, travel history, or specific requirements..." 
                value={formData.additionalInfo || ""} 
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              ></textarea>
            </div>

            {/* UPLOADS */}
            <div className="col-12 border-bottom pb-2 mt-5">
              <h6 className="fw-black text-primary d-flex align-items-center gap-2 uppercase italic" style={{ fontSize: "0.8rem" }}>
                <Camera size={16} /> Document Repository
              </h6>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Passport Data Page</label>
              <div className="p-3 bg-light rounded-3 border-dashed border-2 d-flex flex-column align-items-center gap-2">
                <UploadCloud size={20} className="text-muted" />
                <input type="file" name="passportFile" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} />
              </div>
            </div>

            <div className="col-md-6 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Passport Photo (Biometric)</label>
              <div className="p-3 bg-light rounded-3 border-dashed border-2 d-flex flex-column align-items-center gap-2 text-start">
                <Camera size={20} className="text-muted" />
                <input type="file" required name="photoFile" accept="image/*" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} />
              </div>
            </div>

            <div className="col-12 text-start">
              <label className="small fw-black mb-1 text-muted text-uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Other Documents (Optional - PDF/JPG)</label>
              <div className="p-3 bg-light rounded-3 border-dashed border-2 d-flex flex-column align-items-center gap-2 text-start">
                <FileText size={20} className="text-muted" />
                <input type="file" name="othersFile" className="form-control form-control-sm border-0 bg-transparent" onChange={handleFileChange} />
              </div>
            </div>

            {/* PAYMENT BOX */}
            <div className="col-12 mt-5">
              <div className="bg-primary p-4 rounded-[25px] text-white d-flex align-items-center justify-content-between shadow-lg">
                <div className="text-start">
                  <p className="text-[10px] fw-black uppercase opacity-75 tracking-widest mb-1">Policy Premium Amount</p>
                  <h2 className="fw-black mb-0 italic">₦300,000.00</h2>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl border border-white/10">
                  <Wallet size={32} />
                </div>
              </div>
            </div>

            {/* PAYSTACK ACTION */}
            <div className="col-12 mt-4 mb-4">
              <div className="p-2 border rounded-[25px] bg-slate-50 shadow-inner">
                <ApplyPayment
                  amount={300000}
                  email={formData.email || (formData.phone ? formData.phone + "@arewavisa.com" : "client@arewavisa.com")}
                  onSuccessAction={onPaymentSuccess}
                  isSubmitting={uploading}
                />
              </div>

              <div className="text-center mt-4 pb-4">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="small fw-black text-muted uppercase tracking-wider" style={{ fontSize: "0.6rem" }}>Secured Global Payment Gateway Active</span>
                </div>
                {uploading && (
                  <div className="bg-blue-50 p-3 rounded-4 border border-blue-100 animate-pulse text-start">
                    <Loader2 size={18} className="me-2 d-inline animate-spin text-primary" />
                    <span className="text-primary small fw-black uppercase">Encrypting documents & syncing registry...</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #007bff; border-radius: 10px; }
        .fw-black { font-weight: 900; }
        .rounded-xl { border-radius: 1rem; }
        @media (max-width: 768px) {
           .card { border-radius: 20px !important; }
           .p-4 { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default InsuranceApplicationForm;