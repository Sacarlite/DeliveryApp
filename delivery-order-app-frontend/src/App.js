import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
        <div className="App">
            <nav style={{ backgroundColor: '#f8f9fa', padding: '10px 20px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Доставка</h1>
                <div>
                    <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginRight: '15px', fontWeight: 'bold' }}>Создать Заказ</Link>
                    <Link to="/list" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Список Заказов</Link>
                </div>
            </nav>

            <div className="container-fluid mt-4"> 
                <Routes>
                    <Route path="/" element={<OrderForm />} />
                    <Route path="/list" element={<OrderList />} />
                </Routes>
            </div>
        </div>
    </Router>
  );
}

export default App;