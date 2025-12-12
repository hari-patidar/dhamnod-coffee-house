 // 1. GLOBAL CART STORAGE
    let cart = [];

    // Utility: Show Toast Notification
    function showToast(message) {
        const toast = document.getElementById('item-toast');
        if (!toast) {
            console.log("Notification:", message);
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    // Utility: Update Cart Count Badge
    function updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (!countElement) return;

        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        countElement.textContent = totalQuantity;

        // Show/Hide the badge based on quantity
        countElement.style.opacity = (totalQuantity > 0) ? 1 : 0;
    }
    
    // Utility: Dynamically build cart list in modal
    function renderCartItems() {
        const listElement = document.getElementById('cart-items-list');
        const emptyDisplay = document.getElementById('empty-cart-display');
        const modalFooter = document.querySelector('.modal-footer');
        
        // Calculate Total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cart.length === 0) {
            listElement.innerHTML = '';
            emptyDisplay.style.display = 'block'; // SHOW empty state
            
            // Update Footer for empty cart
            modalFooter.innerHTML = `
                <button class="checkout-btn" onclick="closeModal()">Continue Browsing</button>
            `;
            return;
        }

        emptyDisplay.style.display = 'none'; // HIDE empty state

        // Render the list items
        listElement.innerHTML = cart.map(item => `
            <li>
                <span>${item.name}</span>
                <div style="display:flex; align-items:center;">
                    <span style="font-size:0.9rem; margin-right: 5px;">₹${item.price}</span>
                    <span class="item-qty">${item.quantity} x</span>
                    <button class="remove-item-btn" onclick="removeItem('${item.name}')">×</button>
                </div>
            </li>
        `).join('');

        // Update Footer with WhatsApp button and Total
        modalFooter.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px dashed #e0d9c9; margin-top: 5px;">
                <span style="font-weight: 700; font-size: 1.2rem;">Total:</span>
                <span style="font-weight: 800; font-size: 1.3rem; color: var(--color-espresso);">₹${total}</span>
            </div>
            <button class="checkout-btn" style="background-color: #25D366; margin-bottom: 8px;" onclick="placeOrderWhatsApp()">
                Send Order via WhatsApp 💬
            </button>
            <button class="checkout-btn" style="background-color: var(--color-sage);" onclick="closeModal()">Continue Browsing</button>
        `;
    }
    
    // NEW FUNCTION: Place Order via WhatsApp
    function placeOrderWhatsApp() {
        // NOTE: Your WhatsApp number has been successfully added here.
        const whatsappNumber = "918982628715"; 

        if (cart.length === 0) {
            showToast("Your cart is empty! Add items first.");
            return;
        }

        // Build the text message
        let orderMessage = "DCH Cafe Order:\n\n";
        let total = 0;
        
        cart.forEach((item, index) => {
            orderMessage += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        });

        orderMessage += `\n--- Total: ₹${total} --- \n\n*Please confirm delivery/pickup details.*`;
        
        // Encode the message for the URL
        const encodedMessage = encodeURIComponent(orderMessage);
        
        // Construct the WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open the link in a new tab/window
        window.open(whatsappUrl, '_blank');
        
        // Optional: Clear cart after sending (uncomment if you want this behaviour)
        // cart = [];
        // updateCartCount();
        // renderCartItems();
        // closeModal();
    }


    // NEW INTERACTIVITY: Remove/Decrease Item Quantity
    function removeItem(name) {
        const itemIndex = cart.findIndex(item => item.name === name);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
                showToast(`Removed 1x ${name}. Quantity now: ${cart[itemIndex].quantity}`);
            } else {
                cart.splice(itemIndex, 1); // Remove item completely
                showToast(`${name} removed from cart.`);
            }
        }
        
        updateCartCount();
        renderCartItems(); // Re-render the modal list
    }


    // CORE NAVIGATION FUNCTION: Using direct inline style manipulation for maximum reliability
    function showPage(pageId) {
        const homePage = document.getElementById('home-page');
        const menuPage = document.getElementById('menu-page');
        
        // Use direct style manipulation for robustness
        if (homePage) homePage.style.display = 'none';
        if (menuPage) menuPage.style.display = 'none';
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
        } else {
            console.error('Target page ID not found:', pageId);
        }
    }

    function showMenu() {
        showPage('menu-page');
    }

    function showHome() {
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active-category');
        });
        document.querySelectorAll('.menu-item-list').forEach(list => {
            list.querySelectorAll('.menu-item-card').forEach(card => {
                card.style.animation = '';
                card.style.opacity = 0;
            });
            list.classList.add('hidden');
        });
        showPage('home-page');
    }

    // This function will automatically retain focus on the clicked button
    function showCategory(categoryName, clickedButton) {
        // 1. Handle Active Category Highlighting
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active-category');
        });
        if (clickedButton) {
            clickedButton.classList.add('active-category');
            clickedButton.focus(); // Explicitly retain focus for accessibility
        }

        // 2. Hide all menu lists first
        document.querySelectorAll('.menu-item-list').forEach(list => {
            list.querySelectorAll('.menu-item-card').forEach(card => {
                card.style.animation = '';
                card.style.opacity = 0; 
            });
            list.classList.add('hidden');
        });

        // 3. Show the selected menu list
        const selectedList = document.getElementById(categoryName + '-menu');
        if (selectedList) {
            selectedList.classList.remove('hidden');
            selectedList.querySelectorAll('.menu-item-card').forEach((card, index) => {
                card.style.animation = `itemFadeIn 0.3s ease-out forwards`;
                card.style.animationDelay = `${index * 0.05}s`; 
            });

            // 4. Scroll to the menu list
            selectedList.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'      
            });
        } else {
            showToast('Menu items for ' + categoryName.replace('_', ' ').toUpperCase() + ' are coming soon!');
        }
    }
    
    // ADD TO ORDER FUNCTION: Now uses Toast
    function addToOrder(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
            showToast(`Added another: ${name} (x${existingItem.quantity})`);
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
            showToast(`${name} added to order!`);
        }
        
        updateCartCount();
    }

    // MODAL FUNCTIONS
    function openModal() {
        renderCartItems(); // Render content before opening
        document.getElementById('cart-modal').classList.add('open');
    }

    function closeModal() {
        document.getElementById('cart-modal').classList.remove('open');
    }

    // SHOW CART FUNCTION: Now opens the modal
    function showCart() {
        openModal();
    }
    
    // Initial setup
    updateCartCount();


    // PWA: Service Worker Registration Logic (sw.js content would go here if inlined)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // NOTE: Since you are combining, the sw.js content is not here. 
        // This registration will FAIL unless you still host sw.js separately.
        // It is strongly recommended to keep the sw.js file separate for hosting.
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }