// public/js/cart.js
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.dataset.productId;
            const quantity = 1; // Or get the quantity from user input

            addToCartButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.dataset.productId;
                    
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity })
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Product added to cart!');
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                alert('Error adding product to cart');
            }
        });
    });
});
