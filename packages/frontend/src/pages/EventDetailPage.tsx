import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI, eventsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { GetEventByIdResponse, GetEventRegistrationsResponse } from '@events-platform/shared';
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
    const [registrations, setRegistrations] = useState<GetEventRegistrationsResponse['data']>([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [regPage, setRegPage] = useState(1);
    const [regTotalPages, setRegTotalPages] = useState(1);
    const [regTotal, setRegTotal] = useState(0);
    const [regLimit] = useState(10);

    // Fetch registrations only for attendee list
    useEffect(() => {
        if (event && event.registrationCount > 0) {
            setLoadingRegistrations(true);
            eventsAPI.getEventRegistrations(event.id, regPage, regLimit)
                .then((res) => {
                    setRegistrations(res.data);
                    setRegTotal(res.pagination.total);
                    setRegTotalPages(res.pagination.totalPages);
                })
                .catch(() => {
                    setRegistrations([]);
                    setRegTotal(0);
                    setRegTotalPages(1);
                })
                .finally(() => setLoadingRegistrations(false));
        } else {
            setRegistrations([]);
            setRegTotal(0);
            setRegTotalPages(1);
        }
    }, [event, regPage, regLimit]);

    const isRegistered = event?.isRegistered;
    const isOrganizer = event?.organizer.id === user?.id;

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await eventsAPI.getById(id);
                setEvent(data);
                setError(null);
            } catch (err: any) {
                let message = 'Failed to load event details. Please try again later.';
                if (err.response && err.response.data && err.response.data.error) {
                    message = err.response.data.error;
                } else if (err.message) {
                    message = err.message;
                }
                setError(message);
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
            navigate('/congratulations');
        } catch (err: any) {
            let message = 'Failed to register for this event. Please try again.';
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!user || !event) return;

        try {
            setCancelingRegistration(true);
            await eventsAPI.cancelRegistration(event.id, user.id);
            // Refresh event details to update isRegistered
            const updatedEvent = await eventsAPI.getById(event.id);
            setEvent(updatedEvent);
            setError(null);
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
                await adminAPI.deleteEvent(event.id);
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
                            <Card.Title as="h2" className="mb-3 text-primary">{event.name}</Card.Title>
                            <Card.Subtitle className="mb-3 text-muted">
                                <i className="bi bi-calendar-event me-2"></i>
                                {formattedDate}
                            </Card.Subtitle>
                            <Card.Text className="mb-4" style={{ minHeight: 60 }}>{event.description}</Card.Text>
                            <Row className="mb-3">
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-tags me-1"></i>
                                    <strong>Category:</strong> {event.category}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-currency-dollar me-1"></i>
                                    <strong>Price:</strong> ${event.price}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    <strong>Venue:</strong> {event.venue}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <i className="bi bi-person me-1"></i>
                                    <strong>Organizer:</strong> {event.organizer.name} <Badge bg="secondary">{event.organizer.email}</Badge>
                                </Col>
                            </Row>
                            <div className="mb-3">
                                {event.image ? (
                                    <img src={event.image} alt={event.name} style={{ width: 360, height: 240, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 12px #0002', marginBottom: 24 }} />
                                ) : (
                                    <div style={{ width: 360, height: 240, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 24, borderRadius: 12, boxShadow: '0 2px 12px #0002', marginBottom: 24 }}>
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <strong>Attendees ({event.registrationCount}):</strong>
                                <ListGroup className="mt-2">
                                    {event.registrationCount === 0 ? (
                                        <div>No attendees yet.</div>
                                    ) : loadingRegistrations ? (
                                        <div>Loading attendees...</div>
                                    ) : (
                                        registrations.map((registration) => (
                                            <ListGroup.Item key={registration.id}>
                                                <i className="bi bi-person-circle me-2"></i>
                                                {registration.user.name} <span className="text-muted">({registration.user.email})</span>
                                            </ListGroup.Item>
                                        ))
                                    )}
                                </ListGroup>
                                {regTotalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                                        <Button size="sm" variant="outline-primary" disabled={regPage === 1} onClick={() => setRegPage(regPage - 1)}>
                                            Previous
                                        </Button>
                                        <span>Page {regPage} of {regTotalPages}</span>
                                        <Button size="sm" variant="outline-primary" disabled={regPage === regTotalPages} onClick={() => setRegPage(regPage + 1)}>
                                            Next
                                        </Button>
                                    </div>
                                )}
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
                                        {user && user.role === 'admin' && (
                                            <Button
                                                variant="primary"
                                                className="me-2"
                                                onClick={() => navigate(`/admin?edit=${event.id}`)}
                                            >
                                                Edit Event
                                            </Button>
                                        )}
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