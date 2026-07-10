const pool = require("../config/db");

// ── GET MY PROFILE ───────────────────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT donor_id, full_name, email, blood_group, phone, address, latitude, longitude, is_active, created_at FROM donors
      WHERE donor_id = $1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Donor not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getMyProfile error:", err.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// ── UPDATE MY PROFILE ────────────────────────────────────────────
const updateMyProfile = async (req, res) => {
  const { full_name, phone, address, latitude, longitude } = req.body;

  try {
    const result = await pool.query(
      `UPDATE donors
      SET full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          latitude = COALESCE($4, latitude),
          longitude = COALESCE($5, longitude)
      WHERE donor_id = $6
      RETURNING donor_id, full_name, email, blood_group, phone, address, latitude, longitude, is_active`,
      [full_name, phone, address, latitude, longitude, req.user.id],
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("updateMyProfile error:", err.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// ── TOGGLE ACTIVE / INACTIVE ─────────────────────────────────────
const toggleStatus = async (req, res) => {
  try {
    // Toggle current value
    const result = await pool.query(
      `UPDATE donors
       SET is_active = NOT is_active
       WHERE donor_id = $1
       RETURNING donor_id, full_name, is_active`,
      [req.user.id],
    );

    const donor = result.rows[0];

    res.json({
      message: `You are now ${donor.is_active ? "ACTIVE - you will receive alerts" : "INACTIVE — you will not receive alerts"}`,
      is_active: donor.is_active,
    });
  } catch (err) {
    console.error("toggleStatus error:", err.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// ── GET MY DONATION HISTORY ──────────────────────────────────────
const getMyHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.donation_id,
              d.donated_at,
              d.notes,
              r.blood_group,
              r.hospital_name,
              r.address AS request_address,
              r.status AS request_status
      FROM donations d
      JOIN requests r ON d.request_id = r.request_id
      WHERE d.donor_id = $1
      ORDER BY d.donated_at DESC
      `,
      [req.user.id],
    );

    res.json({
      total: result.rows.length,
      history: result.rows,
    });
  } catch (err) {
    console.error("getMyHistory error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET ALL ACTIVE DONORS (role = 'admin') ───────────────────────────
const getAllDonors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT donor_id, full_name, email, blood_group, phone, address, is_active, created_at
      FROM donors
      ORDER BY created_at DESC
      `,
    );

    res.json({
      total: result.rows.length,
      donors: result.rows,
    });
  } catch (err) {
    console.error("getAllDonors error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllDonors,
  getMyHistory,
  getMyProfile,
  toggleStatus,
  updateMyProfile,
};
