
import { EventType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventName, eventType, eventDate, eventTime, location } = await req.json();

    if (!eventName || !eventType || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields: eventName, eventType, and eventDate' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        eventName,
        eventType,
        eventDate: new Date(eventDate),
        eventTime: new Date(eventTime),
        location,
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    const eventType = searchParams.get('eventType') as EventType | null;

    const where: any = {
      userId: parseInt(session.user.id),
    };

    if (eventType) {
      where.eventType = eventType;
    }

    const events = await prisma.event.findMany({
      where,
      take,
      skip,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
