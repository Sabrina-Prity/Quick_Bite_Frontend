const avarageRating = () => {
    const token = localStorage.getItem("token");
    const seller_id = localStorage.getItem("seller_id");

    console.log("SellerId", seller_id);

    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller/${seller_id}/average-rating/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("avg", data);
        
        const avgReviewContainer = document.querySelector(".avg-review");

        if (!avgReviewContainer) {
            console.error("Review container not found!");
            return;
        }

        avgReviewContainer.innerHTML = `
            <div class="rating-box">
                <h3>Average Rating</h3>
                <p class="rating-score">${data.average_rating} / 5</p>
                <p class="rating-stars">${data.average_stars}</p>
            </div>
        `;
    })
    .catch(error => console.error("Error fetching rating:", error));
};

avarageRating();