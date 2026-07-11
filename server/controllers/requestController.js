const pool = require("../config/db");
const { sendDonorAlerts } = require("../services/emailService");

// ── CREATE REQUEST (triggers email matching) ─────────────────────
const createRequest = async (req, res) => {
  const {
    blood_group,
    quantity,
    deadline,
    hospital_name,
    address,
    latitude,
    longitude,
    notes,
  } = req.body;

  // Validation
  if (!blood_group || !deadline || !hospital_name) {
    return res.status(400).json({
      error: "blood_group, deadline and hospital_name are required",
    });
  }

  const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  if (!validBloodGroups.includes(blood_group)) {
    return res.status(400).json({
      error: "Invalid blood group",
    });
  }

  if (new Date(deadline) <= new Date()) {
    return res.status(400).json({
      error: "Deadline must be in the future",
    });
  }

  try {
    // 1. Save the request
    const result = await pool.query(
      `INSERT INTO requests
      (requester_id, requester_type, blood_group, quantity, deadline, hospital_name, address, latitude, longitude, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        req.user.id,
        req.user.role,
        blood_group,
        quantity || 1,
        deadline,
        hospital_name,
        address,
        latitude,
        longitude,
        notes,
      ],
    );

    const newRequest = result.rows[0];

    // 2. Find all matching donors
    const donorResult = await pool.query(
      `SELECT donor_id, full_name, email, blood_group
      FROM donors
      WHERE blood_group = $1 AND is_active = true`,
      [blood_group],
    );

    console.log(donorResult);
    console.log(donorResult.rows);

    const matchedDonors = donorResult.rows;

    // 3. Send emails asynchronously
    if (matchedDonors.length > 0) {
      sendDonorAlerts(matchedDonors, newRequest);
    }

    res.status(201).json({
      message: "Request posted successfully",
      request: newRequest,
      donors_alerted: matchedDonors.length,
    });
  } catch (err) {
    console.error("createRequest error:", err.message);
    res.status(500).json({
      error: "Server error while creating request",
    });
  }
};

// ── GET ALL ACTIVE REQUESTS (public — for map) ───────────────────
const getActiveRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT request_id, blood_group, quantity, deadline,hospital_name, longitude,
       notes, status, created_at
       FROM requests
       WHERE status = 'open'
       ORDER BY created_at DESC
      
      `,
    );
    res.json({
      total: result.rows.length,
      requests: result.rows,
    });
  } catch (err) {
    console.error("getActiveRequests error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET SINGLE REQUEST ───────────────────────────────────────────
const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*,
        (SELECT COUNT(*) FROM email_logs e
         WHERE e.request_id = r.request_id AND e.delivery_status = 'sent')
         AS donors_alerted
       FROM requests r
       WHERE r.request_id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getRequestById error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── UPDATE REQUEST STATUS ────────────────────────────────────────
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validation
  const validStatuses = ["open", "fulfilled", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be open, fulfilled or cancelled" });
  }

  try {
    const result = await pool.query(
      `UPDATE requests SET status = $1
      WHERE request_id = $2
      RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    res.json({
      message: `Request marked as ${status}`,
      request: result.rows[0],
    });
  } catch (err) {
    console.error("updateRequestStatus error:", err.message);
    res.status(500).json({
      error: "Server error",
    });
  }
};

// ── GET MY REQUESTS (patient or hospital) ───────────────────────
const getMyRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM requests
      WHERE requester_id = $1 AND requester_type = $2
      ORDER BY created_at DESC`,
      [req.user.id, req.user.role],
    );

    res.json({
      total: result.rows.length,
      requests: result.rows,
    });
  } catch (err) {
    console.error("getMyRequests error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createRequest,
  getActiveRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
};
