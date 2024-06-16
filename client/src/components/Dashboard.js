import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <Link to="/admin/login">
                <button>Admin Sign In</button>
            </Link>
            <Link to="/admin/signup">
                <button>Admin Sign Up</button>
            </Link>
        </div>
    );
};

export default Dashboard;
