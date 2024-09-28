import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, categoryId, imageUrl, meta_title, meta_description, meta_keywords } = data;

    const newSubcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        meta_title, // Save meta title
        meta_description, // Save meta description
        meta_keywords, // Save meta keywords
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Subcategory created successfully',
      data: newSubcategory,
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      {
        message: 'Failed to create subcategory',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const categoryId = searchParams.get('categoryId');

//   try {
//     const subcategories = await prisma.subcategory.findMany({
//       where: {
//         categoryId: parseInt(categoryId, 10)
//       },
//       include: {
//         category: true,
//       },
//     });

//     return NextResponse.json(subcategories);
//   } catch (error) {
//     console.error('Error fetching subcategories:', error);
//     return NextResponse.json(
//       {
//         message: 'Failed to fetch subcategories',
//         status: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const subcategoryId = searchParams.get('subcategoryId');

//   try {
//     if (!subcategoryId) {
//       return NextResponse.json({ message: 'Subcategory ID is required' }, { status: 400 });
//     }

//     const products = await prisma.product.findMany({
//       where: {
//         subcategoryId: parseInt(subcategoryId, 10),
//       },
//       include: {
//         images: true, // Include related images
//       },
//     });

//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch products', status: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch subcategories',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     const subcategories = await prisma.subcategory.findMany({
//       include: {
//         products: true,
//       },
//     });

//     // Log subcategories and their related products to the terminal
//     subcategories.forEach(subcategory => {
//       console.log(`Subcategory ${subcategory.id}: ${subcategory.name}`);
//       subcategory.products.forEach(product => {
//         console.log(`  Product ${product.id}: ${product.name}`);
//       });
//     });

//     return NextResponse.json(subcategories);
//   } catch (error) {
//     console.error('Error fetching subcategories and products:', error);
//     return NextResponse.json(
//       {
//         message: 'Failed to fetch subcategories and products',
//         status: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }



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
