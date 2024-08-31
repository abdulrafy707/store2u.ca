import { NextResponse } from 'next/server';
// import prisma from '../../../util/prisma';
import prisma from '../../util/prisma';

// POST request to create a new admin user
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, branch, role, email, password } = body;
    const newAdmin = await prisma.adminUser.create({
      data: {
        name,
        branch,
        role,
        email,
        password,
      },
    });

    return NextResponse.json(newAdmin);
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      {
        message: 'Failed to create admin user',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all admin users
export async function GET() {
  try {
    const admins = await prisma.adminUser.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch admin users',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
