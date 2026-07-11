const express = require("express");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const pool = require("../config/db");

const router = express.Router();

// Donor confirms they donated
router.post("/", verifyToken, requireRole("donor"), async (req, res) => {
  const { request_id, notes } = req.body;

  if (!request_id) {
    return res.status(400).json({ error: "request_id is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO donations (donor_id, request_id, notes)
      VALUES($1,$2,$3)
      RETURNING *`,
      [req.user.id, request_id, notes],
    );

    res.status(201).json({
      message: "Donation recorded successfully",
      donation: result.rows[0],
    });
  } catch (err) {
    console.error("record donation error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
