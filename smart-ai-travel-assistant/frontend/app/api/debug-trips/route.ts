import { NextResponse } from 'next/server';
import { trips } from '@/lib/mockData';

export async function GET() {
    return NextResponse.json({
        count: trips.length,
        ids: trips.map(t => t.id),
        first: trips[0],
        last: trips[trips.length - 1]
    });
}
