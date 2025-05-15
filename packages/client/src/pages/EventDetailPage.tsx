import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { GetEventByIdResponse } from '@events-platform/shared';
import { Card, Button, Container, Row, Col, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState<GetEventByIdResponse | null>(null);
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

    if (!event) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="info">Event not found.</Alert>
            </Container>
        );
    }

    const formattedDate = new Date(event.date).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg border-0">
                        <Card.Body>
                            <Card.Title as="h2" className="mb-3 text-primary">{event.title}</Card.Title>
                            <Card.Subtitle className="mb-3 text-muted">
                                <i className="bi bi-calendar-event me-2"></i>
                                {formattedDate}
                            </Card.Subtitle>
                            <Card.Text className="mb-4" style={{ minHeight: 60 }}>{event.description}</Card.Text>
                            <Row className="mb-3">
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    <strong>Location:</strong> {event.location}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-person me-1"></i>
                                    <strong>Organizer:</strong> {event.organizer.name} <Badge bg="secondary">{event.organizer.email}</Badge>
                                </Col>
                            </Row>
                            <div className="mb-4">
                                <strong>Attendees ({event.registrations.length}):</strong>
                                <ListGroup className="mt-2">
                                    {event.registrations.length === 0 ? (
                                        <ListGroup.Item>No one has registered for this event yet.</ListGroup.Item>
                                    ) : (
                                        event.registrations.map((registration) => (
                                            <ListGroup.Item key={registration.id}>
                                                <i className="bi bi-person-circle me-2"></i>
                                                {registration.user.name} <span className="text-muted">({registration.user.email})</span>
                                            </ListGroup.Item>
                                        ))
                                    )}
                                </ListGroup>
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                {!isOrganizer && !isRegistered && user && (
                                    <Button variant="success" onClick={handleRegister} disabled={registering}>
                                        {registering ? 'Registering...' : 'Register for Event'}
                                    </Button>
                                )}
                                {!isOrganizer && isRegistered && user && (
                                    <Button variant="danger" onClick={handleCancelRegistration} disabled={cancelingRegistration}>
                                        {cancelingRegistration ? 'Canceling...' : 'Cancel Registration'}
                                    </Button>
                                )}
                                {isOrganizer && (
                                    <>
                                        <Button variant="warning" onClick={() => navigate(`/events/${event.id}/edit`)}>
                                            Edit Event
                                        </Button>
                                        <Button variant="danger" onClick={handleDeleteEvent}>
                                            Delete Event
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EventDetailPage;