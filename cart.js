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
    fetch("http://127.0.0.1:8000/cart/cart-item/", {
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


    fetch(`http://127.0.0.1:8000/cart/see-cart-item/${cartId}/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            console.log("Received Cart Data:", data);
            displayCart(data);
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
        });
};

const displayCart = (items) => {
    // console.log("Cart Items", items);
    const parent = document.getElementById("cart-section");
    parent.innerHTML = `<h2>Your Cart</h2>`;

    if (!items || items.length === 0) {
        parent.innerHTML += `
        <img src="Images/cart_empty.jpg" alt="Empty Cart" class="empty-cart">
        <p>Your cart is empty!</p>
        `;

    }
    else {
        parent.innerHTML += `<p>Total Item : ${items.length}</p>`
    }

    items.forEach((item) => {
        console.log("Item", item)
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.id = item.id;


        div.innerHTML = `
       <div class="cart-item-container">
    <div class="cart-item-image">
        <img src="${item.food_item.image}" alt="Food Image" style="width:100px; height:auto;">
    </div>
    <div class="cart-item-details">
        <h4>Name: ${item.food_item.name}</h4>
        <label for="quantity-${item.id}">Quantity:</label>
        <input type="number" class="quantity" id="quantity-${item.id}" name="quantity" min="1"
            max="${item.food_item?.quantity}" value="1"
            onchange="updatePrice('${item.id}', ${item.food_item.price})">
        <p>Price: $<span id="price-${item.id}">${item.food_item.price}</span></p>
        
        <button class="detail-btn">
            <a href="mangoDetails.html?mangoId=${item.food_item.id}" class="detail-link">Details</a>
        </button>
        
        <button class="delete-btn" onclick="deleteCartItem('${item.id}')">Delete</button>
    </div>
</div>
        `;

        parent.appendChild(div);
    });
};


function updatePrice(cartItemId, unitPrice) {
    const quantityInput = document.getElementById(`quantity-${cartItemId}`);
    const priceElement = document.getElementById(`price-${cartItemId}`);
    
    const quantity = parseInt(quantityInput.value);
    const totalPrice = unitPrice * quantity;
    priceElement.textContent = totalPrice.toFixed(2);
}


{/* <button class="buy-now-btn" onclick="buyNowIntoCart('${item.mango.id}', ${item.mango.price}, ${item.mango.quantity}, '${item.id}')">Buy Now</button>  */}


// function buyNowIntoCart(mangoId, price, maxQuantity, cartItemId) {
//     const token = localStorage.getItem("token");
//     const user_id = localStorage.getItem("user_id");
//     const quantity = document.getElementById("quantity").value;

//     if (!token) {
//         alert("Please Login first.");
//         return;
//     }

//     if (quantity < 1 || quantity > maxQuantity) {
//         alert(`Please enter a valid quantity (1-${maxQuantity}).`);
//         return;
//     }

//     const orderData = {
//         quantity: quantity,
//         buying_status: "Pending",
//         user: user_id,
//         product: mangoId,
//     };

//     // Step 1: Place the Order
//     fetch("https://mango-project-six.vercel.app/add_to_cart/orders-view/", {
//         method: "POST",
//         headers: {
//             Authorization: `Token ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//     })
//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error("Failed to place order.");
//             }
//             return res.json();
//         })
//         .then((orderResponse) => {
//             console.log("Order placed successfully:", orderResponse);
//             alert("Successfully bought the product!");

//             // Step 2: Remove the Item from Cart
//             deleteCartItem(cartItemId);
//         })
//         .catch((error) => {
//             console.error("Error during purchase or cart update:", error);
//         });
// }


function deleteCartItem(cartItemId) {
    const url = `http://127.0.0.1:8000/cart/cart-item/update/${cartItemId}/`;
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