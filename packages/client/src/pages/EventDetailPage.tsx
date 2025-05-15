import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface EventDetail {
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
    registrations: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }[];
}

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);
    const [cancelingRegistration, setCancelingRegistration] = useState(false);

    const isRegistered = event?.registrations.some(
        (registration) => registration.user.id === user?.id
    );

    const isOrganizer = event?.organizer.id === user?.id;

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await eventsAPI.getById(id);
                setEvent(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleRegister = async () => {
        if (!user || !event) return;

        try {
            setRegistering(true);
            await eventsAPI.register(event.id, user.id);
            // Refresh event data to update registrations
            const updatedEvent = await eventsAPI.getById(event.id);
            setEvent(updatedEvent);
        } catch (err) {
            console.error('Error registering for event:', err);
            setError('Failed to register for this event. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!user || !event) return;

        try {
            setCancelingRegistration(true);
            await eventsAPI.cancelRegistration(event.id, user.id);
            // Refresh event data to update registrations
            const updatedEvent = await eventsAPI.getById(event.id);
            setEvent(updatedEvent);
        } catch (err) {
            console.error('Error canceling registration:', err);
            setError('Failed to cancel registration. Please try again.');
        } finally {
            setCancelingRegistration(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!event || !isOrganizer) return;

        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await eventsAPI.delete(event.id);
                navigate('/events');
            } catch (err) {
                console.error('Error deleting event:', err);
                setError('Failed to delete event. Please try again.');
            }
        }
    };

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

    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Event not found.</p>
            </div>
        );
    }

    // Format date for display
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>

                    <div className="flex flex-col md:flex-row md:justify-between mb-6">
                        <div className="flex flex-col space-y-2 text-gray-600 mb-4 md:mb-0">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Organized by {event.organizer.name}</span>
                            </div>
                        </div>

                        {user && (
                            <div className="flex space-x-2">
                                {!isRegistered ? (
                                    <button
                                        onClick={handleRegister}
                                        disabled={registering || isOrganizer}
                                        className={`px-4 py-2 rounded font-medium ${isOrganizer ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {registering ? 'Registering...' : isOrganizer ? 'You are the organizer' : 'Register for Event'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancelRegistration}
                                        disabled={cancelingRegistration}
                                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded"
                                    >
                                        {cancelingRegistration ? 'Canceling...' : 'Cancel Registration'}
                                    </button>
                                )}

                                {isOrganizer && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/events/${event.id}/edit`)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded"
                                        >
                                            Edit Event
                                        </button>
                                        <button
                                            onClick={handleDeleteEvent}
                                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded"
                                        >
                                            Delete Event
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">About this event</h2>
                        <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Attendees ({event.registrations.length})
                        </h2>
                        {event.registrations.length === 0 ? (
                            <p className="text-gray-600">No one has registered for this event yet.</p>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {event.registrations.map((registration) => (
                                    <li key={registration.id} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="font-medium">{registration.user.name}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;