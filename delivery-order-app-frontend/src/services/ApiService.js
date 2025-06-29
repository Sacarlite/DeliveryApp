import config from "../config/config.json"
const API_BASE_URL = config.API_BASE_URL;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const ApiService = {
    getOrders: async (retries = 3, delayMs = 5000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Попытка ${attempt}: Отправка запроса на ${API_BASE_URL}/orders`);
                const response = await fetch(`${API_BASE_URL}/orders`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки заказов: ${response.status} ${response.statusText}`);
                }
                return response.json();
            } catch (error) {
                console.error(`Ошибка в getOrders (попытка ${attempt}):`, error);
                if (attempt === retries) throw error;
                await delay(delayMs);
            }
        }
    },
    createOrder: async (orderData) => {
        try {
            console.log('Отправка POST на:', `${API_BASE_URL}/orders`, orderData);
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error(`Ошибка создания заказа: ${response.status} ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Ошибка в createOrder:', error);
            throw error;
        }
    },
    downloadOrderPdf: async (orderId) => {
        try {
            console.log('Запрос PDF на:', `${API_BASE_URL}/orders/${orderId}/pdf`);
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pdf`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки PDF: ${response.status} ${response.statusText}`);
            }
            return response.blob();
        } catch (error) {
            console.error('Ошибка в downloadOrderPdf:', error);
            throw error;
        }
    },
};

export default ApiService;