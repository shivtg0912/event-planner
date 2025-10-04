import EventForm from '../../../components/events/EventForm';

export default function CreateEventPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
}