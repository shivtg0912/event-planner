
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { EventType } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '../lib/prisma';
import EventFilters from './EventFilters';


import { Prisma } from '@prisma/client';

async function getEvents({ 
  userId, 
  take, 
  skip, 
  eventType, 
  location, 
  search, 
  sortBy, 
  sortOrder 
}: { 
  userId: string; 
  take: number; 
  skip: number; 
  eventType?: EventType | null; 
  location?: string | null; 
  search?: string | null; 
  sortBy?: string | null; 
  sortOrder?: string | null; 
}) {
  if (!userId) return { events: [], total: 0 };

  const where: Prisma.EventWhereInput = { userId };
  if (eventType) where.eventType = eventType;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) where.eventName = { contains: search, mode: 'insensitive' };

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

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    page?: string; 
    eventType?: EventType; 
    location?: string; 
    search?: string; 
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
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">You need to be signed in to view this page.</p>
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
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Events</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create New Event
          </Link>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Sign Out
            </button>
          </form>
        </div>
      </div>
      <EventFilters initialEvents={events} initialTotal={total} />
    </div>
  );
}
