import { NextResponse } from 'next/server';
// import prisma from '../../../util/prisma';
import prisma from '@/app/util/prisma';
// import prisma from '@/util/prisma';

// Fetch a single coupon by ID
export async function GET(request, { params }) {
  console.log('GET request received');
  try {
    const id = parseInt(params.id, 10);

    if (!id) {
      return NextResponse.json(
        { message: 'Coupon ID is required', status: false },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json(
        { message: 'Coupon not found', status: false },
        { status: 404 }
      );
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { message: 'Failed to fetch coupon', status: false, error: error.message },
      { status: 500 }
    );
  }
}

// Update an existing coupon
export async function PUT(request, { params }) {
  console.log('PUT request received');
  try {
    const id = parseInt(params.id, 10);
    const { code, discount, expiration, isActive } = await request.json();
    console.log('Request body:', { code, discount, expiration, isActive });
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discount,
        expiration: expiration ? new Date(expiration) : null,
        isActive,
      },
    });
    console.log('Updated coupon:', updatedCoupon);
    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { message: 'Failed to update coupon', status: false, error: error.message },
      { status: 500 }
    );
  }
}

// Delete a coupon
export async function DELETE(request, { params }) {
  console.log('DELETE request received');
  try {
    const id = parseInt(params.id, 10);

    await prisma.coupon.delete({
      where: { id },
    });

    console.log('Deleted coupon with ID:', id);
    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { message: 'Failed to delete coupon', status: false, error: error.message },
      { status: 500 }
    );
  }
}
