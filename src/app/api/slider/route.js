import { NextResponse } from 'next/server';
import prisma from '@/app/util/prisma';// Adjust the path according to your project structure

// POST request to create a new slider
export async function POST(request) {
  try {
    const body = await request.json();
    const { imgurl, link } = body;
    const newSlider = await prisma.slider.create({
      data: {
        imgurl,
        link,
      },
    });

    return NextResponse.json(newSlider);
  } catch (error) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      {
        message: 'Failed to create slider',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all sliders
export async function GET() {
  try {
    const sliders = await prisma.slider.findMany();
    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch sliders',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
