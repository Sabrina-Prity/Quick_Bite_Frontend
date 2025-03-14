const loadCustomers = () => {
    const token = localStorage.getItem("token");

    fetch("https://quick-bite-backend-pink.vercel.app/customer/customer-list/", {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Customers", data);
        displayCustomers(data);
    })
    .catch((error) => {
        console.error("Error loading customers:", error);
    });
};

const displayCustomers = (customers) => {
    const customersList = document.getElementById("customer-list");

    // Clear existing content
    customersList.innerHTML = "";

    if (customers.length === 0) {
        customersList.innerHTML = "<tr><td colspan='3'>No customers available!</td></tr>";
        return;
    }

    customers.forEach((customer) => {
        let imageUrl = customer?.image || "Images/default-profile.png"; // Default image if no image is provided

        // Fix image URL if needed
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${imageUrl}" alt="${customer.user}" class="customer-img"></td>
            <td>${customer.user || "N/A"}</td>
            <td>${customer.mobile_no || "N/A"}</td>
        `;

        customersList.appendChild(row);
    });
};

loadCustomers();