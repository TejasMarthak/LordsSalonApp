import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  logger: true, // Enable logger for debugging
  debug: true, // Enable debug output
});

// Helper function to promisify sendMail
const sendMailPromise = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    // ✅ Validate email parameter
    if (!email) {
      throw new Error("Email recipient is required but was not provided");
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email, // ✅ EXPLICITLY using the email parameter
      subject: "Lords Salon - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Lords Professional Makeup Studio & Salon</h1>
          </div>
          <div style="background: #f8f8f8; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              Hello,
            </p>
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              You requested to reset your password. Your OTP is:
            </p>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; border: 2px solid #1A1A1A;">
              <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1A1A1A; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            <p style="color: #666; font-size: 12px; line-height: 1.6;">
              This OTP will expire in 15 minutes.
            </p>
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 11px; line-height: 1.6;">
              © 2024 Lords Professional Makeup Studio & Salon. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await sendMailPromise(mailOptions);
    
    return true;
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, adminName) => {
  try {
    // ✅ Validate email parameter
    if (!email) {
      throw new Error("Email recipient is required but was not provided");
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email, // ✅ EXPLICITLY using the email parameter
      subject: "Lords Salon - Password Changed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Lords Professional Makeup Studio & Salon</h1>
          </div>
          <div style="background: #f8f8f8; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              Hello ${adminName},
            </p>
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              Your password has been successfully changed. You can now log in with your new password.
            </p>
            <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #22863A;">
              <p style="margin: 0; color: #22863A; font-weight: bold;">
                ✓ Password Reset Successful
              </p>
            </div>
            <p style="color: #333; font-size: 14px; line-height: 1.6;">
              If you didn't change your password, please contact support immediately.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 11px; line-height: 1.6;">
              © 2024 Lords Professional Makeup Studio & Salon. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    
    const info = await sendMailPromise(mailOptions);
    
    return true;
  } catch (error) {
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }
};

export { sendOTPEmail, sendPasswordResetConfirmation };
