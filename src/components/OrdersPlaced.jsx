import React, { useState, useEffect } from 'react';
import Database from '../apis/client-data.json';
import UniqueList from '../utils/UniqueListSort';
import "./OrdersPlaced.css";
import DeleteButton from './ui/DeleteButton';
import TextButton from './ui/TextButtonDefault';
import TextButtonTransparent from './ui/TextButtonTransparent';
import MyDatePicker from "./ui/DatePicker";

const OrdersPlaced = () => {
  // Funkcja do formatowania daty dd/MM/yyyy
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [orders, setOrders] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedQuarry, setSelectedQuarry] = useState('');
  const [selectedMaterialPrice, setSelectedMaterialPrice] = useState(0);
  const [transport, setTransport] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [date, setDate] = useState(formatDate(new Date()));

  useEffect(() => {
    updateTransport();
    updateMaterialPrice();
  }, [selectedClient, selectedDestination, selectedQuarry, selectedMaterial]);

  useEffect(() => {
    calculateTotalSum();
  }, [transport, selectedMaterialPrice, quantity]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
      try {
          const response = await fetch('http://localhost:3000/orders-placed');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setOrders(data);
      } catch (error) {
          console.error('Error fetching orders:', error);
      }
  };
  const updateTransport = () => {
    // Logika do aktualizacji transportu na podstawie wyborów
    const selectedData = Database.find(entry =>
      entry.client === selectedClient &&
      entry.destination.split(',').map(dest => dest.trim()).includes(selectedDestination) &&
      entry.quarry === selectedQuarry
    );

    if (selectedData) {
      setTransport(selectedData.transport);
    } else {
      setTransport(0);
    }
  };
  const updateMaterialPrice = () => {
    // Logika do aktualizacji ceny materiału na podstawie wyborów
    const selectedData = Database.find(entry =>
      entry.client === selectedClient &&
      entry.destination.split(',').map(dest => dest.trim()).includes(selectedDestination) &&
      entry.quarry === selectedQuarry &&
      entry.materials.some(material => material.name === selectedMaterial)
    );

    if (selectedData) {
      const selectedMaterialData = selectedData.materials.find(material => material.name === selectedMaterial);
      setSelectedMaterialPrice(selectedMaterialData.price);
    } else {
      setSelectedMaterialPrice(0);
    }
  };
  const calculateTotalSum = () => {
    const transportCost = parseFloat(transport);
    const materialPrice = parseFloat(selectedMaterialPrice);
    const quantityValue = parseFloat(quantity);

    if (!isNaN(transportCost) && !isNaN(materialPrice) && !isNaN(quantityValue) && quantityValue > 0) {
        const sum = (transportCost + materialPrice) * quantityValue;
        setTotalSum(sum.toFixed(2));
    } else {
        setTotalSum(0); // Ustawiamy sumę na zero lub inną wartość domyślną w przypadku nieprawidłowych danych
    }
  };
  const addOrder = async () => {
      const newOrder = { id: Date.now().toString(), selectedClient, selectedDestination, selectedMaterial, selectedQuarry, quantity, transport, selectedMaterialPrice, totalSum, date };
      try {
          const response = await fetch('http://localhost:3000/orders-placed', {
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
              setSelectedClient('');
              setSelectedDestination('');
              setSelectedMaterial('');
              setSelectedQuarry('');
              setQuantity(0);
              setTransport(0);
              setSelectedMaterialPrice(0);
              setTotalSum(0);
              setDate(formatDate(new Date()));
          } else {
              console.error('Failed to add order:', response.statusText);
          }
      } catch (error) {
          console.error('Error adding order:', error);
      }
  };
  const issueInvoice = async (order) => {
    try {
      const response = await fetch('http://localhost:3000/invoices', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
      });
      if (response.ok) {
          await removeOrder(order.id); // Usuń zamówienie po zapisaniu faktury
      } else {
        console.error('Failed to issue invoice:', response.statusText);
      }
    } catch (error) {
        console.error('Error issuing invoice:', error);
    }
  };
  const removeOrder = async (id) => {
      try {
          const response = await fetch(`http://localhost:3000/orders-placed/${id}`, {
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

  //Handle Events
  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };
  const handleDestinationChange = (event) => {
    setSelectedDestination(event.target.value);
  };
  const handleQuarryChange = (event) => {
    setSelectedQuarry(event.target.value);
  };
  const handleMaterialChange = (event) => {
    setSelectedMaterial(event.target.value);
  };
  const handleQuantityChange = (event) => {
      setQuantity(event.target.value);
  };
  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setDate(formattedDate);
  };

  //Wskazanie części bazy danych
  const materialsData = Database.map(entry => ({
    items: entry.materials
  }));
  const clientsData = Database.map(entry => ({
    items: [{ name: entry.client }]
  }));
  const destinationData = Database.map(entry => ({
    items: [{ name: entry.destination }]
  }));
  const quarryData = Database.map(entry => ({
    items: [{ name: entry.quarry }]
  }));

  return (
    <div className="container">
      <div className="page-header">
        <h1>Faktury do zrobienia</h1>
      </div>
      <div className="card">
        <div className="orders-placed-input">
          <div className="grid-item-1 col flex-col t-start">
            <label className="t-bold">Klient</label>
            <UniqueList data={clientsData} label="Klient" id="client-data" onChange={handleClientChange} selectedValue={selectedClient}/>
          </div>
          <div className="grid-item-2 col flex-col t-start">
            <label className="t-bold">Destynacja</label>
            <UniqueList data={destinationData} label="Destynacja" id="dest-data" onChange={handleDestinationChange} selectedValue={selectedDestination}/>
          </div>
          <div className="grid-item-3 col flex-col t-start">
            <label className="t-bold">Materiał</label>
            <UniqueList data={materialsData} label="Materiał" id="material-data" onChange={handleMaterialChange} selectedValue={selectedMaterial}/>
          </div>
          <div className="grid-item-4 col flex-col t-start">
            <label className="t-bold">Kamieniołom</label>
            <UniqueList data={quarryData} label="Kamieniołom" id="quarry-data" onChange={handleQuarryChange} selectedValue={selectedQuarry}/>
          </div>
          <div className="grid-item-5 col flex-col t-start">
            <label className="t-bold">Ilość</label>
            <input className="input-field"
                type="number"
                placeholder="Ilość"
                value={quantity} 
                onChange={handleQuantityChange} />
          </div>
          <div className="grid-item-6 col flex-col t-center">
            <label className="t-bold">Transport</label>
            {transport}
          </div>
          <div className="grid-item-7 col flex-col t-center">
            <label className="t-bold">Cena</label>
            {selectedMaterialPrice}
          </div>
          <div className="grid-item-8 col flex-col t-center">
            <label className="t-bold">Suma</label>
            {totalSum}
          </div>
          <div className="grid-item-9 col flex-col t-start">
            <label className="t-bold">Data</label>
            <MyDatePicker selectedValue={new Date(date)} onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="flex t-center mt-def">
          <TextButton onClick={addOrder} content="Złóź Zamówienie" title="Dodaj draft zamówienia"/>
        </div>
      </div>
        <ul className="responsive-table">
          <li className="table-header">
            <div className="table-header--card">
              <div className="col col-2">Klient</div>
              <div className="col col-2">Destynacja</div>
              <div className="col col-2">Materiał</div>
              <div className="col col-2">Kamieniołom</div>
              <div className="col col-2">Ilość</div>
              <div className="col col-overflow col-2">Transport</div>
              <div className="col col-1">Cena</div>
              <div className="col col-1">Suma</div>
              <div className="col col-2">Data</div>
              <div className="col col-2 t-center">Faktura</div>
            </div>
            <div className='col col-1'></div>
          </li>
            {orders.map(order => (
              <li className="table-row" key={order.id}>
                <div className="table-row--card">
                    <div className="col col-2" data-label="Klient">{order.selectedClient}</div>
                    <div className="col col-2" data-label="Destynacja">{order.selectedDestination}</div>
                    <div className="col col-2" data-label="Materiał">{order.selectedMaterial}</div>
                    <div className="col col-2" data-label="Kamieniołom">{order.selectedQuarry}</div>
                    <div className="col col-2" data-label="Ilość">{order.quantity}</div>
                    <div className="col col-2" data-label="Transport">{order.transport}</div>
                    <div className="col col-1" data-label="Cena">{order.selectedMaterialPrice}</div>
                    <div className="col col-1" data-label="Suma">{order.totalSum}</div>
                    <div className="col col-2" data-label="Data">{order.date}</div>
                    <div className="col col-2 t-center">
                      <TextButtonTransparent onClick={() => issueInvoice(order)} content="Wystaw" title="Wystaw fakture"/>
                    </div>
                </div>
                <div className="col col-1 t-center">
                  <DeleteButton onClick={() => removeOrder(order.id)}/>
                </div>
              </li>
            ))}
        </ul>
    </div>
  );
};

export default OrdersPlaced;