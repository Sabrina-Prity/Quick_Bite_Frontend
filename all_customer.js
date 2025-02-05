const loadCustomers = () => {
    const token = localStorage.getItem("token");
    
    fetch("https://quick-bite-backend-pink.vercel.app/customer/customer-list/",{
        method : "GET",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Customers", data);
            displayCustomers(data);
        });
};

const displayCustomers = (customers) => {
    const customersList = document.getElementById("customer-list");

    // Clear existing content
    customersList.innerHTML = "";

    if (customers.length === 0) {
        customersList.innerHTML = "<p class='no-seller'>No Customer available yet!</p>";
        return;
    }

    
    customersList.innerHTML += `<p class='no-seller'>Total Customers: ${customers.length}</p>`;

    customers.forEach((customer) => {
        const customerDiv = document.createElement("div");
        customerDiv.classList.add("seller-card");

        // Fix the image URL
        let imageUrl = customer?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }

        customerDiv.innerHTML = `
            <div class="seller-image-container">
                <img src="${imageUrl}" alt="${customer.user}" class="seller-image">
            </div>
            <div class="seller-details">
                <p><strong>User Name:</strong> ${customer.user}</p>
                <p><strong>Mobile:</strong> ${customer.mobile_no}</p>
            </div>
        `;

        customersList.appendChild(customerDiv);
    });
};



loadCustomers();