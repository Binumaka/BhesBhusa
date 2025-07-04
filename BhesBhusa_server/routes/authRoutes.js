const express = require("express");
const {
  test,
  loginUser,
  verifyOtp,
  resendRegistrationOtp,
  registerUser,
  forgetPassword,
  resetPassword,
  imageUpload,
  changePassword,
  findUserById,
} = require("../controller/authController");
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require("../security/Auth");
const {validateRegister,validateLogin,validateForgot,validateReset,validateChangePassword} = require('../validation/authvalidation');

const router = express.Router();
const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true); // Accept all files (you can customize this)
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false, 
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many password reset requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', validateRegister, registerUser);
router.post('/login', loginLimiter,validateLogin, loginUser);
router.get('/users',authenticateToken, findUserById); 
router.post('/verify-otp', verifyOtp);
router.post('/resendotp', resendRegistrationOtp);
router.post('/forgetpassword',validateForgot, forgetPassword);
router.post('/resetpassword',passwordResetLimiter,validateReset, resetPassword);
router.post('/change-password', authenticateToken,validateChangePassword, changePassword);
router.post('/imageupload', authenticateToken, upload.single('image'), imageUpload);

module.exports = router;
