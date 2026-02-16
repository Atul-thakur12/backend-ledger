const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "WELCOME to BACKEND-LEDGER!";
  const text = `Hello ${name},\n\n Thank You for registration at Backend-Ledger. 
    We're excited to have you on board! \n\n Best regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p> Thank you for registration at Backend-Ledger. 
    We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
  const subject = "Login Alert – Backend-Ledger Account Accessed";
  const text = `Hello ${name},

Your Backend-Ledger account was successfully logged in.

If this was you, no further action is needed.

If you did NOT log in, please change your password immediately to secure your account.

Stay secure,
The Backend Ledger Team
`;

  const html = `
  <p>Hello ${name},</p>
  <p>Your <strong>Backend-Ledger</strong> account was successfully logged in.</p>
  <p>If this was you, no further action is needed.</p>
  <p style="color:red;"><strong>If you did NOT log in, please change your password immediately to secure your account.</strong></p>
  <p>Stay secure,<br>The Backend Ledger Team</p>
`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendLoginEmail
};
