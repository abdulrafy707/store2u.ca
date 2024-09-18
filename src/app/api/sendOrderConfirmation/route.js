import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/app/util/prisma';

export async function POST(request) {
  try {
    const { email, name, orderId } = await request.json();

    // Fetch order details by orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true, // Fetch product details
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const items = order.orderItems;

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid items array');
    }

    // Fetch delivery and extra delivery charges from settings
    const settingsResponse = await fetch(`http://store2u.ca/api/settings/getSettings`);
    const settings = await settingsResponse.json();

    const deliveryCharge = settings.deliveryCharge || 0;
    const extraDeliveryCharge = settings.other1 || 0;

    // Build the product list from items array
    const productList = items.map(item => {
      const productName = item.product && item.product.name ? item.product.name.toUpperCase() : 'Unknown Product';
      const price = item.price || 0;
      const quantity = item.quantity || 1;

      return `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: left; color: #555;">${quantity}x</td>
          <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: left; color: #333; font-weight: bold;">${productName}</td>
          <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: right; color: #333;">Rs. ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        </tr>
      `;
    }).join('');

    // Calculate final total
    const finalTotal = order.netTotal;

    // Set up email content with a professional design
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
      subject: `Order Confirmation - Order ID #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 650px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #007BFF; margin-bottom: 20px;">Thank you for your order, ${name}!</h2>

            <p style="text-align: center; font-size: 18px; margin-bottom: 20px;">Your order ID: <strong>#${orderId}</strong></p>
            <p style="text-align: center; font-size: 16px; color: #555; margin-bottom: 30px;"><strong>Status:</strong> ${order.status.toUpperCase()}</p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr>
                  <th style="padding: 15px; background-color: #007BFF; color: white; text-align: left; border-top-left-radius: 8px;">Quantity</th>
                  <th style="padding: 15px; background-color: #007BFF; color: white; text-align: left;">Product</th>
                  <th style="padding: 15px; background-color: #007BFF; color: white; text-align: right; border-top-right-radius: 8px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productList}
              </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 15px; color: #555;">Delivery Charges:</td>
                <td style="padding: 15px; text-align: right; color: #333;">Rs. ${deliveryCharge.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              ${order.paymentMethod === 'Cash on Delivery' ? `
              <tr>
                <td style="padding: 15px; color: #555;">Cash on Delivery Charges:</td>
                <td style="padding: 15px; text-align: right; color: #333;">Rs. ${extraDeliveryCharge.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 15px; font-weight: bold;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; color: #007BFF;">Rs. ${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              </tr>
            </table>

            <h3 style="margin-top: 40px; color: #333;">Shipping Address</h3>
            <p style="font-size: 16px; color: #555;">
              ${order.streetAddress}, ${order.city}, ${order.state}, ${order.zip}
            </p>

            <p style="font-size: 16px; color: #007BFF; text-align: center; margin-top: 30px;">We will notify you once your order has been shipped.</p>
          </div>
        </div>
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

