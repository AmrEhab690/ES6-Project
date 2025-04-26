document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slider img');
    const usernameEl = document.getElementById("username");
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    const filterBtn = document.getElementById('filterBtn');
    const priceFilter = document.getElementById('priceFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const addButtons = document.querySelectorAll('.add-btn');
    const toast = document.getElementById('toast');

    const username = localStorage.getItem("username");
    if (usernameEl) {
        usernameEl.textContent = username || "Guest";
    }

let currentSlide = 0;
const nextBtn = document.getElementById('nextSlide');
const prevBtn = document.getElementById('prevSlide');
const dotsContainer = document.querySelector('.dots-container');      

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });
    const dots = document.querySelectorAll('.dots-container span');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) dot.classList.add('active');
    });
}

slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot'); 
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
    dotsContainer.appendChild(dot);
});

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

let sliderInterval = setInterval(nextSlide, 4000);

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
}

showSlide(currentSlide);

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const show = (category === 'all' || category === cardCategory);
                card.classList.toggle('hidden', !show);
            });
        });
    });

    function matchesPriceFilter(price, filter) {
        if (filter === 'low') return price >= 0 && price <= 50;
        if (filter === 'medium') return price > 50 && price <= 100;
        if (filter === 'high') return price > 100;
        return true;
    }

    function matchesSizeFilter(size, filter) {
        return filter === 'all' || size === filter;
    }

    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const selectedPrice = priceFilter.value;
            const selectedSize = sizeFilter.value;
            const selectedCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'all';

            productCards.forEach(card => {
                const productPrice = parseInt(card.getAttribute('data-price'));
                const productSize = card.getAttribute('data-size');
                const cardCategory = card.getAttribute('data-category');

                const priceMatch = matchesPriceFilter(productPrice, selectedPrice);
                const sizeMatch = matchesSizeFilter(productSize, selectedSize);
                const categoryMatch = selectedCategory === 'all' || selectedCategory === cardCategory;

                const showCard = priceMatch && sizeMatch && categoryMatch;
                card.classList.toggle('hidden', !showCard);
            });
        });
    }

    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.getAttribute('data-price')),
                image: card.querySelector('img').src,
                quantity: 1,
                size: card.getAttribute('data-size'),
                category: card.getAttribute('data-category')
            };

            const username = localStorage.getItem("username");
            let cart = JSON.parse(localStorage.getItem(username + '_cart')) || [];

            const existingProductIndex = cart.findIndex(item =>
                item.name === product.name &&
                item.size === product.size &&
                item.category === product.category
            );

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem(username + '_cart', JSON.stringify(cart));
            const qty = cart[existingProductIndex > -1 ? existingProductIndex : cart.length - 1].quantity;

            const btn = e.target;
            btn.textContent = "Added ✅";
            btn.disabled = true; 

            showToast(`${product.name} (x${qty}) added to your cart!`);
        });
    });

    function checkIfProductInCart() {
        const username = localStorage.getItem("username");
        const cart = JSON.parse(localStorage.getItem(username + '_cart')) || [];

        addButtons.forEach(button => {
            const card = button.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const productSize = card.getAttribute('data-size');
            const productCategory = card.getAttribute('data-category');

            const existingProductIndex = cart.findIndex(item =>
                item.name === productName &&
                item.size === productSize &&
                item.category === productCategory
            );

            if (existingProductIndex > -1) {
                button.textContent = "Added ✅";
                button.disabled = true;   
            }
        });
    }

    checkIfProductInCart();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        showToast("You must be logged in first.");
        setTimeout(() => {
            window.location.href = "../sign_in/signin.html";
        }, 2000);
    }

    const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");

        showToast("You have been logged out.", () => {
            console.log("Redirecting to sign in...");
            window.location.href = "../sign_in/signin.html";
        });
    });
}

    function showToast(message, callback) {
        const toast = document.getElementById('toast');
        if (!toast) return;
    
        toast.textContent = message;
        toast.classList.add('show');
    
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            if (typeof callback === 'function') callback(); 
        }, 2000);
    }
    
});


