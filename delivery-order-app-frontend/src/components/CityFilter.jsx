import { Form } from 'react-bootstrap';
import './css/CityFilter.css';

const CityFilter = ({ uniqueSenderCities, selectedSenderCity, onSenderCityChange }) => {
    return (
        <Form.Group className="formGroup"> 
            <Form.Label className="formLabel">Город отправителя:</Form.Label> 
            <Form.Select
                aria-label="Фильтр по городу отправителя"
                value={selectedSenderCity}
                onChange={onSenderCityChange}
                className="formSelect" 
            >
                {uniqueSenderCities.map((city) => (
                    <option key={city || 'all'} value={city}>
                        {city || 'Все города'}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
};

export default CityFilter;