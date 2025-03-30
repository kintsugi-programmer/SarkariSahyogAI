// app/api/schemes/route.ts

import connectToDatabase from '@/lib/mongoose';
import Scheme from '@/models/Scheme';
import { NextResponse } from 'next/server';

// Create a scheme
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const newScheme = await Scheme.create(body);

    return NextResponse.json({ success: true, data: newScheme });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Get all schemes
export async function GET() {
  try {
    await connectToDatabase();

    const allSchemes = await Scheme.find();

    return NextResponse.json({ success: true, data: allSchemes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
