const loadOrderDetails = () => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
        console.log("No cart found. Please create a cart first.");
        return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/cart/see-cart-item/${cartId}/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Received Cart Data:", data);

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

            // Display grouped data
            displayOrderDetails(groupedItems);
        })
        .catch((error) => {
            console.error("Error fetching cart details:", error);
        });
};

const displayOrderDetails = (groupedItems) => {
    const orderDetailsDiv = document.querySelector(".order-details");

    // Check if groupedItems exist and have content
    if (!groupedItems || Object.keys(groupedItems).length === 0) {
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

    // Loop through grouped items
    Object.values(groupedItems).forEach((group) => {
        const { company_name, items } = group;

        // Loop through items for each seller
        items.forEach((item, index) => {
            const { food_item, quantity, price } = item;
            const totalPrice = parseFloat(price) * quantity;
            grandTotal += totalPrice;

            orderHTML += `
                <tr>
                    ${index === 0 ? `<td rowspan="${items.length}">${company_name}</td>` : ""}
                    <td>${food_item.name}</td>
                    <td>${quantity}</td>
                    <td>$${parseFloat(price).toFixed(2)}</td>
                    <td>$${totalPrice.toFixed(2)}</td>
                </tr>
            `;
        });
    });

    orderHTML += `
            </tbody>
        </table>
        <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
    `;

    orderDetailsDiv.innerHTML = orderHTML;
};



const SSLpayment = (event) => {
    event.preventDefault();
    const cartId = localStorage.getItem("cartId");
    const token = localStorage.getItem('token');

    fetch(`http://127.0.0.1:8000/payment/payment/sslcomarce/?cart_id=${cartId}`, {
        method: "POST",
        // headers: {
        //     'Authorization': `Token ${token}`,  
        //     'Content-Type': 'application/json',
        // },
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Failed to initiate payment session");
        }
        return res.json(); 
    })
    .then((data) => {
        if (data.GatewayPageURL) {
            
            window.location.href = data.GatewayPageURL;
        } else {
            console.error("Payment gateway URL not received.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
};


loadOrderDetails();
