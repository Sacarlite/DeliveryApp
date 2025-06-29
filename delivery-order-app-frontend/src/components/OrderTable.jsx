import { Table } from 'react-bootstrap';
import './css/OrderTable.css';

const OrderTable = ({ currentRecords ,onRowDoubleClick }) => {
    return (
          <Table striped bordered hover responsive className="orders-table">
                     <thead>
                         <tr>
                             <th>ID Заказа</th>
                             <th>Город отправителения</th>
                             <th>Адрес отправителения</th>
                             <th>Дата забора</th>
                             <th>Город получения</th>
                             <th>Адрес получения</th>
                             <th>Вес груза, кг</th>
                         </tr>
                     </thead>
                     <tbody>
                         {currentRecords.length === 0 ? (
                             <tr>
                                  <td colSpan="7" className="text-center">Нет заказов для отображения. Создайте новый заказ.</td>
                             </tr>
                         ) : (
                             currentRecords.map(order => (
                                 <tr key={order.id}
                                   onDoubleClick={() => {onRowDoubleClick(order);
                                   }} >
                                     <td>{order.id}</td>
                                     <td>{order.senderCity}</td>
                                     <td>{order.senderAddress}</td>
                                     <td>{new Date(order.pickupDate).toLocaleDateString('ru-RU')}</td>
                                     <td>{order.recipientCity}</td>
                                     <td>{order.recipientAddress}</td>
                                     <td>{order.cargoWeight}</td>
                                 </tr>
                             ))
                         )}
                     </tbody>
                 </Table>
    );
};

export default OrderTable;