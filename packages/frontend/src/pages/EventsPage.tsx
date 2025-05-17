import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, eventsAPI } from '../services/api';
import { GetAllEventsResponse } from '@events-platform/shared';
import { useAuth } from '../contexts/AuthContext';

const EventsPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    // Initialize page from URL param (only on first render)
    const getInitialPage = () => {
        const params = new URLSearchParams(window.location.search);
        const pageParam = parseInt(params.get('page') || '1', 10);
        return isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    };
    // --- Fix: Only initialize search/page from URL on first mount ---
    const getInitialSearch = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('search') || '';
    };
    const [search, setSearch] = useState(getInitialSearch);
    const [page, setPage] = useState(getInitialPage);
    const [events, setEvents] = useState<GetAllEventsResponse['data']>([]);
    const [pagination, setPagination] = useState<GetAllEventsResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<string | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const limit = 9;

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1500); // 400ms debounce
        return () => clearTimeout(handler);
    }, [search]);

    // Only update state from URL if the param actually changes (avoid infinite loop)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageParam = parseInt(params.get('page') || '1', 10);
        // Only update page if it actually changed
        if (pageParam !== page && !isNaN(pageParam) && pageParam > 0) {
            setPage(pageParam);
        }
        // Do NOT update search here, only on first mount
        // eslint-disable-next-line
    }, [location.search]);

    // Update URL when page or search changes (but not on first mount)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let changed = false;
        if (page !== parseInt(params.get('page') || '1', 10)) {
            params.set('page', String(page));
            changed = true;
        }
        if (search !== (params.get('search') || '')) {
            params.set('search', search);
            params.set('page', "1");
            changed = true;
        }
        if (changed) {
            navigate({ search: params.toString() }, { replace: true });
        }
        // eslint-disable-next-line
    }, [page, search]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await eventsAPI.getAll(page, limit, debouncedSearch);
                setEvents(data.data);
                setPagination(data.pagination);
                setError(null);
            } catch (err: any) {
                let message = 'Failed to load events. Please try again later.';
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
        fetchEvents();
    }, [page, debouncedSearch]);

    const handleBook = async (eventId: string) => {
        if (!user) return;
        setBooking(eventId);
        try {
            await eventsAPI.register(eventId, user.id);
            setEvents(events => events.map(ev =>
                ev.id === eventId ? { ...ev, isRegistered: true } : ev
            ));
            navigate('/congratulations');
        } catch (err: any) {
            let message = 'Failed to book event. Please try again.';
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
        } finally {
            setBooking(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages && newPage !== page) {
            setPage(newPage);
        }
    };

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-center">Upcoming Events</h1>
            <div className="mb-4 d-flex justify-content-center">
                <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control w-auto"
                    style={{ minWidth: 240 }}
                    placeholder="Search events by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            {error && (
                <Alert variant="danger">{error}</Alert>
            )}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" />
                </div>
            ) : events.length === 0 ? (
                <Alert variant="info" className="text-center">No events found. Check back later!</Alert>
            ) : (
                <>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {events.map(event => {
                            const isOrganizer = user && event.organizer.id === user.id;
                            const isRegistered = event.isRegistered;
                            return (
                                <Col key={event.id}>
                                    <Card className="h-100 shadow-sm border-0">
                                        <Card.Body>
                                            <Card.Title className="mb-2">{event.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {new Date(event.date).toLocaleString()}
                                            </Card.Subtitle>
                                            <Card.Text className="mb-3" style={{ minHeight: 60 }}>{event.description}</Card.Text>
                                            <div className="mb-2">
                                                <i className="bi bi-tags me-1"></i>
                                                <strong>Category:</strong> {event.category}
                                            </div>
                                            <div className="mb-2">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                <strong>Venue:</strong> {event.venue}
                                            </div>
                                            <div className="mb-2">
                                                <i className="bi bi-currency-dollar me-1"></i>
                                                <strong>Price:</strong> ${event.price}
                                            </div>
                                            <div className="mb-2">
                                                {event.image ? (
                                                    <img
                                                        src={event.image}
                                                        alt={event.name}
                                                        className="img-fluid"
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: 240,
                                                            aspectRatio: '3/2',
                                                            objectFit: 'cover',
                                                            borderRadius: 8,
                                                            boxShadow: '0 2px 8px #0001'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', maxWidth: 240, aspectRatio: '3/2', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontSize: 18, borderRadius: 8, boxShadow: '0 2px 8px #0001', border: '1px dashed #ced4da' }}>
                                                        No Image Available
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-2">
                                                <i className="bi bi-person me-1"></i>
                                                <strong>Organizer:</strong> {event.organizer.name}
                                            </div>
                                            <div className="mb-3">
                                                <i className="bi bi-people me-1"></i>
                                                <strong>Registrations:</strong> {event.registrationCount}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button variant="primary" href={`/events/${event.id}`}>View Details</Button>
                                                {user && (
                                                    isOrganizer ? (
                                                        <Badge bg="info" className="align-self-center d-flex justify-content-center align-items-center" style={{ height: '38px', minWidth: '120px', fontWeight: 500, fontSize: '1rem' }}>
                                                            Organized by you
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            variant={isRegistered ? 'success' : 'primary'}
                                                            className="w-auto d-flex justify-content-center align-items-center"
                                                            style={{ minWidth: '120px', height: '38px', fontWeight: 500, fontSize: '1rem' }}
                                                            disabled={isRegistered || booking === event.id}
                                                            onClick={() => handleBook(event.id)}
                                                        >
                                                            {isRegistered ? 'Booked' : booking === event.id ? 'Booking...' : 'Book Now'}
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
                    {pagination && pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                            <Button variant="outline-primary" size="sm" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                                Previous
                            </Button>
                            <span>Page {page} of {pagination.totalPages}</span>
                            <Button variant="outline-primary" size="sm" type='button' disabled={page === pagination.totalPages} onClick={() => handlePageChange(page + 1)}>
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default EventsPage;