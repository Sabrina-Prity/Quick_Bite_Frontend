const fetchCategory = () => {
    const sellerId = localStorage.getItem("seller_id");
    fetch(`https://quick-bite-backend-pink.vercel.app/category/seller_category_list/${sellerId}`, {
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

    // Validation checks
    if (!name || !price || !category || !description) {
        document.getElementById("error").innerText = "All fields are required.";
        return;
    }

    if (!imageInput) {
        document.getElementById("error").innerText = "Please upload an image.";
        return;
    }

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageInput); // Use 'file' for key
    formData.append("upload_preset", "ecommerce_upload"); // Your Cloudinary preset

    fetch("https://api.cloudinary.com/v1_1/dtyxxpqdl/image/upload", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        // Check if image upload is successful (check for secure_url)
        if (data.secure_url) {
            const imageUrl = data.secure_url;

            // Prepare the food item data
            const productData = {
                name,
                price: parseFloat(price),
                description,
                image: imageUrl,
                seller: localStorage.getItem("seller_id"),
                category,
            };

            // Send the product data to your API
            const sellerId = localStorage.getItem("seller_id");
            const token = localStorage.getItem("token");
            fetch(`https://quick-bite-backend-pink.vercel.app/food/food-item/${sellerId}/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Posted Food Data:", data);

                // Display success message
                document.getElementById("error").innerText = "Product added successfully!";

                // Clear form fields
                document.getElementById("name").value = '';
                document.getElementById("price").value = '';
                document.getElementById("category").value = '';
                document.getElementById("description").value = '';
                document.getElementById("image").value = '';

                // Optionally, reload the page or redirect
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error("Error posting food data:", error);
                document.getElementById("error").innerText = "Error adding product. Please try again.";
            });

        } else {
            document.getElementById("error").innerText = "Image upload failed. Please try again.";
        }
    })
    .catch((error) => {
        console.error("Error during image upload:", error);
        document.getElementById("error").innerText = "Error during image upload. Please check your connection.";
    });
};



