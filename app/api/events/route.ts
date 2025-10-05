
import { Prisma, EventType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';

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

    // Validate and parse dates
    const parsedEventDate = new Date(eventDate);
    const parsedEventTime = eventTime ? new Date(eventTime) : parsedEventDate;

    // Check if dates are valid
    if (isNaN(parsedEventDate.getTime())) {
      return NextResponse.json({ error: 'Invalid eventDate format' }, { status: 400 });
    }

    if (eventTime && isNaN(parsedEventTime.getTime())) {
      return NextResponse.json({ error: 'Invalid eventTime format' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        eventName,
        eventType,
        eventDate: parsedEventDate,
        eventTime: parsedEventTime,
        location,
        userId: session.user.id,
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
    const sortBy = searchParams.get('sortBy') || 'eventDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    const where: Prisma.EventWhereInput = {
      userId: session.user.id,
    };

    if (eventType) {
      where.eventType = eventType;
    }

    if (location) {
      where.location = { 
        contains: location, 
        mode: 'insensitive' 
      };
    }

    if (search) {
      where.eventName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.EventOrderByWithRelationInput = {};
    if (sortBy) {
      (orderBy as Record<string, unknown>)[sortBy] = sortOrder;
    }

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        orderBy,
        take,
        skip,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({ events, total });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
