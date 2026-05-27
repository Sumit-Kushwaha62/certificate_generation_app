import AcademicCert from '../templates/education/AcademicCert';
import TechCert from '../templates/tech/TechCert';
import CorporateCert from '../templates/corporate/CorporateCert';

export const templates = [
  {
    id: 'academic-1',
    name: 'Academic Certificate',
    category: 'education',
    component: AcademicCert,
    thumbnail: '🎓'
  },
  {
    id: 'tech-1',
    name: 'Tech Certificate',
    category: 'tech',
    component: TechCert,
    thumbnail: '💻'
  },
  {
    id: 'corporate-1',
    name: 'Corporate Training',
    category: 'corporate',
    component: CorporateCert,
    thumbnail: '🏢'
  },
];