// import nodemailer from 'nodemailer';

// export async function sendOrderConfirmation(email, orderId, total, items) {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // Using Gmail's service
//       auth: {
//         user: process.env.EMAIL_USERNAME, // Your Gmail email address
//         pass: process.env.EMAIL_PASSWORD, // Your Gmail app password (not your regular Gmail password)
//       },
//     });

//     // Create order items list for the email
//     const itemsList = items
//       .map(item => `<li>${item.quantity}x ${item.product.name} (Price: Rs.${item.price})</li>`)
//       .join('');

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: email,
//       subject: `Order Confirmation - Order ID #${orderId}`,
//       html: `
//         <h2>Thank you for your order!</h2>
//         <p>Your order ID is: <strong>#${orderId}</strong></p>
//         <ul>${itemsList}</ul>
//         <p><strong>Total Amount: Rs.${total}</strong></p>
//         <p>We will notify you once your order has been shipped.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Order confirmation email sent successfully.');
//   } catch (error) {
//     console.error('Error sending order confirmation email:', error);
//     throw new Error('Failed to send order confirmation email');
//   }
// }
