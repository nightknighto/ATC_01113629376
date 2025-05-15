import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, api, eventsAPI } from '../services/api';
import {
    AdminGetAllEventsResponse,
    AdminCreateEventRequest,
    AdminCreateEventResponse,
    AdminUpdateEventRequest,
    AdminUpdateEventResponse,
    AdminDeleteEventResponse,
} from '@events-platform/shared';

// Modal state type uses string for date
interface ModalEventState {
    title: string;
    description: string;
    date: string; // 'YYYY-MM-DDTHH:mm'
    location: string;
}

const defaultEvent: ModalEventState = {
    title: '',
    description: '',
    date: '',
    location: '',
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

    // Show non-authorized message if not logged in or not admin
    if (!user || user.role !== 'admin') {
        return (
            <Container className="py-5">
                <Alert variant="danger">Access denied. Admins only.</Alert>
            </Container>
        );
    }

    const [events, setEvents] = useState<AdminGetAllEventsResponse>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalEvent, setModalEvent] = useState<ModalEventState>(defaultEvent);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [saving, setSaving] = useState(false);
    const [editEventId, setEditEventId] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await eventsAPI.getAll();
            setEvents(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleShowCreate = () => {
        setModalEvent(defaultEvent);
        setModalType('create');
        setShowModal(true);
    };

    const handleShowEdit = (event: AdminGetAllEventsResponse[number]) => {
        setModalEvent({
            title: event.title,
            description: event.description,
            date: toDatetimeLocal(event.date),
            location: event.location,
        });
        setEditEventId(event.id); // Track the id of the event being edited
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
            setError(err.message || 'Failed to delete event');
        }
    };

    const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModalEvent({ ...modalEvent, [e.target.name]: e.target.value });
    };

    const handleModalSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            // Convert modalEvent to DTO type (date as Date)
            const eventData = {
                ...modalEvent,
                date: new Date(modalEvent.date),
            };
            if (modalType === 'create') {
                const data = await adminAPI.createEvent(eventData);
                setEvents([...events, data]);
            } else {
                if (!editEventId) throw new Error('Event not found for update');
                const data = await adminAPI.updateEvent(editEventId, eventData);
                setEvents(events.map(e => (e.id === editEventId ? data : e)));
            }
            setShowModal(false);
            setEditEventId(null);
        } catch (err: any) {
            setError(err.message || 'Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="py-5">
            <h1 className="mb-4">Admin Panel</h1>
            <Button variant="success" className="mb-3" onClick={handleShowCreate}>Create Event</Button>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{event.description}</td>
                                <td>{new Date(event.date).toLocaleString()}</td>
                                <td>{event.location}</td>
                                <td>
                                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEdit(event)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleModalSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType === 'create' ? 'Create Event' : 'Edit Event'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={modalEvent.title}
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
                        <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={modalEvent.location}
                                onChange={handleModalChange}
                                required
                            />
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
