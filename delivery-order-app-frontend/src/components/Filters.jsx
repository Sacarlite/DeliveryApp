import { Dropdown,  Button } from 'react-bootstrap';
import './css/Filters.css';
import CityFilter from './CityFilter';
import WeightSliderFilter from './WeightSliderFilter';

const Filters = ({
    uniqueSenderCities,
    selectedSenderCity,
    onSenderCityChange,
    minCargoWeight,
    maxCargoWeight,
    dataMinWeight,
    dataMaxWeight,
    onDisplayWeightChange,
    onActualWeightChange,
    displayMinWeight,
    displayMaxWeight,
    handleResetFilters,
    setCurrentPage
}) => {
    const handleCityChange = (e) => {
        onSenderCityChange(e);
        setCurrentPage(1);
    };

    const handleWeightChange = (values) => {
        onDisplayWeightChange(values);
    };

    const handleWeightFinalChange = (values) => {
        onActualWeightChange(values);
        setCurrentPage(1);
    };

    return (
        <div className="filtersContainer" >
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-filter-button" className="filterButton">
                    <i className="fas fa-filter"></i> Фильтры
                </Dropdown.Toggle>
                <Dropdown.Menu className="filterDropdownMenu">
                    <CityFilter
                        uniqueSenderCities={uniqueSenderCities}
                        selectedSenderCity={selectedSenderCity}
                        onSenderCityChange={handleCityChange}
                    />
                    <WeightSliderFilter
                        minCargoWeight={minCargoWeight}
                        maxCargoWeight={maxCargoWeight}
                        dataMinWeight={dataMinWeight}
                        dataMaxWeight={dataMaxWeight}
                        onDisplayWeightChange={handleWeightChange}
                        onActualWeightChange={handleWeightFinalChange}
                        displayMinWeight={displayMinWeight}
                        displayMaxWeight={displayMaxWeight}
                    />
                    <div className="d-grid">
                        <Button variant="outline-secondary" onClick={handleResetFilters} className="resetFiltersButton">
                            <i className="fas fa-times"></i> Сбросить фильтры
                        </Button>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default Filters;