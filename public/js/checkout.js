document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.getElementById('checkout-button');

    checkoutButton.addEventListener('click', async () => {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        try {
            await axios.post('/api/cart/checkout', { paymentMethod });
            window.location.href = '/api/cart/checkout';
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Failed to proceed to checkout');
        }
    });
});
