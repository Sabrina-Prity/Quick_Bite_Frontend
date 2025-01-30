const fetchSellerOrders = () => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");

    fetch(`http://127.0.0.1:8000/order/seller-orders/${sellerId}/`, {
        method: 'GET',
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Seller Orders:", data);

        if (data.orders && data.orders.length > 0) {
            const orderListElement = document.getElementById('display-all-orders');
            orderListElement.innerHTML = ""; // Clear previous orders

            data.orders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.classList.add('order');
                
                let totalPrice = 0;

                orderElement.innerHTML = `
                    <div class="order-header">
                        <h3>Order #${order.id}</h3>
                        <span>Status: <strong>${order.buying_status}</strong></span>
                    </div>
                    <div class="order-content">
                        <div class="order-details">
                            <ul>
                                ${order.order_items.map(item => {
                                    const itemTotal = item.food_item.price * item.quantity;
                                    totalPrice += itemTotal;
                                    return `
                                        <li class="order-item">
                                            <div class="food-image">
                                                <img src="${item.food_item.image}" alt="${item.food_item.name}" />
                                            </div>
                                            <div class="food-details">
                                                <p><strong>Name:</strong> ${item.food_item.name}</p>
                                                <p><strong>Quantity:</strong> ${item.quantity}</p>
                                                <p><strong>Price:</strong> $${item.food_item.price}</p>
                                                <p><strong>Total Price:</strong> $${itemTotal}</p>
                                            </div>
                                        </li>
                                        <hr>
                                        <p class="total-price">Total Order Price: $${totalPrice}</p>
                                    `;
                                })}
                            </ul>
                            
                        </div>
                        <div class="order-side">
                            <div class="customer-info">
                                <p><strong>Customer:</strong> ${order.customer}</p>
                                <p><strong>Mobile:</strong> ${order.mobile}</p>
                                <p><strong>Email:</strong> ${order.email}</p>
                                <p><strong>District:</strong> ${order.district}</p>
                                <p><strong>Address:</strong> ${order.full_address}</p>
                            </div>
                            <button class="completed-btn">Mark as Completed</button>
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

fetchSellerOrders();
