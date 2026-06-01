import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Anelyria" <noreply@anelyria.de>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
  await sendEmail(
    email,
    'Reset your Anelyria password',
    `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`
  );
};

export const sendTenantWelcomeEmail = async (email: string, tenantName: string) => {
  await sendEmail(
    email,
    `Welcome to ${tenantName} on Anelyria`,
    `<p>Your account for ${tenantName} has been created. You can now log in at ${process.env.APP_URL}.</p>`
  );
};
