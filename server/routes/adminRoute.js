const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  getStats,
  getAllDonors,
  getAllRequests,
  getAllHospitals,
  getPendingHospitals,
  verifyHospital,
  deleteHospital,
  deleteDonor,
  getEmailLogs,
  cancelRequest,
} = require("../controllers/adminController");

const router = express.Router();

// Middleware check for JWT token and "admin" Role
router.use(verifyToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/donors", getAllDonors);
router.get("/requests", getAllRequests);
router.get("/hospitals", getAllHospitals);
router.get("/hospitals/pending", getPendingHospitals);
router.patch("/hospitals/:id/verify", verifyHospital);
router.delete("/hospitals/:id", deleteHospital);
router.delete("/donors/:id", deleteDonor);
router.patch("/requests/:id/cancel", cancelRequest);
router.get("/email-logs", getEmailLogs);

module.exports = router;
