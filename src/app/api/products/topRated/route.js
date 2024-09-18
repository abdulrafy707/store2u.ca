import prisma from "@/app/util/prisma";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const topRatedProducts = await prisma.product.findMany({
            where: { isTopRated: true },
            include: {
                images: true, // Include related images
            },
        });
        
        // Log the top-rated products to the console
        // console.log('Top Rated Products:', topRatedProducts);

        return NextResponse.json({ data: topRatedProducts, status: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch top-rated products', error: error.message, status: false }, { status: 500 });
    }
}
