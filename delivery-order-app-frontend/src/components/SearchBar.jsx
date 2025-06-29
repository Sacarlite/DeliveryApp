import { Form, FormControl } from 'react-bootstrap';
import  './css/SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, setCurrentPage }) => {
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    return (
      <Form className="search-form">
                <FormControl
                    type="text"
                    placeholder="Поиск по номеру заказа, городу отправителя/получателя..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <i className="fas fa-search search-icon"></i>
            </Form>
    );
};

export default SearchBar;