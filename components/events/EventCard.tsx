
'use client'

import { Event } from '@prisma/client';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(new Date(event.eventDate).toLocaleDateString());
  }, [event.eventDate]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <div className="border shadow-md rounded-lg p-4 bg-white relative">
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-full hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push(`/dashboard/event/${event.id}`)}
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    View
                  </button>
                )}
              </Menu.Item>
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
      <p className="text-gray-600 mb-2">{formattedDate}</p>
      <p className="text-gray-600">{event.location}</p>
    </div>
  );
}
