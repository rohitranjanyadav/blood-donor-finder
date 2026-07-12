const pool = require("../config/db");

// ── GET DASHBOARD STATS ──────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [
      donors,
      requests,
      donations,
      hospitals,
      pendingHospitals,
      emailsSent,
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM donors`),
      pool.query(`SELECT COUNT(*) FROM requests WHERE status = 'open'`),
      pool.query(`SELECT COUNT(*) FROM donations`),
      pool.query(`SELECT COUNT(*) FROM hospitals WHERE is_verified = true`),
      pool.query(`SELECT COUNT(*) FROM hospitals WHERE is_verified = false`),
      pool.query(
        `SELECT COUNT(*) FROM email_logs WHERE delivery_status = 'sent'`,
      ),
    ]);

    res.json({
      total_donors: parseInt(donors.rows[0].count),
      active_requests: parseInt(requests.rows[0].count),
      total_donations: parseInt(donations.rows[0].count),
      verified_hospitals: parseInt(hospitals.rows[0].count),
      pending_hospitals: parseInt(pendingHospitals.rows[0].count),
      total_emails_sent: parseInt(emailsSent.rows[0].count),
    });
  } catch (err) {
    console.error("getStats error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET ALL DONORS ───────────────────────────────────────────────
const getAllDonors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.donor_id, d.full_name, d.email, d.blood_group, d.phone, d.address, d.is_active, d.created_at, COUNT(dn.donation_id) AS total_donations
      FROM donors d
      LEFT JOIN donations dn ON d.donor_id = dn.donor_id
      GROUP BY d.donor_id
      ORDER BY d.created_at DESC`,
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

// ── GET ALL REQUESTS ─────────────────────────────────────────────
const getAllRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.*,
         (SELECT COUNT(*) FROM email_logs e
          WHERE e.request_id = r.request_id
          AND   e.delivery_status = 'sent') AS donors_alerted
       FROM requests r
       ORDER BY r.created_at DESC`,
    );

    res.json({
      total: result.rows.length,
      requests: result.rows,
    });
  } catch (err) {
    console.error("getAllRequests error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET PENDING HOSPITALS ────────────────────────────────────────
const getPendingHospitals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT hospital_id, hospital_name, email, phone,
              address, license_no, created_at
       FROM hospitals
       WHERE is_verified = false
       ORDER BY created_at DESC`,
    );

    res.json({ total: result.rows.length, hospitals: result.rows });
  } catch (err) {
    console.error("getPendingHospitals error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET ALL HOSPITALS ────────────────────────────────────────────
const getAllHospitals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT hospital_id, hospital_name, email, phone,
              address, license_no, is_verified, created_at
      FROM hospitals
      ORDER BY created_at DESC`,
    );

    res.json({
      total: result.rows.length,
      hospitals: result.rows,
    });
  } catch (err) {
    console.error("getAllHospitals error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── VERIFY HOSPITAL ──────────────────────────────────────────────
const verifyHospital = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE hospitals
      SET is_verified = true
      WHERE hospital_id = $1
      RETURNING hospital_id, hospital_name, email, is_verified`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({
      message: `${result.rows[0].hospital_name} has been verified successfully`,
      hospital: result.rows[0],
    });
  } catch (err) {
    console.error("verifyHospital error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── REJECT / DELETE HOSPITAL ─────────────────────────────────────
const deleteHospital = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM hospitals
      WHERE hospital_id = $1
      RETURNING hospital_name`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({
      message: `${result.rows[0].hospital_name} has been removed from the platform`,
    });
  } catch (err) {
    console.error("deleteHospital error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── DELETE DONOR ─────────────────────────────────────────────────
const deleteDonor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM donors
      WHERE donor_id = $1
      RETURNING full_name`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Donor not found" });
    }

    res.json({
      message: `Donor ${result.rows[0].full_name} has been removed`,
    });
  } catch (err) {
    console.error("deleteDonor error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── CANCEL ANY REQUEST ───────────────────────────────────────────
const cancelRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE requests SET status = 'cancelled
      WHERE request_id = $1
      RETURNING request_id, blood_group, hospital_name, status`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      message: "Request cancelled by admin",
      request: result.rows[0],
    });
  } catch (err) {
    console.error("cancelRequest error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ── GET EMAIL LOGS ───────────────────────────────────────────────
const getEmailLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT el.log_id,
         el.sent_at,
         el.delivery_status,
         d.full_name   AS donor_name,
         d.email       AS donor_email,
         d.blood_group,
         r.hospital_name,
         r.request_id
      FROM email_logs el
      JOIN donors d ON el.donor_id = d.donor_id
      JOIN requests r On el.request_id = r.request_id
      ORDER BY el.sent_at DESC
      LIMIT 100`,
    );

    res.json({
      total: result.rows.length,
      logs: result.rows,
    });
  } catch (err) {
    console.error("getEmailLogs error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getStats,
  getAllDonors,
  getAllRequests,
  getPendingHospitals,
  getAllHospitals,
  verifyHospital,
  deleteHospital,
  deleteDonor,
  cancelRequest,
  getEmailLogs,
};
