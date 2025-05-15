import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
    AdminGetAllEventsResponse,
    AdminCreateEventRequest,
    AdminCreateEventResponse,
    AdminUpdateEventRequest,
    AdminUpdateEventResponse,
    AdminDeleteEventResponse,
} from '@events-platform/shared';

const defaultEvent: AdminCreateEventRequest = {
    title: '',
    description: '',
    date: new Date(),
    location: '',
};

const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<AdminGetAllEventsResponse>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalEvent, setModalEvent] = useState<AdminCreateEventRequest>(defaultEvent);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get<AdminGetAllEventsResponse>('/admin/events');
            setEvents(res.data);
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
            date: event.date,
            location: event.location,
        });
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete<AdminDeleteEventResponse>(`/admin/events/${id}`);
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
            if (modalType === 'create') {
                const res = await api.post<AdminCreateEventResponse>('/admin/events', modalEvent);
                setEvents([...events, res.data]);
            } else {
                const eventToUpdate = events.find(e =>
                    e.title === modalEvent.title &&
                    e.description === modalEvent.description &&
                    e.date === modalEvent.date &&
                    e.location === modalEvent.location
                );
                if (!eventToUpdate) throw new Error('Event not found for update');
                const res = await api.put<AdminUpdateEventResponse>(`/admin/events/${eventToUpdate.id}`, modalEvent);
                setEvents(events.map(e => (e.id === eventToUpdate.id ? res.data : e)));
            }
            setShowModal(false);
        } catch (err: any) {
            setError(err.message || 'Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    // if (!user || user.role !== UserRole.ADMIN) {
    //     return <Container className="py-5"><Alert variant="danger">Access denied. Admins only.</Alert></Container>;
    // }

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
                                <td>{event.date.toString()}</td>
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
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={modalEvent.date.toString()}
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
