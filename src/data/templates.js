const GOLD = '#D4AF37';
const DARK_BLUE = '#063C5D';
const MAROON = '#8B2C2C';
const WHITE = '#FFFFFF';
const CREAM = '#FFF6DD';
const DARK = '#1A1A1A';
const BODY = '#333333';
const GREEN = '#1B4332';

export const templates = [
  {
    id: 'bg1',
    name: 'Black Gold Geometric',
    category: 'corporate',
    background: '/src/assets/templates/bg1.png',
    textColor: DARK,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'INTERNATIONAL CONFERENCE', x: 80, y: 58, fontSize: 36, fontFamily: 'Playfair Display', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 640 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Forum on Knowledge,\nCulture and Development', x: 130, y: 128, fontSize: 20, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 198, fontSize: 18, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 248, fontSize: 48, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 95, y: 340, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 250, y: 332, fontSize: 30, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 430 },
      { id: 'body', label: 'Body Text', defaultValue: 'actively participated in the International Conference held from May 09th to 11th, 2026 as a Conference Participant / Resource Person and made a valuable academic contribution towards the success of the conference.', x: 95, y: 382, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 590 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Jonathan Flatley\nEdwin INC – Switzerland', x: 100, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 150 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Dr. R. C. Mishra\nMahakaushal University', x: 325, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 170 },
      { id: 'signature3', label: 'Signature 3', defaultValue: 'Dr. Denesh M.\nEdwin INC – India', x: 545, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 150 },
      { id: 'venue', label: 'Venue', defaultValue: 'Venue:\nUniversity of Bern\nSwitzerland', x: 620, y: 430, fontSize: 10, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 95 },
    ],
  },

  {
    id: 'bg2',
    name: 'Black Gold Curves',
    category: 'corporate',
    background: '/src/assets/templates/bg2.png',
    textColor: WHITE,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'INTERNATIONAL CONFERENCE', x: 90, y: 70, fontSize: 34, fontFamily: 'Playfair Display', color: GOLD, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Forum on Knowledge,\nCulture and Development', x: 130, y: 138, fontSize: 20, fontFamily: 'Playfair Display', color: CREAM, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 206, fontSize: 17, fontFamily: 'DM Sans', color: GOLD, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 255, fontSize: 48, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 110, y: 338, fontSize: 13, fontFamily: 'DM Sans', color: CREAM, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 333, fontSize: 30, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'actively participated in the International Conference and made a valuable academic contribution towards the success of the conference.', x: 110, y: 386, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: false, italic: false, align: 'left', width: 580 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 482, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Conference Chair', x: 320, y: 482, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 9-11, 2026\nSwitzerland', x: 565, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: GOLD, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg3',
    name: 'Black Gold Floral',
    category: 'education',
    background: '/src/assets/templates/bg3.png',
    textColor: WHITE,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF ACHIEVEMENT', x: 90, y: 75, fontSize: 32, fontFamily: 'Playfair Display', color: GOLD, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Academic Excellence Program', x: 130, y: 145, fontSize: 18, fontFamily: 'Playfair Display', color: CREAM, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 235, fontSize: 50, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 115, y: 325, fontSize: 13, fontFamily: 'DM Sans', color: CREAM, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 150, y: 350, fontSize: 34, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: false, align: 'center', width: 500 },
      { id: 'body', label: 'Body Text', defaultValue: 'has successfully participated and contributed with dedication, excellence and professional commitment.', x: 115, y: 405, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: false, italic: false, align: 'center', width: 570 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Director / Chairperson', x: 320, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: CREAM, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 28, 2026', x: 560, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: GOLD, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg4',
    name: 'Green Gold Laurel',
    category: 'education',
    background: '/src/assets/templates/bg4.png',
    textColor: WHITE,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF ACHIEVEMENT', x: 90, y: 72, fontSize: 32, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Forum on Knowledge,\nCulture and Development', x: 130, y: 140, fontSize: 19, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 205, fontSize: 17, fontFamily: 'DM Sans', color: WHITE, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 255, fontSize: 48, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 105, y: 340, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 333, fontSize: 31, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'actively participated in the International Conference and made a valuable academic contribution towards the success of the conference.', x: 105, y: 386, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 585 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 482, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Conference Chair', x: 320, y: 482, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 9-11, 2026\nSwitzerland', x: 565, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: GREEN, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg5',
    name: 'Green Lotus',
    category: 'education',
    background: '/src/assets/templates/bg5.png',
    textColor: GREEN,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF PARTICIPATION', x: 90, y: 78, fontSize: 31, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Yoga & Wellness Program', x: 130, y: 148, fontSize: 19, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 210, fontSize: 17, fontFamily: 'DM Sans', color: WHITE, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 260, fontSize: 48, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 105, y: 343, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 336, fontSize: 31, fontFamily: 'Playfair Display', color: GREEN, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'has actively participated and successfully completed the program with dedication and excellence.', x: 105, y: 390, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 585 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Program Director', x: 320, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 28, 2026', x: 565, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: GREEN, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg6',
    name: 'White Gold Lace',
    category: 'corporate',
    background: '/src/assets/templates/bg6.png',
    textColor: DARK,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF APPRECIATION', x: 90, y: 80, fontSize: 32, fontFamily: 'Playfair Display', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Academic Excellence Program', x: 130, y: 148, fontSize: 19, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 250, fontSize: 50, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 105, y: 338, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 332, fontSize: 31, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'is hereby appreciated for outstanding contribution, dedication and valuable support towards the success of the program.', x: 105, y: 386, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 585 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Director / Chairperson', x: 320, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 28, 2026', x: 565, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg7',
    name: 'Classic Cream',
    category: 'education',
    background: '/src/assets/templates/bg7.png',
    textColor: DARK,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF ACHIEVEMENT', x: 90, y: 75, fontSize: 32, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Forum on Knowledge,\nCulture and Development', x: 130, y: 142, fontSize: 19, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 208, fontSize: 17, fontFamily: 'DM Sans', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 258, fontSize: 48, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 105, y: 343, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 337, fontSize: 31, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'has successfully participated and made a valuable academic contribution towards the success of the conference.', x: 105, y: 390, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 585 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Conference Chair', x: 320, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 9-11, 2026\nSwitzerland', x: 565, y: 485, fontSize: 12, fontFamily: 'DM Sans', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },

  {
    id: 'bg8',
    name: 'Red Gold Wave',
    category: 'corporate',
    background: '/src/assets/templates/bg8.png',
    textColor: DARK,
    fields: [
      { id: 'title', label: 'Main Title', defaultValue: 'CERTIFICATE OF EXCELLENCE', x: 90, y: 72, fontSize: 32, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: false, align: 'center', width: 620 },
      { id: 'event', label: 'Event Name', defaultValue: 'International Corporate Leadership Program', x: 130, y: 142, fontSize: 19, fontFamily: 'Playfair Display', color: DARK_BLUE, bold: true, italic: true, align: 'center', width: 540 },
      { id: 'locationDate', label: 'Location Date', defaultValue: 'Switzerland | May 9-11, 2026', x: 230, y: 205, fontSize: 17, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 340 },
      { id: 'certificate', label: 'Certificate Text', defaultValue: 'Certificate', x: 150, y: 252, fontSize: 48, fontFamily: 'Playfair Display', color: MAROON, bold: true, italic: true, align: 'center', width: 500 },
      { id: 'certify', label: 'Certify Line', defaultValue: 'This is to certify that', x: 105, y: 338, fontSize: 13, fontFamily: 'DM Sans', color: DARK, bold: false, italic: false, align: 'left', width: 250 },
      { id: 'name', label: 'Recipient Name', defaultValue: 'Recipient Name', x: 230, y: 332, fontSize: 31, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 450 },
      { id: 'body', label: 'Body Text', defaultValue: 'has successfully completed the program and demonstrated excellent performance, commitment and professional dedication.', x: 105, y: 386, fontSize: 12, fontFamily: 'DM Sans', color: BODY, bold: false, italic: false, align: 'left', width: 585 },
      { id: 'signature1', label: 'Signature 1', defaultValue: 'Authorized Signatory', x: 95, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'signature2', label: 'Signature 2', defaultValue: 'Program Director', x: 320, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: DARK, bold: true, italic: false, align: 'center', width: 160 },
      { id: 'venue', label: 'Date / Venue', defaultValue: 'May 28, 2026', x: 565, y: 480, fontSize: 12, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 170 },
    ],
  },
];