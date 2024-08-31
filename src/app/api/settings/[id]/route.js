import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

// Get a single setting by ID
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const setting = await prisma.settings.findFirst({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch setting',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Update a setting by ID
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const data = await request.json();
    const { deliveryCharge, taxPercentage, other1, other2 } = data;

    const updatedSetting = await prisma.settings.update({
      where: { id: parseInt(id) },
      data: {
        deliveryCharge: parseFloat(deliveryCharge),
        taxPercentage: parseFloat(taxPercentage),
        other1: parseFloat(other1) || 0,
        other2: parseFloat(other2) || 0,
      },
    });

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      {
        message: 'Failed to update setting',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Delete a setting by ID
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.settings.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete setting',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
