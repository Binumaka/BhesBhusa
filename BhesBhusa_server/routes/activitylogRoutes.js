const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole  } = require("../security/Auth");
const {getActivityLogs} = require("../controller/activitylogController");

router.get("/", authenticateToken,authorizeRole('admin'), getActivityLogs);

module.exports = router;