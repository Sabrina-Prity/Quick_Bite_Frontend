const loadRestaurants = (search = "") => {
    const parent = document.getElementById("card");
    const loading = document.getElementById("loading");

    // Check if the 'loading' element exists before trying to modify it
    if (loading) {
        // Show the loading image if the element exists
        loading.style.display = "flex";
    }

    parent.innerHTML = ""; // Clear previous content

    // Create and append a loading message and spinner inside the parent element
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-container");
    loadingDiv.innerHTML = `
        <img src="Images/loading.png" alt="Loading..." />
        <p>Loading restaurants...</p>
    `;
    parent.appendChild(loadingDiv); // Show loading spinner

    // Fetch the restaurant data based on the search query
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-list/?search=${search}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Restaurant Data:", data);

            // Hide the loading image once data is fetched (only if the loading element exists)
            if (loading) {
                loading.style.display = "none";
            }

            parent.innerHTML = ""; // Clear the loading spinner

            if (data.length > 0) {
                document.getElementById("nodata").style.display = "none";
                displayRestaurants(data); // Call function to display restaurants
            } else {
                document.getElementById("nodata").style.display = "block"; // Show "No data" message
            }
        })
        .catch((err) => {
            console.log(err);

            // Hide loading spinner if an error occurs (only if the loading element exists)
            if (loading) {
                loading.style.display = "none";
            }

            parent.innerHTML = "<p>Error loading data. Please try again.</p>"; // Show error message
        });
};


// Display Restaurants (All Items)
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
            <p>${item?.street_name}</p>
            <button class="details-btn" data-id="${item.id}">Details</button>
        `;
        parent.appendChild(div);
    });

    // Add event listener for details buttons
    document.querySelectorAll(".details-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const restaurantId = button.dataset.id;
            const url = `resturent_details.html?restaurantId=${restaurantId}`;
            console.log("Redirecting to:", url); // Debugging step
            window.location.href = url;
        });
    });
};

// Handle Search
const handleSearch = (event) => {
    event.preventDefault();
    const value = document.getElementById("search").value;
    loadRestaurants(value);
};

// Initial Load
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
    const reviewsContainer = document.querySelector("#customer-review-slider");

    fetch("https://quick-bite-backend-pink.vercel.app/food/comment/")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Reviews:", data); // Debugging step

            if (data.length > 0) {
                reviewsContainer.innerHTML = ""; // Clear previous content

                data.forEach((review) => {
                    const reviewItem = document.createElement("div");
                    reviewItem.classList.add("slide-visible");

                    reviewItem.innerHTML = `
                        <div class="customer-review-card p-5">
                            <h4>${review.food_name}</h4>
                            <p><strong>Review:</strong> ${review.body}</p>
                            <p><strong>Rating:</strong> ${review.rating}</p>
                            <p><strong>Date:</strong> ${new Date(review.created_on).toLocaleDateString()}</p>
                        </div>
                    `;

                    reviewsContainer.appendChild(reviewItem);
                });
            } else {
                reviewsContainer.innerHTML = "<p class='text-center'>No reviews available.</p>";
            }
        })
        .catch(error => console.error("Error fetching reviews:", error));
});





const createCart = () => {
    const token = localStorage.getItem("token");
    console.log("Create Cart", token)
    // if(!token){
    //     alert("Please Login!")
    //     return
    // }
    object = {
        user: localStorage.getItem("user_id"),
    }
    console.log(object)
    fetch("https://quick-bite-backend-pink.vercel.app/cart/create-cart/", {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(object)
    })
        .then((data) => {
            console.log("Cart Create Successful", data)
        })

}

createCart();