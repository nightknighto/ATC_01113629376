import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Events Platform</Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {/* Desktop navigation */}
                <div className="hidden md:flex space-x-4 items-center">
                    <Link to="/events" className="hover:text-blue-200">Events</Link>
                    {user ? (
                        <>
                            <span>Hello, {user.name}</span>
                            <button
                                onClick={logout}
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200">Login</Link>
                            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-blue-700 px-4 py-2">
                    <Link to="/events" className="block py-2 hover:text-blue-200">Events</Link>
                    {user ? (
                        <>
                            <span className="block py-2">Hello, {user.name}</span>
                            <button
                                onClick={logout}
                                className="block w-full text-left py-2 hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block py-2 hover:text-blue-200">Login</Link>
                            <Link to="/register" className="block py-2 hover:text-blue-200">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
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
                    {/* These routes will be implemented later */}
                    <Route path="/login" element={<div className="container mx-auto p-4">Login page will be implemented</div>} />
                    <Route path="/register" element={<div className="container mx-auto p-4">Register page will be implemented</div>} />
                    <Route path="/events/create" element={<div className="container mx-auto p-4">Create event page will be implemented</div>} />
                    <Route path="/events/:id/edit" element={<div className="container mx-auto p-4">Edit event page will be implemented</div>} />
                    <Route path="/profile" element={<div className="container mx-auto p-4">User profile page will be implemented</div>} />
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