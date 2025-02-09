// const loadOrderDetails = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const sellerId = urlParams.get("seller_id");
//     let cartId = localStorage.getItem("cartId");

//     if (!cartId) {
//         let cartData = JSON.parse(localStorage.getItem("cartData"));
//         if (cartData && cartData.length > 0) {
//             cartId = cartData[0].cart;  
//             localStorage.setItem("cartId", cartId);
//         } else {
//             console.log("No cart found. Please create a cart first.");
//             return;
//         }
//     }

//     const token = localStorage.getItem("token");

//     fetch(`https://quick-bite-backend-pink.vercel.app/cart/see-cart-items-for-seller/${cartId}/${sellerId}/`, {
//         method: "GET",
//         headers: {
//             Authorization: `Token ${token}`,
//         },
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         console.log("Received Cart Data:", data);
//         localStorage.setItem("cartData", JSON.stringify(data));

//         // Update UI
//         displayOrderDetails(data);
//     })
//     .catch((error) => {
//         console.error("Error fetching cart details:", error);
//     });
// };



// const handleOrder = (event) => {
//     event.preventDefault();

//     const mobile = document.getElementById("mobile_no").value;
//     const district = document.getElementById("district").value;
//     const full_address = document.getElementById("address").value;

//     const urlParams = new URLSearchParams(window.location.search);
//     const sellerId = urlParams.get("seller_id");

//     let cartData = JSON.parse(localStorage.getItem("cartData"));

//     if (!cartData || cartData.length === 0) {
//         alert("Your cart is empty!");
//         return;
//     }

//     const cartId = cartData[0].cart;

//     // Get latest quantity from inputs
//     cartData = cartData.map(item => {
//         const quantityInput = document.getElementById(`quantity-${item.id}`);
//         if (quantityInput) {
//             item.quantity = parseInt(quantityInput.value);
//         }
//         return item;
//     });

//     const orderData = {
//         mobile,
//         district,
//         full_address,
//         cart_items: cartData.map(item => ({
//             food_item: item.food_item.id,
//             quantity: item.quantity,
//             price: item.food_item.price,
//         })),
//     };

//     const token = localStorage.getItem("token");

