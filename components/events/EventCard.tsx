
'use client'

import { Event } from '@prisma/client';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border shadow-md rounded-lg p-4 bg-white">
      <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
      <p className="text-gray-600 mb-2">{event.eventType}</p>
      <p className="text-gray-600 mb-2">{new Date(event.eventDate).toLocaleDateString()}</p>
      <p className="text-gray-600">{event.location}</p>
    </div>
  );
}
