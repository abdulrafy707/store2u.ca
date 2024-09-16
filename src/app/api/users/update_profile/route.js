// import prisma from '../../../util/prisma';
import prisma from '@/app/util/prisma';
// import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const data = await request.json();
    const { name, phoneno, city } = data;

    if (!name || !phoneno || !city) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: 1 }, // Replace with user ID logic
      data: { name, phoneno, city, updatedAt: new Date() },
    });

    return NextResponse.json({
      status: true,
      message: 'Profile updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', status: false },
      { status: 500 }
    );
  }
}
