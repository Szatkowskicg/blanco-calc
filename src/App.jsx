import React, { useState } from 'react';
import Footer from "./Footer";
import Header from "./Header";
import OrdersDraft from "./components/OrdersDraft"
import OrdersPlaced from "./components/OrdersPlaced";
import InvoicesIssuedTab from "./components/InvoicesIssuedTab";
import InvoicesPaid from './components/InvoicesPaid';
import MaterialTable from "./components/MaterialTable";
import SettlementTab from "./components/Settlement";

function App() {
  const [activeTab, setActiveTab] = useState('orders-draft');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders-draft':
        return <OrdersDraft />
      case 'orders-placed':
        return <OrdersPlaced />;
      case 'invoices-issued':
        return <InvoicesIssuedTab />;
      case 'invoices-paid':
        return <InvoicesPaid />;
      case 'materials':
        return <MaterialTable />;
      case 'settlement':
        return <SettlementTab />;
      default:
        return <OrdersPlaced />;
    }
  };

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App