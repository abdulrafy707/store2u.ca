// server/api/shipping.js
import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const { orderId, shippingMethod, shippingTerms, shipmentDate, deliveryDate } = await request.json();

    if (!orderId || !shippingMethod || !shippingTerms || !shipmentDate || !deliveryDate) {
      return NextResponse.json({ message: 'All fields are required', status: false }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingMethod,
        shippingTerms,
        shipmentDate: new Date(shipmentDate),
        deliveryDate: new Date(deliveryDate),
      },
    });

    return NextResponse.json({ message: 'Shipping information updated successfully', status: true, data: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating shipping information:', error);
    return NextResponse.json({ message: 'Failed to update shipping information', status: false }, { status: 500 });
  }
}
