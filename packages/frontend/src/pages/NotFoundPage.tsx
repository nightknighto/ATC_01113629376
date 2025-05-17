import type React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Custom LinkButton component to wrap Link and Button
const LinkButton = ({
    to,
    children,
    ...props
}: { to: string; children: React.ReactNode } & React.ComponentProps<typeof Button>) => (
    <Link to={to}>
        <Button {...props}>{children}</Button>
    </Link>
);

const NotFoundPage: React.FC = () => (
    <Container className="py-5 text-center">
        <h1 className="display-4 mb-3">404 - Page Not Found</h1>
        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
        <LinkButton to="/events" variant="primary">
            Go to Events
        </LinkButton>
    </Container>
);

export default NotFoundPage;
