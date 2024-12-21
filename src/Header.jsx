import './Header.css'

function Header({ activeTab, setActiveTab }) {
    return(
        <header className="header">
            <div className="header--left">
                <a className="logo">SzwagierCalc</a>
            </div>
            <div className="header--right">
                <a className={`link ${activeTab === 'orders-draft' ? 'active' : ''}`} onClick={() => setActiveTab('orders-draft')}>Zamówienia</a>
                <a className={`link ${activeTab === 'orders-placed' ? 'active' : ''}`} onClick={() => setActiveTab('orders-placed')}>Zamówienia Złożone</a>
                <a className={`link ${activeTab === 'invoices-issued' ? 'active' : ''}`} onClick={() => setActiveTab('invoices-issued')}>Faktury Wystawione</a>
                <a className={`link ${activeTab === 'invoices-paid' ? 'active' : ''}`} onClick={() => setActiveTab('invoices-paid')}>Faktury Opłacone</a>
                <a className={`link ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>Rozliczenie</a>
                <a className={`link ${activeTab === 'settlement' ? 'active' : ''}`} onClick={() => setActiveTab('settlement')}>Export</a>
            </div>
        </header>
    );
}

export default Header