import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, name, orderId, status } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Order Status Updated - Order ID #${orderId}`,
      html: `
        <h2>Hello ${name},</h2>
        <p>Your order with ID <strong>#${orderId}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>We will notify you once further updates are available.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Status update email sent successfully' });
  } catch (error) {
    console.error('Error sending status update email:', error);
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
  }
}
