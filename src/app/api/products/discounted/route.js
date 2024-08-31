// /api/products/discounted.js

import prisma from "@/app/util/prisma";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const discountedProducts = await prisma.product.findMany({
            where: {
                discount: {
                    gt: 0, // Fetch products with discount greater than 0
                }
            },
            include: {
                images: true, // Include related images
            },
        });
        
        // Log the discounted products to the console
        console.log('Discounted Products:', discountedProducts);

        return NextResponse.json({ data: discountedProducts, status: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch discounted products', error: error.message, status: false }, { status: 500 });
    }
}
