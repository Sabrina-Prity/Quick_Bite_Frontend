const loadAvgRatings = () => {
    const token = localStorage.getItem("token");
    fetch("https://quick-bite-backend-pink.vercel.app/seller/sellers/average-rating/", {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const reviewsContainer = document.querySelector("#avg-ratings");
            reviewsContainer.innerHTML = ""; // Clear previous content

            if (!Array.isArray(data) || data.length === 0) {
                reviewsContainer.innerHTML = "<p>No reviews available.</p>";
                return;
            }

            data.forEach(seller => {
                const reviewCard = document.createElement("div");
                reviewCard.classList.add("review-cards");

                reviewCard.innerHTML = `
                    <h3>${seller.seller_name || "Unknown Seller"}</h3>
                    <p><strong>Average Rating:</strong> ${seller.average_rating} (${seller.average_stars})</p>
                    <p>${seller.message || "No message available"}</p>
                `;

                reviewsContainer.appendChild(reviewCard);
            });
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
            document.querySelector("#avg-ratings").innerHTML = "<p>Failed to load reviews.</p>";
        });
};

loadAvgRatings();
