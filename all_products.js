const fetchFoodItem = () => {
    const container = document.getElementById("display-all-food");

    // Create and append the loading message and spinner inside the container
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-containers");
    loadingDiv.innerHTML = `
        <img src="Images/loading.png" alt="Loading..." />
        <p>Loading food items...</p>
    `;
    container.innerHTML = ''; // Clear any previous content
    container.appendChild(loadingDiv); // Add the loading image to the container

    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");

    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-items-for-seller/${sellerId}/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((items) => {
        // Remove the loading image once the data is loaded
        container.innerHTML = ''; // Clear loading div

        if (items.length === 0) {
            container.innerHTML += "<p>No items found!</p>";
        } else {
            items.forEach((item) => {
                const div = document.createElement("div");
                div.classList.add("food-item");

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

                div.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}" />
                    <p>${item.name}</p>
                    <p>Price: $${item.price}</p>
                    <p>Category: ${item.category}</p>
                    <button class="delete-btn" onclick="deleteFood(${item.id})">Delete</button>
                `;
                container.appendChild(div);
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        container.innerHTML = "<p>Error fetching food items.</p>";
    });
};






const deleteFood = (id) => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");
    // if (!confirm("Are you sure you want to delete this mango?")) return;

    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-item/delete/${id}/${sellerId}/`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Deleted successfully!");
                fetchFoodItem();
            } else {
                alert("Failed to delete item!");
            }
        })
        .catch((error) => console.error('Error:', error));
};

fetchFoodItem();