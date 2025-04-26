document.addEventListener('DOMContentLoaded', () => {

    const username = localStorage.getItem("username");
    if (!username) {
        showToast("You must be logged in to view your cart.");
        setTimeout(() => {
            window.location.href = "../sign_in/signin.html";
        }, 2000);
        return;
    }

    let cart = JSON.parse(localStorage.getItem(username + '_cart')) || [];

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <div class="quantity">
                    <button class="decrease" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove" onclick="removeItem(${index})">Remove</button>
            `;

            cartItemsContainer.appendChild(cartItem);
            total += parseFloat(item.price) * item.quantity;
        });

        document.getElementById('totalAmount').textContent = total.toFixed(2);
    }


    window.updateQuantity = function(index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
            localStorage.setItem(username + '_cart', JSON.stringify(cart));
            renderCartItems();
        }
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem(username + '_cart', JSON.stringify(cart));
        renderCartItems();
    }

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        window.location.href = '../Checkout/checkout.html';
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            showToast("You have been logged out.");
            setTimeout(() => {
                window.location.href = "../sign_in/signin.html";
            }, 2000);
        });
    }

    renderCartItems();
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
