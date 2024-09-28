
import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch categories',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request) {
  try {
    const { name, imageUrl, meta_title, meta_description, meta_keywords } = await request.json();
    const newCategory = await prisma.category.create({
      data: {
        name,
        imageUrl,
        meta_title,           // Store meta title
        meta_description,     // Store meta description
        meta_keywords,        // Store meta keywords
      },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        message: 'Failed to create category',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

