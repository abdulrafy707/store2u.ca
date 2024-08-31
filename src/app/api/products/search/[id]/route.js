import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';

export async function GET(request, { params }) {
  const search = params.id; // Fetch the search query from the URL parameters

  if (!search) {
    return NextResponse.json({ message: 'Search query cannot be empty', status: false }, { status: 400 });
  }

  try {
    const products = await prisma.$queryRaw`
      SELECT 
        Product.id, 
        Product.name, 
        Product.description, 
        Product.price, 
        Product.discount, 
        Product.stock,
        COALESCE(
          (
            SELECT 
              JSON_ARRAYAGG(Image.url)
            FROM 
              Image 
            WHERE 
              Image.productId = Product.id
          ), 
          JSON_ARRAY()
        ) AS images
      FROM 
        Product 
      WHERE 
        Product.name LIKE ${`%${search}%`} 
      OR 
        Product.description LIKE ${`%${search}%`}
    `;

    return NextResponse.json({ data: products, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products', error: error.message, status: false }, { status: 500 });
  }
}
