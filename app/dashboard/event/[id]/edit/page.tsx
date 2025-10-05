'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Event } from '@prisma/client';
import EventForm from '../../../../../components/events/EventForm';

export default function EditEventPage() {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const eventData: Event = await res.json();
        setEvent(eventData);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8"></h1>
      {event && <EventForm event={event} />}
    </div>
  );
}