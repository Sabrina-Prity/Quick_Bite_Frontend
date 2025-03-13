const displayRestaurantDetails = () => {
    const param = new URLSearchParams(window.location.search).get("resturantId"); // Fixed typo
    console.log("Display Restaurant Id:", param);

    // Get the restaurant details container
    const parent = document.getElementById("restaurant-details");

    // Create the restaurant-detail div
    const div = document.createElement("div");
    div.classList.add("restaurant-detail");

    // Create and append the loading message and spinner inside the restaurant-detail div
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-container-resturent");
    loadingDiv.innerHTML = `
        <img src="Images/loading.jpg" alt="Loading..." />
        <p>Loading food details...</p>
    `;
    div.appendChild(loadingDiv); // Append loading spinner inside the restaurant-detail div

    parent.appendChild(div);  // Append the div to the parent container

    // Fetch restaurant details
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-detail/${param}`)
        .then((res) => res.json())
        .then((restaurant) => {
            console.log("Fetched Data:", restaurant);

            // Clear the loading state and show the restaurant details
            parent.innerHTML = ""; // Clear the loading spinner
            if (!restaurant || Object.keys(restaurant).length === 0) {
                parent.innerHTML = "<p>No restaurant details available.</p>";
                console.error("No restaurant details available");
                return;
            }

            const restaurantItem = restaurant; // Use directly, as it's not an array

            const formattedDistrict = restaurantItem?.district
                ? restaurantItem.district.charAt(0).toUpperCase() + restaurantItem.district.slice(1).toLowerCase()
                : "N/A";

            let imageUrl = restaurantItem?.image || "";

            if (imageUrl.includes("image/upload/https://")) {
                imageUrl = imageUrl.replace("image/upload/", "");
            }

            if (!imageUrl.startsWith("https://")) {
                imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
            }

            div.innerHTML = `
                <div class="restaurant-content">
                    <div class="restaurant-image">
                        <img src="${imageUrl}" alt="${restaurantItem.company_name}" />
                    </div>
                    <div class="restaurant-info">
                        <h4>${restaurantItem.company_name}</h4>
                        <p><strong>Average Rating:</strong> <span id="average-rating">Loading...</span></p>
                        <p><strong>Stars:</strong> <span id="average-stars">Loading...</span></p>
                        <p><strong>Street Name:</strong> ${restaurantItem.street_name}</p>
                        <p><strong>District:</strong> ${formattedDistrict}</p>
                        <p><strong>Postal Code:</strong> ${restaurantItem.postal_code}</p>
                        <p><strong>Mobile Number:</strong> ${restaurantItem.mobile_no}</p>
                    </div>
                </div>
            `;

            // Create and append the close button
            const closeButton = document.createElement("span");
            closeButton.classList.add("close-btn");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => window.history.back();
            div.appendChild(closeButton);

            parent.appendChild(div);

            // Fetch the average rating of the seller
            const sellerId = restaurantItem.id;
            console.log("SellerId", sellerId);
            if (sellerId) {
                fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller/${sellerId}/average-rating/`)
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error(`Error: ${res.status} - ${res.statusText}`);
                        }
                        return res.json();
                    })
                    .then((ratingData) => {
                        console.log("Seller Average Rating:", ratingData);

                        const averageRatingElement = document.getElementById("average-rating");
                        const averageStarsElement = document.getElementById("average-stars");

                        if (ratingData && ratingData.average_rating) {
                            averageRatingElement.textContent = ratingData.average_rating;
                        } else {
                            averageRatingElement.textContent = "No ratings available";
                        }

                        if (ratingData && ratingData.average_stars) {
                            averageStarsElement.textContent = ratingData.average_stars;
                        } else {
                            averageStarsElement.textContent = "No stars available";
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching average rating:", error);
                    });
            }
        })
        .catch((error) => {
            parent.innerHTML = "<p>Error loading restaurant details. Please try again later.</p>";
            console.error("Error fetching restaurant details:", error);
        });
};

displayRestaurantDetails();




const loadReviews = () => {
    const param = new URLSearchParams(window.location.search).get("resturantId");

    fetch(`https://quick-bite-backend-pink.vercel.app/seller/reviews/${param}`, {
        method: "GET",
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Reviews", data);
        displayReviews(data);
    });
};

const displayReviews = (reviews) => {
    const reviewsList = document.getElementById("reviews-list");

    // Clear existing content
    reviewsList.innerHTML = "";

    if (reviews.detail) {
        reviewsList.innerHTML = `<p>${reviews.detail}</p>`;
        return;
    }

    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews available yet!</p>";
        return;
    }

    // Loop through each review and append it to the reviews list
    reviews.forEach((review) => {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review");

        reviewDiv.innerHTML = `
            <div class="review-item">
                <p><strong>User Name:</strong> ${review.user}</p>
                <p><strong>Rating:</strong> ${review.rating}</p>
                <p><strong>Posted on:</strong> ${new Date(review.created_on).toLocaleString()}</p>
            </div>
            <hr>
        `;

        reviewsList.appendChild(reviewDiv);
    });
};

const postReview = () => {
    const userId = localStorage.getItem("user_id");
    const param = new URLSearchParams(window.location.search).get("resturantId");  
    const rating = document.getElementById("rating").value;

    if (!userId) {
        document.getElementById("comment-login-msg").innerHTML = "Please login to post a review.";
        return;
    }

    const reviewData = {
        user: userId,
        rating: rating,
        seller: param,
    };

    const token = localStorage.getItem("token");

    fetch(`https://quick-bite-backend-pink.vercel.app/seller/reviews/${param}/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData), 
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Review posted:", data);
        location.reload();  // Reload the page to show the new review
    })
    .catch((error) => {
        console.error("Error posting review:", error);
    });
};


loadReviews();


