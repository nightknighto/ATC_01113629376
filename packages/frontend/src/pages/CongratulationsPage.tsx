import type React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CongratulationsPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '70vh' }}
        >
            <Card className="shadow-lg p-4 text-center" style={{ maxWidth: 500 }}>
                <Card.Body>
                    <Card.Title as="h1" className="mb-3 text-success">
                        Congratulations!
                    </Card.Title>
                    <Card.Text className="mb-4 fs-5">
                        Your booking was successful. We look forward to seeing you at the event!
                    </Card.Text>
                    <Button variant="primary" onClick={() => navigate('/events')}>
                        Back to Events
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CongratulationsPage;
