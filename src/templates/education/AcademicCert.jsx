const AcademicCert = ({ name = "Recipient Name", course = "Course Name", issuer = "Institution Name", date = "January 1, 2025" }) => {
  return (
    <svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id="ac-dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#C9A84C" opacity="0.18" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="800" height="560" fill="#0D1F3C" />
      <rect width="800" height="560" fill="url(#ac-dots)" />

      {/* Outer border */}
      <rect x="18" y="18" width="764" height="524" fill="none" stroke="#C9A84C" strokeWidth="2" rx="4" />
      {/* Inner border */}
      <rect x="28" y="28" width="744" height="504" fill="none" stroke="#C9A84C" strokeWidth="0.6" rx="2" opacity="0.6" />

      {/* Top decorative bar */}
      <rect x="18" y="18" width="764" height="6" fill="#C9A84C" rx="2" />
      {/* Bottom decorative bar */}
      <rect x="18" y="536" width="764" height="6" fill="#C9A84C" rx="2" />

      {/* Corner ornaments - TL */}
      <line x1="18" y1="60" x2="18" y2="90" stroke="#C9A84C" strokeWidth="3" />
      <line x1="60" y1="24" x2="90" y2="24" stroke="#C9A84C" strokeWidth="3" />
      {/* Corner ornaments - TR */}
      <line x1="782" y1="60" x2="782" y2="90" stroke="#C9A84C" strokeWidth="3" />
      <line x1="740" y1="24" x2="710" y2="24" stroke="#C9A84C" strokeWidth="3" />
      {/* Corner ornaments - BL */}
      <line x1="18" y1="500" x2="18" y2="470" stroke="#C9A84C" strokeWidth="3" />
      <line x1="60" y1="536" x2="90" y2="536" stroke="#C9A84C" strokeWidth="3" />
      {/* Corner ornaments - BR */}
      <line x1="782" y1="500" x2="782" y2="470" stroke="#C9A84C" strokeWidth="3" />
      <line x1="740" y1="536" x2="710" y2="536" stroke="#C9A84C" strokeWidth="3" />

      {/* Seal / medallion */}
      <circle cx="400" cy="88" r="34" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
      <circle cx="400" cy="88" r="27" fill="#C9A84C" opacity="0.12" stroke="#C9A84C" strokeWidth="0.8" />

      {/* Divider line */}
      <line x1="160" y1="162" x2="640" y2="162" stroke="#C9A84C" strokeWidth="0.6" opacity="0.7" />
      <circle cx="400" cy="162" r="3" fill="#C9A84C" />

      {/* Name underline */}
      <line x1="160" y1="268" x2="640" y2="268" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />

      {/* Bottom divider */}
      <line x1="180" y1="375" x2="620" y2="375" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4" />

      {/* Issuer and Date section */}
      <line x1="130" y1="460" x2="310" y2="460" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />
      <line x1="490" y1="460" x2="670" y2="460" stroke="#C9A84C" strokeWidth="0.8" opacity="0.6" />

      {/* Center diamond ornament */}
      <rect x="396" y="456" width="8" height="8" fill="#C9A84C" transform="rotate(45 400 460)" opacity="0.8" />
    </svg>
  );
};

export default AcademicCert;
