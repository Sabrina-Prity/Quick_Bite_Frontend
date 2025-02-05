const loadOrderDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get("seller_id");

if (sellerId) {
    // Fetch seller details or display them accordingly
    console.log("Seller ID: ", sellerId);
}
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
            localStorage.setItem("cart_data", JSON.stringify(data));
            localStorage.setItem("order_id", JSON.stringify(data.id));
            // Group data by seller
            const groupedItems = data.reduce((acc, item) => {
                const sellerName = item.food_item.seller.company_name;

                if (!acc[sellerName]) {
                    acc[sellerName] = {
                        company_name: sellerName,
                        items: [],
                    };
                }
                acc[sellerName].items.push(item);

                return acc;
            }, {});

            
            displayOrderDetails(groupedItems);
        })
        .catch((error) => {
            console.error("Error fetching cart details:", error);
        });
};

const displayOrderDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get("seller_id");
    const cartData = JSON.parse(decodeURIComponent(urlParams.get("cart")) || "[]");

    // Display the order details in console for debugging
    console.log("Seller ID:", sellerId);
    console.log("Cart Items:", cartData);

    const orderDetailsDiv = document.querySelector(".order-details");

    // Check if cartData exists and has content
    if (!cartData || cartData.length === 0) {
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

    // Loop through the cartData to display items
    cartData.forEach((item, index) => {
        // Assuming you have a way to get the food details (like price and name) from the food_id
        const foodItem = getFoodDetailsById(item.food_id);  // Create this function to fetch food item details by ID
        const quantity = item.quantity;
        const price = foodItem.price;  // Assuming price is in foodItem
        const totalPrice = parseFloat(price) * quantity;
        grandTotal += totalPrice;

        orderHTML += `
            <tr>
                <td>${foodItem.seller.company_name}</td>
                <td>${foodItem.name}</td>
                <td>${quantity}</td>
                <td>$${parseFloat(price).toFixed(2)}</td>
                <td>$${totalPrice.toFixed(2)}</td>
            </tr>
        `;
    });

    orderHTML += `
        </tbody>
    </table>
    <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
    `;

    orderDetailsDiv.innerHTML = orderHTML;
};

// const displayOrderDetails = () => {
//     const urlParams = new URLSearchParams(window.location.search);
// const sellerId = urlParams.get("seller_id");
// const cartData = JSON.parse(decodeURIComponent(urlParams.get("cart")) || "[]");

// // Display the order details
// console.log("Seller ID:", sellerId);
// console.log("Cart Items:", cartData);
//     const orderDetailsDiv = document.querySelector(".order-details");

//     // Check if groupedItems exist and have content
//     if (!groupedItems || Object.keys(groupedItems).length === 0) {
//         orderDetailsDiv.innerHTML = "<p>No items found in your order!</p>";
//         return;
//     }

//     let orderHTML = `
//         <table class="order-table">
//             <thead>
//                 <tr>
//                     <th>Seller</th>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Unit Price</th>
//                     <th>Total Price</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     let grandTotal = 0;

//     // Loop through grouped items
//     Object.values(groupedItems).forEach((group) => {
//         const { company_name, items } = group;

//         // Loop through items for each seller
//         items.forEach((item, index) => {
//             const { food_item, quantity, price } = item;
//             const totalPrice = parseFloat(price) * quantity;
//             grandTotal += totalPrice;

//             orderHTML += `
//                 <tr>
//                     ${index === 0 ? `<td rowspan="${items.length}">${company_name}</td>` : ""}
//                     <td>${food_item.name}</td>
//                     <td>${quantity}</td>
//                     <td>$${parseFloat(price).toFixed(2)}</td>
//                     <td>$${totalPrice.toFixed(2)}</td>
//                 </tr>
//             `;
//         });
//     });

//     orderHTML += `
//             </tbody>
//         </table>
//         <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
//     `;

//     orderDetailsDiv.innerHTML = orderHTML;
// };

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
    let cartData = JSON.parse(localStorage.getItem("cart_data"));

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
