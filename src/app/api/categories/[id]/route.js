import { NextResponse } from 'next/server';

import prisma from '../../../util/prisma';
// Get category by ID

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = params?.id ? parseInt(params.id, 10) : parseInt(searchParams.get('categoryId'), 10);

    if (!id) {
      return NextResponse.json(
        { message: 'Category ID is required', status: false },
        { status: 400 }
      );
    }

    // Fetch the specific category by its ID, including its subcategories
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found', status: false },
        { status: 404 }
      );
    }

    // Return the category data
    return NextResponse.json({ status: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category', status: false, error: error.message },
      { status: 500 }
    );
  }
}



// Update an existing category
// Update an existing category, including meta fields
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const { name, imageUrl, meta_title, meta_description, meta_keywords } = await request.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        imageUrl,
        meta_title,          // Update meta title
        meta_description,    // Update meta description
        meta_keywords,       // Update meta keywords
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        message: 'Failed to update category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// Delete a category
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
