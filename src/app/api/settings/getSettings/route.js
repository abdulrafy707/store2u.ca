import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return NextResponse.json({ message: 'Settings not found' }, { status: 404 });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Failed to fetch settings', error: error.message }, { status: 500 });
  }
}
