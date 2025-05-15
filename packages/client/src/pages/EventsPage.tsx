import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { api } from '../services/api';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizer: {
        id: string;
        name: string;
        email: string;
    };
    _count: {
        registrations: number;
    };
}

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await api.get('/events');
                setEvents(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No events found. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            description={event.description}
                            date={event.date}
                            location={event.location}
                            organizerName={event.organizer.name}
                            registrationCount={event._count.registrations}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;