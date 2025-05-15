import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { api, eventsAPI } from '../services/api';
import { GetAllEventsResponse } from '@events-platform/shared';
import { useAuth } from '../contexts/AuthContext';

const EventsPage: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<GetAllEventsResponse>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await eventsAPI.getAll();
                setEvents(data);
                setError(null);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleBook = async (eventId: string) => {
        if (!user) return;
        setBooking(eventId);
        try {
            await eventsAPI.register(eventId, user.id);
            // Refresh events after booking
            const data = await eventsAPI.getAll();
            setEvents(data);
        } catch (err) {
            setError('Failed to book event. Please try again.');
        } finally {
            setBooking(null);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-center">Upcoming Events</h1>
            {events.length === 0 ? (
                <Alert variant="info" className="text-center">No events found. Check back later!</Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {events.map(event => {
                        const isOrganizer = user && event.organizer.id === user.id;
                        const isRegistered = user && event.registrations.some(r => r.user.id === user.id);
                        return (
                            <Col key={event.id}>
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body>
                                        <Card.Title className="mb-2">{event.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            {new Date(event.date).toLocaleString()}
                                        </Card.Subtitle>
                                        <Card.Text className="mb-3" style={{ minHeight: 60 }}>{event.description}</Card.Text>
                                        <div className="mb-2">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            <strong>Location:</strong> {event.location}
                                        </div>
                                        <div className="mb-2">
                                            <i className="bi bi-person me-1"></i>
                                            <strong>Organizer:</strong> {event.organizer.name}
                                        </div>
                                        <div className="mb-3">
                                            <i className="bi bi-people me-1"></i>
                                            <strong>Registrations:</strong> {event.registrations.length}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button variant="primary" href={`/events/${event.id}`}>View Details</Button>
                                            {user && (
                                                isOrganizer ? (
                                                    <Badge bg="info" className="align-self-center">Organized by you</Badge>
                                                ) : isRegistered ? (
                                                    <Badge bg="success" className="align-self-center">Booked</Badge>
                                                ) : (
                                                    <Button
                                                        variant="success"
                                                        disabled={booking === event.id}
                                                        onClick={() => handleBook(event.id)}
                                                    >
                                                        {booking === event.id ? 'Booking...' : 'Book Now'}
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default EventsPage;