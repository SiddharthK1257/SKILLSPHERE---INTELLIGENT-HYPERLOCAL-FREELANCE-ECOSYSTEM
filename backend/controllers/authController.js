import "dotenv/config";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const getOAuth2Client = () => {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

// =========================
// Register User
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    const allowedRoles = ["client", "freelancer"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected.",
      });
    }

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Note: User model pre-save hook will hash password automatically
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role || "client",

      isVerified: false,
      emailVerified: false,
      verified: false,

      emailVerificationToken: verificationToken,

      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    const verifyURL = `${frontendUrl}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your SkillSphere Account",
      html: `
      <h2>Welcome to SkillSphere 👋</h2>

      <p>Click the button below to verify your email.</p>

      <a href="${verifyURL}">
        Verify Email
      </a>

      <br><br>

      <small>This link expires in 24 hours.</small>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

// =========================
// Login User
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account was registered using Google Sign-In. Please sign in with Google.",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isVerified === false && user.emailVerified === false && user.verified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    /* ==========================================================
       CHECK TWO FACTOR AUTHENTICATION
    ========================================================== */

    if (user.security?.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        message: "Enter your 2FA verification code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful.",

      token: generateToken(user._id),

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

// =========================
// Google Login
// =========================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    let payload;

    try {
      if (process.env.GOOGLE_CLIENT_ID) {
        const client = getOAuth2Client();
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        payload = ticket.getPayload();
      } else {
        console.warn("GOOGLE_CLIENT_ID not set on backend. Falling back to jwt.decode.");
        payload = jwt.decode(credential);
      }
    } catch (verifyError) {
      console.warn("Google verifyIdToken failed, falling back to jwt.decode:", verifyError.message);

      const decoded = jwt.decode(credential);

      if (decoded && decoded.email && (decoded.exp * 1000 > Date.now())) {
        payload = decoded;
      } else {
        throw verifyError;
      }
    }

    const { sub, email, name, picture, email_verified } = payload || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account does not provide an email.",
      });
    }

    if (email_verified === false) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      user = await User.create({
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        googleId: sub,
        authProvider: "google",
        profileImage: picture || "",
        role: "client",
        isVerified: true,
        emailVerified: true,
        verified: true,
      });
    } else {
      let updated = false;

      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }

      if (!user.profileImage && picture) {
        user.profileImage = picture;
        updated = true;
      }

      if (!user.isVerified || !user.emailVerified || !user.verified) {
        user.isVerified = true;
        user.emailVerified = true;
        user.verified = true;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    /* ==========================================================
       CHECK TWO FACTOR AUTHENTICATION
    ========================================================== */

    if (user.security?.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        userId: user._id,
        message: "Enter your 2FA verification code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google Login Successful.",

      token: generateToken(user._id),

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Google Authentication Failed.",
    });
  }
};

// =========================
// Verify Email
// =========================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
  emailVerificationToken: token,
  emailVerificationExpires: {
    $gt: Date.now(),
  },
}).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = "";
user.emailVerificationExpires = null;

user.emailVerified = true;
user.isVerified = true;
user.verified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// Forgot Password
// =========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "SkillSphere Password Reset",
      html: `
        <h2>Password Reset Request</h2>

        <p>You requested to reset your password.</p>

        <a href="${resetURL}">
            Reset Password
        </a>

        <br><br>

        <small>
        This link expires in 15 minutes.
        </small>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// Reset Password
// =========================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired.",
      });
    }

    user.password = password;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};