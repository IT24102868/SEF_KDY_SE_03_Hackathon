const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Service = require('./models/Service');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded data matching the Service schema for the Going Abroad module
const goingAbroadServices = [
  {
    _id: 'srv_passport_001',
    title: 'Sri Lankan Passport Application',
    description:
      'Step-by-step guidance for applying for an all-countries ordinary Sri Lankan passport via the Department of Immigration and Emigration (Online & Battaramulla Head Office).',
    steps: [
      'Fill out the online application via the Department of Immigration & Emigration portal (or obtain Form K-35A).',
      'Obtain an authorized biometric digital photograph from an approved studio and receive the studio acknowledgement note.',
      'Book an appointment slot online for either One-Day Urgent Service or Normal Service.',
      'Visit the Immigration Department with original birth certificate, NIC, studio receipt, and copies.',
      'Complete biometric capture (fingerprints/photo verification), pay the processing fee, and collect the tracking acknowledgement.',
    ],
    requiredDocuments: [
      'Original Birth Certificate (issued within valid period) + photocopy',
      'National Identity Card (NIC) / Postal ID with copy',
      'Biometric Studio Photograph Acknowledgement Receipt',
      'Previous Passport (if renewing or applying for replacement)',
      'Marriage Certificate (for married female applicants requesting name alteration)',
    ],
    officialSource: 'http://www.immigration.gov.lk',
  },
  {
    _id: 'srv_visa_002',
    title: 'Student & Work Visa Guidance',
    description:
      'Crucial requirements, documentation checklist, and timeline navigation for Sri Lankan students and professionals applying for foreign entry visas.',
    steps: [
      'Receive official Letter of Acceptance / Confirmation of Acceptance for Studies (CAS) / Job Offer & Sponsorship.',
      'Prepare certified financial records, including 28-day bank balance statements, source of funds, and sponsor affidavits.',
      'Book and undergo mandatory IOM Tuberculosis (TB) health screening test in Colombo.',
      'Complete country-specific visa application portal (e.g., UKVI, Australian ImmiAccount, US CEAC/DS-160, or Canada IRCC).',
      'Schedule and attend biometrics capture & document verification interview at the VFS Global / designated Visa Application Center.',
    ],
    requiredDocuments: [
      'Valid Sri Lankan Passport (with at least 6 months validity remaining)',
      'University CAS / Unconditional Offer Letter / Certificate of Sponsorship',
      'IOM Medical & TB Screening Clearance Certificate',
      'Certified Bank Statements & Financial Affidavit of Support',
      'Academic Transcripts, Degree Certificates, and English Language Proficiency (IELTS / PTE / TOEFL)',
    ],
    officialSource: 'https://www.vfsglobal.com',
  },
  {
    _id: 'srv_police_003',
    title: 'Police Clearance Certificate (PCC)',
    description:
      'Official background check certificate issued by the Sri Lanka Police Headquarters, required for international immigration, work permits, and overseas university admissions.',
    steps: [
      'Visit the official Sri Lanka Police e-Services portal (services.police.lk).',
      'Register an account and fill out the online application detailing residential addresses over the past 5 years.',
      'Upload clear scanned copies of your National Identity Card, Passport info page, and supporting letters.',
      'Pay the administrative clearance processing fee securely online using a credit/debit card.',
      'Track your clearance application status online until verified and dispatched directly to the designated foreign mission or your address.',
    ],
    requiredDocuments: [
      'Coloured scan of National Identity Card (NIC)',
      'Passport biodata page copy & endorsement page',
      'Grama Niladhari (GN) Certificate for proof of address / local residence',
      'Embassy / High Commission request letter or proof of visa requirement',
    ],
    officialSource: 'https://services.police.lk',
  },
];

// GET /api/services/going-abroad - Returns the 3 services for going abroad
app.get('/api/services/going-abroad', (req, res) => {
  try {
    res.status(200).json(goingAbroadServices);
  } catch (error) {
    console.error('Error fetching going-abroad services:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.send('AdultinLK Backend API is running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AdultinLK Server running on port ${PORT}`);
});