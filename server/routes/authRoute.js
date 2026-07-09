const express = require("express");
const {
  registerDonor,
  registerPatient,
  registerHospital,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/donor", registerDonor);
router.post("/register/patient", registerPatient);
router.post("/register/hospital", registerHospital);
router.post("/login", login);

module.exports = router;
