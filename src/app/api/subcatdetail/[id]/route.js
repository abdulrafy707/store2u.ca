import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';

// Get subcategory details by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10); // Parse the ID from the URL

    // Fetch the specific subcategory by ID, including meta fields
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true, // Include the associated category details if needed
      },
    });

    // If the subcategory is not found, return a 404 response
    if (!subcategory) {
      return NextResponse.json(
        { message: `Subcategory with ID ${id} not found`, status: false },
        { status: 404 }
      );
    }

    // Return the subcategory data with a success status
    return NextResponse.json({ status: true, data: subcategory });
  } catch (error) {
    console.error(`Error fetching subcategory with ID ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch subcategory', status: false, error: error.message },
      { status: 500 }
    );
  }
}
