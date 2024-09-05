// In your API route for products
import prisma from "@/app/util/prisma"; // Ensure you're using Prisma or your DB ORM

// export default async function handler(req, res) {
//   const subcategoryId = 1; // Hardcode subcategoryId to 1

//   try {
//     const products = await prisma.product.findMany({
//       where: {
//         subcategoryId: subcategoryId, // Ensure it only fetches products for subcategoryId = 1
//       },
//       include: {
//         images: true, // Include related images
//       },
//     });

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'No products found for this subcategory' });
//     }

//     console.log(`Products for subcategoryId ${subcategoryId}:`, products);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Error fetching products' });
//   }
// }
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('subcategoryId');
  
    try {
      if (!subcategoryId) {
        return NextResponse.json({ message: 'Subcategory ID is required' }, { status: 400 });
      }
  
      const products = await prisma.product.findMany({
        where: {
          subcategoryId: parseInt(subcategoryId, 10),
        },
        include: {
          images: true, // Include related images
        },
      });
  
      return NextResponse.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { message: 'Failed to fetch products', status: false, error: error.message },
        { status: 500 }
      );
    }
  }