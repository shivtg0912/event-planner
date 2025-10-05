
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { EventType } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '../lib/prisma';
import EventFilters from './EventFilters';
import UpcomingEvents from '../../components/events/UpcomingEvents';

import { Prisma } from '@prisma/client';

async function getEvents({ 
  userId, 
  take, 
  skip, 
  eventType, 
  location, 
  search, 
  dateFilter,
  sortBy, 
  sortOrder 
}: { 
  userId: string; 
  take: number; 
  skip: number; 
  eventType?: EventType | null; 
  location?: string | null; 
  search?: string | null; 
  dateFilter?: string | null;
  sortBy?: string | null; 
  sortOrder?: string | null; 
}) {
  if (!userId) return { events: [], total: 0 };

  const where: Prisma.EventWhereInput = { userId };
  if (eventType) where.eventType = eventType;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) where.eventName = { contains: search, mode: 'insensitive' };
  
  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    where.eventDate = {
      gte: filterDate,
      lt: nextDay,
    };
  }

  const orderBy: Prisma.EventOrderByWithRelationInput = {};
  if (
    sortBy &&
    sortOrder &&
    (sortBy in Prisma.EventScalarFieldEnum)
  ) {
    orderBy[sortBy as keyof Prisma.EventOrderByWithRelationInput] = sortOrder as Prisma.SortOrder;
  }

  try {
    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        orderBy,
        take,
        skip,
      }),
      prisma.event.count({ where }),
    ]);
    return { events, total };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [], total: 0 };
  }
}

async function getTodaysEvents(userId: string) {
  if (!userId) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const events = await prisma.event.findMany({
      where: {
        userId,
        eventDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        eventTime: 'asc',
      },
    });
    return events;
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    return [];
  }
}

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    page?: string; 
    eventType?: EventType; 
    location?: string; 
    search?: string; 
    dateFilter?: string;
    sortBy?: string; 
    sortOrder?: string; 
  }> 
}) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const eventsPerPage = 9;

  if (!session || !session.user || !session.user.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-4">You need to be signed in to view this page.</p>
        <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </Link>
      </div>
    );
  }

  const { events, total } = await getEvents({
    userId: session.user.id,
    take: eventsPerPage,
    skip: (currentPage - 1) * eventsPerPage,
    eventType: resolvedSearchParams.eventType,
    location: resolvedSearchParams.location,
    search: resolvedSearchParams.search,
    dateFilter: resolvedSearchParams.dateFilter,
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  });

  const todaysEvents = await getTodaysEvents(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Events</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create New Event
          </Link>
          <Link href="/auth/signout" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Sign Out
          </Link>
        </div>
      </div>
      <UpcomingEvents events={todaysEvents} />
      <EventFilters initialEvents={events} initialTotal={total} />
    </div>
  );
}
