import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "MONGODB_URI not found in env" },
      { status: 500 }
    );
  }

  try {
    await mongoose.connect(uri);
    return NextResponse.json({ message: "Database connected successfully!" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
