const displayFoodDetails = () => {
    const param = new URLSearchParams(window.location.search).get("foodId");

    // Get the food details container
    const parent = document.getElementById("food-details");

    // Create the food-detail div
    const div = document.createElement("div");
    div.classList.add("food-detail");

    // Create and append the loading message and spinner inside the food-detail div
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("food-loading-container");
    loadingDiv.innerHTML = `
        <img src="Images/loading.jpg" alt="Loading..." />
        <p>Loading food details...</p>
    `;
    div.appendChild(loadingDiv); // Append loading spinner inside the food-detail div
    parent.appendChild(div); // Append food-detail div to the parent

    // Fetch the food details
    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-item/get/${param}/`)
        .then((res) => res.json())
        .then((food) => {
            div.innerHTML = ""; // Clear the loading message once the food details are fetched

            if (!food || food.length === 0) {
                console.error("No food details available");
                return;
            }

            const foodItem = food[0];

            let imageUrl = foodItem?.image;

            if (imageUrl.includes("image/upload/https://")) {
                imageUrl = imageUrl.replace("image/upload/", "");
            }

            if (!imageUrl.startsWith("https://")) {
                imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
            }

            div.innerHTML = `  <!-- Food details content -->
                <div class="food-image">
                    <img src="${imageUrl}" alt="${foodItem.name}" />
                </div>
                <div class="food-info">
                    <h4>${foodItem.name}</h4>
                    <h6><b>Price:</b> $${foodItem.price}</h6>
                    <h6><b>Category:</b> ${foodItem.category}</h6>
                    <p><b>Food Details:</b> ${foodItem.description}</p>
                    <div class="action-buttons">
                        <button class="add-to-cart-btn" id="add-to-cart-btn" onclick="addToCart('${foodItem.id}')">Add To Cart</button>
                    </div>
                </div>
            `;

            // Create and append the close button after the content is added
            const closeButton = document.createElement("span");
            closeButton.classList.add("close-btn");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => window.history.back();
            div.appendChild(closeButton);

            // Create login message and style it
            const loginMessage = document.createElement("div");
            loginMessage.style.display = "none";
            loginMessage.style.color = "red";
            loginMessage.style.fontSize = "1.2rem";
            loginMessage.innerText = "Please login to add to the cart.";

            // Append login message below the "Add To Cart" button
            const actionButtonsDiv = div.querySelector(".action-buttons");
            actionButtonsDiv.appendChild(loginMessage);

            // Check if the user is logged in (token in localStorage)
            const token = localStorage.getItem("token");
            const addToCartBtn = document.getElementById("add-to-cart-btn");

            if (!token) {
                // Show login message and disable Add to Cart button if not logged in
                addToCartBtn.disabled = true;
                loginMessage.style.display = "block";
            } else {
                loginMessage.style.display = "none";
            }
        })
        .catch((error) => {
            div.innerHTML = "<p>Error loading food details. Please try again later.</p>";
            console.error("Error fetching food details:", error);
        });
};

displayFoodDetails();




const postComment = () => {
    const foodId = new URLSearchParams(window.location.search).get("foodId");
    const sellerId = new URLSearchParams(window.location.search).get("sellerId");

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    const commentText = document.getElementById("comment-text").value;
    const rating = document.getElementById("rating").value;

    // If no token, show message and don't allow comment submission
    if (!token) {
        alert("Please log in to post a comment.");
        return;
    }

    const commentData = {
        body: commentText,
        rating: rating,
        user: user_id,
        food_item: foodId,
    };

    fetch(`https://quick-bite-backend-pink.vercel.app/food/comment/${foodId}/${sellerId}/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Comment posted:", data);
        document.getElementById("comment-text").value = "";
        document.getElementById("rating").value = "⭐";  // Reset rating to default
        location.reload();
    })
    .catch((error) => {
        console.error("Error posting comment:", error);
    });
};

const displayComments = () => {
    const foodId = new URLSearchParams(window.location.search).get("foodId");
    const sellerId = new URLSearchParams(window.location.search).get("sellerId");

    fetch(`https://quick-bite-backend-pink.vercel.app/food/comment/${foodId}/${sellerId}/`)
    .then((res) => res.json())
    .then((data) => {
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = '';

        data.forEach((comment) => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");

            const createdOn = new Date(comment.created_on);
            const formattedTime = createdOn.toLocaleString();

            commentDiv.innerHTML = `
            <small>by: ${comment.user} | Rated: ${comment.rating} | Posted on: ${formattedTime}</small>
            <hr>
            <p>${comment.body}</p>
            `;
            commentsList.appendChild(commentDiv);
        });

        // Show or hide the message depending on login status
        const token = localStorage.getItem("token");
        const submitButton = document.getElementById("submit-comment-btn");
        const commentLoginMsg = document.getElementById("comment-login-msg");

        if (token) {
            submitButton.disabled = false;
            commentLoginMsg.style.display = "none"; // Hide the login message
        } else {
            submitButton.disabled = true; // Disable the submit button
            commentLoginMsg.style.display = "block"; // Show the login message
        }
    });
};

displayComments();




