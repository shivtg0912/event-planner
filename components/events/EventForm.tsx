
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event, EventType } from '@prisma/client';

interface EventFormProps {
  event?: Event;
}

export default function EventForm({ event }: EventFormProps) {
  const [eventName, setEventName] = useState(event ? '' : 'New Event');
  const [eventType, setEventType] = useState<EventType>(EventType.CONFERENCE);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState(event ? '' : 'Online');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.eventDate);
      const eventTime = new Date(event.eventTime);

      setEventName(event.eventName);
      setEventType(event.eventType);
      setEventDate(eventDate.toISOString().split('T')[0]);
      setEventTime(eventTime.toTimeString().substring(0, 5));
      setLocation(event.location);
    } else {
      const now = new Date();
      setEventName('New Event');
      setEventType(EventType.CONFERENCE);
      setEventDate(now.toISOString().split('T')[0]);
      setEventTime(now.toTimeString().substring(0, 5));
      setLocation('Online');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!eventName || !eventType || !eventDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Combine date and time into proper datetime strings
    const eventDateTime = eventDate ? (eventTime ? `${eventDate}T${eventTime}:00.000Z` : `${eventDate}T00:00:00.000Z`) : null;
    const eventTimeDateTime = eventDate ? (eventTime ? `${eventDate}T${eventTime}:00.000Z` : `${eventDate}T00:00:00.000Z`) : null;

    const res = await fetch(event ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${event.id}` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
      method: event ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        eventName, 
        eventType, 
        eventDate: eventDateTime, 
        eventTime: eventTimeDateTime, 
        location 
      }),
    });

    if (res.ok) {
      router.push(event ? `/dashboard/event/${event.id}` : '/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">Event Name</label>
        <input
          type="text"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eventType" className="block text-gray-700 font-bold mb-2">Event Type</label>
        <select
          id="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {Object.values(EventType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="eventDate" className="block text-gray-700 font-bold mb-2">Event Date</label>
        <input
          type="date"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eventTime" className="block text-gray-700 font-bold mb-2">Event Time (Optional)</label>
        <input
          type="time"
          id="eventTime"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.push(event ? `/dashboard/event/${event.id}` : '/dashboard')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
