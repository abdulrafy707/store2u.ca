// server/api/products/newArrivals.js
import prisma from '@/app/util/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const newArrivals = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Order by creation date, most recent first
      },
      take: 10, // Limit the results to 10 products
      include: {
        images: true, // Include related images
      },
    });

    return NextResponse.json({ data: newArrivals, status: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch new arrivals', error: error.message, status: false }, { status: 500 });
  }
}
