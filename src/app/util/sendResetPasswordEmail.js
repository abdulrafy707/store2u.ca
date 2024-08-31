import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail's service
      auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail email address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail app password (not your regular Gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please reset your password by clicking the following link: ${process.env.BASE_URL}/customer/pages/reset?token=${token}`,
      html: `<p>You requested a password reset. Please reset your password by clicking the following link: <a href="${process.env.BASE_URL}/customer/pages/reset?token=${token}">Reset Password</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
