import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const authToken = request.cookies.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = jwt.verify(authToken, process.env.JWT_KEY);
    console.log("Current user ID:", data.id); // Log the user ID in the terminal

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
