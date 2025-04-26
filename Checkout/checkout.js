document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem("username");
    if (!username) {
        showToast("You must be logged in to view your cart.", "error");
        window.location.href = "../sign_in/signin.html";   
        return;
    }

    let cart = JSON.parse(localStorage.getItem(username + '_cart')) || [];
    
    function renderCheckoutItems() {
        const checkoutItemsContainer = document.getElementById('checkoutItems');
        checkoutItemsContainer.innerHTML = ''; 
        let total = 0;

        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.classList.add('checkout-item');
            checkoutItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span class="quantity">x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            checkoutItemsContainer.appendChild(checkoutItem);
            total += item.price * item.quantity;
        });

        document.getElementById('totalAmount').textContent = total.toFixed(2);
    }

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const customerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            paymentMethod: formData.get('paymentMethod')
        };

        console.log('Customer Data:', customerData);

        showToast('Your order has been placed successfully!', 'success');
 
        localStorage.removeItem(username + '_cart');
        window.location.href = '../orderConfirmation/orderConfirmation.html'; // Redirect to confirmation page
    });

    renderCheckoutItems();
});


function showToast(message, type) {
    const toast = document.createElement("div");
    toast.classList.add("toast", type === "success" ? "success-toast" : "error-toast");
    toast.textContent = message;
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
  
