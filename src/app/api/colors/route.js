import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function GET() {
  try {
    const colors = await prisma.color.findMany();
    return NextResponse.json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch colors', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const newColor = await prisma.color.create({
      data: { name },
    });
    return NextResponse.json(newColor, { status: 201 });
  } catch (error) {
    console.error('Error creating color:', error);
    return NextResponse.json(
      { message: 'Failed to create color', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name } = await request.json();
    const updatedColor = await prisma.color.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    return NextResponse.json(updatedColor);
  } catch (error) {
    console.error('Error updating color:', error);
    return NextResponse.json(
      { message: 'Failed to update color', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.color.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error('Error deleting color:', error);
    return NextResponse.json(
      { message: 'Failed to delete color', error: error.message },
      { status: 500 }
    );
  }
}
