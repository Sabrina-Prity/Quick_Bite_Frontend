const loadSellers = () => {
    const token = localStorage.getItem("token");
    
    fetch("http://127.0.0.1:8000/seller/seller-list/",{
        method : "GET",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Sellers", data);
            displaySellers(data);
        });
};

const displaySellers = (sellers) => {
    const sellerList = document.getElementById("seller-list");

    // Clear existing content
    sellerList.innerHTML = "";

    if (sellers.length === 0) {
        sellerList.innerHTML = "<p class='no-seller'>No seller available yet!</p>";
        return;
    }else {
        sellerList.innerHTML += `<p class='no-seller'>Total Sellers: ${sellers.length}</p>`;
    }

    // Loop through each seller and append it to the seller list
    sellers.forEach((seller) => {
        const sellerDiv = document.createElement("div");
        sellerDiv.classList.add("seller-card");

        sellerDiv.innerHTML = `
            <div class="seller-image-container">
                <img src="${seller.image}" alt="${seller.company_name}" class="seller-image">
            </div>
            <div class="seller-details">
                <h3 class="seller-company">${seller.company_name}</h3>
                <p><strong>User Name:</strong> ${seller.user}</p>
                <p><strong>Address:</strong> ${seller.street_name}, ${seller.district}, ${seller.postal_code}</p>
                <p><strong>Mobile:</strong> ${seller.mobile_no}</p>
            </div>
        `;

        sellerList.appendChild(sellerDiv);
    });
};


loadSellers();