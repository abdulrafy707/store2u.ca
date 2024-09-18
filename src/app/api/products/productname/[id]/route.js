import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma'; // Adjust the path based on your project structure

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }, // Convert id to integer
      select: {
        name: true, // Select only the name field
      },
    });

    // If no product found
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Return the product name
    return NextResponse.json({ name: product.name }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
  }
}
