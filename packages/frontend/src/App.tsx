import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import CongratulationsPage from './pages/CongratulationsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const Navigation = () => {
    const { user, logout } = useAuth();
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">Events Platform</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto align-items-lg-center gap-lg-3">
                        <Nav.Link as={Link} to="/events">Events</Nav.Link>
                        {user?.role === "admin" && (
                            <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                        )}
                        {user ? (
                            <>
                                <Navbar.Text className="fw-semibold">Hello, {user.name}</Navbar.Text>
                                <Button variant="light" size="sm" className="ms-lg-2" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as="a" href="/register" variant="light" size="sm" className="ms-lg-2">Sign Up</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

function AppContent() {
    return (
        <div className="app-container">
            <header className="app-header">
                <Navigation />
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<EventsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/events/create" element={<div className="container mx-auto p-4">Create event page will be implemented</div>} />
                    <Route path="/events/:id/edit" element={<div className="container mx-auto p-4">Edit event page will be implemented</div>} />
                    <Route path="/profile" element={<div className="container mx-auto p-4">User profile page will be implemented</div>} />
                    <Route path="/congratulations" element={<CongratulationsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Events Platform</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;