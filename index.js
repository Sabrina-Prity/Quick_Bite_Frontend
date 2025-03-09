const loadResturents = (search) => {
    document.getElementById("card").innerHTML = "";
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-list/?search=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("resturent Data",data)
            if (data.length > 0) {
                document.getElementById("nodata").style.display = "none";
                displayResturents(data);
            } else {
                document.getElementById("card").innerHTML = "";
                document.getElementById("nodata").style.display = "block";
            }
        })
        .catch((err) => console.log(err));
};

const displayResturents = (data) => {
    const parent = document.getElementById("card");
    parent.innerHTML = ""; // Clear existing content

    data?.forEach((item) => {
        const formattedDistrict = item?.district
            ? item.district.charAt(0).toUpperCase() + item.district.slice(1).toLowerCase()
            : ""; 

         // Fix the image URL
        let imageUrl = item?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
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
            <p>District: ${formattedDistrict}</p>
            <p>Mobile: ${item?.mobile_no}</p>
            <button class="details-btn" data-id="${item.id}">
                Details
            </button>
        `;
        parent.appendChild(div);
    });

    // Add click event listeners to the buttons
    const buttons = parent.querySelectorAll(".details-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const resturentId = button.dataset.id;
            window.location.href = `resturent_details.html?resturentId=${resturentId}`;
            // const token = localStorage.getItem("token"); // Check for token in localStorage
            // if (token) {
            //     const resturentId = button.dataset.id;
            //     window.location.href = `resturent_details.html?resturentId=${resturentId}`;
            // } else {
            //     alert("Please login first.");
            // }
        });
    });
};


const handleSearch = (event) => {
    event.preventDefault();
    const value = document.getElementById("search").value;
    loadResturents(value);
};

loadResturents();

document.addEventListener("DOMContentLoaded", function () {
    fetch("https://quick-bite-backend-pink.vercel.app/seller/sellers/average-rating/")
        .then(response => response.json())
        .then(data => {
            console.log("Review data", data)
            const reviewsContainer = document.querySelector(".all-reviews");
            reviewsContainer.innerHTML = ""; // Clear previous content

            if (data.length === 0) {
                reviewsContainer.innerHTML = "<p>No reviews available.</p>";
                return;
            }

            data.forEach(seller => {
                const reviewCard = document.createElement("div");
                reviewCard.classList.add("review-card");

                reviewCard.innerHTML = `
                    <h3>${seller.seller_name}</h3>
                    <p><strong>Average Rating:</strong> ${seller.average_rating} (${seller.average_stars})</p>
                    <p>${seller.message}</p>
                `;

                reviewsContainer.appendChild(reviewCard);
            });
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
            document.querySelector(".all-reviews").innerHTML = "<p>Failed to load reviews.</p>";
        });
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