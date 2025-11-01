const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard stats (DB aggregate)
router.get('/stats', adminController.getStats);

// List schemes (from blockchain)
router.get('/schemes', adminController.listSchemes);

// Add scheme (blockchain + db)
router.post('/add-scheme', adminController.addScheme);

// Use fund (blockchain + db + transaction record)
router.post('/use-fund', adminController.useFund);

module.exports = router;
