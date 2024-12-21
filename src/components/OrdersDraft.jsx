import { useState, useEffect } from "react";
import "./OrdersDraft.css";
import DeleteButton from "./ui/DeleteButton";
import TextButton from './ui/TextButtonDefault';
import MyDatePicker from "./ui/DatePicker";

const OrdersDraft = () => {
    // Funkcja do formatowania daty dd/MM/yyyy
    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const [orders, setOrders] = useState([]);
    const [material, setMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [client, setClient] = useState('');
    const [transport, setTransport] = useState('');
    const [misc, setMisc] = useState('');
    const [date, setDate] = useState(formatDate(new Date()));

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const addOrder = async () => {
        const newOrder = { id: Date.now().toString(), material, quantity, client, transport, misc, date };
        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Order added:', data);
                setOrders([...orders, newOrder]);
                setMaterial('');
                setQuantity('');
                setClient('');
                setTransport('');
                setMisc('');
                setDate(formatDate(new Date()));
            } else {
                console.error('Failed to add order:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };
    const removeOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/orders/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Order removed:', data);
                setOrders(orders.filter(order => order.id !== id));
            } else {
                console.error('Failed to remove order:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing order:', error);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, []);

    // Funkcja do sortowania danych według daty
    const sortByDate = (data) => {
        return data.sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split('/');
            const [dayB, monthB, yearB] = b.date.split('/');
            const dateA = new Date(`${yearA}/${monthA}/${dayA}`);
            const dateB = new Date(`${yearB}/${monthB}/${dayB}`);
            return dateA - dateB;
        });
    };
    const sortedOrders = sortByDate(orders);
    // Funkcja do grupowania po dacie
    const groupByDate = (data) => {
        const grouped = {};
        data.forEach(item => {
            const [day, month, year] = item.date.split('/');
            const formattedDate = `${year}/${month}/${day}`;
            if (grouped[formattedDate]) {
                grouped[formattedDate].push(item);
            } else {
                grouped[formattedDate] = [item];
            }
        });
        return grouped;
    };
    const groupedData = groupByDate(sortedOrders);

    const handleMaterialChange = (event) => {
        setMaterial(event.target.value);
    };
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const handleClientChange = (event) => {
        setClient(event.target.value);
    };
    const handleTransportChange = (event) => {
        setTransport(event.target.value);
    };
    const handleMiscChange = (event) => {
        setMisc(event.target.value);
    };
    const handleDateChange = (date) => {
        const formattedDate = formatDate(date);
        setDate(formattedDate);
    };

    return(
    <div className="container">
        <h1 className="page-header">Zamówienia</h1>
        <section className="card">
            <div className="orders-draft-input">
                <div className="orders-draft-input--grid-item-1 col flex-col t-start">
                    <label className="t-bold">Materiał</label>
                    <input className="input-field"
                        type="text"
                        placeholder="Materiał"
                        value={material}
                        onChange={handleMaterialChange}
                    />
                </div>
                <div className="orders-draft-input--grid-item-2 col flex-col t-start">
                    <label className="t-bold">Ilość</label>
                    <input className="input-field"
                        type="text"
                        placeholder="Ilość"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                </div>
                <div className="orders-draft-input--grid-item-3 col flex-col t-start">
                    <label className="t-bold">Klient</label>
                    <input className="input-field"
                        type="text"
                        placeholder="Klient"
                        value={client}
                        onChange={handleClientChange}
                    />
                </div>
                <div className="orders-draft-input--grid-item-4 col flex-col t-start">
                    <label className="t-bold">Transport</label>
                    <input className="input-field"
                        type="text"
                        placeholder="Transport"
                        value={transport}
                        onChange={handleTransportChange}
                    />
                </div>
                <div className="orders-draft-input--grid-item-5 col flex-col t-start">
                    <label className="t-bold">Misc</label>
                    <input className="input-field"
                        type="text"
                        placeholder="Misc"
                        value={misc}
                        onChange={handleMiscChange}
                    />
                </div>
                <div className="orders-draft-input--grid-item-6 col flex-col t-start">
                    <label className="t-bold">Data</label>
                    <MyDatePicker selectedValue={new Date(date)} onDateChange={handleDateChange} />
                </div>
            </div>
            <div className="flex t-center mt-def">
                <TextButton onClick={addOrder} content="Dodaj Zamówienie" title="add-ordered"/>
            </div>
        </section>
        <section>
            {Object.keys(groupedData).map(date => (
                <div key={date}>
                    <div className="orders-draft-date">
                        <span className="t-bold c-grey">{date}</span>
                    </div>
                    <div className="orders-draft draft-card">
                        <div className="orders-draft--header">
                            <div className="col-draft">Materiał</div>
                            <div className="col-draft">Ilość</div>
                            <div className="col-draft">Klient</div>
                            <div className="col-draft">Transport</div>
                            <div className="col-draft">Misc</div>
                            <div className="col-draft"></div>
                        </div>
                        <div className="orders-draft--data">
                            {groupedData[date].map(order => (
                                <div className="orders-draft--row" key={order.id}>
                                    <div className="col-draft" data-label="Material">{order.material}</div>
                                    <div className="col-draft" data-label="Ilosc">{order.quantity}</div>
                                    <div className="col-draft" data-label="Klient">{order.client}</div>
                                    <div className="col-draft" data-label="Transport">{order.transport}</div>
                                    <div className="col-draft" data-label="Inne">{order.misc}</div>
                                    <div className="col-draft"><DeleteButton onClick={() => removeOrder(order.id)}/></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    </div>
    );
}

export default OrdersDraft