import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
// import prisma from "../../../util/prisma";

// GET request to fetch a specific admin user by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (admin) {
      return NextResponse.json(admin);
    } else {
      return NextResponse.json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT request to update a specific admin user by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, branch, role, email, password } = body;
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: id },
      data: { name, branch, role, email, password },
    });
    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE request to delete a specific admin user by ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
