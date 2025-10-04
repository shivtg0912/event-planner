
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { Event } from '@prisma/client';
import Link from 'next/link';

async function getEvent(id: string, session: any) {
  if (!session) return null;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${id}`);

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const event: Event | null = await getEvent(params.id, session);

  if (!event) {
    return (
      <div className="p-8 text-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Event Not Found</h1>
        <Link href="/dashboard" className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">{event.eventName}</h1>
        <div className="grid grid-cols-2 gap-4 mb-4 text-foreground">
          <div>
            <p className="font-bold">Event Type:</p>
            <p>{event.eventType}</p>
          </div>
          <div>
            <p className="font-bold">Date:</p>
            <p>{new Date(event.eventDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-bold">Time:</p>
            <p>{new Date(event.eventTime).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="font-bold">Location:</p>
            <p>{event.location}</p>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/dashboard" className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
