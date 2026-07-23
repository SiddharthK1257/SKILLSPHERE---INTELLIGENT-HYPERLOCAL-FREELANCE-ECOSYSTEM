import nodemailer from "nodemailer";

/* ==========================================================
   EMAIL TRANSPORTER
========================================================== */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ==========================================================
   VERIFY EMAIL CONFIGURATION
========================================================== */

(async () => {
  try {
    await transporter.verify();
    console.log("✅ Email Server is Ready");
  } catch (error) {
    console.error("❌ Email Configuration Error");
    console.error(error.message);
  }
})();

/* ==========================================================
   SEND EMAIL
========================================================== */

const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"SkillSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("✅ Email Sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Sending Failed");
    console.error(error.message);

    console.log("\n================ EMAIL DEBUG ================");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:");
    console.log(html || text);
    console.log("=============================================\n");

    return {
      success: false,
      messageId: null,
      error: error.message,
    };
  }
};

export default sendEmail;