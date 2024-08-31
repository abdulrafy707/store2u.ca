import { NextResponse } from 'next/server';
import prisma from '../../util/prisma'; // Ensure the path is correct

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch settings',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { deliveryCharge, taxPercentage, other1, other2 } = data;

    const newSetting = await prisma.settings.create({
      data: {
        deliveryCharge: parseFloat(deliveryCharge),
        taxPercentage: parseFloat(taxPercentage),
        other1: parseFloat(other1) || 0,
        other2: parseFloat(other2) || 0,
      },
    });

    return NextResponse.json(newSetting);
  } catch (error) {
    console.error('Error creating settings:', error);
    return NextResponse.json(
      {
        message: 'Failed to create settings',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { deliveryCharge, taxPercentage, other1, other2 } = data;

    const updatedSetting = await prisma.settings.update({
      where: { id: parseInt(params.id) },
      data: {
        deliveryCharge: parseFloat(deliveryCharge),
        taxPercentage: parseFloat(taxPercentage),
        other1: parseFloat(other1) || 0,
        other2: parseFloat(other2) || 0,
      },
    });

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      {
        message: 'Failed to update settings',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.settings.delete({
      where: { id },
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
