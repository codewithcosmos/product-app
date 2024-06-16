import React, { useState } from 'react';

const QuoteForm = ({ createQuote }) => {
    const [client, setClient] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        createQuote({ client, description, amount });
        setClient('');
        setDescription('');
        setAmount('');
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Client" value={client} onChange={e => setClient(e.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
            <button type="submit">Create Quote</button>
        </form>
    );
};

export default QuoteForm;
