
'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Event, EventType } from '@prisma/client';
import EventCard from '../../components/events/EventCard';

import { useDebounce } from '../hooks/useDebounce';

interface EventFiltersProps {
  initialEvents?: Event[];
  initialTotal?: number;
}

export default function EventFilters({ initialEvents, initialTotal }: EventFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [isLoading, setIsLoading] = useState(false);

  const [eventType, setEventType] = useState(searchParams.get('eventType') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('dateFilter') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'eventDate');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');

  const debouncedSearch = useDebounce(search, 500);
  const debouncedLocation = useDebounce(location, 500);

  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef({ eventType, location: debouncedLocation, search: debouncedSearch, dateFilter, sortBy, sortOrder });

  // Update state when initialEvents change (e.g., on page refresh)
  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
    }
    if (initialTotal !== undefined) {
      setTotal(initialTotal);
    }
  }, [initialEvents, initialTotal]);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevFiltersRef.current = { eventType, location: debouncedLocation, search: debouncedSearch, dateFilter, sortBy, sortOrder };
      return;
    }

    // Check if filters actually changed
    const filtersChanged = 
      prevFiltersRef.current.eventType !== eventType ||
      prevFiltersRef.current.location !== debouncedLocation ||
      prevFiltersRef.current.search !== debouncedSearch ||
      prevFiltersRef.current.dateFilter !== dateFilter ||
      prevFiltersRef.current.sortBy !== sortBy ||
      prevFiltersRef.current.sortOrder !== sortOrder;

    if (!filtersChanged) {
      return;
    }

    prevFiltersRef.current = { eventType, location: debouncedLocation, search: debouncedSearch, dateFilter, sortBy, sortOrder };

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('eventType', eventType);
        params.set('location', debouncedLocation);
        params.set('search', debouncedSearch);
        params.set('dateFilter', dateFilter);
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);

        const res = await fetch(`/api/events?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
          setTotal(data.total || 0);
        } else {
          console.error('Failed to fetch events');
          setEvents([]);
          setTotal(0);
        }
        router.replace(`/dashboard?${params.toString()}`);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, debouncedLocation, debouncedSearch, dateFilter, sortBy, sortOrder]);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const eventsPerPage = 9;
  const totalPages = Math.ceil(total / eventsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by event name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">All Event Types</option>
          {Object.values(EventType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear date filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="eventDate">Date</option>
            <option value="location">Location</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="shadow border rounded px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:shadow-outline transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">Loading events...</p>
        </div>
      ) : !events || events.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">No events found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isLastEventOnPage={events.length === 1}
                currentPage={currentPage}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (currentPage - 1).toString());
                router.push(`/dashboard?${params.toString()}`);
              }}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-4 self-center text-gray-900">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (currentPage + 1).toString());
                router.push(`/dashboard?${params.toString()}`);
              }}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
