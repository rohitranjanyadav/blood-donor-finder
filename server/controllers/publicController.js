const pool = require("../config/db");

const getPublicStats = async (req, res) => {
  try {
    const [donors, requests, donations, requestTotals] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM donors"),
      pool.query("SELECT COUNT(*) FROM requests WHERE status = 'open'"),
      pool.query("SELECT COUNT(*) FROM donations"),
      pool.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'fulfilled') AS fulfilled FROM requests"),
    ]);

    const totalRequests = Number(requestTotals.rows[0].total);
    const fulfilledRequests = Number(requestTotals.rows[0].fulfilled);

    res.json({
      total_donors: Number(donors.rows[0].count),
      active_requests: Number(requests.rows[0].count),
      total_donations: Number(donations.rows[0].count),
      fulfillment_rate: totalRequests
        ? Math.round((fulfilledRequests / totalRequests) * 100)
        : 0,
    });
  } catch (err) {
    console.error("getPublicStats error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getPublicStats };
