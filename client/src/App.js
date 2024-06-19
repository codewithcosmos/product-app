import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';  // Add this import
import QuoteForm from './components/QuoteForm';
import InvoiceForm from './components/InvoiceForm';

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/signup" component={SignupForm} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/products" exact component={ProductList} />
                    <Route path="/products/:id" component={ProductDetail} />
                    <Route path="/cart" component={Cart} />
                    <Route path="/checkout" component={Checkout} />  // Add this route
                    <Route path="/quote" component={QuoteForm} />
                    <Route path="/invoice" component={InvoiceForm} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
