document.addEventListener('DOMContentLoaded', async () => {
    // Elements
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
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const generateInvoiceContainer = document.getElementById('generate-invoice-container');
    const downloadInvoiceLink = document.getElementById('download-invoice-link');

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
    generateInvoiceBtn.addEventListener('click', async () => {
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;

        try {
            const response = await axios.post('/api/generate-invoice', { customerName, customerEmail }, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            downloadInvoiceLink.href = url;
            downloadInvoiceLink.download = 'invoice.pdf';
            downloadInvoiceLink.style.display = 'block';
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('An error occurred while generating the invoice. Please try again later.');
        }
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

    // Show login form and hide sign-up and generate invoice forms
    showLoginBtn.addEventListener('click', () => {
        generateInvoiceContainer.style.display = 'none';
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Show sign-up form and hide login and generate invoice forms
    showSignupBtn.addEventListener('click', () => {
        generateInvoiceContainer.style.display = 'none';
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await axios.post('/api/login', { email, password });

            if (response.status === 200) {
                alert('Login successful!');
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
            const response = await axios.post('/api/signup', { email, password });

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
