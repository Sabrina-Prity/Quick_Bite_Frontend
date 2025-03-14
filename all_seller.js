const loadSellers = () => {
    const token = localStorage.getItem("token");

    fetch("https://quick-bite-backend-pink.vercel.app/seller/seller-list/", {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Sellers", data);
        displaySellers(data);
    })
    .catch((error) => {
        console.error("Error loading sellers:", error);
    });
};

const displaySellers = (sellers) => {
    const sellerList = document.getElementById("seller-list");

    // Clear existing content
    sellerList.innerHTML = "";

    if (sellers.length === 0) {
        sellerList.innerHTML = "<tr><td colspan='5'>No sellers available!</td></tr>";
        return;
    }

    sellers.forEach((seller) => {
        let imageUrl = seller?.image || "Images/default-profile.png"; // Default image

        // Fix image URL if needed
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${imageUrl}" alt="${seller.company_name}" class="seller-img"></td>
            <td>${seller.company_name || "N/A"}</td>
            <td>${seller.user || "N/A"}</td>
            <td>${seller.street_name}, ${seller.district}, ${seller.postal_code}</td>
            <td>${seller.mobile_no || "N/A"}</td>
        `;

        sellerList.appendChild(row);
    });
};

loadSellers();