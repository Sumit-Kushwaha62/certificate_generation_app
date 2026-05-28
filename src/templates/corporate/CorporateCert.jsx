const CorporateCert = () => {
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

      {/* Left panel decorative lines */}
      <rect x="50" y="188" width="120" height="1" fill="#C8973A" opacity="0.5" />

      {/* Left panel vertical line accent */}
      <line x1="110" y1="225" x2="110" y2="290" stroke="#C8973A" strokeWidth="0.6" opacity="0.4" />

      <line x1="50" y1="375" x2="170" y2="375" stroke="#C8973A" strokeWidth="0.5" opacity="0.3" />

      {/* Left bottom seal rings */}
      <circle cx="110" cy="500" r="28" fill="none" stroke="#C8973A" strokeWidth="1" opacity="0.5" />
      <circle cx="110" cy="500" r="20" fill="none" stroke="#C8973A" strokeWidth="0.5" opacity="0.3" />

      {/* RIGHT PANEL CONTENT */}

      {/* Top right decorative lines */}
      <line x1="260" y1="50" x2="770" y2="50" stroke="#1A2332" strokeWidth="0.5" opacity="0.15" />
      <line x1="260" y1="52" x2="770" y2="52" stroke="#C8973A" strokeWidth="1" opacity="0.6" />

      {/* Gold underline for name */}
      <line x1="260" y1="188" x2="740" y2="188" stroke="#C8973A" strokeWidth="1.5" opacity="0.6" />

      {/* Horizontal rule under course */}
      <line x1="260" y1="292" x2="640" y2="292" stroke="#1A2332" strokeWidth="0.3" opacity="0.2" />

      {/* Bottom right signature area line */}
      <line x1="620" y1="470" x2="760" y2="470" stroke="#1A2332" strokeWidth="0.8" opacity="0.4" />

      {/* Bottom border line */}
      <line x1="260" y1="510" x2="770" y2="510" stroke="#C8973A" strokeWidth="1" opacity="0.6" />
      <line x1="260" y1="512" x2="770" y2="512" stroke="#1A2332" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
};

export default CorporateCert;
