const loadAvgRatings = () => {
    const token = localStorage.getItem("token");

    fetch("https://quick-bite-backend-pink.vercel.app/seller/sellers/average-rating/", {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Rating data", data);
        const ratingsTable = document.querySelector("#avg-ratings");
        ratingsTable.innerHTML = ""; // Clear previous content

        if (!Array.isArray(data) || data.length === 0) {
            ratingsTable.innerHTML = "<tr><td colspan='4'>No reviews available.</td></tr>";
            return;
        }

        data.forEach(seller => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${seller.seller_name || "Unknown Seller"}</td>
                <td>${seller.average_rating}</td>
                <td>${seller.average_stars}</td>
                <td>${seller.message || "No message available"}</td>
            `;
            ratingsTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching reviews:", error);
        document.querySelector("#avg-ratings").innerHTML = "<tr><td colspan='4'>Failed to load reviews.</td></tr>";
    });
};

loadAvgRatings();