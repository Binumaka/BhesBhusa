const bcrypt = require("bcryptjs");
const User = require('../model/userModel');
const comparePassword = require('../helpers/auth').comparePassword;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const PASSWORD_EXPIRY_DAYS = 90;

const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmpassword, role } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password should be at least 8 characters long' });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for registration verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      role,
      passwordChangedAt: new Date(),
      passwordHistory: [hashedPassword],
      otp: otp,
      otpExpires: otpExpiry,
      isVerified: false, // User is not verified until OTP is confirmed
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP Email
    const mailOptions = {
      from: `BhesBhusa <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'BhesBhusa: Verify Your Registration',
      html: `
        <h1>Welcome to BhesBhusa, ${user.username}!</h1>
        <p>Please verify your email address by entering this OTP code:</p>
        <h2 style="color: #4B2E2E; background: #f8f9fa; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't register for this account, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: 'Registration successful. OTP sent to your email. Please verify to complete registration.',
      email: user.email,
      needsVerification: true
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Something went wrong during registration' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("User found:", user);
    console.log("Stored OTP:", user.otp);
    console.log("Entered OTP:", otp);
    console.log("OTP Expiry:", new Date(user.otpExpires), "Current Time:", new Date());

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ error: 'OTP not generated or expired' });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP and mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const welcomeMailOptions = {
      from: `BhesBhusa <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to BhesBhusa - Registration Complete!',
      html: `
        <h1>Registration Completed Successfully!</h1>
        <p>Hi ${user.username},</p>
        <p>Your email has been verified successfully. You can now log in to your BhesBhusa account.</p>
        <p>Thank you for joining us!</p>
      `,
    };

    await transporter.sendMail(welcomeMailOptions);

    return res.status(200).json({
      message: 'Email verified successfully. You can now log in to your account.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'An error occurred while verifying OTP' });
  }
};


const resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `BhesBhusa <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'BhesBhusa - New Verification Code',
      html: `
        <h2>New Verification Code</h2>
        <p>Hi ${user.username},</p>
        <p>Here's your new verification code:</p>
        <h2 style="color: #4B2E2E; background: #f8f9fa; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Something went wrong while resending OTP' });
  }
};

const isPasswordExpired = (user) => {
  if (!user.passwordChangedAt) return false;
  const expiryDate = new Date(user.passwordChangedAt);
  expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
  return new Date() > expiryDate;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: 'Account is locked. Try again later.' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 minutes
        await user.save();
        return res.status(403).json({ error: 'Account locked due to failed login attempts.' });
      }

      await user.save();
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password expiry
    if (isPasswordExpired(user)) {
      return res.status(403).json({ error: 'Password expired. Please reset your password.' });
    }

    // Reset failed attempts & lock
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();

    let warningMessage = null;
    if (user.passwordChangedAt) {
      const expiryDate = new Date(user.passwordChangedAt);
      expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
      const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 7 && daysLeft > 0) {
        warningMessage = `Your password will expire in ${daysLeft} day(s). Please consider changing it.`;
      }
    }

    await user.save();
    // Generate JWT token for successful login
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '90d' }
    );

    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ 
      message: 'Login successful',
      token,
      warning: warningMessage,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `BhesBhusa <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'BhesBhusa: Your Password Reset Code',
      html: `<h2>Enter this code to reset your password</h2><h1>${resetCode}</h1><p>This code will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Code sent to email' });
  } catch (error) {
    console.error('Error in forgetPassword:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Find user by ID
const findUserById = async (req, res) => {
  try {
      const userId = req.user._id;
      const user = await User.findById(userId); 
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordPolicy.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must include uppercase, lowercase, number, and special character.',
      });
    }

    // Check password reuse
    for (const oldHashed of user.passwordHistory || []) {
      const isSame = await bcrypt.compare(newPassword, oldHashed);
      if (isSame) {
        return res.status(400).json({
          error: 'You cannot reuse a recently used password.',
        });
      }
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({
        error: 'New password cannot be the same as your current password.',
      });
    }

    user.passwordHistory = user.passwordHistory || [];
    user.passwordHistory.unshift(user.password);
    if (user.passwordHistory.length > 5) user.passwordHistory.pop();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordPolicy.test(newPassword)) {
      return res.status(400).json({
        error: 'New password must include uppercase, lowercase, number, and special character.',
      });
    }

    // Check password reuse in history
    for (const oldHashed of user.passwordHistory || []) {
      const isSame = await bcrypt.compare(newPassword, oldHashed);
      if (isSame) {
        return res.status(400).json({
          error: 'You cannot reuse a recently used password.',
        });
      }
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return res.status(400).json({
        error: 'New password cannot be the same as your current password.',
      });
    }

    user.passwordHistory = user.passwordHistory || [];
    user.passwordHistory.unshift(user.password);
    if (user.passwordHistory.length > 5) user.passwordHistory.pop();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const imageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const image = req.file.path || null;

    if (!image) return res.status(400).json({ error: 'Invalid file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.image = image;
    await user.save();

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl: image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  resendRegistrationOtp,
  loginUser,
  forgetPassword,
  resetPassword,
  imageUpload,
  changePassword,
  findUserById,
};