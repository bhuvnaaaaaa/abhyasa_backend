import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Normalize email
    let emailLower = email ? email.toLowerCase() : null;

    // Validate email format if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate phone format if provided
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
    }

    // Check for existing user
    let existingUser = null;
    if (emailLower) {
      existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return res.status(409).json({ message: "User with given email already exists" });
      }
    }
    if (phone) {
      existingUser = await User.findOne({ phone: phone });
      if (existingUser) {
        return res.status(409).json({ message: "User with given phone number already exists" });
      }
    }

    // Determine role: if email is admin email, set role to admin
    const userRole = (emailLower === 'bhuvanamallesh08@gmail.com') ? 'admin' : 'user';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      password: hashedPassword,
      role: userRole,
    };

    if (emailLower) userData.email = emailLower;
    if (phone) userData.phone = phone;

    const newUser = await User.create(userData);

    // Auto login after signup: create tokens
    const accessToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // create refresh token (stored in httpOnly cookie)
    const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || "7d" });

    // save refresh token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    // allow multiple possible identifier fields for compatibility
    let identifier = req.body.identifier || req.body.email || req.body.phone || req.body.username;
    const password = req.body.password;
    if (!identifier) return res.status(400).json({ message: 'Identifier required (email or phone)' });

    // Determine if email or phone, normalize for db lookup
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const isPhone = /^[6-9]\d{9}$/.test(identifier);
    let email = null, phone = null;
    if (isEmail) {
      email = identifier.toLowerCase();
    } else if (isPhone) {
      phone = identifier;
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up instead." });
    }

    if (!user.password) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/phone or password" });
    }

    // create access token (short lived)
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES || "15m" });

    // create refresh token (stored in httpOnly cookie)
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || "7d" });

    // save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token: accessToken, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// refresh access token using refreshToken cookie
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    // verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: "Refresh token mismatch" });

    // issue new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES || "15m" });

    // Optionally rotate refresh token
    const newRefresh = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || "7d" });
    user.refreshToken = newRefresh;
    await user.save();
    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      // find user with this refresh token and remove it
      const payload = jwt.decode(token);
      if (payload?.id) {
        const user = await User.findById(payload.id);
        if (user) {
          user.refreshToken = undefined;
          await user.save();
        }
      }
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper used by OAuth callback to set cookies and return an access token
export const createTokensForOAuth = async (user, res) => {
  // create access token (short lived)
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_EXPIRES || "15m" });

  // create refresh token (stored in httpOnly cookie)
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || "7d" });

  // save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  // set refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};
