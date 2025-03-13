
const getparams = () => {
    // const token = localStorage.getItem("token");
    const param = new URLSearchParams(window.location.search).get("resturantId");
    console.log("Profile ID:", param)

    // Fetch the restaurant details
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-detail/${param}`, {
        method: "GET",
        // headers: {
        //     Authorization: `Token ${token}`,
        //     'Content-Type': 'application/json',
        // }
    })
    .then((res) => res.json())
    .then((data) => {
        // Fetch average rating for this specific seller
        fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller/${param}/average-rating/`, {
            method: "GET",
            // headers: {
            //     Authorization: `Token ${token}`,
            //     'Content-Type': 'application/json',
            // }
        })
        .then((ratingRes) => ratingRes.json())
        .then((ratingData) => {
            // Add rating to restaurant details and display
            data.average_rating = ratingData.average_rating || 0;  // Default to 0 if no rating found
            data.average_stars = ratingData.average_stars || "⭐";  // Default to a star if no stars found
            displayResturentDetails(data);
        });
    });
};

getparams();

const displayResturentDetails = (data) => {
    const resturentContainer = document.getElementById("resturent-container");

    if (!resturentContainer) {
        console.error("Restaurant container not found!");
        return;
    }

    resturentContainer.innerHTML = "";
    const formattedDistrict = data?.district
        ? data.district.charAt(0).toUpperCase() + data.district.slice(1).toLowerCase()
        : "";

    // Fix the image URL
    let imageUrl = data?.image;

    if (imageUrl.includes("image/upload/https://")) {
        imageUrl = imageUrl.replace("image/upload/", "");
    }

    if (!imageUrl.startsWith("https://")) {
        imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
    }

    // Display the details along with the average rating
    resturentContainer.innerHTML = `
        <div class="d-flex align-items-start gap-3">
            <!-- Image Section -->
            <div class="col-md-7">
                <img src="${imageUrl}" alt="${data.company_name}" class="img-fluid rounded w-100">
            </div>
            <!-- Details Section -->
            <div class="res-Details col-md-5">
                <h2>${data.company_name} </h2>
                       <!-- Average Rating Section -->
                <p><strong>Average Rating:</strong> ${data.average_rating} (${data.average_stars}) </p>

                <p><strong>Street Name:</strong> ${data.street_name}</p>
                <p><strong>District:</strong> ${formattedDistrict}</p>
                <p><strong>Postal Code:</strong> ${data.postal_code}</p>
                <p><strong>Mobile Number:</strong> ${data.mobile_no}</p>

         
                <button class="details-btn" onclick="window.location.href='resturent-review.html?sellerId=${data.id}'">
                    Restaurant Reviews
                </button>
            </div>
        </div>
    `;
};

