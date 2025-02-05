const loadReview = () => {
    const token = localStorage.getItem("token");
    const seller_id = localStorage.getItem("seller_id");
    console.log("SellerId", seller_id)
    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/seller/reviews/${seller_id}`,{
        method : "GET",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((data) => {
            
            displayReview(data);
        });
};


const displayReview = (reviews) => {
    console.log("Reviews", reviews);
    const reviewsList = document.getElementById("reviews-list");

    reviewsList.innerHTML = "";
    if (reviews.detail) {
        reviewsList.innerHTML = `<p style="color:white; text-align:center;">${reviews.detail}</p>`;
        return;
    }

    if (reviews.length === 0) {
        reviewsList.innerHTML = "<p style='color:white; text-align:center;'>No reviews available yet!</p>";
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
                <button class="delete-btn" data-id="${review.id}" data-seller-id="${review.seller}">Delete</button>
            </div>
            <hr>
        `;

        reviewsList.appendChild(reviewDiv);
    });

    // Attach click event listeners to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const reviewId = button.getAttribute("data-id");
            const sellerId = button.getAttribute("data-seller-id");
            deleteReview(reviewId, sellerId);
        });
    });
};


const deleteReview = (reviewId, sellerId) => {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this review?")) {
        return;
    }

    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/seller/reviews/delete/${sellerId}/${reviewId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status === 204) {
                alert("Review deleted successfully!");
                loadReview(); // Reload the reviews list after deletion
            } else if (res.status === 404) {
                alert("Review not found.");
            } else if (res.status === 403) {
                alert("You are not authorized to delete this review.");
            } else {
                return res.json().then((data) => {
                    alert(data.error || "An error occurred.");
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while trying to delete the review.");
        });
};


loadReview();