const displayOrderHistory = () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/order/orders-view/${id}/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((orders) => {
        console.log(orders);
        const orderHistoryContainer = document.getElementById("order-history");
        orderHistoryContainer.innerHTML = "";

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
                    <th>Status</th>
                    
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

{/* <td>
                        <button class="delete-button" 
                            onclick="deleteOrder(${order.id})"
                            ${order.buying_status === 'Pending' ? 'disabled' : ''}>
                            Delete
                        </button>
                    </td> */}
// Delete order function
const deleteOrder = (orderId) => {
    console.log("OrderId", orderId);
    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/order/orders-delete/${orderId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (response.status === 404) {
            alert("Order not found!");
        } else if (response.ok) {
            alert("Order deleted successfully!");
            displayOrderHistory(); // Refresh the order history after deletion
        } else {
            alert("Failed to delete the order.");
        }
    })
    .catch((error) => {
        console.error("Error deleting order:", error);
    });
};

// Initial call to display order history
displayOrderHistory();
