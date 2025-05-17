import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, api, eventsAPI } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AdminGetAllEventsResponse,
    AdminCreateEventRequest,
    AdminCreateEventResponse,
    AdminUpdateEventRequest,
    AdminUpdateEventResponse,
    AdminDeleteEventResponse,
} from '@events-platform/shared';

interface ModalEventState {
    name: string;
    description: string;
    category: string;
    date: string; // 'YYYY-MM-DDTHH:mm'
    venue: string;
    price: string;
    image: string; // for preview only
    imageFile?: File | null; // for upload
}

const defaultEvent: ModalEventState = {
    name: '',
    description: '',
    category: '',
    date: '',
    venue: '',
    price: '',
    image: '',
    imageFile: null,
};

// Helper to format date string for datetime-local input
const toDatetimeLocal = (date: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [events, setEvents] = useState<AdminGetAllEventsResponse['data']>([]);
    const [pagination, setPagination] = useState<AdminGetAllEventsResponse['pagination'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalEvent, setModalEvent] = useState<ModalEventState>(defaultEvent);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [saving, setSaving] = useState(false);
    const [editEventId, setEditEventId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const limit = 10;

    // Initialize page from URL param (only on first render)
    const getInitialPage = () => {
        const params = new URLSearchParams(window.location.search);
        const pageParam = parseInt(params.get('page') || '1', 10);
        return isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    };
    const [page, setPage] = useState(getInitialPage);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await adminAPI.getAll(page, limit, debouncedSearch);
                setEvents(data.data);
                setPagination(data.pagination);
            } catch (err: any) {
                let message = 'Failed to fetch events';
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const editId = params.get('edit');
        if (editId && events.length > 0) {
            const event = events.find(e => e.id === editId);
            if (event && !showModal) {
                setModalEvent({
                    name: event.name,
                    description: event.description,
                    category: event.category,
                    date: toDatetimeLocal(event.date),
                    venue: event.venue,
                    price: event.price.toString(),
                    image: event.image,
                    imageFile: null,
                });
                setEditEventId(event.id);
                setModalType('edit');
                setShowModal(true);
            }
        }
    }, [location.search, events]);

    // Only update state from URL if the param actually changes (avoid infinite loop)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageParam = parseInt(params.get('page') || '1', 10);
        if (pageParam !== page && !isNaN(pageParam) && pageParam > 0) {
            setPage(pageParam);
        }
        // eslint-disable-next-line
    }, [location.search]);

    // Update URL when page changes (but not on first mount)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (page !== parseInt(params.get('page') || '1', 10)) {
            params.set('page', String(page));
            navigate({ search: params.toString() }, { replace: true });
        }
        // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleShowCreate = () => {
        setModalEvent(defaultEvent);
        setModalType('create');
        setShowModal(true);
    };

    const handleShowEdit = (event: AdminGetAllEventsResponse['data'][number]) => {
        setModalEvent({
            name: event.name,
            description: event.description,
            category: event.category,
            date: toDatetimeLocal(event.date),
            venue: event.venue,
            price: event.price.toString(),
            image: event.image,
            imageFile: null,
        });
        setEditEventId(event.id);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await adminAPI.deleteEvent(id);
            setEvents(events.filter(e => e.id !== id));
        } catch (err: any) {
            let message = 'Failed to delete event';
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
        }
    };

    const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === 'file' && files && files.length > 0) {
            setModalEvent(ev => ({ ...ev, imageFile: files[0], image: URL.createObjectURL(files[0]) }));
        } else {
            setModalEvent(ev => ({ ...ev, [name]: value }));
        }
    };

    const handleModalSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (modalType === 'create') {
                const eventData = {
                    name: modalEvent.name,
                    description: modalEvent.description,
                    category: modalEvent.category,
                    date: new Date(modalEvent.date).toISOString(),
                    venue: modalEvent.venue,
                    price: Number(modalEvent.price),
                };
                const data = await adminAPI.createEvent(eventData);
                if (modalEvent.imageFile) {
                    const imgRes = await adminAPI.uploadEventImage(data.id, modalEvent.imageFile);
                    data.image = imgRes.image;
                }
                setEvents([...events, data]);
            } else {
                if (!editEventId) throw new Error('Event not found for update');
                const eventData = {
                    name: modalEvent.name,
                    description: modalEvent.description,
                    category: modalEvent.category,
                    date: new Date(modalEvent.date).toISOString(),
                    venue: modalEvent.venue,
                    price: Number(modalEvent.price)
                };
                const data = await adminAPI.updateEvent(editEventId, eventData);
                if (modalEvent.imageFile) {
                    const imgRes = await adminAPI.uploadEventImage(editEventId, modalEvent.imageFile);
                    data.image = imgRes.image;
                }
                setEvents(events.map(e => (e.id === editEventId ? data : e)));
            }
            setShowModal(false);
            setEditEventId(null);
            setModalEvent(defaultEvent);
        } catch (err: any) {
            let message = 'Failed to save event';
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            }
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    // Access control check AFTER all hooks
    if (!user || user.role !== 'admin') {
        return (
            <Container className="py-5">
                <Alert variant="danger">Access denied. Admins only.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4">Admin Panel</h1>
            <div className="mb-4 d-flex justify-content-center">
                <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control w-auto"
                    style={{ minWidth: 240 }}
                    placeholder="Search events by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onBlur={e => {
                        setTimeout(() => {
                            if (document.activeElement !== searchInputRef.current && searchInputRef.current) {
                                searchInputRef.current.focus();
                            }
                        }, 0);
                    }}
                />
            </div>
            <Button variant="success" className="mb-3" onClick={handleShowCreate}>Create Event</Button>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td>{event.name}</td>
                                    <td>{event.description}</td>
                                    <td>{event.category}</td>
                                    <td>{new Date(event.date).toLocaleString()}</td>
                                    <td>{event.venue}</td>
                                    <td>{event.price}</td>
                                    <td>
                                        {event.image ? (
                                            <img src={event.image} alt={event.name} style={{ width: 60, height: 40, objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: 60, height: 40, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEdit(event)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {pagination && pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                            <Button variant="outline-primary" size="sm" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                                Previous
                            </Button>
                            <span>Page {pagination.page} of {pagination.totalPages}</span>
                            <Button variant="outline-primary" size="sm" disabled={page === pagination.totalPages} onClick={() => handlePageChange(page + 1)}>
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleModalSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType === 'create' ? 'Create Event' : 'Edit Event'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={modalEvent.name}
                                onChange={handleModalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={modalEvent.description}
                                onChange={handleModalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={modalEvent.category}
                                onChange={handleModalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Date & Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                value={modalEvent.date}
                                onChange={handleModalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="venue">
                            <Form.Label>Venue</Form.Label>
                            <Form.Control
                                type="text"
                                name="venue"
                                value={modalEvent.venue}
                                onChange={handleModalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={modalEvent.price}
                                onChange={handleModalChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleModalChange}
                                required={false}
                            />
                            {modalEvent.image && (
                                <img src={modalEvent.image} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', marginTop: 8 }} />
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminPage;
