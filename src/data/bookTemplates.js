const GOLD = '#D4AF37';
const DARK = '#1A1A1A';
const WHITE = '#FFFFFF';
const CREAM = '#FFF6DD';
const MAROON = '#8B2C2C';
const DARK_BLUE = '#063C5D';

// Book cover canvas: 560 x 800 (portrait)
export const BOOK_CANVAS_W = 560;
export const BOOK_CANVAS_H = 800;

export const bookTemplates = [
  {
    id: 'book_blank',
    name: 'Book Template 1',
    category: 'minimal',
    background: null,
    backgroundColor: '#1A1A2E',
    fields: [
      { id: 'title', label: 'Book Title', defaultValue: 'The Art of Thinking', x: 40, y: 180, fontSize: 38, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'subtitle', label: 'Subtitle', defaultValue: 'A Guide to Creative Intelligence', x: 40, y: 250, fontSize: 16, fontFamily: 'DM Sans', color: CREAM, bold: false, italic: true, align: 'center', width: 480 },
      { id: 'author', label: 'Author Name', defaultValue: 'Author Name', x: 40, y: 680, fontSize: 20, fontFamily: 'DM Sans', color: GOLD, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'publisher', label: 'Publisher', defaultValue: 'Publisher Name', x: 40, y: 750, fontSize: 12, fontFamily: 'DM Sans', color: WHITE, bold: false, italic: false, align: 'center', width: 480 },
    ],
  },
  {
    id: 'book_classic',
    name: 'Book Template 2',
    category: 'classic',
    background: null,
    backgroundColor: '#F5F0E8',
    fields: [
      { id: 'genre', label: 'Genre / Series', defaultValue: 'FICTION', x: 40, y: 60, fontSize: 11, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'title', label: 'Book Title', defaultValue: 'Echoes of Eternity', x: 40, y: 120, fontSize: 46, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: true, align: 'center', width: 480 },
      { id: 'subtitle', label: 'Subtitle', defaultValue: 'A Novel', x: 40, y: 200, fontSize: 18, fontFamily: 'Playfair Display', color: MAROON, bold: false, italic: false, align: 'center', width: 480 },
      { id: 'author', label: 'Author Name', defaultValue: 'Author Name', x: 40, y: 700, fontSize: 22, fontFamily: 'Playfair Display', color: DARK, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'edition', label: 'Edition', defaultValue: 'First Edition', x: 40, y: 745, fontSize: 11, fontFamily: 'DM Sans', color: MAROON, bold: false, italic: false, align: 'center', width: 480 },
      { id: 'publisher', label: 'Publisher', defaultValue: 'Publisher Name', x: 40, y: 765, fontSize: 11, fontFamily: 'DM Sans', color: '#666666', bold: false, italic: false, align: 'center', width: 480 },
    ],
  },
  {
    id: 'book_modern',
    name: 'Book Template 3',
    category: 'modern',
    background: null,
    backgroundColor: '#0D1117',
    fields: [
      { id: 'title', label: 'Book Title', defaultValue: 'ZERO TO ONE', x: 40, y: 140, fontSize: 52, fontFamily: 'DM Sans', color: WHITE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'subtitle', label: 'Subtitle', defaultValue: 'Notes on Startups, or How to Build the Future', x: 40, y: 215, fontSize: 14, fontFamily: 'DM Sans', color: '#7C5CBF', bold: false, italic: false, align: 'center', width: 480 },
      { id: 'author', label: 'Author Name', defaultValue: 'Author Name', x: 40, y: 690, fontSize: 18, fontFamily: 'DM Sans', color: WHITE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'tagline', label: 'Tagline', defaultValue: '#1 NEW YORK TIMES BESTSELLER', x: 40, y: 60, fontSize: 10, fontFamily: 'DM Sans', color: '#7C5CBF', bold: true, italic: false, align: 'center', width: 480 },
      { id: 'publisher', label: 'Publisher', defaultValue: 'Publisher Name', x: 40, y: 760, fontSize: 11, fontFamily: 'DM Sans', color: '#555555', bold: false, italic: false, align: 'center', width: 480 },
    ],
  },
  {
    id: 'book_academic',
    name: 'Book Template 4',
    category: 'academic',
    background: null,
    backgroundColor: '#FFFFFF',
    fields: [
      { id: 'title', label: 'Book Title', defaultValue: 'Introduction to\nMachine Learning', x: 40, y: 100, fontSize: 36, fontFamily: 'Playfair Display', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'subtitle', label: 'Subtitle', defaultValue: 'Algorithms, Concepts and Applications', x: 40, y: 210, fontSize: 14, fontFamily: 'DM Sans', color: '#444444', bold: false, italic: false, align: 'center', width: 480 },
      { id: 'edition', label: 'Edition', defaultValue: 'Third Edition', x: 40, y: 245, fontSize: 12, fontFamily: 'DM Sans', color: MAROON, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'author', label: 'Author Name', defaultValue: 'Dr. Author Name', x: 40, y: 690, fontSize: 18, fontFamily: 'DM Sans', color: DARK_BLUE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'coauthor', label: 'Co-Author (optional)', defaultValue: '', x: 40, y: 720, fontSize: 14, fontFamily: 'DM Sans', color: '#555555', bold: false, italic: false, align: 'center', width: 480 },
      { id: 'publisher', label: 'Publisher', defaultValue: 'Academic Press', x: 40, y: 760, fontSize: 12, fontFamily: 'DM Sans', color: '#888888', bold: false, italic: false, align: 'center', width: 480 },
    ],
  },
  {
    id: 'book_thriller',
    name: 'Book Template 5',
    category: 'thriller',
    background: null,
    backgroundColor: '#0A0A0A',
    fields: [
      { id: 'tagline', label: 'Tagline', defaultValue: 'FROM THE BESTSELLING AUTHOR OF THE SILENCE', x: 30, y: 55, fontSize: 9, fontFamily: 'DM Sans', color: '#888888', bold: true, italic: false, align: 'center', width: 500 },
      { id: 'title', label: 'Book Title', defaultValue: 'THE LAST\nWITNESS', x: 40, y: 160, fontSize: 58, fontFamily: 'Playfair Display', color: WHITE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'subtitle', label: 'Subtitle', defaultValue: 'Some secrets are worth killing for', x: 40, y: 310, fontSize: 13, fontFamily: 'DM Sans', color: GOLD, bold: false, italic: true, align: 'center', width: 480 },
      { id: 'author', label: 'Author Name', defaultValue: 'AUTHOR NAME', x: 40, y: 710, fontSize: 20, fontFamily: 'DM Sans', color: WHITE, bold: true, italic: false, align: 'center', width: 480 },
      { id: 'publisher', label: 'Publisher', defaultValue: 'Publisher Name', x: 40, y: 760, fontSize: 10, fontFamily: 'DM Sans', color: '#444444', bold: false, italic: false, align: 'center', width: 480 },
    ],
  },
];
