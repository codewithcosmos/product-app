document.addEventListener('DOMContentLoaded', async () => {
    const productListDiv = document.getElementById('product-list');
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const generateInvoiceBtn = document.getElementById('generate-invoice');
    const sendInvoiceBtn = document.getElementById('send-invoice');
    const loginSection = document.getElementById('login');
    const signupSection = document.getElementById('signup');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    // Fetch and display products
    try {
        const response = await axios.get('/api/products');
        const products = response.data;

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="images/${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: R ${formatPriceInRands(product.price)}</p>
                <button class="add-to-cart" data-product-id="${product._id}">Add to Cart</button>
            `;
            productListDiv.appendChild(productDiv);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }

    // Fetch and display cart items
    try {
        const response = await axios.get('/api/cart', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        const cartItems = response.data.products;

        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <p>${item.product.name}</p>
                <p>Quantity: ${item.quantity}</p>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

    } catch (error) {
        console.error('Error fetching cart items:', error);
    }

    // Handle checkout button click
    checkoutBtn.addEventListener('click', async () => {
        try {
            const response = await axios.post('/api/checkout', {
                // Include any necessary data for checkout
            });

            if (response.status === 200) {
                alert('Checkout successful!');
                // Optionally, redirect or update UI after successful checkout
            } else {
                alert('Checkout failed! Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again later.');
        }
    });

    // Handle generate invoice button click
    generateInvoiceBtn.addEventListener('click', () => {
        alert('Generate Invoice functionality will be implemented here.');
    });

    // Handle send invoice button click
    sendInvoiceBtn.addEventListener('click', () => {
        alert('Send Invoice functionality will be implemented here.');
    });

    // Show sign-up form and hide login form
    signupBtn.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    // Show login form and hide sign-up form
    loginBtn.addEventListener('click', () => {
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            if (response.status === 200) {
                alert('Login successful!');
                // Optionally redirect to a dashboard or home page
                window.location.href = '/dashboard';
            } else {
                alert('Login failed! Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });

    // Handle sign-up form submission
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const email = formData.get('new-email');
        const password = formData.get('new-password');

        try {
            const response = await axios.post('/api/signup', {
                email,
                password
            });

            if (response.status === 201) {
                alert('Sign up successful! Please login.');
                loginSection.style.display = 'block';
                signupSection.style.display = 'none';
            } else {
                alert('Sign up failed! Please try again.');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            alert('An error occurred during sign up. Please try again later.');
        }
    });

    // Function to format price in Rands
    function formatPriceInRands(price) {
        return `${price.toLocaleString('en-ZA')}`;
    }
});
