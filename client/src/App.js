import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import QuoteForm from './components/QuoteForm';
import LoginForm from './components/LoginForm';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="header">
                    <h1>App Header</h1>
                </header>
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={ProductList} />
                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/checkout" component={Checkout} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/create-invoice" component={InvoiceForm} />
                        <Route exact path="/create-quote" component={QuoteForm} />
                        <Route exact path="/login" component={LoginForm} />
                    </Switch>
                </div>
                <footer className="footer">
                    <p>App Footer</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
