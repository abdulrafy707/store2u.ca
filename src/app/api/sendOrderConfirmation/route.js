import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
      const { email, name, orderId, total, items, address } = await request.json();
  
      // Check if items contain product details
      const itemsList = items.map(item => {
        if (item.product && item.product.name) {
          return `<li>${item.quantity}x ${item.product.name} (Price: Rs.${item.price})</li>`;
        } else {
          return `<li>${item.quantity}x Unknown Product (Price: Rs.${item.price})</li>`;
        }
      }).join('');
  
      // Create the email content
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
        subject: `Order Placed Successfully - Order ID #${orderId}`,
        html: `
          <h2>Thank you for your order, ${name}!</h2>
          <p>Your order ID is: <strong>#${orderId}</strong></p>
          <ul>${itemsList}</ul>
          <p><strong>Total Amount: Rs.${total}</strong></p>
          <p><strong>Shipping Address:</strong> ${address.streetAddress}, ${address.city}, ${address.state}, ${address.zip}</p>
          <p>We will notify you once your order has been shipped.</p>
        `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: 'Order confirmation email sent successfully' });
  
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return NextResponse.json({ message: 'Failed to send order confirmation email', error: error.message }, { status: 500 });
    }
  }
  