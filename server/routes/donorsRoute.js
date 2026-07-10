const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  toggleStatus,
  getMyHistory,
  getAllDonors,
} = require("../controllers/donorController");

const router = express.Router();

router.get("/me", verifyToken, requireRole("donor"), getMyProfile);
router.put("/me", verifyToken, requireRole("donor"), updateMyProfile);
router.patch("/me/status", verifyToken, requireRole("donor"), toggleStatus);
router.get("/me/history", verifyToken, requireRole("donor"), getMyHistory);

// Admin Only
router.get("/", verifyToken, requireRole("admin"), getAllDonors);

module.exports = router;
