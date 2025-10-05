'use client'

import { Event } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter events that are today and haven't passed yet
    const todaysUpcoming = events.filter(event => {
      const eventDate = new Date(event.eventDate);
      const eventTime = new Date(event.eventTime);
      
      // Check if event is today
      const isToday = eventDate >= today && eventDate < tomorrow;
      
      // Check if event time hasn't passed yet
      const eventDateTime = new Date(eventDate);
      eventDateTime.setHours(eventTime.getHours(), eventTime.getMinutes(), 0, 0);
      const hasNotPassed = eventDateTime > now;
      
      return isToday && hasNotPassed;
    }).sort((a, b) => {
      // Sort by time
      return new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime();
    });

    setUpcomingEvents(todaysUpcoming);
  }, [events, currentTime]);

  if (upcomingEvents.length === 0) {
    return null;
  }

  const formatTimeRemaining = (eventTime: Date) => {
    const now = new Date();
    const event = new Date(eventTime);
    const diff = event.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes}m`;
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden border border-blue-100">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-blue-100/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Today</h2>
              <p className="text-sm text-gray-600">Events starting soon</p>
            </div>
            <span className="ml-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {upcomingEvents.length}
            </span>
          </div>
          <button 
            className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <svg 
              className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {isExpanded && (
          <div className="px-6 pb-6 space-y-3">
          {upcomingEvents.map((event) => {
            const eventTime = new Date(event.eventTime);
            const hours = eventTime.getHours().toString().padStart(2, '0');
            const minutes = eventTime.getMinutes().toString().padStart(2, '0');
            
            return (
              <div
                key={event.id}
                onClick={() => router.push(`/dashboard/event/${event.id}`)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-blue-600 mr-3">
                        {hours}:{minutes}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.eventName}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mr-2">
                            {event.eventType}
                          </span>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {formatTimeRemaining(eventTime)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
