import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
    <Container className="py-5 text-center">
        <h1 className="display-4 mb-3">404 - Page Not Found</h1>
        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
        <Button as={Link} to="/events" variant="primary">
            Go to Events
        </Button>
    </Container>
);

export default NotFoundPage;
