const TechCert = () => {
  return (
    <svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id="tc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0L0 0 0 40" fill="none" stroke="#00E5FF" strokeWidth="0.3" opacity="0.12" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="800" height="560" fill="#0A0E17" />
      <rect width="800" height="560" fill="url(#tc-grid)" />

      {/* Top accent glow bar */}
      <rect x="0" y="0" width="800" height="3" fill="#00E5FF" opacity="0.9" />

      {/* Left sidebar accent */}
      <rect x="0" y="0" width="5" height="560" fill="#00E5FF" opacity="0.7" />

      {/* Right side circuit-like lines */}
      <line x1="720" y1="40" x2="760" y2="40" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <line x1="760" y1="40" x2="760" y2="100" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <circle cx="720" cy="40" r="3" fill="#00E5FF" opacity="0.5" />
      <circle cx="760" cy="100" r="3" fill="#00E5FF" opacity="0.5" />

      <line x1="720" y1="520" x2="760" y2="520" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <line x1="760" y1="460" x2="760" y2="520" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <circle cx="720" cy="520" r="3" fill="#00E5FF" opacity="0.5" />
      <circle cx="760" cy="460" r="3" fill="#00E5FF" opacity="0.5" />

      <line x1="40" y1="40" x2="80" y2="40" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <line x1="40" y1="40" x2="40" y2="100" stroke="#00E5FF" strokeWidth="0.8" opacity="0.4" />
      <circle cx="80" cy="40" r="3" fill="#00E5FF" opacity="0.5" />
      <circle cx="40" cy="100" r="3" fill="#00E5FF" opacity="0.5" />

      {/* Top header block decorative rect */}
      <rect x="25" y="30" width="340" height="2" fill="#00E5FF" opacity="0.3" />

      {/* Main title underline */}
      <rect x="30" y="136" width="200" height="1.5" fill="#00E5FF" opacity="0.8" />

      {/* Cyan accent polygon / badge */}
      <polygon points="680,60 720,80 720,120 680,140 640,120 640,80" fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.6" />
      <polygon points="680,72 708,88 708,112 680,128 652,112 652,88" fill="#00E5FF" opacity="0.06" />

      {/* Glowing underline for name */}
      <line x1="28" y1="258" x2="580" y2="258" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
      <line x1="28" y1="260" x2="200" y2="260" stroke="#00E5FF" strokeWidth="2.5" opacity="0.3" />

      {/* Course tag box */}
      <rect x="28" y="308" width="560" height="52" fill="#00E5FF" opacity="0.06" rx="3" />
      <rect x="28" y="308" width="3" height="52" fill="#00E5FF" opacity="0.8" />

      {/* Stats row boxes */}
      <rect x="28" y="390" width="160" height="50" fill="#0D1624" rx="4" />
      <rect x="28" y="390" width="160" height="1" fill="#00E5FF" opacity="0.4" />

      <rect x="208" y="390" width="160" height="50" fill="#0D1624" rx="4" />
      <rect x="208" y="390" width="160" height="1" fill="#00E5FF" opacity="0.4" />
    </svg>
  );
};

export default TechCert;
