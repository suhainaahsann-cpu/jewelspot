document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // JEWEL SPOT - SHOPPING CART & FAVOURITES
    // =====================================

    const WHATSAPP_NUMBER = "923324185675";

    let cart = JSON.parse(localStorage.getItem("jewelSpotCart")) || [];
    let favorites = JSON.parse(localStorage.getItem("jewelSpotFavorites")) || [];

    const cartButton = document.getElementById("cart-button");
    const favoritesButton = document.getElementById("favorites-button");

    const cartCount = document.getElementById("cart-count");
    const favoritesCount = document.getElementById("favorites-count");

    const cartOverlay = document.getElementById("cart-overlay");
    const favoritesOverlay = document.getElementById("favorites-overlay");

    const cartItemsContainer = document.getElementById("cart-items");
    const favoritesItemsContainer = document.getElementById("favorites-items");

    const cartTotal = document.getElementById("cart-total");
    const checkoutForm = document.getElementById("checkout-form");


    // =====================================
    // PRODUCT INFORMATION
    // =====================================

    function getProductInfo(card) {

        const name = card.querySelector("h4").innerText;
        const priceText = card.querySelector(".price").innerText;
        const price = Number(priceText.replace(/[^\d]/g, ""));
        const image = card.querySelector("img").getAttribute("src");

        return {
            id: name,
            name: name,
            price: price,
            image: image
        };
    }


    function saveCart() {
        localStorage.setItem("jewelSpotCart", JSON.stringify(cart));
    }


    function saveFavorites() {
        localStorage.setItem("jewelSpotFavorites", JSON.stringify(favorites));
    }


    function formatPrice(price) {
        return "Rs. " + price.toLocaleString("en-PK");
    }


    // =====================================
    // OPEN AND CLOSE PANELS
    // =====================================

    function openPanel(panel) {

        panel.classList.add("active");
        panel.setAttribute("aria-hidden", "false");

        document.body.classList.add("panel-open");
    }


    function closePanel(panel) {

        panel.classList.remove("active");
        panel.setAttribute("aria-hidden", "true");

        if (
            !cartOverlay.classList.contains("active") &&
            !favoritesOverlay.classList.contains("active")
        ) {
            document.body.classList.remove("panel-open");
        }
    }


    cartButton.addEventListener("click", function (event) {

        event.preventDefault();

        renderCart();
        openPanel(cartOverlay);

    });


    favoritesButton.addEventListener("click", function (event) {

        event.preventDefault();

        renderFavorites();
        openPanel(favoritesOverlay);

    });


    document.querySelectorAll("[data-close-panel]").forEach(button => {

        button.addEventListener("click", function () {

            closePanel(this.closest(".shop-overlay"));

        });

    });


    [cartOverlay, favoritesOverlay].forEach(panel => {

        panel.addEventListener("click", function (event) {

            if (event.target === panel) {
                closePanel(panel);
            }

        });

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closePanel(cartOverlay);
            closePanel(favoritesOverlay);

        }

    });


    // =====================================
    // ADD PRODUCTS TO CART
    // =====================================

    document.querySelectorAll(".product-card").forEach(card => {

        const addButton = card.querySelector(".btn-secondary");

        addButton.addEventListener("click", function () {

            const product = getProductInfo(card);

            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({
                    ...product,
                    quantity: 1
                });

            }

            saveCart();
            updateCartCount();

            alert(product.name + " has been added to your shopping bag!");

        });

    });


    // =====================================
    // UPDATE CART COUNTER
    // =====================================

    function updateCartCount() {

        const totalQuantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.innerText = totalQuantity;

    }


    // =====================================
    // DISPLAY CART PRODUCTS
    // =====================================

    function renderCart() {

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {

            cartItemsContainer.innerHTML =
                '<p class="empty-state">Your bag is currently empty.</p>';

            cartTotal.innerText = formatPrice(0);

            return;
        }


        cart.forEach(item => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-details">

                    <h4>${item.name}</h4>

                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity-controls">

                        <button type="button" class="quantity-minus"
                            aria-label="Decrease quantity">−</button>

                        <span>${item.quantity}</span>

                        <button type="button" class="quantity-plus"
                            aria-label="Increase quantity">+</button>

                    </div>

                    <button type="button" class="remove-item">
                        Remove
                    </button>

                </div>
            `;


            cartItem.querySelector(".quantity-minus").addEventListener(
                "click",
                function () {
                    changeQuantity(item.id, -1);
                }
            );


            cartItem.querySelector(".quantity-plus").addEventListener(
                "click",
                function () {
                    changeQuantity(item.id, 1);
                }
            );


            cartItem.querySelector(".remove-item").addEventListener(
                "click",
                function () {
                    removeFromCart(item.id);
                }
            );


            cartItemsContainer.appendChild(cartItem);

        });


        updateCartTotal();

    }


    // =====================================
    // CHANGE PRODUCT QUANTITY
    // =====================================

    function changeQuantity(productId, change) {

        const product = cart.find(item => item.id === productId);

        if (!product) return;

        product.quantity += change;

        if (product.quantity <= 0) {

            cart = cart.filter(item => item.id !== productId);

        }

        saveCart();
        updateCartCount();
        renderCart();

    }


    // =====================================
    // REMOVE PRODUCT FROM CART
    // =====================================

    function removeFromCart(productId) {

        cart = cart.filter(item => item.id !== productId);

        saveCart();
        updateCartCount();
        renderCart();

    }


    // =====================================
    // CALCULATE TOTAL PRICE
    // =====================================

    function updateCartTotal() {

        const total = cart.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        cartTotal.innerText = formatPrice(total);

    }


    // =====================================
    // FAVOURITES / WISHLIST
    // =====================================

    document.querySelectorAll(".product-card").forEach(card => {

        const favoriteButton = card.querySelector(".favorite-toggle");

        const product = getProductInfo(card);

        if (favorites.some(item => item.id === product.id)) {

            favoriteButton.classList.add("is-favorite");
            favoriteButton.innerText = "♥";
            favoriteButton.setAttribute("aria-pressed", "true");

        }


        favoriteButton.addEventListener("click", function () {

            const existingFavorite = favorites.some(
                item => item.id === product.id
            );

            if (existingFavorite) {

                favorites = favorites.filter(
                    item => item.id !== product.id
                );

                favoriteButton.classList.remove("is-favorite");
                favoriteButton.innerText = "♡";
                favoriteButton.setAttribute("aria-pressed", "false");

            } else {

                favorites.push(product);

                favoriteButton.classList.add("is-favorite");
                favoriteButton.innerText = "♥";
                favoriteButton.setAttribute("aria-pressed", "true");

            }

            saveFavorites();
            updateFavoritesCount();
            renderFavorites();

        });

    });


    function updateFavoritesCount() {

        favoritesCount.innerText = favorites.length;

    }


    // =====================================
    // DISPLAY FAVOURITES
    // =====================================

    function renderFavorites() {

        favoritesItemsContainer.innerHTML = "";

        if (favorites.length === 0) {

            favoritesItemsContainer.innerHTML =
                '<p class="empty-state">You haven\'t saved any favourites yet.</p>';

            return;
        }


        favorites.forEach(item => {

            const favoriteItem = document.createElement("div");

            favoriteItem.className = "cart-item";

            favoriteItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-details">

                    <h4>${item.name}</h4>

                    <p>${formatPrice(item.price)}</p>

                    <button type="button" class="favorite-remove">
                        Remove from Favourites
                    </button>

                </div>
            `;


            favoriteItem.querySelector(".favorite-remove").addEventListener(
                "click",
                function () {

                    favorites = favorites.filter(
                        product => product.id !== item.id
                    );

                    saveFavorites();
                    updateFavoritesCount();

                    const card = Array.from(
                        document.querySelectorAll(".product-card")
                    ).find(card => getProductInfo(card).id === item.id);

                    if (card) {

                        const button = card.querySelector(".favorite-toggle");

                        button.classList.remove("is-favorite");
                        button.innerText = "♡";
                        button.setAttribute("aria-pressed", "false");

                    }

                    renderFavorites();

                }
            );


            favoritesItemsContainer.appendChild(favoriteItem);

        });

    }


    // =====================================
    // WHATSAPP CHECKOUT
    // =====================================

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your shopping bag is empty!");

            return;
        }


        const customerName = document.getElementById("customer-name").value.trim();

        const customerPhone = document.getElementById("customer-phone").value.trim();

        const customerAddress = document.getElementById("customer-address").value.trim();

        const customerNotes = document.getElementById("customer-notes").value.trim();


        const total = cart.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );


        let message = "Hello JEWEL SPOT! I would like to place an order.\n\n";

        message += "CUSTOMER DETAILS\n";
        message += "Name: " + customerName + "\n";
        message += "Phone: " + customerPhone + "\n";
        message += "Address: " + customerAddress + "\n";

        if (customerNotes) {
            message += "Additional Instructions: " + customerNotes + "\n";
        }

        message += "\nORDER DETAILS\n";

        cart.forEach(item => {

            message +=
                item.name +
                " x " +
                item.quantity +
                " = " +
                formatPrice(item.price * item.quantity) +
                "\n";

        });


        message += "\nTOTAL: " + formatPrice(total);

        message += "\n\nPlease confirm my order. Thank you!";


        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);


        window.open(whatsappURL, "_blank");

    });


    // =====================================
    // EXISTING PRODUCT FILTERS
    // =====================================

    const filterButtons = document.querySelectorAll(".filter-btn");

    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            const filter = this.getAttribute("data-filter");

            filterButtons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");


            productCards.forEach(card => {

                const category = card.getAttribute("data-category");

                if (filter === "all" || category === filter) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


    // =====================================
    // EXISTING NEWSLETTER FORM
    // =====================================

    const newsletterForm = document.getElementById("newsletter-form");

    const emailInput = document.getElementById("email-input");

    const formMessage = document.getElementById("form-message");


    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (emailInput.value.trim() !== "") {

            formMessage.innerText =
                "Thank you for subscribing to JEWEL SPOT!";

            emailInput.value = "";

        }

    });


    // =====================================
    // INITIAL PAGE SETUP
    // =====================================

    updateCartCount();
    updateFavoritesCount();

    renderCart();
    renderFavorites();

});
