const express = require("express");
const {
  getActiveRequests,
  getRequestById,
  createRequest,
  getMyRequests,
  updateRequestStatus,
} = require("../controllers/requestController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — no auth needed (map shows all active requests)
router.get("/active", getActiveRequests);
router.get("/:id", getRequestById);

// Patient or hospital can post a request
router.post(
  "/",
  verifyToken,
  requireRole("patient", "hospital"),
  createRequest,
);

// View own requests
router.get(
  "/my/requests",
  verifyToken,
  requireRole("patient", "hospital", "admin"),
  getMyRequests,
);

// Update status — owner or admin
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("patient", "hospital", "admin"),
  updateRequestStatus,
);

module.exports = router;
