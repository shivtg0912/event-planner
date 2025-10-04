
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import EventCard from '../../components/events/EventCard';
import { Event } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '../lib/prisma';

async function getEvents(userId: string) {
  if (!userId) return [];

  try {
    const events = await prisma.event.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
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

  const events: Event[] = await getEvents(session.user.id);

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
      {events.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">You don't have any events yet.</p>
          <p className="text-gray-600">Click the button above to create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
