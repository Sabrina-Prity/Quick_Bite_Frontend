const loadResturents = (search) => {
    document.getElementById("card").innerHTML = "";
    fetch(`http://127.0.0.1:8000/seller/seller-list/?search=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                document.getElementById("nodata").style.display = "none";
                displayResturents(data);
            } else {
                document.getElementById("card").innerHTML = "";
                document.getElementById("nodata").style.display = "block";
            }
        })
        .catch((err) => console.log(err));
};

const displayResturents = (data) => {
    const parent = document.getElementById("card");
    parent.innerHTML = ""; // Clear existing content

    data?.forEach((item) => {
        const formattedDistrict = item?.district
            ? item.district.charAt(0).toUpperCase() + item.district.slice(1).toLowerCase()
            : ""; 
        const div = document.createElement("div");
        div.classList.add("item-card");
        div.innerHTML = `
            <img class="item-img" src="${item?.image}" alt="${item?.company_name}" />
            <h4>${item?.company_name}</h4>
            <p>Street: ${item?.street_name}</p>
            <p>Postal Code: ${item?.postal_code}</p>
            <p>District: ${formattedDistrict}</p>
            <p>Mobile: ${item?.mobile_no}</p>
            <button class="details-btn" data-id="${item.id}">
                Details
            </button>
        `;
        parent.appendChild(div);
    });

    // Add click event listeners to the buttons
    const buttons = parent.querySelectorAll(".details-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const token = localStorage.getItem("token"); // Check for token in localStorage
            if (token) {
                const resturentId = button.dataset.id;
                window.location.href = `resturent_details.html?resturentId=${resturentId}`;
            } else {
                alert("Please login first.");
            }
        });
    });
};


const handleSearch = (event) => {
    event.preventDefault();
    const value = document.getElementById("search").value;
    loadResturents(value);
};

loadResturents();



const createCart=()=>{
    const token = localStorage.getItem("token");
    console.log("Create Cart",token)
    if(!token){
        alert("Please Login!")
        return
    }
    object = {
        user : localStorage.getItem("user_id"),
    }
    console.log(object)
    fetch("http://127.0.0.1:8000/cart/create-cart/",{
        method : "POST",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(object)
    })
    .then((data)=> {
        console.log("Cart Create Successful", data)
    })

}

createCart();