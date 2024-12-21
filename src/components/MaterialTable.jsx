import React, { useEffect, useState } from 'react';
// import invoices from '../apis/invoices.json';
import './MaterialTable.css';
import TextButtonTransparent from './ui/TextButtonTransparent';

const MaterialTable = () => {
  const [userInput, setUserInput] = useState({}); // Stan dla danych wprowadzonych przez użytkownika
  const [processedData, setProcessedData] = useState({});
  const [details, setDetails] = useState({}); // Dodany stan dla śledzenia szczegółów

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:3000/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      processInvoiceData(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  const processInvoiceData = (invoices) => {
    const data = invoices.reduce((acc, invoice) => {
      const { selectedMaterial, quantity, selectedClient, date } = invoice;
      const numericQuantity = parseFloat(quantity);
      const materialNames = selectedMaterial.split(', ');

      materialNames.forEach((materialName) => {
        if (!acc[materialName]) {
          acc[materialName] = { total: 0, details: [] };
        }
        acc[materialName].total += numericQuantity;
        acc[materialName].details.push({ quantity: numericQuantity, selectedClient, date });
      });

      return acc;
    }, {});
    setProcessedData(data);
  };
    
  // Handle input change
  const handleInputChange = (materialName, value) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [materialName]: value,
    }));
  };
  // Compare data when input value changes
  const compareData = (materialName) => {
    const userInputValue = parseFloat(userInput[materialName] || 0);
    return userInputValue === processedData[materialName].total;
  };
  // Toggle details visibility
  const toggleDetails = (materialName) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [materialName]: !prevDetails[materialName],
    }));
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Rozliczenie</h1>
      </div>
      <section>
        <table className="material-table card">
          <thead>
            <tr className="material-table-header">
              <th className="">Nazwa materiału</th>
              <th className="">Ilość materiału</th>
              <th className="">User Input</th>
              <th className="">Porównanie</th>
              <th className="">Button</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(processedData).map((materialName) => (
              <React.Fragment key={materialName}>
                <tr className="material-table-data">
                  <td className="">{materialName}</td>
                  <td className="">{processedData[materialName].total}</td>
                  <td className="">
                    <input className="input-field"
                      type="number"
                      value={userInput[materialName] || ''}
                      onChange={(e) => handleInputChange(materialName, e.target.value)}
                    />
                  </td>
                  <td className="">
                    {compareData(materialName) ? 'Zgadza się' : 'Nie zgadza się'}
                  </td>
                  <td className="">
                    <TextButtonTransparent
                      onClick={() => toggleDetails(materialName)}
                      title={details[materialName] ? 'Ukryj' : 'Szczegóły'}
                      content={details[materialName] ? 'Ukryj' : 'Szczegóły'}
                    />
                  </td>
                </tr>
                {details[materialName] && (
                  <tr className="details-table">
                    <td colSpan="5">
                      <ul>
                        {processedData[materialName].details.map((detail, index) => (
                          <li key={index}>
                            <strong>Klient:</strong> {detail.selectedClient}, <strong>Data:</strong> {detail.date}, <strong>Ilość:</strong> {detail.quantity.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default MaterialTable;