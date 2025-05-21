import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    await connectDB();

    interface DateQuery {
      created_time?: {
        $gte: Date;
        $lte: Date;
      };
    }
    const query: DateQuery = {};
    if (fromDate && toDate) {
      query.created_time = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    console.log('Query:', query);

    const users = await User.find(query).select('name email created_time');
    console.log('Users:', users);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
} 