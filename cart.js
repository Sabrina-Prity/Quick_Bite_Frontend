const addToCart = (foodId, price) => {

    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
        alert("No cart found. Please Login first.");
        return;
    }

    // Prepare data to be sent to the backend
    const data = {

        food_item: foodId,
        quantity: 1,
        price: price,
        user: localStorage.getItem("user_id"),
        cart: cartId,
    };

    console.log("Cart Data", data)
    const token = localStorage.getItem("token");
    fetch("https://quick-bite-backend-pink.vercel.app/cart/cart-item/", {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Item added to cart:", data);
            alert("Item added to cart successfully!");
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
        });
};

const loadCartProduct = () => {
    const cartId = localStorage.getItem("cartId");
    // console.log(cartId);
    if (!cartId) {
        console.log("No cart found. Please create a cart first.");
        return;
    }
    const token = localStorage.getItem("token");


    fetch(`https://quick-bite-backend-pink.vercel.app/cart/see-cart-item/${cartId}/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            // console.log("Received Cart Data:", data);
            displayCart(data);
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
        });
};


const displayCart = (items) => {
    const parent = document.getElementById("cart-section");
    parent.innerHTML = "";

    if (!items || items.length === 0) {
        parent.innerHTML += `
        <img src="Images/cart_empty.jpg" alt="Empty Cart" class="empty-cart">
        <p>Your cart is empty!</p>`;
        return;
    }

    // Group items by seller
    const groupedItems = items.reduce((groups, item) => {
        const sellerId = item.food_item.seller.id;
        if (!groups[sellerId]) {
            groups[sellerId] = {
                company_name: item.food_item.seller.company_name,
                seller_id: sellerId,
                items: [],
            };
        }
        groups[sellerId].items.push(item);
        return groups;
    }, {});

    // Display grouped items
    Object.values(groupedItems).forEach((group) => {
        const sellerHeading = document.createElement("h3");
        sellerHeading.textContent = `Seller: ${group.company_name}`;
        parent.appendChild(sellerHeading);

        const sellerContainer = document.createElement("div");
        sellerContainer.classList.add("seller-container");

        group.items.forEach((item) => {
            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.id = `cart-item-${item.id}`;

            let imageUrl = item.food_item?.image;
            if (imageUrl.includes("image/upload/https://")) {
                imageUrl = imageUrl.replace("image/upload/", "");
            }
            if (!imageUrl.startsWith("https://")) {
                imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
            }

            div.innerHTML = `
                <div class="cart-item-container">
                    <div class="cart-item-image">
                        <img src="${imageUrl}" alt="Food Image" style="width:100px; height:auto;">
                    </div>
                    <div class="cart-item-details">
                        <h4>Name: ${item.food_item.name}</h4>
                        <label for="quantity-${item.id}">Quantity:</label>
                        <input type="number" class="quantity" id="quantity-${item.id}" name="quantity" min="1"
                            max="${item.food_item?.quantity}" value="${item.quantity}"
                            onchange="updateCartQuantity('${item.id}', this.value)">
                        <p>Price: $<span id="price-${item.id}">${(item.food_item.price * item.quantity).toFixed(2)}</span></p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="detail-btn">
                            <a href="foodDetails.html?foodId=${item.food_item.id}" class="detail-link">Details</a>
                        </button>
                        <button class="delete-btn" onclick="deleteCartItem('${item.id}')">Delete</button>
                    </div>
                </div>
            `;

            sellerContainer.appendChild(div);
        });

        parent.appendChild(sellerContainer);

        const checkoutButton = document.createElement("button");
        checkoutButton.classList.add("checkout-btn");
        checkoutButton.textContent = "Place Order";

        checkoutButton.addEventListener("click", () => {
            window.location.href = `checkout.html?seller_id=${group.seller_id}`;
        });

        sellerContainer.appendChild(checkoutButton);
    });
};


const updateCartQuantity = (cartItemId, newQuantity) => {
    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

    cartData = cartData.map(item => {
        if (item.id === cartItemId) {
            item.quantity = parseInt(newQuantity);
        }
        return item;
    });

    localStorage.setItem("cartData", JSON.stringify(cartData));

    // Update price dynamically
    const priceElement = document.getElementById(`price-${cartItemId}`);
    if (priceElement) {
        const updatedItem = cartData.find(item => item.id === cartItemId);
        priceElement.textContent = (updatedItem.food_item.price * updatedItem.quantity).toFixed(2);
    }
};



// const displayCart = (items) => {
//     const parent = document.getElementById("cart-section");
//     parent.innerHTML = ""; // Clear previous cart content

//     if (!items || items.length === 0) {
//         parent.innerHTML += `
//         <img src="Images/cart_empty.jpg" alt="Empty Cart" class="empty-cart">
//         <p>Your cart is empty!</p>`;
//         return;
//     }

//     // Group items by seller
//     const groupedItems = items.reduce((groups, item) => {
//         const sellerId = item.food_item.seller.id;
//         if (!groups[sellerId]) {
//             groups[sellerId] = {
//                 company_name: item.food_item.seller.company_name,
//                 seller_id: sellerId,  // Store seller ID for later use
//                 items: [],
//             };
//         }
//         groups[sellerId].items.push(item);
//         return groups;
//     }, {});

//     // Display grouped items in the cart
//     Object.values(groupedItems).forEach((group) => {
//         const sellerHeading = document.createElement("h3");
//         sellerHeading.textContent = `Seller: ${group.company_name}`;
//         parent.appendChild(sellerHeading);

//         // Create a container for the seller's items
//         const sellerContainer = document.createElement("div");
//         sellerContainer.classList.add("seller-container");

//         group.items.forEach((item) => {
//             const div = document.createElement("div");
//             div.classList.add("cart-item");
//             div.id = item.id;


//             // Fix the image URL
//         let imageUrl = item.food_item?.image;
        
//         // Remove incorrect "image/upload/" prefix if it exists
//         if (imageUrl.includes("image/upload/https://")) {
//             imageUrl = imageUrl.replace("image/upload/", "");  
//         }

//         // Ensure the image URL is properly formatted
//         if (!imageUrl.startsWith("https://")) {
//             imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
//         }

//             div.innerHTML = `
//                 <div class="cart-item-container">
//                     <div class="cart-item-image">
//                         <img src="${imageUrl}" alt="Food Image" style="width:100px; height:auto;">
//                     </div>
//                     <div class="cart-item-details">
//                         <h4>Name: ${item.food_item.name}</h4>
//                         <label for="quantity-${item.id}">Quantity:</label>
//                         <input type="number" class="quantity" id="quantity-${item.id}" name="quantity" min="1"
//                             max="${item.food_item?.quantity}" value="${item.quantity}"
//                             onchange="updatePrice('${item.id}', ${item.food_item.price})">
//                         <p>Price: $<span id="price-${item.id}">${(item.food_item.price * item.quantity).toFixed(2)}</span></p>
//                     </div>
//                     <div class="cart-item-actions">
//                         <button class="detail-btn">
//                             <a href="foodDetails.html?foodId=${item.food_item.id}" class="detail-link">Details</a>
//                         </button>
//                         <button class="delete-btn" onclick="deleteCartItem('${item.id}')">Delete</button>
//                     </div>
//                 </div>
//             `;

//             sellerContainer.appendChild(div);
//         });

//         parent.appendChild(sellerContainer);

//         // Create a checkout button specific for this seller
//         const checkoutButton = document.createElement("button");
//         checkoutButton.classList.add("checkout-btn");
//         checkoutButton.textContent = "Place Order";

//         checkoutButton.addEventListener("click", () => {
//             // Redirect to the checkout page with the seller_id in the URL
//             window.location.href = `checkout.html?seller_id=${group.seller_id}`;
//         });

//         // Append the checkout button at the end of the seller's section
//         sellerContainer.appendChild(checkoutButton);
//     });
// };





// function updatePrice(cartItemId, unitPrice) {
//     const quantityInput = document.getElementById(`quantity-${cartItemId}`);
//     const priceElement = document.getElementById(`price-${cartItemId}`);
    
//     const quantity = parseInt(quantityInput.value);
//     const totalPrice = unitPrice * quantity;
//     priceElement.textContent = totalPrice.toFixed(2);
// }


function deleteCartItem(cartItemId) {
    const url = `https://quick-bite-backend-pink.vercel.app/cart/cart-item/update/${cartItemId}/`;
    const token = localStorage.getItem("token");
    fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const cartItemElement = document.getElementById(cartItemId);
        if (cartItemElement) {
            cartItemElement.remove(); 
        }
        setTimeout(() => {
            window.location.reload();
        }, 100); 

    })
    .catch(error => {
        console.error('Error deleting cart item:', error);
    });
}





loadCartProduct();