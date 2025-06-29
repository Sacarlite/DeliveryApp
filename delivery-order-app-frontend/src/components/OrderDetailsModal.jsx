import {useState} from 'react';
import { Modal, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import ApiService from '../services/ApiService'; 

const OrderDetailsModal = ({ show, handleClose, orderDetails }) => {
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [errorPdf, setErrorPdf] = useState('');
    if (!orderDetails) {
        return null; 
    }
const handleDownloadPdf = async () => {
        setLoadingPdf(true);
        setErrorPdf('');
        try {
            const response = await ApiService.downloadOrderPdf(orderDetails.id);
            
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `OrderReport_${orderDetails.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorPdf('Не удалось скачать PDF-отчет. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoadingPdf(false);
        }
    };
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Детали Заказа № { orderDetails.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorPdf && <Alert variant="danger">{errorPdf}</Alert>}
                <Container>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Номер заказа:</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.orderNumber || orderDetails.id}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Город отправителя:</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.senderCity}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Адрес отправителя:</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.senderAddress}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Город получателя:</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.recipientCity}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Адрес получателя:</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.recipientAddress}
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Вес груза (кг):</strong>
                        </Col>
                        <Col md={6}>
                            {orderDetails.cargoWeight} кг
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <strong>Дата забора:</strong>
                        </Col>
                        <Col md={6}>
                            {new Date(orderDetails.pickupDate).toLocaleDateString('ru-RU')}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleDownloadPdf} 
                    disabled={loadingPdf}
                >
                    {loadingPdf ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {' Загрузка PDF...'}
                        </>
                    ) : (
                        <>
                            <i className="fas fa-file-pdf"></i> Сохранить отчет PDF
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsModal;