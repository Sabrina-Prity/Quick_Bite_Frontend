let currentPage = 1;
const itemsPerPage = 5; // Show only 5 cards per page

const loadRestaurants = (search = "", page = 1) => {
    document.getElementById("card").innerHTML = "";
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-list/?search=${search}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Restaurant Data:", data);

            const startIndex = (page - 1) * itemsPerPage;
            const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

            if (paginatedData.length > 0) {
                document.getElementById("nodata").style.display = "none";
                displayRestaurants(paginatedData);
                updatePagination(page, data.length);
            } else {
                document.getElementById("card").innerHTML = "";
                document.getElementById("nodata").style.display = "block";
            }
        })
        .catch((err) => console.log(err));
};

const displayRestaurants = (data) => {
    const parent = document.getElementById("card");
    parent.innerHTML = "";

    data.forEach((item) => {
        let imageUrl = item?.image;

        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }

        const div = document.createElement("div");
        div.classList.add("item-card");
        div.innerHTML = `
            <img class="item-img" src="${imageUrl}" alt="${item?.company_name}" />
            <h4>${item?.company_name}</h4>
            <p>Street: ${item?.street_name}</p>
            <p>Postal Code: ${item?.postal_code}</p>
            <p>District: ${item?.district}</p>
            <p>Mobile: ${item?.mobile_no}</p>
            <button class="details-btn" data-id="${item.id}">Details</button>
        `;
        parent.appendChild(div);
    });

    document.querySelectorAll(".details-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const restaurantId = button.dataset.id;
            window.location.href = `restaurant_details.html?restaurantId=${restaurantId}`;
        });
    });
};

// Pagination Update
const updatePagination = (page, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Clear previous pagination

    const prevButton = document.createElement("li");
    prevButton.classList.add("page-item");
    prevButton.innerHTML = `
        <a class="page-link" href="#" id="prevPage">&laquo;</a>
    `;
    prevButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadRestaurants("", currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.classList.add("page-item");
        if (i === page) {
            pageButton.classList.add("active");
        }
        pageButton.innerHTML = `<a class="page-link page-number" href="#">${i}</a>`;
        pageButton.addEventListener("click", (event) => {
            event.preventDefault();
            currentPage = i;
            loadRestaurants("", currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("li");
    nextButton.classList.add("page-item");
    nextButton.innerHTML = `
        <a class="page-link" href="#" id="nextPage">&raquo;</a>
    `;
    nextButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadRestaurants("", currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
};







const handleSearch = (event) => {
    event.preventDefault();
    const value = document.getElementById("search").value;
    loadRestaurants();(value);
};
loadRestaurants();

document.addEventListener("DOMContentLoaded", function () {
    fetch("https://quick-bite-backend-pink.vercel.app/seller/sellers/average-rating/")
        .then(response => response.json())
        .then(data => {
            console.log("Review data", data);
            const sliderContainer = document.querySelector(".slider-container");
            sliderContainer.innerHTML = ""; // Clear previous content

            if (data.length === 0) {
                sliderContainer.innerHTML = "<p>No reviews available.</p>";
                return;
            }

            data.forEach(seller => {
                const reviewSlide = document.createElement("div");
                reviewSlide.classList.add("slide-visible");

                reviewSlide.innerHTML = `
                    <div class="review-card">
                        <h3 style="color:#DF1E1E;">${seller.seller_name}</h3>
                        <p><strong>Average Rating:</strong> ${seller.average_rating} ⭐ (${seller.average_stars})</p>
                        <p>${seller.message}</p>
                    </div>
                `;

                sliderContainer.appendChild(reviewSlide);
            });

            // Reinitialize Swiffy Slider after dynamically loading reviews
            window.swiffyslider.init();
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
            document.querySelector(".slider-container").innerHTML = "<p>Failed to load reviews.</p>";
        });
});



document.addEventListener("DOMContentLoaded", function () {
    const reviewsContainer = document.querySelector("#reviews-carousel .carousel-inner");

    fetch("https://quick-bite-backend-pink.vercel.app/food/comment/")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Reviews:", data); // Debugging step

            if (data.length > 0) {
                reviewsContainer.innerHTML = ""; // Clear previous data

                data.forEach((review, index) => {
                    const reviewItem = document.createElement("div");
                    reviewItem.classList.add("carousel-item");

                    if (index === 0) {
                        reviewItem.classList.add("active"); // Ensure first item is active
                    }

                    reviewItem.innerHTML = `
                        <div class="review-card p-4">
                            <h3 class="text-primary">${review.food_name}</h3>
                            <p><strong>Review:</strong> ${review.body}</p>
                            <p><strong>Rating:</strong> ⭐${review.rating}</p>
                            <p><strong>Date:</strong> ${new Date(review.created_on).toLocaleDateString()}</p>
                        </div>
                    `;

                    reviewsContainer.appendChild(reviewItem);
                });

                // ✅ Start the carousel and auto-slide every 3 seconds
                $('#reviews-carousel').carousel({
                    interval: 3000, // Slide every 3 seconds
                    pause: "hover" // Pause when hovered
                });
            } else {
                reviewsContainer.innerHTML = "<p class='text-center'>No reviews available.</p>";
            }
        })
        .catch(error => console.error("Error fetching reviews:", error));
});




const createCart=()=>{
    const token = localStorage.getItem("token");
    console.log("Create Cart",token)
    // if(!token){
    //     alert("Please Login!")
    //     return
    // }
    object = {
        user : localStorage.getItem("user_id"),
    }
    console.log(object)
    fetch("https://quick-bite-backend-pink.vercel.app/cart/create-cart/",{
        method : "POST",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(object)
    })
    .then((data)=> {
        console.log("Cart Create Successful", data)
    })

}

createCart();