//     fetch(`https://quick-bite-backend-pink.vercel.app/order/place-order/${cartId}/${sellerId}/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Token ${token}`,
//         },
//         body: JSON.stringify(orderData),
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message === "Order placed successfully") {
//             alert("Your order has been placed successfully!");
//             deleteCartItems(cartId, sellerId);
//         } else {
//             document.getElementById("error").innerText = data.message || "An unknown error occurred.";
//         }
//     })
//     .catch(error => {
//         console.error("Error placing the order:", error);
//     });
// };




const loadOrderDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get("seller_id");
    const cartId = localStorage.getItem("cartId");
    
    if (!cartId) {
        console.log("No cart found. Please create a cart first.");
        return;
    }

    const token = localStorage.getItem("token");

    fetch(`https://quick-bite-backend-pink.vercel.app/cart/see-cart-items-for-seller/${cartId}/${sellerId}/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Received Cart Data:", data);
            
            // Save cart data to local storage
        localStorage.setItem("cartData", JSON.stringify(data));
            // Display the order details
            displayOrderDetails(data);
        })
        .catch((error) => {
            console.error("Error fetching cart details:", error);
        });
};

const displayOrderDetails = (items) => {
    const orderDetailsDiv = document.querySelector(".order-details");

    if (!items || items.length === 0) {
        orderDetailsDiv.innerHTML = "<p>No items found in your order!</p>";
        return;
    }

    let orderHTML = `
        <table class="order-table">
            <thead>
                <tr>
                    <th>Seller</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
    `;

    let grandTotal = 0;
    let sellerRows = {}; // Track the number of rows for each seller

    // Count items per seller for rowspan
    items.forEach((item) => {
        const sellerName = item.food_item.seller.company_name;
        sellerRows[sellerName] = (sellerRows[sellerName] || 0) + 1;
    });

    let addedSellers = {}; // Track which sellers have been added

    items.forEach((item) => {
        const sellerName = item.food_item.seller.company_name;
        const totalPrice = parseFloat(item.food_item.price) * item.quantity;
        grandTotal += totalPrice;

        orderHTML += `
            <tr>
                ${!addedSellers[sellerName] ? `<td rowspan="${sellerRows[sellerName]}">${sellerName}</td>` : ""}
                <td>${item.food_item.name}</td>
                <td>${item.quantity}</td>
                <td>$${parseFloat(item.food_item.price).toFixed(2)}</td>
                <td>$${totalPrice.toFixed(2)}</td>
            </tr>
        `;

        addedSellers[sellerName] = true; // Mark this seller as added
    });

    orderHTML += `
            </tbody>
        </table>
        <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
    `;

    orderDetailsDiv.innerHTML = orderHTML;
};






const handleOrder = (event) => {
    event.preventDefault();

    // Collect form data
    const mobile = document.getElementById("mobile_no").value;
    const district = document.getElementById("district").value;
    const full_address = document.getElementById("address").value;

    // Get sellerId from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get("seller_id");

    // Get cart data from localStorage
    let cartData = JSON.parse(localStorage.getItem("cartData"));

    if (!cartData || cartData.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const cartId = cartData[0].cart; 
    console.log("CartId", cartId)
    const orderData = {
        mobile,
        district,
        full_address,
        cart_items: cartData.map(item => ({
            food_item: item.food_item.id,  // sending food_item ID
            quantity: item.quantity,        // sending quantity
            price: item.price,              // sending price
        })),
    };
    console.log("OrderData", orderData)

    const token = localStorage.getItem("token");

    fetch(`https://quick-bite-backend-pink.vercel.app/order/place-order/${cartId}/${sellerId}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(orderData), // Send orderData containing cart_items
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Order placed successfully") {
            alert("Your order has been placed successfully!");

            // Delete cart items for the specific seller
            deleteCartItems(cartId, sellerId);
        } else {
            document.getElementById("error").innerText = data.message || "An unknown error occurred.";
        }
    })
    .catch(error => {
        console.error("Error placing the order:", error);
        document.getElementById("error").innerText = "There was an issue placing the order.";
    });
};

// Function to delete cart items for a specific seller
const deleteCartItems = (cartId, sellerId) => {
    const token = localStorage.getItem("token");

    fetch(`https://quick-bite-backend-pink.vercel.app/cart/clear-seller-cart/${cartId}/${sellerId}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${token}`,
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Cart items for this seller deleted successfully.");

            // Remove cart items from localStorage that belong to this seller
            let cartData = JSON.parse(localStorage.getItem("cart_data")) || [];
            cartData = cartData.filter(item => item.food_item.seller.id !== parseInt(sellerId));
            localStorage.setItem("cart_data", JSON.stringify(cartData));

            // Reload cart display
            loadCartProduct();
        } else {
            console.error("Failed to delete cart items for this seller.");
        }
    })
    .catch(error => console.error("Error deleting cart items:", error));
};


// function SSLpayment(event) {
//     event.preventDefault();  

//     const token = localStorage.getItem("token");
//     if (!token) {
//         alert("You are not logged in! Please log in first.");
//         return;
//     }

//     fetch("http://127.0.0.1:8000/payment/post_payment/", {
//         method: "POST",
//         headers: {
//             "Authorization": `Token ${token}`,  
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             order_id: 1,  // Ensure this is a valid order ID
//         }),
//     })
//     .then(response => {
//         if (response.status === 403) {
//             alert("Access forbidden. Please check your authentication token.");
//         }
//         return response.json();
//     })
//     .then(result => {
//         if (result.status === "success") {
//             window.location.href = result.payment_url;  
//         } else {
//             alert("Payment initiation failed: " + result.message);
//         }
//     })
//     .catch(error => {
//         console.error("Error initiating payment:", error);
//         alert("Something went wrong. Please check your connection.");
//     });
// }



loadOrderDetails();
