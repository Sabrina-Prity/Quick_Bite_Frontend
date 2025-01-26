const fetchCategory = () => {
    const sellerId = localStorage.getItem("seller_id");
    fetch(`http://127.0.0.1:8000/category/seller_category_list/${sellerId}`, {
        method: 'GET',
        headers: {
            // Authorization: `Token ${token}`, 
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((categories) => {
            // console.log('Fetched Categories:', categories);

            const parent = document.getElementById("category"); 
            if (!parent) {
                console.error("Category <select> element not found!");
                return;
            }

            parent.innerHTML = '<option value="" selected disabled>Select Category</option>';
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id; 
                option.textContent = category.name; 
                parent.appendChild(option);
            });
        })
        .catch((error) => {
            document.getElementById("error").textContent = "Failed to load categories.";
        });
};

fetchCategory();



const handleAddFoodItem = (event) => {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("image").files[0];

    if (!name || !price || !category || !description) {
        document.getElementById("error").innerText = "All fields are required.";
        return;
    }

    if (!imageInput) {
        document.getElementById("error").innerText = "Please upload an image.";
        return;
    }

    const formData = new FormData();
    formData.append("image", imageInput);

    fetch("https://api.imgbb.com/1/upload?key=13f268ce593eb3a2e14811c1e1de5660", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            const imageUrl = data.data.url;

            const productData = {
                name,
                price: parseFloat(price),
                description,
                image: imageUrl,
                seller: localStorage.getItem("seller_id"),
                category,
            };

            // console.log("Product Data:", productData);
            const sellerId = localStorage.getItem("seller_id");
            const token = localStorage.getItem("token");
            fetch(`http://127.0.0.1:8000/food/food-item/${sellerId}/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Posted Food Data", data)
                
                document.getElementById("error").innerText = "Product added successfully!";

                // Reset the form fields
                document.getElementById("name").value = '';
                document.getElementById("price").value = '';
                document.getElementById("category").value = '';
                document.getElementById("description").value = '';
                document.getElementById("image").value = '';

                // Reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 100); 
                
            })
            
        } else {
            document.getElementById("error").innerText = "Image upload failed. Please try again.";
        }
    })
    .catch((error) => {
        document.getElementById("error").innerText = "Error during image upload. Please check your connection.";
    });
};






const fetchFoodItem = () => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");
    fetch(`http://127.0.0.1:8000/food/food-items-for-seller/${sellerId}/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((items) => {
            const container = document.getElementById("display-all-food");
            container.innerHTML = "<h2>All Items</h2>";

            if (items.length === 0) {
                container.innerHTML += "<p>No Item found!</p>";
            } else {
                items.forEach((item) => {
                    const div = document.createElement("div");
                    div.classList.add("food-item");

                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" />
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
            // document.getElementById("error").innerText = "Error fetching food items.";
        });
};


const deleteFood = (id) => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("seller_id");
    // if (!confirm("Are you sure you want to delete this mango?")) return;

    fetch(`http://127.0.0.1:8000/food/food-item/delete/${id}/${sellerId}/`, {
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