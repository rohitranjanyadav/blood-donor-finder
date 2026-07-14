const pool = require("../config/db");
const { sendDonorAlerts } = require("../services/emailService");
const {
  matchDonors,
  getPriorityScore,
  sortRequestsByPriority,
} = require("../services/matchingService");

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
      `SELECT donor_id, full_name, email, blood_group,latitude,longitude,address
      FROM donors
      WHERE is_active = true`,
    );

    // 3. DSA algo - matchDonors
    const matchedDonors = matchDonors(
      donorResult.rows,
      blood_group,
      latitude,
      longitude,
    );

    // 4. Get priority for this request
    const priority = getPriorityScore(deadline);

    // 3. Send emails asynchronously
    if (matchedDonors.length > 0) {
      sendDonorAlerts(matchedDonors, newRequest);
    }

    res.status(201).json({
      message: "Request posted successfully",
      request: newRequest,
      priority: priority,
      donors_alerted: matchedDonors.length,
      nearest_donor: matchedDonors[0]
        ? {
            name: matchedDonors[0].full_name,
            distance_km: matchedDonors[0].distance_km,
          }
        : null,
    });
  } catch (err) {
    console.error("createRequest error:", err.message);
    res.status(500).json({
      error: "Server error while creating request",
    });
  }
};

// ── GET ALL ACTIVE REQUESTS (public & with priority sorting) ─────────────────
const getActiveRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         request_id, blood_group, quantity, deadline,
         hospital_name, address, latitude, longitude,
         notes, status, created_at,
         (SELECT COUNT(*) FROM email_logs e
          WHERE e.request_id = requests.request_id
          AND   e.delivery_status = 'sent') AS donors_alerted
       FROM requests
       WHERE status = 'open'`,
    );

    // Priority Scoring
    const prioritized = sortRequestsByPriority(result.rows);

    res.json({
      total: prioritized.length,
      requests: prioritized,
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

    const request = result.rows[0];
    const priority = getPriorityScore(request.deadline);

    res.json({ ...request, ...priority });
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

    const withPriority = sortRequestsByPriority(result.rows);

    res.json({
      total: withPriority.length,
      requests: withPriority,
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
