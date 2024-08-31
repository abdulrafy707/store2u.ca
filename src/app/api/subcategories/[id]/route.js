import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';




// Get subcategories by category ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    
    // Fetch subcategories under the given category ID
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: id },
      include: {
        category: true,
      },
    });

    if (subcategories.length === 0) {
      return NextResponse.json(
        { message: `No subcategories found for category ID ${id}`, status: false },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error(`Error fetching subcategories for category ID ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch subcategories', status: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await request.json();
    const { name, categoryId, imageUrl } = data;

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory,
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to update subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);

    const deletedSubcategory = await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 200,
      message: 'Subcategory deleted successfully',
      data: deletedSubcategory,
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
