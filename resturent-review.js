const loadReviews = () => {
    const token = localStorage.getItem("token");
    const param = new URLSearchParams(window.location.search).get("sellerId");
    console.log("SellerId", param)
    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/seller/reviews/${param}`,{
        method : "GET",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
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
            </div>
            <hr>
        `;

        reviewsList.appendChild(reviewDiv);
    });
};



const postReview = () => {
    const userId = localStorage.getItem("user_id");
    console.log("User Id", userId);
    const param = new URLSearchParams(window.location.search).get("sellerId");  
    const rating = document.getElementById("rating").value;
    


    const reviewData = {
        user: userId,
        rating: rating,
        seller: param,
    };
    console.log(reviewData)


    const token = localStorage.getItem("token");
  

    fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/seller/reviews/${param}/`, {
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
        location.reload(); 
    })
    .catch((error) => {
        console.error("Error posting review:", error);
    });
};


loadReviews();