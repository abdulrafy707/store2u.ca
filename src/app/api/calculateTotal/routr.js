// /api/calculateTotal.js
import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const { items } = await request.json();
    const productIds = items.map(item => item.id);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    const total = products.reduce((acc, product) => {
      const item = items.find(i => i.id === product.id);
      return acc + product.price * item.quantity;
    }, 0);

    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    return NextResponse.json({ message: 'Failed to calculate total amount', error: error.message }, { status: 500 });
  }
}
