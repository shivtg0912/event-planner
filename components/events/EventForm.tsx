
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
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setDescription(event.description || '');
    } else {
      const now = new Date();
      setEventName('New Event');
      setEventType(EventType.CONFERENCE);
      setEventDate(now.toISOString().split('T')[0]);
      setEventTime(now.toTimeString().substring(0, 5));
      setLocation('Online');
      setDescription('');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!eventName || !eventType || !eventDate) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Create a date object in the user's local timezone
      const [year, month, day] = eventDate.split('-').map(Number);
      const [hours, minutes] = eventTime ? eventTime.split(':').map(Number) : [0, 0];
      
      // Create date in local timezone
      const localDate = new Date(year, month - 1, day, hours, minutes);
      
      // Convert to ISO string (this will be in UTC, but we'll store the ISO string)
      const eventDateTime = localDate.toISOString();
      const eventTimeDateTime = localDate.toISOString();

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
          location,
          description 
        }),
      });

      if (res.ok) {
        router.push(event ? `/dashboard/event/${event.id}` : '/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An error occurred while submitting the form');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {event ? 'Edit Event' : 'Create New Event'}
              </h1>
              <div className="text-white/80">
                Fill in the details below to {event ? 'update' : 'create'} your event
              </div>
            </div>

            {/* Form Section */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Event Name */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="eventName" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Event Name
                      </label>
                      <input
                        type="text"
                        id="eventName"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                        className="w-full text-lg font-semibold text-gray-900 border-0 border-b-2 border-gray-200 bg-transparent focus:border-blue-600 focus:ring-0 px-0 py-2"
                        placeholder="Enter event name"
                      />
                    </div>
                  </div>

                  {/* Event Type */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="eventType" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Event Type
                      </label>
                      <select
                        id="eventType"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventType)}
                        required
                        className="w-full text-lg font-semibold text-gray-900 border-0 border-b-2 border-gray-200 bg-transparent focus:border-blue-600 focus:ring-0 px-0 py-2"
                      >
                        {Object.values(EventType).map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="eventDate" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full text-lg font-semibold text-gray-900 border-0 border-b-2 border-gray-200 bg-transparent focus:border-blue-600 focus:ring-0 px-0 py-2"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="eventTime" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Time (Optional)
                      </label>
                      <input
                        type="time"
                        id="eventTime"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full text-lg font-semibold text-gray-900 border-0 border-b-2 border-gray-200 bg-transparent focus:border-blue-600 focus:ring-0 px-0 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="location" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full text-lg font-semibold text-gray-900 border-0 border-b-2 border-gray-200 bg-transparent focus:border-blue-600 focus:ring-0 px-0 py-2"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label htmlFor="description" className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full text-lg font-medium text-gray-900 border-2 border-gray-200 rounded-lg bg-transparent focus:border-blue-600 focus:ring-0 px-3 py-2 resize-none"
                        placeholder="Add a description for your event..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-8 py-4 bg-red-50 border-t border-red-200">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Actions Section */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {event ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {event ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => router.push(event ? `/dashboard/event/${event.id}` : '/dashboard')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
