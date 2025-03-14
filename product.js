const fetchProductItem = (search = "") => {
    const container = document.getElementById("display-all-product");
    const loadingDiv = document.getElementById("loading");
    const noDataDiv = document.getElementById("nodata");

    // Show loading state
    container.innerHTML = "";
    loadingDiv.style.display = "block";
    noDataDiv.style.display = "none";

    const token = localStorage.getItem("token");
    
    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-items/?search=${search}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(items => {
        // Hide loading
        loadingDiv.style.display = "none";
        container.innerHTML = "";

        if (!items || items.length === 0) {
            noDataDiv.style.display = "block"; // Show "No Data" if nothing is found
            return;
        }

        noDataDiv.style.display = "none"; // Hide "No Data"

        items.forEach(item => {
            console.log("Food Item:", item);

            // Fix image URL
            let imageUrl = item?.image || "Images/default-food.png"; // Fallback image
            if (imageUrl.includes("image/upload/https://")) {
                imageUrl = imageUrl.replace("image/upload/", "");
            }
            if (!imageUrl.startsWith("https://")) {
                imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
            }

            // Create food card
            const div = document.createElement("div");
            div.classList.add("food-card");
            div.innerHTML = `
                <img class="food-img" src="${imageUrl}" alt="${item?.name}" />
                <h4>${item?.name}</h4>
                <h6>$${item?.price}</h6>
                
                <a class="detail-btn" href="foodDetails.html?foodId=${item.id}&sellerId=${item.seller}">Details</a>
                <button class="detail-btn">
                <a onclick="addToCart('${item.id}', '${item.price}')">Add To Cart</a>
            </button>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error("Error fetching food items:", error);
        loadingDiv.style.display = "none";
        noDataDiv.style.display = "block"; // Show error UI
    });
};



// Handle Search
const letSearch = (event) => {
    event.preventDefault();
    const value = document.getElementById("search").value.trim();
    fetchProductItem(value);
};

// Initial Fetch
fetchProductItem();
