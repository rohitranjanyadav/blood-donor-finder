const nodemailer = require("nodemailer");
const pool = require("../config/db");
require("dotenv").config();

// ── Transporter ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── Verify SMTP on startup ───────────────────────────────────────
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err.message);
  } else {
    console.log("✅ SMTP server ready to send emails");
  }
});

// ── Email template ───────────────────────────────────────────────
const buildEmailHTML = (donor, request) => `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">

    <div style="background: #C0392B; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0;">🩸 Blood Donor Finder Network</h1>
    </div>

    <div style="background: #fff5f5; border: 2px solid #C0392B;
                padding: 24px; border-radius: 0 0 8px 8px;">

      <h2 style="color: #C0392B;">Urgent Blood Donation Request</h2>

      <p>Dear <strong>${donor.full_name}</strong>,</p>

      <p>A new urgent blood donation request matches your profile.
         You are registered as a <strong>${donor.blood_group}</strong> donor
         and are currently <strong>Active</strong>.</p>

      <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #C0392B; color: white;">
          <th style="padding: 10px; text-align: left;">Detail</th>
          <th style="padding: 10px; text-align: left;">Info</th>
        </tr>
        <tr style="background: #fff;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Blood Group</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${request.blood_group}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Hospital</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${request.hospital_name}</td>
        </tr>
        <tr style="background: #fff;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Quantity Needed</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${request.quantity} unit(s)</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${request.address || "See platform for details"}</td>
        </tr>
        <tr style="background: #fff;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Deadline</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; color: #C0392B;">
            <strong>${new Date(request.deadline).toLocaleString("en-NP", {
              dateStyle: "medium",
              timeStyle: "short",
            })}</strong>
          </td>
        </tr>
        ${
          request.notes
            ? `
        <tr style="background: #fafafa;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Notes</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${request.notes}</td>
        </tr>`
            : ""
        }
      </table>

      <p>Please respond as soon as possible. Every minute matters.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/requests/${request.request_id}"
           style="background: #C0392B; color: white; padding: 14px 28px;
                  text-decoration: none; border-radius: 6px;
                  font-size: 16px; font-weight: bold;">
          View Request & Respond →
        </a>
      </div>

      <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
        You received this because you are a registered ${donor.blood_group} donor
        at Blood Donor Finder Network.<br/>
        To stop receiving alerts, set your status to Inactive from your dashboard.
      </p>

    </div>
  </body>
  </html>
`;

// ── Main alert function ──────────────────────────────────────────
const sendDonorAlerts = async (donors, request) => {
  let successCount = 0;
  let failCount = 0;

  for (const donor of donors) {
    try {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: donor.email,
        subject: `🚨 URGENT: ${request.blood_group} Blood Needed — ${request.hospital_name}`,
        html: buildEmailHTML(donor, request),
      });

      // Log successful email
      await pool.query(
        `INSERT INTO email_logs (donor_id, request_id, delivery_status)
        VALUES ($1, $2, 'sent')`,
        [donor.donor_id, request.request_id],
      );

      successCount++;
      console.log(`📧 Alert sent to ${donor.email}`);
    } catch (err) {
      // Log failed email without crashing
      await pool.query(
        `INSERT INTO email_logs (donor_id, request_id, delivery_status)
         VALUES ($1, $2, 'failed')`,
        [donor.donor_id, request.request_id],
      );

      failCount++;
      console.error(`❌ Failed to send to ${donor.email}:`, err.message);
    }
  }
  console.log(`📊 Email summary — Sent: ${successCount}, Failed: ${failCount}`);
};

module.exports = { sendDonorAlerts };
