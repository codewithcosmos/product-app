// public/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');

    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = `
                    <div class="product">
                        <img src="${product.productImage}" alt="${product.productName}">
                        <h3>${product.productName}</h3>
                        <p>${product.productDescription}</p>
                        <p>${product.productPrice}</p>
                    </div>
                `;
                productsList.innerHTML += productCard;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
