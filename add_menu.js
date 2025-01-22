const handleAddMenu = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim(); // Trim unnecessary spaces
    const sellerId = localStorage.getItem("seller_id");
    const token = localStorage.getItem("token");

    if (!name) {
        alert("Category name cannot be empty!");
        return;
    }

    fetch(`http://127.0.0.1:8000/category/seller_category_list/${sellerId}/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }), // Only include 'name'
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Category Data:", data);
            if (data.id) {
                alert("Category added successfully!");
                document.getElementById("name").value = ""; // Clear input field
                fetchMenu(); // Refresh the category list
            } else {
                document.getElementById("error").innerText = data.error || "Failed to add category!";
            }
        })
        .catch((error) => console.error('Error:', error));
};



const fetchMenu = () => {
    // fetch('http://127.0.0.1:8000/category/list/', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // })
    const sellerId = localStorage.getItem("seller_id");
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/category/seller_category_list/${sellerId}/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((categories) => {
            const container = document.getElementById("display-all-category");
            container.innerHTML = '<h2 style="text-align: center; margin-bottom: 20px; font-size: 40px;" class="menu-title">All Menu Items</h2>';

            if (categories.length === 0) {
                container.innerHTML += "<p>No menu found!</p>";
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
        .catch((error) => console.error('Error:', error));
};


const deleteCategory = (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    fetch(`http://127.0.0.1:8000/category/list/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.status === 204) {
                // alert("Category deleted successfully!");
                fetchMenu(); 
            } else {
                alert("Failed to delete category!");
            }
        })
        .catch((error) => console.error('Error:', error));
};


fetchMenu();