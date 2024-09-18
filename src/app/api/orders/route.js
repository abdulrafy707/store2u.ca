import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import jwt from 'jsonwebtoken';
// import { sendOrderConfirmation } from '../../util/sendOrderConfirmation';
import { sendOrderConfirmation } from '@/app/util/sendOrderConfirmation';


const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function GET() {
  try {
    // Fetch orders along with order items and products
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  take: 1 // Take only the first image
                }
              }
            }
          },
        },
      },
    });

    // Fetch user information for each order
    const ordersWithUserDetails = await Promise.all(
      orders.map(async (order) => {
        let user = null;
        if (order.userId) { // Only fetch user if userId is present
          user = await prisma.user.findUnique({
            where: { id: order.userId },
            select: { id: true, name: true },
          });
        }
        return {
          ...order,
          user: user || null, // Set user to null if not found
        };
      })
    );

    return NextResponse.json(ordersWithUserDetails);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const { userId, shippingAddress, paymentMethod, items, total, discount = 0, tax, netTotal, couponCode = null } = await request.json();

    // Ensure that paymentInfo is defined only when the payment method is 'Credit Card'
    const paymentInfo = paymentMethod === 'Credit Card' ? await request.json().paymentInfo : null;

    // Validate the required fields
    if (!items || items.length === 0 || !total || !netTotal) {
      return NextResponse.json({ message: 'Invalid order data', status: false }, { status: 400 });
    }

    // Create the order in the database
    const createdOrder = await prisma.order.create({
      data: {
        userId: userId || null,  // Store userId if available, otherwise null for guest orders
        total,
        discount,
        tax,
        netTotal,  // Make sure this field is included
        status: 'PENDING',
        recipientName: shippingAddress.recipientName,
        streetAddress: shippingAddress.streetAddress,
        apartmentSuite: shippingAddress.apartmentSuite || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        phoneNumber: shippingAddress.phoneNumber,
        email: shippingAddress.email,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null, // Only include paymentInfo if Credit Card
        couponCode,
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            price: item.price,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,  // Include the product details for each order item
          },
        },
      },
    });

    // Send back the response with the created order
    return NextResponse.json({ message: 'Order placed successfully', data: createdOrder, status: true }, { status: 200 });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Failed to place order', error: error.message, status: false }, { status: 500 });
  }
}




// Uncomment and update the PUT and DELETE methods as needed

// export async function PUT(request) {
//   try {
//     const { id, total, status, orderItems, shippingAddress, paymentMethod, paymentInfo } = await request.json();

//     const updatedOrder = await prisma.order.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         status,
//         paymentMethod,
//         paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json(updatedOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { id } = await request.json();
//     const deletedOrder = await prisma.order.delete({
//       where: {
//         id: parseInt(id),
//       },
//     });

//     return NextResponse.json(deletedOrder);
//   } catch (error) {
//     console.error('Error deleting order:', error);
//     return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
//   }
// }
