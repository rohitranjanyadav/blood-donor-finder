const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ── Helper: generate JWT ─────────────────────────────────────────
const generateToken = (id, role, email) => {
  return jwt.sign(
    {
      id,
      role,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

// ── REGISTER DONOR ───────────────────────────────────────────────
const registerDonor = async (req, res) => {
  const {
    full_name,
    email,
    password,
    blood_group,
    phone,
    address,
    latitude,
    longitude,
  } = req.body;

  // Validation
  if (!full_name || !email || !password || !blood_group) {
    return res.status(400).json({
      error: "full_name, email, password and blood_group are required",
    });
  }

  const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  if (!validBloodGroups.includes(blood_group)) {
    return res.status(400).json({
      error: "Invalid blood group",
    });
  }

  try {
    // Check if email already exists
    const existing = await pool.query(
      `SELECT donor_id FROM donors 
       WHERE email = $1`,
      [email],
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert donor
    const result = await pool.query(
      `INSERT INTO donors 
       (full_name, email, password, blood_group, phone, address,latitude,longitude) 
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) 
       RETURNING donor_id, full_name, email, blood_group, phone, address, is_active, created_at`,
      [
        full_name,
        email,
        hashedPassword,
        blood_group,
        phone,
        address,
        latitude,
        longitude,
      ],
    );

    const donor = result.rows[0];

    const token = generateToken(donor.donor_id, "donor", donor.email);

    res.status(201).json({
      message: "Donor registered successfully",
      token,
      user: {
        ...donor,
        role: "donor",
      },
    });
  } catch (err) {
    console.error("registerDonor error:", err.message);
    res.status(500).json({
      error: "Server error during registration",
    });
  }
};

// ── REGISTER PATIENT ─────────────────────────────────────────────
const registerPatient = async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      error: "full_name, email and password are required",
    });
  }

  try {
    const existing = await pool.query(
      `SELECT patient_id FROM patients
       WHERE email = $1`,
      [email],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO patients
       (full_name, email, password, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING patient_id, full_name, email, phone, created_at
       
       `,
      [full_name, email, hashedPassword, phone],
    );

    const patient = result.rows[0];
    const token = generateToken(patient.patient_id, "patient", patient.email);

    res.status(201).json({
      message: "Patient registered successfully",
      token,
      user: {
        ...patient,
        role: "patient",
      },
    });
  } catch (err) {
    console.error("registerPatient error:", err.message);
    res.status(500).json({
      error: "Server error during registration",
    });
  }
};

// ── REGISTER HOSPITAL ────────────────────────────────────────────
const registerHospital = async (req, res) => {
  const { hospital_name, email, password, phone, address, license_no } =
    req.body;

  if (!hospital_name || !email || !password || !license_no) {
    return res.status(400).json({
      error: "hospital_name, email, password and license_no are required",
    });
  }

  try {
    const existing = await pool.query(
      `SELECT hospital_id FROM hospitals
       WHERE email = $1
      `,
      [email],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO hospitals (hospital_name, email, password, phone, address, license_no)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING hospital_id, hospital_name, email, phone, address, license_no, is_verified, created_at
      `,
      [hospital_name, email, hashedPassword, phone, address, license_no],
    );

    const hospital = result.rows[0];
    const token = generateToken(
      hospital.hospital_id,
      "hospital",
      hospital.email,
    );

    res.status(201).json({
      message: "Hospital registered. Awaiting admin verification before login.",
      token,
      user: {
        ...hospital,
        role: "hospital",
      },
    });
  } catch (err) {
    console.error("registerHospital error:", err.message);
    res.status(500).json({
      error: "Server error during registration",
    });
  }
};

// ── LOGIN (all roles) ────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    let user = null;
    let role = null;

    // Check donors table
    let result = await pool.query(
      `SELECT donor_id AS id, full_name, email, password, blood_group, is_active, 'donor' AS role FROM donors
       WHERE email = $1 `,
      [email],
    );
    if (result.rows.length > 0) {
      user = result.rows[0];
      role = "donor";
    }

    // Check patients table
    if (!user) {
      result = await pool.query(
        `SELECT patient_id AS id, full_name, email, password, 'patient' AS role
        FROM patients WHERE email = $1`,
        [email],
      );
      if (result.rows.length > 0) {
        user = result.rows[0];
        role = "patient";
      }
    }

    // Check hospitals table
    if (!user) {
      result = await pool.query(
        `SELECT hospital_id AS id, hospital_name AS full_name, email, password, is_verified, 'hospital' AS role
        FROM hospitals WHERE email = $1`,
        [email],
      );
      if (result.rows.length > 0) {
        user = result.rows[0];
        role = "hospital";

        if (!user.is_verified) {
          return res.status(403).json({
            error:
              "Hospital account not yet verified by admin. Please wait for approval.",
          });
        }
      }
    }

    // Check admin table
    if (!user) {
      result = await pool.query(
        `SELECT admin_id AS id, username AS full_name, email, password, 'admin' AS role
        FROM admin_users WHERE email = $1`,
        [email],
      );

      if (result.rows.length > 0) {
        user = result.rows[0];
        role = "admin";
      }
    }

    // User not found in any table
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Remove password for response
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id, role, user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        ...userWithoutPassword,
        role,
      },
    });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({
      error: "Server error during login",
    });
  }
};

module.exports = {
  registerDonor,
  registerPatient,
  registerHospital,
  login,
};
