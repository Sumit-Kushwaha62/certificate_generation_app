const CorporateCert = ({ name = "Recipient Name", course = "Training Program", issuer = "Organization", date = "January 1, 2025" }) => {
  return (
    <svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <rect width="800" height="560" fill="#FAFAF8" />

      {/* Left color panel */}
      <rect x="0" y="0" width="220" height="560" fill="#1A2332" />

      {/* Left panel decorative elements */}
      <rect x="0" y="0" width="220" height="5" fill="#C8973A" />
      <rect x="0" y="555" width="220" height="5" fill="#C8973A" />

      {/* Left panel logo area */}
      <circle cx="110" cy="100" r="44" fill="#253347" />
      <circle cx="110" cy="100" r="36" fill="none" stroke="#C8973A" strokeWidth="1" opacity="0.8" />
      <text x="110" y="92" textAnchor="middle" fill="#C8973A" fontSize="26" fontFamily="Georgia, serif">🏢</text>
      <text x="110" y="116" textAnchor="middle" fill="#C8973A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="2">EXCELLENCE</text>

      {/* Left panel text */}
      <text x="110" y="180" textAnchor="middle" fill="#C8973A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="3">
        CERTIFICATE
      </text>
      <rect x="50" y="188" width="120" height="1" fill="#C8973A" opacity="0.5" />
      <text x="110" y="204" textAnchor="middle" fill="#C8973A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="3">
        OF COMPLETION
      </text>

      {/* Left panel vertical line accent */}
      <line x1="110" y1="225" x2="110" y2="290" stroke="#C8973A" strokeWidth="0.6" opacity="0.4" />

      {/* Left panel details */}
      <text x="110" y="330" textAnchor="middle" fill="#7A8A9A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1">ISSUED BY</text>
      <text x="110" y="350" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">{issuer}</text>

      <line x1="50" y1="375" x2="170" y2="375" stroke="#C8973A" strokeWidth="0.5" opacity="0.3" />

      <text x="110" y="400" textAnchor="middle" fill="#7A8A9A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1">DATE</text>
      <text x="110" y="420" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">{date}</text>

      {/* Left bottom seal rings */}
      <circle cx="110" cy="500" r="28" fill="none" stroke="#C8973A" strokeWidth="1" opacity="0.5" />
      <circle cx="110" cy="500" r="20" fill="none" stroke="#C8973A" strokeWidth="0.5" opacity="0.3" />
      <text x="110" y="496" textAnchor="middle" fill="#C8973A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1">OFFICIAL</text>
      <text x="110" y="508" textAnchor="middle" fill="#C8973A" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1">SEAL</text>

      {/* RIGHT PANEL CONTENT */}

      {/* Top right decorative lines */}
      <line x1="260" y1="50" x2="770" y2="50" stroke="#1A2332" strokeWidth="0.5" opacity="0.15" />
      <line x1="260" y1="52" x2="770" y2="52" stroke="#C8973A" strokeWidth="1" opacity="0.6" />

      {/* "This is to certify that" */}
      <text x="260" y="105" fill="#8A9AAA" fontSize="13" fontFamily="Georgia, serif" fontStyle="italic">
        This is to proudly certify that
      </text>

      {/* Recipient Name */}
      <text x="258" y="175" fill="#1A2332" fontSize="44" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="-0.5">
        {name}
      </text>

      {/* Gold underline for name */}
      <line x1="260" y1="188" x2="740" y2="188" stroke="#C8973A" strokeWidth="1.5" opacity="0.6" />

      {/* "has successfully completed" */}
      <text x="260" y="222" fill="#8A9AAA" fontSize="13" fontFamily="Georgia, serif" fontStyle="italic">
        has successfully completed the following program:
      </text>

      {/* Course name */}
      <text x="260" y="272" fill="#1A2332" fontSize="24" fontFamily="Georgia, serif" fontWeight="bold">
        {course}
      </text>

      {/* Horizontal rule under course */}
      <line x1="260" y1="292" x2="640" y2="292" stroke="#1A2332" strokeWidth="0.3" opacity="0.2" />

      {/* Achievement description */}
      <text x="260" y="335" fill="#5A6A7A" fontSize="12" fontFamily="Georgia, serif" fontStyle="italic">
        demonstrating the knowledge, skills, and competencies required
      </text>
      <text x="260" y="353" fill="#5A6A7A" fontSize="12" fontFamily="Georgia, serif" fontStyle="italic">
        for professional excellence in this field.
      </text>

      {/* Bottom right signature area */}
      <line x1="620" y1="470" x2="760" y2="470" stroke="#1A2332" strokeWidth="0.8" opacity="0.4" />
      <text x="690" y="485" textAnchor="middle" fill="#8A9AAA" fontSize="9" fontFamily="Georgia, serif" letterSpacing="1">AUTHORIZED SIGNATURE</text>

      {/* Bottom border line */}
      <line x1="260" y1="510" x2="770" y2="510" stroke="#C8973A" strokeWidth="1" opacity="0.6" />
      <line x1="260" y1="512" x2="770" y2="512" stroke="#1A2332" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
};

export default CorporateCert;