
import { useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import ApiService from '../services/ApiService';
import './css/OrderList.css';
import SearchBar from './SearchBar';
import Filters from './Filters';
import OrderTable from './OrderTable';
import Pagination from './Pagination';
import OrderDetailsModal from './OrderDetailsModal';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSenderCity, setSelectedSenderCity] = useState('');
    const [minCargoWeight, setMinCargoWeight] = useState(0);
    const [maxCargoWeight, setMaxCargoWeight] = useState(1000);
    const [dataMinWeight, setDataMinWeight] = useState(0);
    const [dataMaxWeight, setDataMaxWeight] = useState(1000);
    const [displayMinWeight, setDisplayMinWeight] = useState(0);
    const [displayMaxWeight, setDisplayMaxWeight] = useState(1000);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrdersData = async () => {
        try {
            setLoading(true);
            const ordersData = await ApiService.getOrders();
            setOrders(ordersData);
            setError('');

            const weights = ordersData.map(order => order.cargoWeight).filter(w => typeof w === 'number');
            const actualMin = weights.length > 0 ? Math.floor(Math.min(...weights)) : 0;
            const actualMax = weights.length > 0 ? Math.ceil(Math.max(...weights)) : 1000;

            setDataMinWeight(actualMin);
            setDataMaxWeight(actualMax);
            setMinCargoWeight(actualMin);
            setMaxCargoWeight(actualMax);
            setDisplayMinWeight(actualMin);
            setDisplayMaxWeight(actualMax);

        } catch (err) {
            const errorMessage = err.response && err.response.data ?
                                 (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) :
                                 err.message || 'Неизвестная ошибка при создании заказа.';
            setError(`Не удалось загрузить данные о заказах: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersData();
    }, []);

    const handleRefresh = () => {
        fetchOrdersData();
        setCurrentPage(1);
        setSearchQuery('');
        setSelectedSenderCity('');
        setMinCargoWeight(dataMinWeight);
        setMaxCargoWeight(dataMaxWeight);
        setDisplayMinWeight(dataMinWeight);
        setDisplayMaxWeight(dataMaxWeight);
    };

    const handleResetFilters = () => {
        setSelectedSenderCity('');
        setSearchQuery('');
        setMinCargoWeight(dataMinWeight);
        setMaxCargoWeight(dataMaxWeight);
        setDisplayMinWeight(dataMinWeight);
        setDisplayMaxWeight(dataMaxWeight);
        setCurrentPage(1);
    };

    const handleSenderCityFilterChange = (event) => {
    const value = event.target.value || '';
    setSelectedSenderCity(value);
    setCurrentPage(1);
};
    const handleDisplayWeightRangeChange = (values) => {
        setDisplayMinWeight(values[0]);
        setDisplayMaxWeight(values[1]);
    };

    const handleActualWeightRangeChange = (values) => {
        setMinCargoWeight(values[0]);
        setMaxCargoWeight(values[1]);
        setCurrentPage(1);
    };

    const uniqueSenderCities = useMemo(() => {
        const cities = new Set(orders.map(order => order.senderCity));
        return ['', ...Array.from(cities).sort()];
    }, [orders]);

    const combinedFilteredOrders = useMemo(() => {
        let filtered = orders;

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(lowerCaseQuery) ||
                order.senderCity.toLowerCase().includes(lowerCaseQuery) ||
                order.recipientCity.toLowerCase().includes(lowerCaseQuery)
            );
        }

        if (selectedSenderCity) {
            filtered = filtered.filter(order => order.senderCity === selectedSenderCity);
        }

        const currentMinWeight = typeof minCargoWeight === 'number' ? minCargoWeight : dataMinWeight;
        const currentMaxWeight = typeof maxCargoWeight === 'number' ? maxCargoWeight : dataMaxWeight;

        filtered = filtered.filter(order =>
            typeof order.cargoWeight === 'number' &&
            order.cargoWeight >= currentMinWeight &&
            order.cargoWeight <= currentMaxWeight
        );

        return filtered;
    }, [orders, searchQuery, selectedSenderCity, minCargoWeight, maxCargoWeight, dataMinWeight, dataMaxWeight]);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = combinedFilteredOrders.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(combinedFilteredOrders.length / recordsPerPage);
  const handleOpenOrderDetailsModal = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailsModal(true);
    };

    const handleCloseOrderDetailsModal = () => {
        setShowOrderDetailsModal(false);
        setSelectedOrder(null);
    };
    if (loading) {
        return <div className="loading">Загрузка данных...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="table-container">
            <div className="header-with-refresh">
                <h2>Список Заказов</h2>
                <Button variant="link" onClick={handleRefresh} className="refresh-button">
                    <i className="fas fa-sync-alt"></i>
                </Button>
            </div>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentPage={setCurrentPage} />
            <Filters
                uniqueSenderCities={uniqueSenderCities}
                selectedSenderCity={selectedSenderCity}
                onSenderCityChange={handleSenderCityFilterChange}
                dataMinWeight={dataMinWeight}
                dataMaxWeight={dataMaxWeight}
                displayMinWeight={displayMinWeight}
                displayMaxWeight={displayMaxWeight}
                onDisplayWeightChange={handleDisplayWeightRangeChange}
                onActualWeightChange={handleActualWeightRangeChange}
                handleResetFilters={handleResetFilters}
                setCurrentPage={setCurrentPage}
            />
            <OrderTable currentRecords={currentRecords}
                onRowDoubleClick={handleOpenOrderDetailsModal}  />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
              <OrderDetailsModal
                show={showOrderDetailsModal}
                handleClose={handleCloseOrderDetailsModal}
                orderDetails={selectedOrder}
            />
        </div>
    );
};

export default OrderList;
