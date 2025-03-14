const fetchSellerOrders = () => { 
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");

    fetch(`https://quick-bite-backend-pink.vercel.app/order/seller-orders/${sellerId}/`, {
        method: 'GET',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Seller Orders:", data);

        const orderListElement = document.getElementById('display-all-orders');
        orderListElement.innerHTML = ""; // Clear previous orders

        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(order => {
                let totalPrice = 0;

                const orderItemsHTML = order.order_items.map(item => {
                    const itemTotal = item.food_item.price * item.quantity;
                    totalPrice += itemTotal;

                    // Fix the image URL
                    let imageUrl = item.food_item?.image;
                    if (imageUrl.includes("image/upload/https://")) {
                        imageUrl = imageUrl.replace("image/upload/", "");
                    }
                    if (!imageUrl.startsWith("https://")) {
                        imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
                    }

                    return `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.customer.first_name} ${order.customer.last_name}</td>
                            <td>
                                <img src="${imageUrl}" alt="${item.food_item.name}" />
                                <p>${item.food_item.name}</p>
                            </td>
                            <td>${item.quantity}</td>
                            <td>$${item.food_item.price}</td>
                            <td>$${itemTotal}</td>
                            <td class="status-${order.buying_status.toLowerCase()}">${order.buying_status}</td>
                            <td class="status-${order.payment_status.toLowerCase()}">${order.payment_status}</td>
                            <td>
                                <button id="completed-btn-${order.id}" class="completed-btn ${order.buying_status === 'Completed' || order.buying_status === 'Canceled' ? 'disabled' : ''}" 
                                    onclick="updateStatus(${order.id}, 'Completed')">Completed</button>
                                <button id="cancel-btn-${order.id}" class="cancel-btn ${order.buying_status === 'Completed' || order.buying_status === 'Canceled' ? 'disabled' : ''}" 
                                    onclick="updateStatus(${order.id}, 'Canceled')">Canceled</button>
                            </td>
                        </tr>
                    `;
                }).join("");

                orderListElement.innerHTML += orderItemsHTML;
            });
        } else {
            alert("No orders found.");
        }
    })
    .catch(error => {
        console.error("Error fetching seller orders:", error);
        alert("There was an issue fetching the orders.");
    });
};



const updateStatus = (orderId, status) => {
    const token = localStorage.getItem("token");

    // Get the buttons for the specific order
    const completedButton = document.getElementById(`completed-btn-${orderId}`);
    const cancelButton = document.getElementById(`cancel-btn-${orderId}`);

    completedButton.classList.add('disabled');
    cancelButton.classList.add('disabled');

    fetch(`https://quick-bite-backend-pink.vercel.app/order/admin-order-updated/${orderId}/`, {
        method: "PUT",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buying_status: status })
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                alert(data.message);
            }
            // Refresh the order history after the status update
            fetchSellerOrders(); // Re-fetch orders to display the updated status
        })
        .catch((error) => {
            console.error("Error updating order status:", error);
        });
};

fetchSellerOrders();
