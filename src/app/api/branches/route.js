import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, city, address } = data;
    const newBranch = await prisma.Branches.create({
      data: {
        title,
        city,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newBranch);
  } catch (error) {
    console.error('Error creating branch', error);
    return NextResponse.json(
      {
        message: 'Failed to create branch',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const branches = await prisma.Branches.findMany();
    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch branches',
        status: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
