
const displayFoodDetails = () => {
    const param = new URLSearchParams(window.location.search).get("foodId");
    // console.log("Food Id:", param);
    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/food/food-item/get/${param}/`)
        .then((res) => res.json())
        .then((food) => {
            // console.log("Food:", food);
            const parent = document.getElementById("food-details");
            parent.innerHTML = "";

            const div = document.createElement("div");

            if (!food || food.length === 0) {
                console.error("No food details available");
                return;
            }

            const foodItem = food[0]

            // Fix the image URL
            let imageUrl = foodItem?.image;

            // Remove incorrect "image/upload/" prefix if it exists
            if (imageUrl.includes("image/upload/https://")) {
                imageUrl = imageUrl.replace("image/upload/", "");
            }

            // Ensure the image URL is properly formatted
            if (!imageUrl.startsWith("https://")) {
                imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
            }

            div.classList.add("food-detail");

            const closeButton = document.createElement("span");
            closeButton.classList.add("close-btn");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => window.history.back();
            parent.appendChild(closeButton);

            div.innerHTML = `
                <div class="food-image">
                    <img src="${imageUrl}" alt="${foodItem.name}" />
                </div>
                <div class="food-info">
                    <h4>${foodItem.name}</h4>
                    <h6><b>Price:</b> $${foodItem.price}</h6>
                    <h6><b>Category:</b> ${foodItem.category}</h6>
                    <p><b>Food Details:</b> ${foodItem.description}</p>
                    <div class="action-buttons">
                        <button class="add-to-cart-btn" onclick="addToCart('${foodItem.id}')">Add To Cart</button>
                    </div>
                </div>
            `;

            parent.appendChild(div);

        })
        .catch((error) => {
            console.error("Error fetching food details:", error);
        });

};

displayFoodDetails();



const postComment = () => {
    const foodId = new URLSearchParams(window.location.search).get("foodId");
    console.log("Food Id:", foodId);
    const sellerId = new URLSearchParams(window.location.search).get("sellerId");
    console.log("seller Id:", sellerId);

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    const commentText = document.getElementById("comment-text").value;
    const rating = document.getElementById("rating").value;

    const commentData = {
        body: commentText,
        rating: rating,
        user: user_id,
        food_item: foodId,
    };

    console.log(commentData);
    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/food/comment/${foodId}/${sellerId}/`, {
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
            commentText.value = "";
            rating.value = "";
            // displayComments(data);  
            location.reload();

        })
        .catch((error) => {
            console.error("Error posting comment:", error);
        });
};

const displayComments = () => {
    const foodId = new URLSearchParams(window.location.search).get("foodId");
    console.log("Food Id:", foodId);
    const sellerId = new URLSearchParams(window.location.search).get("sellerId");
    console.log("seller Id:", sellerId);
    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/food/comment/${foodId}/${sellerId}/`)
        .then((res) => res.json())
        .then((data) => {
            const commentsList = document.getElementById("comments-list");
            commentsList.innerHTML = '';
            // const username = localStorage.getItem("username")

            data.forEach((comment) => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");

                // Format the created_on time
                const createdOn = new Date(comment.created_on);
                const formattedTime = createdOn.toLocaleString();

                commentDiv.innerHTML = `
                <small>by: ${comment.user} | Rated: ${comment.rating} | Posted on: ${formattedTime}</small>
                <hr>
                    <p>${comment.body}</p>
                `;
                commentsList.appendChild(commentDiv);
            });

            // Show the comment form if the user is logged in
            const token = localStorage.getItem("token");
            if (token) {
                document.getElementById("comment-form").style.display = "block";
                document.getElementById("comment-login-msg").style.display = "none";
            } else {
                document.getElementById("comment-form").style.display = "none";
                document.getElementById("comment-login-msg").style.display = "block";
            }
        });
};
displayComments();

