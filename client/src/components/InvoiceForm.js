import React, { useState } from 'react';

const InvoiceForm = ({ createInvoice }) => {
    const [client, setClient] = useState('');
    const [items, setItems] = useState('');
    const [total, setTotal] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        createInvoice({ client, items, total });
        setClient('');
        setItems('');
        setTotal('');
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Client" value={client} onChange={e => setClient(e.target.value)} required />
            <input type="text" placeholder="Items" value={items} onChange={e => setItems(e.target.value)} required />
            <input type="text" placeholder="Total" value={total} onChange={e => setTotal(e.target.value)} required />
            <button type="submit">Create Invoice</button>
        </form>
    );
};

export default InvoiceForm;
