import QRCode from 'qrcode.react';

const CertificateTemplate = ({ student, certInfo, qrData }) => (
    <div id={`cert-pdf-${student.id}`} style={{
        width: '1050px', height: '750px', padding: '50px',
        background: 'white', position: 'absolute', left: '-5000px',
        fontFamily: "'Times New Roman', serif", color: '#1a1a1a',
        border: '25px solid #C5A059', boxSizing: 'border-box'
    }}>
        <div style={{ border: '2px solid #C5A059', height: '100%', padding: '40px', position: 'relative' }}>
            
            {/* Logo Placeholder */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d9534f' }}>AVA GLOBAL</div>
                <div style={{ fontSize: '12px', letterSpacing: '3px' }}>INTERNATIONAL TRAINING CENTER</div>
            </div>

            <h1 style={{ fontSize: '60px', textAlign: 'center', margin: '10px 0', color: '#1a1a1a' }}>
                CERTIFICATE
            </h1>
            <p style={{ textAlign: 'center', fontSize: '20px', fontStyle: 'italic' }}>
                OF COMPLETION
            </p>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{ fontSize: '22px' }}>This is to certify that</p>
                <h2 style={{ fontSize: '45px', borderBottom: '2px solid #C5A059', display: 'inline-block', padding: '0 30px' }}>
                    {student.fullName}
                </h2>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <p style={{ fontSize: '20px' }}>has successfully completed the professional training course in</p>
                <h3 style={{ fontSize: '32px', color: '#1a1a1a' }}>{certInfo.courseTitle}</h3>
                <p style={{ fontSize: '18px' }}>Completed on: <b>{certInfo.completionDate}</b></p>
            </div>

            {/* Footer Section: Signatures & QR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px', padding: '0 40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '24px' }}>Director General</div>
                    <div style={{ borderTop: '1px solid black', width: '200px', marginTop: '5px', paddingTop: '5px' }}>
                        Authorized Signature
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    {/* QR Code for Verification */}
                    <div style={{ background: 'white', padding: '5px', border: '1px solid #ddd' }}>
                        <QRCode id={`qr-${student.id}`} value={qrData} size={100} level="H" includeMargin />
                    </div>
                    <p style={{ fontSize: '10px', marginTop: '5px' }}>ID: {certInfo.certificateID}</p>
                </div>
            </div>

            {/* Gold Seal Decorative Element */}
            <div style={{ 
                position: 'absolute', bottom: '20px', right: '45%', 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'gold', opacity: '0.3', border: '2px dotted orange' 
            }}></div>
        </div>
    </div>
);

export default CertificateTemplate;