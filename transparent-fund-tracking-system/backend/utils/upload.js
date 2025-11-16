const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = {
  supportingDocs: 'uploads/supporting-docs',
  expenditureBills: 'uploads/expenditure-bills',
  proofs: 'uploads/proofs',
  certificates: 'uploads/certificates',
  grievances: 'uploads/grievances'
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    const routePath = req.route?.path || req.url || '';
    
    // Determine upload directory based on route or field name
    if (routePath.includes('grievance')) {
      uploadPath = uploadDirs.grievances;
    } else if (routePath.includes('request') || file.fieldname === 'documents') {
      uploadPath = uploadDirs.supportingDocs;
    } else if (routePath.includes('expenditure') || file.fieldname === 'bill') {
      uploadPath = uploadDirs.expenditureBills;
    } else if (routePath.includes('proof') || file.fieldname === 'file') {
      // Check if it's a proof upload based on URL
      if (routePath.includes('/proof')) {
        uploadPath = uploadDirs.proofs;
      } else {
        uploadPath = uploadDirs.proofs; // Default to proofs for file uploads
      }
    } else if (routePath.includes('certificate')) {
      uploadPath = uploadDirs.certificates;
    } else {
      // Default to supporting docs
      uploadPath = uploadDirs.supportingDocs;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and common document formats
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image, PDF, and document files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = { upload, uploadDirs };

