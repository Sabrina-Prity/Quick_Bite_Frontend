const displayOrderHistory = () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("user_id");

    // Get the order-history container
    const orderHistoryContainer = document.getElementById("order-history");

    // Create and append the loading message and spinner inside the order-history div
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-container-customer");
    loadingDiv.innerHTML = `
        <img src="Images/loading.png" alt="Loading..." />
        <p>Loading your order history...</p>
    `;
    orderHistoryContainer.innerHTML = ''; // Clear any previous content
    orderHistoryContainer.appendChild(loadingDiv); // Append the loading div

    // Fetch the order history from the server
    fetch(`https://quick-bite-backend-pink.vercel.app/order/orders-view/${id}/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((orders) => {
        console.log(orders);
        orderHistoryContainer.innerHTML = ""; // Clear the loading spinner

        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = "<p>No orders found.</p>";
        } else {
            const table = document.createElement("table");
            table.classList.add("order-history-table");

            // Table Header
            const header = document.createElement("thead");
            header.innerHTML = `  
                <tr>
                    <th>Order ID</th>
                    <th>Food Items</th>
                    <th>Total Price</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Complete Your Payment</th>
                </tr>
            `;
            table.appendChild(header);

            const tbody = document.createElement("tbody");

            orders.forEach((order) => {
                let totalPrice = 0;
                let productListHTML = "<ul style='padding-left: 15px; text-align: left;'>";

                order.order_items.forEach((item) => {
                    const productName = item.food_item.name;
                    const price = parseFloat(item.food_item.price);
                    const quantity = item.quantity;
                    totalPrice += price * quantity;

                    productListHTML += `<li>${productName} (x${quantity}) - $${(price * quantity).toFixed(2)}</li>`;
                });

                productListHTML += "</ul>";

                const orderRow = document.createElement("tr");
                orderRow.innerHTML = `
                    <td>${order.id}</td>
                    <td>${productListHTML}</td>
                    <td>$${totalPrice.toFixed(2)}</td>
                    <td class="status-cell">${order.buying_status}</td>
                    <td class="payment-status status-complete">${order.payment_status}</td>
                    <td> 
                        <button class="pay-button" 
                            onclick="SSLpayment(${order.id}, ${totalPrice}, ${order.order_items.length})"
                            ${order.payment_status === "Completed" ? "disabled style='background:gray; cursor:not-allowed;'" : ""}>
                            ${order.payment_status === "Completed" ? "Paid" : "Pay Now"}
                        </button>
                    </td> 
                `;

                // Update the status cell styles based on the order status
                const statusCell = orderRow.querySelector(".status-cell");
                if (order.buying_status === "Pending") {
                    statusCell.classList.add("status-pending");
                } else if (order.buying_status === "Completed") {
                    statusCell.classList.add("status-complete");
                } else if (order.buying_status === "Canceled") {
                    statusCell.classList.add("status-canceled");
                }

                tbody.appendChild(orderRow);
            });

            table.appendChild(tbody);
            orderHistoryContainer.appendChild(table);
        }
    })
    .catch((error) => {
        console.error("Error fetching orders:", error);
    });
};




function SSLpayment(orderId, totalPrice, length) {  
    console.log("OrderId:", orderId, "Total Price:", totalPrice);
    console.log("Length", length);

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    console.log("user_id",user_id)
    if (!token) {
        alert("You are not logged in! Please log in first.");
        return;
    }

    fetch("https://quick-bite-backend-pink.vercel.app/payment/pay/", {
        method: "POST",
        headers: {
            "Authorization": `Token ${token}`,  
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            order_id: orderId,
            total_amount: totalPrice,  
            total_item: length,
            user_id : user_id,  
        }),
    })
    .then(response => response.json())
    .then(result => {
        console.log("Request", result)
        if (result.status === "success") {
            console.log("success",result.status)
            window.location.href = result.payment_url;  
        } else {
            alert("Payment initiation failed: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error initiating payment:", error);
        alert("Something went wrong. Please check your connection.");
    });
}





displayOrderHistory();


// // Delete order function
// const deleteOrder = (orderId) => {
//     console.log("OrderId", orderId);
//     const token = localStorage.getItem("token");

//     fetch(`http://127.0.0.1:8000/order/orders-delete/${orderId}/`, {
//         method: "DELETE",
//         headers: {
//             Authorization: `Token ${token}`,
//             'Content-Type': 'application/json',
//         },
//     })
//     .then((response) => {
//         if (response.status === 404) {
//             alert("Order not found!");
//         } else if (response.ok) {
//             alert("Order deleted successfully!");
//             displayOrderHistory(); // Refresh the order history after deletion
//         } else {
//             alert("Failed to delete the order.");
//         }
//     })
//     .catch((error) => {
//         console.error("Error deleting order:", error);
//     });
// };

// Initial call to display order history

