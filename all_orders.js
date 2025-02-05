const fetchSellerOrders = () => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");

    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/order/seller-orders/${sellerId}/`, {
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
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('order');

                    // Fix the image URL
                    let custimageUrl = order.customer?.image;

                    // Remove incorrect "image/upload/" prefix if it exists
                    if (custimageUrl.includes("image/upload/https://")) {
                        custimageUrl = custimageUrl.replace("image/upload/", "");
                    }

                    // Ensure the image URL is properly formatted
                    if (!custimageUrl.startsWith("https://")) {
                        custimageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
                    }

                    let totalPrice = 0;

                    const orderItemsHTML = order.order_items.map(item => {
                        const itemTotal = item.food_item.price * item.quantity;
                        totalPrice += itemTotal;

                        // Fix the image URL
                        let imageUrl = item.food_item?.image;

                        // Remove incorrect "image/upload/" prefix if it exists
                        if (imageUrl.includes("image/upload/https://")) {
                            imageUrl = imageUrl.replace("image/upload/", "");
                        }

                        // Ensure the image URL is properly formatted
                        if (!imageUrl.startsWith("https://")) {
                            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
                        }
                        return `
                        <li>
                            <div class="order-item">
                                <div class="food-image">
                                    <img src="${imageUrl}" alt="${item.food_item.name}" />
                                </div>
                                <div class="food-details">
                                    <p><strong>Name:</strong> ${item.food_item.name}</p>
                                    <p></p>
                                    <p><strong>Price:</strong> $${item.food_item.price} <strong> Q:</strong>${item.quantity}</p>
                                    <p><strong>Total Price:</strong> $${itemTotal}</p>
                                </div>
                            </div>
                        </li>
                        <hr>
                    `;
                    }).join("");

                    let disableButtons = '';
                    if (order.buying_status === 'Completed' || order.buying_status === 'Canceled') {
                        disableButtons = 'disabled'; // Add disabled class for these orders
                    }

                    orderElement.innerHTML = `
                    <div class="order-header">
                        <h3>Order #${order.id}</h3>
                        <span>Order: <strong class="status-${order.buying_status.toLowerCase()}" id="status-${order.id}">${order.buying_status}</strong></span>
    <span>Payment: <strong class="status-${order.payment_status.toLowerCase()}" id="payment-status-${order.id}">${order.payment_status}</strong></span>
                    </div>
                    <div class="order-content">
                        <div class="order-details">
                            <ul>${orderItemsHTML}</ul>
                            <p class="total-price"><strong>Total Order Price:</strong> $${totalPrice}</p>
                        </div>
                        <div class="order-side">
                            <div class="customer-img">
                              <img src="${custimageUrl}" alt="${order.customer.first_name}" />
                            </div>
                            <div class="customer-info">
                                <p><strong>Customer:</strong> ${order.customer.first_name} ${order.customer.last_name}</p>
                                <p><strong>Mobile:</strong> ${order.mobile}</p>
                                <p><strong>Email:</strong> ${order.customer.email}</p>
                                <p><strong>District:</strong> ${order.district}</p>
                                <p><strong>Address:</strong> ${order.full_address}</p>
                            </div>
                            <div class="status">
                            <button id="completed-btn-${order.id}" class="completed-btn ${disableButtons}" onclick="updateStatus(${order.id}, 'Completed')">Completed</button>
                            <button id="cancel-btn-${order.id}" class="cancel-btn ${disableButtons}" onclick="updateStatus(${order.id}, 'Canceled')">Canceled</button>
                            </div>
                             </div>
                    </div>
                `;

                    orderListElement.appendChild(orderElement);
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

    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/order/admin-order-updated/${orderId}/`, {
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
