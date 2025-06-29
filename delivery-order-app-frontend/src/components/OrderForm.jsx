
import  { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

const OrderForm = () => {
    const [senderCity, setSenderCity] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date());
    const [recipientCity, setRecipientCity] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [cargoWeight, setCargoWeight] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const resetForm = () => {
        setSenderCity('');
        setSenderAddress('');
        setPickupDate(new Date());
        setRecipientCity('');
        setRecipientAddress('');
        setCargoWeight('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(''); 
        setLoading(true);

        const orderData = {
            senderCity,
            senderAddress,
          pickupDate: pickupDate ? pickupDate.toISOString().split('T')[0] : '', 
            recipientCity,
            recipientAddress,
            cargoWeight: parseFloat(cargoWeight),
        };

        try {
            await ApiService.createOrder(orderData);
            setSuccess('Заказ успешно добавлен!');
            resetForm(); 
            setTimeout(() => {
                setSuccess('');
                 navigate('/list'); 
            }, 900);

        } catch (err) {
            const errorMessage = err.response && err.response.data ?
                                 (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) :
                                 err.message || 'Неизвестная ошибка при создании заказа.';
            setError(`Ошибка при создании заказа: ${errorMessage}`);
            setTimeout(() => {
                setError('');
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Создать Новый Заказ</h2>

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Город отправителя:</Form.Label>
                            <Form.Control
                                type="text"
                                value={senderCity}
                                onChange={(e) => setSenderCity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Адрес отправителя:</Form.Label>
                            <Form.Control
                                type="text"
                                value={senderAddress}
                                onChange={(e) => setSenderAddress(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Дата забора:</Form.Label>
                            <DatePicker
                                selected={pickupDate}
                                onChange={(date) => setPickupDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="form-control" 
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Город получения:</Form.Label>
                            <Form.Control
                                type="text"
                                value={recipientCity}
                                onChange={(e) => setRecipientCity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Адрес получения:</Form.Label>
                            <Form.Control
                                type="text"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Вес груза (кг):</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={cargoWeight}
                                onChange={(e) => setCargoWeight(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading} className="w-100">
                            {loading ? 'Добавление...' : 'Добавить Заказ'}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/list')} className="w-100 mt-2">
                            Отмена
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderForm;