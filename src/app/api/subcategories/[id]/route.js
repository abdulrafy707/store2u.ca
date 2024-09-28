import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';




// Get subcategories by category ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    
    // Fetch subcategories for the given category ID
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId: id },
      include: {
        category: true,  // Including the category details
      },
    });

    // If no subcategories are found
    if (!subcategories || subcategories.length === 0) {
      return NextResponse.json(
        { message: `No subcategories found for category ID ${id}`, status: false },
        { status: 404 }
      );
    }

    // Successfully return the subcategories
    return NextResponse.json({ status: true, data: subcategories });
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
    const { name, categoryId, imageUrl, meta_title, meta_description, meta_keywords } = data;

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        meta_title, // Update meta title
        meta_description, // Update meta description
        meta_keywords, // Update meta keywords
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
