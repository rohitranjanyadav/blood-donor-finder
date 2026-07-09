const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
// app.use("/api/donors", require("./routes/donors"));
// app.use("/api/requests", require("./routes/requests"));
// app.use("/api/donations", require("./routes/donations"));
// app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Blood Donor Finder API running ✅" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong on the server",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
