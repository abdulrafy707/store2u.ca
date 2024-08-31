import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
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

    if (!order) {
      console.log('Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order Details:', order); // Log order details to the terminal
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status, paymentMethod, paymentInfo } = await request.json();

    // Begin a transaction
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: true, // Include order items to access product ID and quantity
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (status === 'COMPLETED') {
        // Decrease the stock quantity of the products in the order
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }, // Decrement the stock by the order quantity
          });
        }
      }

      // Update the order status and other details
      return prisma.order.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status, // Set the status directly to the provided value
          paymentMethod,
          paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const deletedOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
