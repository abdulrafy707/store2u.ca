import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';
// GET request to fetch a specific slider by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const slider = await prisma.slider.findUnique({ where: { id } });
    if (slider) {
      return NextResponse.json(slider);
    } else {
      return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT request to update a specific slider by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { imgurl, link } = body;
    const updatedSlider = await prisma.slider.update({
      where: { id: id },
      data: { imgurl, link },
    });
    return NextResponse.json(updatedSlider);
  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE request to delete a specific slider by ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.slider.delete({ where: { id } });
    return NextResponse.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
