const handleAddMenu = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim(); // Trim unnecessary spaces
    const sellerId = localStorage.getItem("seller_id");
    const token = localStorage.getItem("token");

    if (!name) {
        alert("Category name cannot be empty!");
        return;
    }

    fetch(`https://quick-bite-backend-pink.vercel.app/category/seller_category_list/${sellerId}/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }), 
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Category Data:", data);
            if (data.id) {
                alert("Menu added successfully!");
                document.getElementById("name").value = ""; // Clear input field
                fetchMenu(); // Refresh the category list
            } else {
                document.getElementById("error").innerText = data.error || "Failed to add category!";
            }
        })
        .catch((error) => console.error('Error:', error));
};


const fetchMenu = () => {
    const orderHistoryContainer = document.getElementById("display-all-category");
    
    // Create and append the loading message and spinner inside the order-history div
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-container-customer");
    loadingDiv.innerHTML = `
        <img src="Images/loading.png" alt="Loading..." />
        <p>Loading your category...</p>
    `;
    
    orderHistoryContainer.innerHTML = ''; // Clear any previous content
    orderHistoryContainer.appendChild(loadingDiv);

    const sellerId = localStorage.getItem("seller_id");
    const token = localStorage.getItem("token");

    fetch(`https://quick-bite-backend-pink.vercel.app/category/seller_category_list/${sellerId}/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((categories) => {
        const container = document.getElementById("display-all-category");
        container.innerHTML = '<h2 class="titles">All Category Items</h2>';

        // Remove the loading spinner after data is fetched
        loadingDiv.remove();

        if (categories.length === 0) {
            container.innerHTML += "<p>No category found!</p>";
        } else {
            categories.forEach((category) => {
                const div = document.createElement("div");
                div.classList.add("category-item");
                div.innerHTML = `
                    <p>${category.name}</p>
                    <button class="delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
                `;
                container.appendChild(div);
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        loadingDiv.innerHTML = "<p>Error loading category!</p>"; // Show error message if fetch fails
    });
};

const deleteCategory = (id) => {
    const sellerId = localStorage.getItem("seller_id");

    fetch(`https://quick-bite-backend-pink.vercel.app/category/delete_seller_category/${sellerId}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (response.status === 204) {
            fetchMenu(); // Refresh the menu list
        } else {
            alert("Failed to delete category!");
        }
    })
    .catch((error) => console.error('Error:', error));
};

// Fetch menu items initially
fetchMenu();
