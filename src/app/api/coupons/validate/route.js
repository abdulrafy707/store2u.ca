// Backend: api/coupons/validate.js

import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function POST(request) {
  console.log('POST request received');
  try {
    const { code } = await request.json();
    console.log('Received code for validation:', code);

    const coupon = await prisma.coupon.findUnique({
      where: { code: code },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'This coupon is not active' });
    }

    const currentDate = new Date();
    if (coupon.expiration && new Date(coupon.expiration) < currentDate) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }

    // Ensure that discount is returned correctly
    return NextResponse.json({ valid: true, discountPercentage: coupon.discount });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon' });
  }
}
