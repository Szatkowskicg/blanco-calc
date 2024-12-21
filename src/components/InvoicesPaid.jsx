import "./InvoicesPaid.css"
import React, { useState, useEffect } from 'react'
import DeleteButton from "./ui/DeleteButton"
import UnsortButton from './ui/UnsortButton';

const InvoicesPaid = () => {   
    const [invoices, setInvoices] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [originalInvoices, setOriginalInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const removeInvoice = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/invoices-paid/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Invoice removed:', data);
                setInvoices(invoices.filter(invoice => invoice.id !== id));
            } else {
                console.error('Failed to remove order:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing order:', error);
        }
    };
    const fetchInvoices = async () => {
        try {
            const response = await fetch('http://localhost:3000/invoices-paid');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setInvoices(data);
            setOriginalInvoices(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const getSortedInvoices = () => {
        if (!sortConfig) {
          return invoices;
        }
    
        return [...invoices].sort((a, b) => {
          if (sortConfig.key === 'date') {
            const dateA = new Date(a.date.split('-').reverse().join('-'));
            const dateB = new Date(b.date.split('-').reverse().join('-'));
            return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
          }
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
    };
    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };
    const resetSort = () => {
        setSortConfig(null);
        setInvoices(originalInvoices);
    };
    const getHeaderClassName = key => {
        if (!sortConfig) {
          return 'sortable-header';
        }
        return `sortable-header ${sortConfig.key === key ? 'active' : ''}`;
    };

    const sortedInvoices = getSortedInvoices();

    return (
        <div className="container">
            <div className="page-header">
                <h1>Faktury Opłacone</h1>
            </div>
            <div>
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="table-header--card">
                            <div className={`col col-2 ${getHeaderClassName('selectedClient')}`}  onClick={() => requestSort('selectedClient')}>
                                Klient
                                <span className={`sort-arrow ${sortConfig?.key === 'selectedClient' ? sortConfig.direction : ''}`}></span>
                            </div>
                            <div className={`col col-2 ${getHeaderClassName('selectedDestination')}`} onClick={() => requestSort('selectedDestination')}>
                                Destynacja
                                <span className={`sort-arrow ${sortConfig?.key === 'selectedDestination' ? sortConfig.direction : ''}`}></span>
                            </div>
                            <div className="col col-2">Materiał</div>
                            <div className="col col-2">Kamieniołom</div>
                            <div className="col col-1">Ilość</div>
                            <div className="col col-1">Transport</div>
                            <div className="col col-1">Cena</div>
                            <div className="col col-2">Suma</div>
                            <div className={`col col-2 ${getHeaderClassName('date')}`} onClick={() => requestSort('date')}>
                                Data
                                <span className={`sort-arrow ${sortConfig?.key === 'date' ? sortConfig.direction : ''}`}></span>
                            </div>
                        </div>
                        <div className="col col-1 t-center">
                            <UnsortButton onClick={resetSort}/>
                        </div>
                    </li>
                    {sortedInvoices.map(invoice => (
                        <li className="table-row" key={invoice.id}>
                            <div className="table-row--card">
                                <div className="col col-2" data-label="Klient">{invoice.selectedClient}</div>
                                <div className="col col-2" data-label="Destynacja">{invoice.selectedDestination}</div>
                                <div className="col col-2" data-label="Materiał">{invoice.selectedMaterial}</div>
                                <div className="col col-2" data-label="Kamieniołom">{invoice.selectedQuarry}</div>
                                <div className="col col-1" data-label="Ilość">{invoice.quantity}</div>
                                <div className="col col-1" data-label="Transport">{invoice.transport}</div>
                                <div className="col col-1" data-label="Cena">{invoice.selectedMaterialPrice}</div>
                                <div className="col col-2" data-label="Suma">{invoice.totalSum}</div>
                                <div className="col col-2" data-label="Data">{invoice.date}</div>                
                            </div>
                            <div className="col col-1 t-center">
                                <DeleteButton onClick={() => removeInvoice(invoice.id)}/>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}

export default InvoicesPaid