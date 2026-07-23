import speakeasy from "speakeasy";
import QRCode from "qrcode";

import User from "../models/User.js";

/* ==========================================================
   HELPERS
========================================================== */

/**
 * Normalize OTP token
 */
const normalizeToken = (token) => {
  return String(token || "")
    .replace(/\s/g, "")
    .trim();
};

/**
 * Validate 6-digit OTP
 */
const isValidOTP = (token) => {
  return /^\d{6}$/.test(token);
};

/**
 * Return safe user data
 */
const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    emailVerified: user.emailVerified,
    twoFactorEnabled:
      user.security?.twoFactorEnabled || false,
  };
};

/* ==========================================================
   SETUP 2FA
========================================================== */

/**
 * @route   POST /api/2fa/setup
 * @access  Private
 */
export const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "+security.twoFactorSecret"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // If already enabled, do not generate another secret
    if (user.security?.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "Two-factor authentication is already enabled.",
      });
    }

    /*
     * Generate a new secret
     */
    const secret = speakeasy.generateSecret({
      name: `SkillSphere (${user.email})`,
      issuer: "SkillSphere",
      length: 20,
    });

    if (!secret.base32 || !secret.otpauth_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate 2FA secret.",
      });
    }

    /*
     * Store secret but keep 2FA disabled
     *
     * The user must verify an OTP before enabling 2FA.
     */
    user.security.twoFactorSecret =
      secret.base32;

    user.security.twoFactorEnabled = false;

    await user.save();

    /*
     * Generate QR code
     */
    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url
    );

    return res.status(200).json({
      success: true,
      message:
        "2FA setup generated. Scan the QR code and verify the code.",
      qrCode,
      manualKey: secret.base32,
    });
  } catch (error) {
    console.error("Setup 2FA Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to setup Two-Factor Authentication.",
    });
  }
};

/* ==========================================================
   VERIFY AND ENABLE 2FA
========================================================== */

/**
 * @route   POST /api/2fa/verify
 * @access  Private
 */
export const verify2FA = async (req, res) => {
  try {
    const token = normalizeToken(req.body.token);

    if (!isValidOTP(token)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 6-digit verification code.",
      });
    }

    const user = await User.findById(req.user._id).select(
      "+security.twoFactorSecret"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.security?.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "Two-factor authentication is already enabled.",
      });
    }

    if (!user.security?.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message:
          "Please generate a 2FA setup QR code first.",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.security.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification code.",
      });
    }

    /*
     * Enable 2FA only after successful verification
     */
    user.security.twoFactorEnabled = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Two-Factor Authentication enabled successfully.",
      twoFactorEnabled: true,
    });
  } catch (error) {
    console.error("Verify 2FA Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify Two-Factor Authentication.",
    });
  }
};

/* ==========================================================
   GET 2FA STATUS
========================================================== */

/**
 * @route   GET /api/2fa/status
 * @access  Private
 */
export const get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      twoFactorEnabled:
        user.security?.twoFactorEnabled || false,
    });
  } catch (error) {
    console.error("Get 2FA Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get 2FA status.",
    });
  }
};

/* ==========================================================
   DISABLE 2FA
========================================================== */

/**
 * @route   POST /api/2fa/disable
 * @access  Private
 */
export const disable2FA = async (req, res) => {
  try {
    const token = normalizeToken(req.body.token);

    if (!isValidOTP(token)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your current 6-digit 2FA code.",
      });
    }

    const user = await User.findById(req.user._id).select(
      "+security.twoFactorSecret"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.security?.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "Two-factor authentication is not enabled.",
      });
    }

    if (!user.security?.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message:
          "2FA secret is not available.",
      });
    }

    /*
     * Require the current OTP before disabling 2FA
     */
    const verified = speakeasy.totp.verify({
      secret: user.security.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification code.",
      });
    }

    user.security.twoFactorEnabled = false;
    user.security.twoFactorSecret = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Two-Factor Authentication disabled successfully.",
      twoFactorEnabled: false,
    });
  } catch (error) {
    console.error("Disable 2FA Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to disable Two-Factor Authentication.",
    });
  }
};

/* ==========================================================
   VERIFY LOGIN 2FA
========================================================== */

/**
 * @route   POST /api/2fa/login
 * @access  Public
 *
 * IMPORTANT:
 * This endpoint should be called only after the
 * email/password credentials have already been verified.
 */
export const verifyLogin2FA = async (req, res) => {
  try {
    const { userId } = req.body;

    const token = normalizeToken(req.body.token);

    if (!userId || !isValidOTP(token)) {
      return res.status(400).json({
        success: false,
        message:
          "User ID and valid 6-digit verification code are required.",
      });
    }

    const user = await User.findById(userId).select(
      "+security.twoFactorSecret"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.active || user.suspended) {
      return res.status(403).json({
        success: false,
        message:
          "This account is inactive or suspended.",
      });
    }

    if (!user.security?.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message:
          "Two-factor authentication is not enabled.",
      });
    }

    if (!user.security?.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message:
          "2FA secret is not available.",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.security.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired verification code.",
      });
    }

    /*
     * Generate your normal access token
     */
    const accessToken =
      user.generateAccessToken();

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: accessToken,
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Login 2FA Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify login code.",
    });
  }
};