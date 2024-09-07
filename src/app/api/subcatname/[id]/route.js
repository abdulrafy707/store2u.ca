import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';  // Assuming prisma is setup in your project

export async function GET(request, { params }) {
  const id = parseInt(params.id, 10);

  try {
    // Fetch the subcategory by ID and only select the 'name'
    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { message: `Subcategory with ID ${id} not found`, status: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ name: subcategory.name, status: true });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch subcategory', error: error.message, status: false },
      { status: 500 }
    );
  }
}
