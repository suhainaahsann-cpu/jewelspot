/* ========================================== */
/* JEWEL SPOT - MAIN JAVASCRIPT FILE          */
/* ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================== */
    // 1. ADD TO CART FUNCTIONALITY
    // ========================================== */
    const addToBagButtons = document.querySelectorAll('.product-card .btn-secondary');
    const cartCountSpan = document.getElementById('cart-count');
    let cartCount = 0;

    addToBagButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Find the product card containing the clicked button
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h4').innerText;
            
            // Increment and update cart count badge
            cartCount++;
            if (cartCountSpan) {
                cartCountSpan.innerText = cartCount;
            }

            // Show a simple confirmation message
            alert(`Success! "${productName}" has been added to your bag.`);
        });
    });

    // ========================================== */
    // 2. PRODUCT FILTERS FUNCTIONALITY
    // ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Show or hide product cards based on selected category
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ========================================== */
    // 3. WHATSAPP ORDERING FUNCTIONALITY
    // ========================================== */
    // Dynamically inject an "Order on WhatsApp" button into each product card 
    // to keep your original HTML untouched while adding this feature.
    const productInfos = document.querySelectorAll('.product-info');
    const whatsappNumber = '923324185675';

    productInfos.forEach(info => {
        const productName = info.querySelector('h4').innerText;
        
        const whatsappBtn = document.createElement('button');
        whatsappBtn.type = 'button';
        whatsappBtn.className = 'btn-whatsapp';
        whatsappBtn.innerText = 'Order on WhatsApp';
        
        // Styling for the dynamic WhatsApp button to match your theme
        whatsappBtn.style.cssText = 'display: block; width: 100%; margin-top: 8px; background-color: #25D366; color: white; border: none; padding: 6px 16px; font-size: 0.8rem; cursor: pointer; border-radius: 2px; transition: opacity 0.3s ease;';
        
        whatsappBtn.addEventListener('mouseenter', () => whatsappBtn.style.opacity = '0.9');
        whatsappBtn.addEventListener('mouseleave', () => whatsappBtn.style.opacity = '1');

        // Open WhatsApp with pre-filled message when clicked
        whatsappBtn.addEventListener('click', () => {
            const message = encodeURIComponent(`Hello JEWEL SPOT, I would like to place an order for "${productName}". Please share more details.`);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappURL, '_blank');
        });

        info.appendChild(whatsappBtn);
    });

    // ========================================== */
    // 4. EMAIL CONTACT LINK SETUP
    // ========================================== */
    const emailAddress = 'suhainaahsan1620@gmail.com';
    const footerLinks = document.querySelectorAll('.footer-col ul li a');

    // Connect any contact links in the footer directly to the email via mailto
    footerLinks.forEach(link => {
        if (link.innerText.toLowerCase().includes('contact')) {
            link.href = `mailto:${emailAddress}`;
        }
    });

    // ========================================== */
    // 5. NEWSLETTER FORM VALIDATION
    // ========================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const formMessage = document.getElementById('form-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            const emailValue = emailInput.value.trim();

            // Basic email validation check
            if (emailValue === '' || !emailValue.includes('@') || !emailValue.includes('.')) {
                formMessage.style.color = '#d9534f';
                formMessage.innerText = 'Please enter a valid email address.';
                return;
            }

            // Display success message (no server storage simulated)
            formMessage.style.color = '#3b7a57';
            formMessage.innerText = 'Thank you for joining the JEWEL SPOT inner circle!';
            emailInput.value = ''; // Clear input field
        });
    }

});
