
'use client'

import { Event } from '@prisma/client';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EventCardProps {
  event: Event;
  isLastEventOnPage?: boolean;
  currentPage?: number;
}

export default function EventCard({ event, isLastEventOnPage = false, currentPage = 1 }: EventCardProps) {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [formattedTime, setFormattedTime] = useState<string | null>(null);

  useEffect(() => {
    // Format date in user's local timezone
    const eventDate = new Date(event.eventDate);
    setFormattedDate(eventDate.toLocaleDateString());
    
    // Format time in user's local timezone
    const timeDate = new Date(event.eventTime);
    const hours = timeDate.getHours().toString().padStart(2, '0');
    const minutes = timeDate.getMinutes().toString().padStart(2, '0');
    setFormattedTime(`${hours}:${minutes}`);
  }, [event.eventDate, event.eventTime]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (isLastEventOnPage && currentPage > 1) {
          const currentUrl = new URL(window.location.href);
          const searchParams = new URLSearchParams(currentUrl.search);
          searchParams.set('page', (currentPage - 1).toString());
          router.push(`/dashboard?${searchParams.toString()}`);
        } else {
          router.refresh();
        }
      }
    }
  };

  return (
    <div 
      className="border shadow-md rounded-lg p-4 bg-white relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50"
      onClick={() => router.push(`/dashboard/event/${event.id}`)}
    >
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-full hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push(`/dashboard/event/${event.id}/edit`)}
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Update
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
      <p className="text-gray-600 mb-2">{event.eventType}</p>
      <div className="flex items-center text-gray-600 mb-2">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formattedDate}
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formattedTime}
      </div>
      <div className="flex items-center text-gray-600">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {event.location}
      </div>
    </div>
  );
}
