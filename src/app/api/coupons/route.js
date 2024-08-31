import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
// import prisma from '../../util/prisma';
// import prisma from '@/app/util/prisma';
// import prisma from '@/util/prisma';

// Fetch all coupons
export async function GET() {
  console.log('GET request received');
  try {
    const coupons = await prisma.coupon.findMany();
    console.log('Fetched coupons:', coupons);
    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { message: 'Failed to fetch coupons', status: false, error: error.message },
      { status: 500 }
    );
  }
}

// Create a new coupon
// Create a new coupon
export async function POST(request) {
  console.log('POST request received');
  try {
    const { code, discount, expiration, isActive } = await request.json();
    console.log('Request body:', { code, discount, expiration, isActive });
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        expiration: expiration ? new Date(expiration) : null,
        isActive,
      },
    });
    console.log('Created new coupon:', newCoupon);
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { message: 'Failed to create coupon', status: false, error: error.message },
      { status: 500 }
    );
  }
}
