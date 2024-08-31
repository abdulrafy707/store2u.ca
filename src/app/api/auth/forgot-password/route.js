import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../../../util/sendResetPasswordEmail';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Check if the email exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'No user found with this email address.', status: false }, { status: 404 });
    }

    // Generate a reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token valid for 1 hour

    // Update user with reset token and expiration
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send the reset password email
    await sendResetPasswordEmail(user.email, resetToken);

    return NextResponse.json({ message: 'Password reset email sent.', status: true });
  } catch (error) {
    console.error('Error during forgot password:', error);
    return NextResponse.json({ message: 'Failed to process request.', status: false }, { status: 500 });
  }
}
